import ftplib
import os
import glob
import time

FTP_HOST = "ftpupload.net"
FTP_USER = "if0_43029836"
FTP_PASS = "Dikshu140803"

pages = [
    "index.html",
    "tiers.html",
    "agents.html",
    "weapons.html",
    "maps.html",
    "skins.html",
    "bundles.html",
    "tools.html",
    "guides.html",
    "lore.html",
    "404.html"
]

# 1. Inline CSS
css_files = glob.glob("out/_next/static/css/*.css")
if css_files:
    with open(css_files[0], "r", encoding="utf-8") as f:
        css = f.read()
    style_tag = f"<style id=\"critical-styles\">{css}</style></head>"
    for p in pages:
        local_p = os.path.join("out", p)
        if os.path.exists(local_p):
            with open(local_p, "r", encoding="utf-8") as f:
                content = f.read()
            if 'id="critical-styles"' not in content:
                content = content.replace("</head>", style_tag, 1)
                with open(local_p, "w", encoding="utf-8") as f:
                    f.write(content)
            print(f"Inlined CSS in {p}")

print("\nConnecting to FTP...", flush=True)
for attempt in range(5):
    try:
        ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
        ftp.set_pasv(True)
        ftp.cwd("htdocs")

        # Upload .htaccess
        with open("public/.htaccess", "rb") as f:
            ftp.storbinary("STOR .htaccess", f)
        print("Uploaded .htaccess", flush=True)

        # Upload pages directly to htdocs/
        for p in pages:
            local_p = os.path.join("out", p)
            if os.path.exists(local_p):
                with open(local_p, "rb") as f:
                    ftp.storbinary(f"STOR {p}", f, blocksize=32768)
                print(f"Uploaded {p}", flush=True)
                time.sleep(0.5)

        # Upload agents chunk
        ftp.cwd("_next/static/chunks/app")
        try:
            ftp.cwd("agents")
        except:
            ftp.mkd("agents")
            ftp.cwd("agents")

        for f in os.listdir("out/_next/static/chunks/app/agents"):
            if f.endswith(".js"):
                local_path = os.path.join("out/_next/static/chunks/app/agents", f)
                with open(local_path, "rb") as fl:
                    ftp.storbinary(f"STOR {f}", fl, blocksize=32768)
                print(f"Uploaded agents chunk: {f}", flush=True)

        ftp.quit()
        print("\nALL CLEAN PAGES AND AGENTS CHUNKS DEPLOYED SUCCESSFULLY!", flush=True)
        break
    except Exception as e:
        print(f"Attempt {attempt+1} error: {e}. Retrying in 4s...", flush=True)
        time.sleep(4)
