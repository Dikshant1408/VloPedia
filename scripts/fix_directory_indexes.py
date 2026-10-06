import ftplib
import os
import glob
import time
import shutil

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
    "lore",
    "collections",
    "compare",
    "flex",
    "leaks",
    "patch-notes"
]

# 1. Local copy: {section}.html -> {section}/index.html
for sec in sections:
    html_src = f"out/{sec}.html"
    target_dir = f"out/{sec}"
    if os.path.exists(html_src):
        os.makedirs(target_dir, exist_ok=True)
        shutil.copy2(html_src, f"{target_dir}/index.html")
        print(f"Copied {html_src} -> {target_dir}/index.html")

# 2. Get CSS to inline
css_files = glob.glob("out/_next/static/css/*.css")
css_content = ""
if css_files:
    with open(css_files[0], "r", encoding="utf-8") as f:
        css_content = f.read()
    style_tag = f"<style id=\"critical-styles\">{css_content}</style></head>"

    for sec in sections:
        for p in [f"out/{sec}.html", f"out/{sec}/index.html"]:
            if os.path.exists(p):
                with open(p, "r", encoding="utf-8") as f:
                    content = f.read()
                if 'id="critical-styles"' not in content:
                    content = content.replace("</head>", style_tag, 1)
                    with open(p, "w", encoding="utf-8") as f:
                        f.write(content)

print("\nConnecting to FTP...", flush=True)
for attempt in range(5):
    try:
        ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
        ftp.set_pasv(True)
        ftp.cwd("htdocs")

        # Upload .htaccess
        with open("public/.htaccess", "rb") as f:
            ftp.storbinary("STOR .htaccess", f)
        print("Uploaded updated .htaccess", flush=True)

        # Upload section HTMLs and section/index.html
        for sec in sections:
            html_src = f"out/{sec}.html"
            if os.path.exists(html_src):
                # Upload sec.html
                with open(html_src, "rb") as f:
                    ftp.storbinary(f"STOR {sec}.html", f, blocksize=32768)
                print(f"Uploaded {sec}.html -> {ftp.size(sec + '.html')} B", flush=True)

                # Ensure remote directory exists
                try:
                    ftp.cwd(sec)
                except ftplib.error_perm:
                    ftp.mkd(sec)
                    ftp.cwd(sec)

                # Upload index.html inside the directory
                idx_src = f"out/{sec}/index.html"
                with open(idx_src, "rb") as f:
                    ftp.storbinary("STOR index.html", f, blocksize=32768)
                print(f"Uploaded {sec}/index.html -> {ftp.size('index.html')} B", flush=True)

                ftp.cwd("..")

        ftp.quit()
        print("\nALL SECTION PAGES & DIRECTORY INDEXES SUCCESSFULLY DEPLOYED!", flush=True)
        break
    except Exception as e:
        print(f"Attempt {attempt+1} error: {e}. Retrying in 4s...", flush=True)
        time.sleep(4)
