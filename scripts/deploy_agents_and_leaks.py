import ftplib
import os
import sys
import time

HOST = "ftpupload.net"
USER = "if0_43029836"
PASS = "Dikshu140803"
REMOTE_ROOT = "htdocs"
LOCAL_OUT = os.path.abspath("out")

def get_ftp():
    for attempt in range(5):
        try:
            ftp = ftplib.FTP(HOST, USER, PASS, timeout=30)
            ftp.set_pasv(True)
            return ftp
        except Exception as e:
            print(f"[FTP] Connection attempt {attempt+1} failed: {e}. Retrying in 4s...")
            time.sleep(4)
    raise RuntimeError("Failed to connect to FTP after 5 attempts")

def ensure_remote_dir(ftp, rel_dir):
    ftp.cwd(f"/{REMOTE_ROOT}")
    if not rel_dir or rel_dir in (".", "/"):
        return
    parts = [p for p in rel_dir.replace("\\", "/").strip("/").split("/") if p]
    for part in parts:
        try:
            ftp.cwd(part)
        except Exception:
            try:
                ftp.mkd(part)
            except Exception:
                pass
            ftp.cwd(part)

def upload_file(ftp, local_path, remote_rel_path):
    remote_dir = os.path.dirname(remote_rel_path).replace("\\", "/")
    filename = os.path.basename(remote_rel_path)

    for attempt in range(3):
        try:
            ensure_remote_dir(ftp, remote_dir)
            with open(local_path, "rb") as f:
                ftp.storbinary(f"STOR {filename}", f, blocksize=32768)
            return True
        except Exception as e:
            print(f"\n  [WARN] Failed {remote_rel_path} (attempt {attempt+1}): {e}")
            time.sleep(3)
            try:
                ftp = get_ftp()
            except Exception:
                pass
    return False

def main():
    print("=" * 65)
    print("DEPLOYING AGENTS DIRECTORY & HUSH DOSSIER TO PRODUCTION")
    print("=" * 65)

    ftp = get_ftp()
    print(f"[FTP] Connected successfully to {HOST} as {USER}")

    # 1. Critical: Sync out/agents.html to BOTH htdocs/agents.html AND htdocs/agents/index.html
    agents_html_path = os.path.join(LOCAL_OUT, "agents.html")
    print("\n[1] Uploading out/agents.html -> /agents.html and /agents/index.html...")
    if upload_file(ftp, agents_html_path, "agents.html"):
        print("  -> /agents.html: OK")
    if upload_file(ftp, agents_html_path, "agents/index.html"):
        print("  -> /agents/index.html: OK")

    # 2. Upload section roots to both .html and /index.html
    sections = ["weapons", "maps", "skins", "leaks"]
    for sec in sections:
        sec_path = os.path.join(LOCAL_OUT, f"{sec}.html")
        if os.path.exists(sec_path):
            print(f"\n[2] Uploading out/{sec}.html -> /{sec}.html and /{sec}/index.html...")
            if upload_file(ftp, sec_path, f"{sec}.html"):
                print(f"  -> /{sec}.html: OK")
            if upload_file(ftp, sec_path, f"{sec}/index.html"):
                print(f"  -> /{sec}/index.html: OK")

    # 3. Upload leaks dossier files (including agent-31-hush.html)
    print("\n[3] Uploading all out/leaks/* files...")
    leaks_dir = os.path.join(LOCAL_OUT, "leaks")
    if os.path.exists(leaks_dir):
        for f in os.listdir(leaks_dir):
            full_path = os.path.join(leaks_dir, f)
            if os.path.isfile(full_path):
                rel = f"leaks/{f}"
                print(f"  -> /{rel} ({os.path.getsize(full_path)} bytes)...", end=" ", flush=True)
                if upload_file(ftp, full_path, rel):
                    print("OK")
                else:
                    print("FAILED")

    # 4. Upload agents subpages (hush.html, agent-31-hush.html, and newly modified operatives)
    print("\n[4] Uploading Hush agent route files...")
    agent_files = [
        "hush.html",
        "hush.txt",
        "agent-31-hush.html",
        "agent-31-hush.txt"
    ]
    for af in agent_files:
        full_path = os.path.join(LOCAL_OUT, "agents", af)
        if os.path.exists(full_path):
            rel = f"agents/{af}"
            print(f"  -> /{rel} ({os.path.getsize(full_path)} bytes)...", end=" ", flush=True)
            if upload_file(ftp, full_path, rel):
                print("OK")
            else:
                print("FAILED")

    # 5. Upload concept art portrait
    print("\n[5] Verifying /images/agent-hush.jpg...")
    hush_img = os.path.join(LOCAL_OUT, "images", "agent-hush.jpg")
    if os.path.exists(hush_img):
        if upload_file(ftp, hush_img, "images/agent-hush.jpg"):
            print("  -> /images/agent-hush.jpg: OK")

    # 6. Verification
    print("\n[6] Verifying remote state...")
    ftp.cwd(f"/{REMOTE_ROOT}/agents")
    idx_size = ftp.size("index.html")
    print(f"  Remote /agents/index.html size: {idx_size} bytes (Local out/agents.html: {os.path.getsize(agents_html_path)} bytes)")

    ftp.cwd(f"/{REMOTE_ROOT}/leaks")
    hush_leak_size = ftp.size("agent-31-hush.html")
    print(f"  Remote /leaks/agent-31-hush.html size: {hush_leak_size} bytes")

    ftp.quit()
    print("\n" + "=" * 65)
    print("DEPLOYMENT COMPLETE! HUSH IS LIVE ON PRODUCTION!")
    print("=" * 65)

if __name__ == "__main__":
    main()
