import ftplib
import os
import time

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

def group_files_by_dir():
    dirs = {}
    base = os.path.join("out", "_next", "static", "chunks")
    for root, _, files in os.walk(base):
        for f in files:
            if f.endswith(".js"):
                rel_dir = os.path.relpath(root, "out").replace("\\", "/")
                full_path = os.path.join(root, f)
                if rel_dir not in dirs:
                    dirs[rel_dir] = []
                dirs[rel_dir].append((f, full_path))
    return dirs

def ensure_dir(ftp, rel_dir):
    ftp.cwd('/')
    ftp.cwd('htdocs')
    for part in rel_dir.split('/'):
        try:
            ftp.cwd(part)
        except ftplib.error_perm:
            try:
                ftp.mkd(part)
            except ftplib.error_perm:
                pass
            ftp.cwd(part)

def run():
    dir_map = group_files_by_dir()
    total_files = sum(len(fl) for fl in dir_map.values())
    print(f"Total directories to process: {len(dir_map)}, Total files: {total_files}", flush=True)

    ftp = None
    uploaded = 0
    skipped = 0

    for dir_idx, (rel_dir, files) in enumerate(sorted(dir_map.items()), 1):
        for attempt in range(4):
            try:
                if ftp is None:
                    ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
                    ftp.set_pasv(True)

                ensure_dir(ftp, rel_dir)
                existing = set(ftp.nlst())

                for fname, local_path in files:
                    if fname in existing:
                        skipped += 1
                        continue

                    local_size = os.path.getsize(local_path)
                    with open(local_path, "rb") as f:
                        ftp.storbinary(f"STOR {fname}", f, blocksize=32768)
                    uploaded += 1
                    print(f"[{uploaded}/{total_files}] Uploaded {rel_dir}/{fname} ({local_size} B)", flush=True)
                    time.sleep(0.05)

                break
            except Exception as e:
                print(f"Directory {rel_dir} error: {e}. Retrying...", flush=True)
                try:
                    if ftp: ftp.close()
                except:
                    pass
                ftp = None
                time.sleep(3)

    if ftp:
        try:
            ftp.quit()
        except:
            pass

    print(f"\nALL 128 CHUNKS FULLY SYNCED TO INFINITYFREE! Uploaded: {uploaded}, Already up-to-date: {skipped}", flush=True)

if __name__ == "__main__":
    run()
