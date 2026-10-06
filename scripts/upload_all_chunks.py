import ftplib
import os
import time

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

def get_ftp():
    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
    ftp.set_pasv(True)
    ftp.cwd("htdocs")
    return ftp

def ensure_remote_dir(ftp, remote_dir):
    parts = remote_dir.strip("/").split("/")
    ftp.cwd("/htdocs")
    for part in parts:
        try:
            ftp.cwd(part)
        except ftplib.error_perm:
            try:
                ftp.mkd(part)
                ftp.cwd(part)
            except ftplib.error_perm:
                ftp.cwd(part)

# 1. Collect priority scripts for index.html and tiers.html
priority_scripts = [
    "_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js",
    "_next/static/chunks/1255-caadb4189e84d899.js",
    "_next/static/chunks/main-app-ecf8d140de131ccf.js",
    "_next/static/chunks/711f8d0a-5605c38a26423310.js",
    "_next/static/chunks/b2b8fa22-2e1cf24725490160.js",
    "_next/static/chunks/0e142730-6e6d0f8058b260a6.js",
    "_next/static/chunks/6419-d03cb0e29ba6acc9.js",
    "_next/static/chunks/2619-04bc32f026a0d946.js",
    "_next/static/chunks/4909-64796d901b595af7.js",
    "_next/static/chunks/1356-f652fb3ba396cdd9.js",
    "_next/static/chunks/4230-e81e73125dbefc2c.js",
    "_next/static/chunks/9449-d91a9301c089ba9f.js",
    "_next/static/chunks/1840-83b5ea5747634631.js",
    "_next/static/chunks/1416-f28c10706cf85ef5.js",
    "_next/static/chunks/app/page-5ccdec6cdf1448bf.js",
    "_next/static/chunks/446-c4e9022d27935b1a.js",
    "_next/static/chunks/6613-0215ac2b41a9e27c.js",
    "_next/static/chunks/2220-8689f42150a8330a.js",
    "_next/static/chunks/app/layout-b837859af17e59e2.js",
    "_next/static/chunks/app/not-found-45e5ac9c267a8f66.js",
    "_next/static/chunks/app/tiers/page-a4a43cd1f90bfa45.js",
    "_next/static/chunks/polyfills-42372ed130431b0a.js",
    "_next/static/chunks/webpack-ce60027f5f1cbddc.js"
]

# 2. Collect all JS chunks
all_chunks = []
for root, dirs, files in os.walk("out/_next/static/chunks"):
    for f in files:
        if f.endswith(".js"):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, "out").replace("\\", "/")
            all_chunks.append(rel_path)

# Put priority first, then remaining
ordered_chunks = list(dict.fromkeys(priority_scripts + all_chunks))
print(f"Total chunks to sync: {len(ordered_chunks)}")

ftp = None
uploaded_count = 0
skipped_count = 0

for i, rel_path in enumerate(ordered_chunks, 1):
    local_path = os.path.join("out", rel_path.replace("/", os.sep))
    if not os.path.exists(local_path):
        print(f"[{i}/{len(ordered_chunks)}] MISSING LOCAL: {local_path}")
        continue

    local_size = os.path.getsize(local_path)
    remote_dir = os.path.dirname(rel_path)
    filename = os.path.basename(rel_path)

    # Upload with retries
    success = False
    for attempt in range(4):
        try:
            if ftp is None:
                ftp = get_ftp()
            
            # Navigate to target dir
            ensure_remote_dir(ftp, remote_dir)

            # Check if file already exists with same size
            try:
                remote_size = ftp.size(filename)
                if remote_size == local_size:
                    skipped_count += 1
                    # print(f"[{i}/{len(ordered_chunks)}] SKIPPED (matches): {filename}")
                    success = True
                    break
            except Exception:
                pass # Doesn't exist or error, proceed to upload

            with open(local_path, "rb") as f:
                ftp.storbinary(f"STOR {filename}", f, blocksize=32768)
            uploaded_count += 1
            print(f"[{i}/{len(ordered_chunks)}] UPLOADED: {rel_path} ({local_size} bytes)")
            success = True
            break
        except Exception as e:
            print(f"[{i}/{len(ordered_chunks)}] Error uploading {filename}: {e}. Retrying in 2s...")
            try:
                if ftp: ftp.close()
            except:
                pass
            ftp = None
            time.sleep(2)

    if not success:
        print(f"FAILED to upload: {rel_path}")

if ftp:
    try:
        ftp.quit()
    except:
        pass

print(f"\nCHUNK SYNC COMPLETE! Uploaded: {uploaded_count}, Skipped (already up-to-date): {skipped_count}")
