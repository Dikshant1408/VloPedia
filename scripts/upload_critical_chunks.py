import ftplib
import os
import time

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

def connect():
    print("Connecting to FTP...", flush=True)
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
    ftp.set_pasv(True)
    return ftp

def upload_file_if_needed(ftp, local_path, filename):
    local_size = os.path.getsize(local_path)
    try:
        remote_size = ftp.size(filename)
        if remote_size == local_size:
            print(f"  [OK] {filename} ({local_size} B) already up-to-date", flush=True)
            return False
    except Exception:
        pass

    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {filename}", f, blocksize=32768)
    print(f"  [UPLOADED] {filename} ({local_size} B)", flush=True)
    return True

def run():
    ftp = connect()

    # 1. Navigate to htdocs/_next/static/chunks
    ftp.cwd("htdocs")
    ftp.cwd("_next")
    ftp.cwd("static")
    try:
        ftp.cwd("chunks")
    except:
        ftp.mkd("chunks")
        ftp.cwd("chunks")

    print("\n--- Uploading direct chunks to _next/static/chunks/ ---", flush=True)
    direct_chunks = [f for f in os.listdir("out/_next/static/chunks") if f.endswith(".js") and os.path.isfile(os.path.join("out/_next/static/chunks", f))]
    for i, f in enumerate(direct_chunks, 1):
        local_path = os.path.join("out/_next/static/chunks", f)
        print(f"[{i}/{len(direct_chunks)}]", end="", flush=True)
        upload_file_if_needed(ftp, local_path, f)

    # 2. Navigate to app/
    try:
        ftp.cwd("app")
    except:
        ftp.mkd("app")
        ftp.cwd("app")

    print("\n--- Uploading app chunks to _next/static/chunks/app/ ---", flush=True)
    app_chunks = [f for f in os.listdir("out/_next/static/chunks/app") if f.endswith(".js") and os.path.isfile(os.path.join("out/_next/static/chunks/app", f))]
    for i, f in enumerate(app_chunks, 1):
        local_path = os.path.join("out/_next/static/chunks/app", f)
        print(f"[{i}/{len(app_chunks)}]", end="", flush=True)
        upload_file_if_needed(ftp, local_path, f)

    # 3. Navigate to tiers/
    try:
        ftp.cwd("tiers")
    except:
        ftp.mkd("tiers")
        ftp.cwd("tiers")

    print("\n--- Uploading tiers chunk to _next/static/chunks/app/tiers/ ---", flush=True)
    tiers_chunks = [f for f in os.listdir("out/_next/static/chunks/app/tiers") if f.endswith(".js") and os.path.isfile(os.path.join("out/_next/static/chunks/app/tiers", f))]
    for i, f in enumerate(tiers_chunks, 1):
        local_path = os.path.join("out/_next/static/chunks/app/tiers", f)
        print(f"[{i}/{len(tiers_chunks)}]", end="", flush=True)
        upload_file_if_needed(ftp, local_path, f)

    ftp.quit()
    print("\nALL CRITICAL RUNTIME CHUNKS FULLY SYNCED!", flush=True)

if __name__ == "__main__":
    for attempt in range(5):
        try:
            run()
            break
        except Exception as e:
            print(f"Attempt {attempt+1} failed with error: {e}. Retrying in 3s...", flush=True)
            time.sleep(3)
