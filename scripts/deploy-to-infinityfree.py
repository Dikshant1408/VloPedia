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
    """
    Ensures relative directory (e.g. '_next/static/css') exists under /htdocs,
    and leaves ftp CWD set to that exact directory.
    """
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
                ftp.storbinary(f"STOR {filename}", f)
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
    print("=" * 60)
    print("FIXING & DEPLOYING NEXT.JS ASSETS TO INFINITYFREE")
    print("=" * 60)

    ftp = get_ftp()
    print(f"[FTP] Connected to {HOST} as {USER}")

    # 1. Critical Next.js Static Runtime: CSS, Chunks, Manifest
    next_static_dir = os.path.join(LOCAL_OUT, "_next", "static")
    print("\n[STEP 1/3] Uploading Next.js CSS and Runtime Chunks...")
    for root, dirs, files in os.walk(next_static_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, LOCAL_OUT).replace("\\", "/")
            print(f"  -> {rel_path}...", end=" ", flush=True)
            if upload_file(ftp, full_path, rel_path):
                print("OK")
            else:
                print("FAILED")

    # 2. Root files: index.html, tiers.html, .htaccess, etc.
    print("\n[STEP 2/3] Uploading Root Pages & .htaccess...")
    root_files = [f for f in os.listdir(LOCAL_OUT) if os.path.isfile(os.path.join(LOCAL_OUT, f))]
    priority = [".htaccess", "tiers.html", "index.html", "404.html", "robots.txt", "sitemap.xml", "ads.txt"]
    sorted_files = [f for f in priority if f in root_files] + [f for f in root_files if f not in priority]

    for f in sorted_files:
        full_path = os.path.join(LOCAL_OUT, f)
        print(f"  -> /{f} ({os.path.getsize(full_path)} bytes)...", end=" ", flush=True)
        if upload_file(ftp, full_path, f):
            print("OK")
        else:
            print("FAILED")

    # 3. Verify CSS file exists at its exact remote path
    ftp.cwd(f"/{REMOTE_ROOT}/_next/static/css")
    css_files = ftp.nlst()
    print("\n" + "=" * 60)
    print(f"VERIFICATION: _next/static/css contains: {css_files}")

    # Verify tiers.html size
    ftp.cwd(f"/{REMOTE_ROOT}")
    tiers_size = ftp.size("tiers.html")
    print(f"VERIFICATION: Root tiers.html size is {tiers_size} bytes")
    print("ALL STYLES & ASSETS DEPLOYED TO https://vlopedia.website/")
    print("=" * 60)
    ftp.quit()

if __name__ == "__main__":
    main()
