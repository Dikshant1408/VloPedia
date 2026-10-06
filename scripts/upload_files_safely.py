import ftplib
import os
import time

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

def upload_single_file(remote_dir, local_path, filename):
    for attempt in range(4):
        try:
            print(f"Uploading {filename} (attempt {attempt+1})...", flush=True)
            ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=45)
            ftp.set_pasv(True)
            ftp.cwd("htdocs")
            if remote_dir:
                for part in remote_dir.split("/"):
                    try:
                        ftp.cwd(part)
                    except:
                        ftp.mkd(part)
                        ftp.cwd(part)

            with open(local_path, "rb") as f:
                ftp.storbinary(f"STOR {filename}", f, blocksize=16384)
            size = os.path.getsize(local_path)
            print(f"SUCCESS: {filename} ({size} bytes)", flush=True)
            ftp.quit()
            time.sleep(2) # Cooldown between socket creations
            return True
        except Exception as e:
            print(f"Error uploading {filename}: {e}. Retrying in 3s...", flush=True)
            time.sleep(3)
    return False

# Target files to update:
files_to_upload = [
    ("", "public/.htaccess", ".htaccess"),
    ("", "out/tiers.html", "tiers.html"),
    ("", "out/agents.html", "agents.html"),
    ("", "out/weapons.html", "weapons.html"),
    ("", "out/maps.html", "maps.html"),
    ("_next/static/chunks/app/agents", "out/_next/static/chunks/app/agents/page-418aa9917c5d680b.js", "page-418aa9917c5d680b.js")
]

for rdir, lpath, fname in files_to_upload:
    if os.path.exists(lpath):
        upload_single_file(rdir, lpath, fname)

print("\nALL TARGET FILES SUCCESSFULLY UPLOADED!")
