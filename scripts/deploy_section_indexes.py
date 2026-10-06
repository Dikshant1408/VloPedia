import ftplib
import os
import time

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

sections = [
    "agents",
    "weapons",
    "maps",
    "skins",
    "bundles",
    "tools",
    "guides",
    "lore"
]

print("Connecting to FTP...", flush=True)
ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
ftp.set_pasv(True)
ftp.cwd("htdocs")

# 1. Upload updated .htaccess
with open("public/.htaccess", "rb") as f:
    ftp.storbinary("STOR .htaccess", f)
print("Uploaded .htaccess", flush=True)

# 2. Upload index.html into each section
for sec in sections:
    idx_src = f"out/{sec}/index.html"
    if not os.path.exists(idx_src):
        continue

    try:
        ftp.cwd(sec)
    except ftplib.error_perm:
        try:
            ftp.mkd(sec)
        except:
            pass
        ftp.cwd(sec)

    with open(idx_src, "rb") as f:
        ftp.storbinary("STOR index.html", f, blocksize=32768)
    print(f"Uploaded {sec}/index.html", flush=True)
    ftp.cwd("..")

ftp.quit()
print("\nALL SECTION INDEXES DEPLOYED SUCCESSFULLY!", flush=True)
