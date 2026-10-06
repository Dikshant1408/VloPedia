import ftplib
import os
import glob
import time
import shutil

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

pages = [
    "index",
    "tiers",
    "agents",
    "weapons",
    "maps",
    "skins",
    "bundles",
    "tools",
    "guides",
    "lore",
    "404"
]

# 1. Ensure section/index.html copies exist locally
for p in pages:
    if p in ["index", "404"]:
        continue
    src = f"out/{p}.html"
    dst_dir = f"out/{p}"
    if os.path.exists(src):
        os.makedirs(dst_dir, exist_ok=True)
        shutil.copy2(src, f"{dst_dir}/index.html")

# 2. Inline critical CSS into all main pages
css_files = glob.glob("out/_next/static/css/*.css")
if css_files:
    with open(css_files[0], "r", encoding="utf-8") as f:
        css = f.read()
    style_tag = f"<style id=\"critical-styles\">{css}</style></head>"
    for p in pages:
        for path in [f"out/{p}.html", f"out/{p}/index.html"]:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                if 'id="critical-styles"' not in content:
                    content = content.replace("</head>", style_tag, 1)
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(content)

print("Connecting to FTP...", flush=True)
for attempt in range(5):
    try:
        ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
        ftp.set_pasv(True)
        ftp.cwd("htdocs")

        # 3. Upload .htaccess
        with open("public/.htaccess", "rb") as f:
            ftp.storbinary("STOR .htaccess", f)
        print("Uploaded .htaccess", flush=True)

        # 4. Upload all main page HTMLs
        for p in pages:
            src = f"out/{p}.html"
            if os.path.exists(src):
                with open(src, "rb") as f:
                    ftp.storbinary(f"STOR {p}.html", f, blocksize=32768)
                print(f"Uploaded {p}.html", flush=True)

            # Upload section/index.html if folder exists
            idx = f"out/{p}/index.html"
            if os.path.exists(idx):
                try:
                    ftp.cwd(p)
                except:
                    ftp.mkd(p)
                    ftp.cwd(p)
                with open(idx, "rb") as f:
                    ftp.storbinary("STOR index.html", f, blocksize=32768)
                print(f"Uploaded {p}/index.html", flush=True)
                ftp.cwd("..")

        # 5. Upload app chunks for agents, weapons, layout, etc.
        ftp.cwd("_next")
        ftp.cwd("static")
        ftp.cwd("chunks")

        # app/
        ftp.cwd("app")
        for f in os.listdir("out/_next/static/chunks/app"):
            local_path = os.path.join("out/_next/static/chunks/app", f)
            if os.path.isfile(local_path) and f.endswith(".js"):
                with open(local_path, "rb") as fl:
                    ftp.storbinary(f"STOR {f}", fl, blocksize=32768)
                print(f"Uploaded app/{f}", flush=True)

        # app/agents/
        if os.path.exists("out/_next/static/chunks/app/agents"):
            try:
                ftp.cwd("agents")
            except:
                ftp.mkd("agents")
                ftp.cwd("agents")
            for f in os.listdir("out/_next/static/chunks/app/agents"):
                local_path = os.path.join("out/_next/static/chunks/app/agents", f)
                if os.path.isfile(local_path) and f.endswith(".js"):
                    with open(local_path, "rb") as fl:
                        ftp.storbinary(f"STOR {f}", fl, blocksize=32768)
                    print(f"Uploaded app/agents/{f}", flush=True)
            ftp.cwd("..")

        # app/weapons/
        if os.path.exists("out/_next/static/chunks/app/weapons"):
            try:
                ftp.cwd("weapons")
            except:
                ftp.mkd("weapons")
                ftp.cwd("weapons")
            for f in os.listdir("out/_next/static/chunks/app/weapons"):
                local_path = os.path.join("out/_next/static/chunks/app/weapons", f)
                if os.path.isfile(local_path) and f.endswith(".js"):
                    with open(local_path, "rb") as fl:
                        ftp.storbinary(f"STOR {f}", fl, blocksize=32768)
                    print(f"Uploaded app/weapons/{f}", flush=True)
            ftp.cwd("..")

        ftp.quit()
        print("\nALL MAIN PAGES, DIRECTORY INDEXES & RUNTIME CHUNKS DEPLOYED SUCCESSFULLY!", flush=True)
        break
    except Exception as e:
        print(f"Attempt {attempt+1} error: {e}. Retrying in 4s...", flush=True)
        time.sleep(4)
