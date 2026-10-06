import ftplib
import os
import time

def upload_single_file(filename):
    local_p = os.path.join("out", filename)
    size = os.path.getsize(local_p)
    print(f"Uploading {filename} ({size} bytes)...")
    for attempt in range(5):
        try:
            ftp = ftplib.FTP()
            ftp.connect("ftpupload.net", 21, timeout=30)
            ftp.login("if0_43029836", "Dikshu140803")
            ftp.set_pasv(True)
            ftp.cwd("htdocs")
            with open(local_p, "rb") as f:
                ftp.storbinary(f"STOR {filename}", f, blocksize=16384)
            rem_size = ftp.size(filename)
            ftp.quit()
            print(f"  -> SUCCESS! Remote size: {rem_size}")
            return True
        except Exception as e:
            print(f"  Attempt {attempt+1} failed: {e}. Retrying in 4s...")
            time.sleep(4)
    return False

if __name__ == "__main__":
    upload_single_file("index.html")
    time.sleep(2)
    upload_single_file("tiers.html")
