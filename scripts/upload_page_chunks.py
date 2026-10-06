import ftplib
import os
import time

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

def run():
    print("Connecting to FTP...", flush=True)
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
    ftp.set_pasv(True)
    ftp.cwd("htdocs")
    ftp.cwd("_next")
    ftp.cwd("static")
    ftp.cwd("chunks")

    # Check / upload app chunks
    try:
        ftp.cwd("app")
    except:
        ftp.mkd("app")
        ftp.cwd("app")

    existing_in_app = set(ftp.nlst())
    print("Files currently in app/:", existing_in_app, flush=True)

    app_files = [
        "page-5ccdec6cdf1448bf.js",
        "not-found-45e5ac9c267a8f66.js",
        "layout-b837859af17e59e2.js"
    ]

    for fname in app_files:
        local_path = os.path.join("out/_next/static/chunks/app", fname)
        if os.path.exists(local_path):
            with open(local_path, "rb") as f:
                ftp.storbinary(f"STOR {fname}", f, blocksize=32768)
            print(f"Uploaded app/{fname} -> {ftp.size(fname)} bytes", flush=True)

    # Check / upload tiers chunks
    try:
        ftp.cwd("tiers")
    except:
        ftp.mkd("tiers")
        ftp.cwd("tiers")

    existing_in_tiers = set(ftp.nlst())
    print("Files currently in tiers/:", existing_in_tiers, flush=True)

    tiers_files = [
        "page-a4a43cd1f90bfa45.js"
    ]

    for fname in tiers_files:
        local_path = os.path.join("out/_next/static/chunks/app/tiers", fname)
        if os.path.exists(local_path):
            with open(local_path, "rb") as f:
                ftp.storbinary(f"STOR {fname}", f, blocksize=32768)
            print(f"Uploaded tiers/{fname} -> {ftp.size(fname)} bytes", flush=True)

    ftp.quit()
    print("\nSUCCESSFULLY UPLOADED ALL REQUIRED PAGE CHUNKS!", flush=True)

if __name__ == "__main__":
    for attempt in range(5):
        try:
            run()
            break
        except Exception as e:
            print(f"Attempt {attempt+1} error: {e}. Retrying in 4s...", flush=True)
            time.sleep(4)
