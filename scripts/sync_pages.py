import ftplib
import os
import glob
import time

css_files = glob.glob("out/_next/static/css/*.css")
if not css_files:
    print("No CSS files found in out/_next/static/css/")
    exit(1)

css_file = css_files[0]
with open(css_file, "r", encoding="utf-8") as f:
    css = f.read()

style_tag = f"<style id=\"critical-styles\">{css}</style></head>"
for page in ["out/tiers.html", "out/index.html"]:
    if not os.path.exists(page):
        print(f"Warning: {page} does not exist.")
        continue
    with open(page, "r", encoding="utf-8") as f:
        html = f.read()
    if 'id="critical-styles"' not in html:
        html = html.replace("</head>", style_tag, 1)
        with open(page, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Inlined CSS in {page}")

print("Connecting to FTP...")
for attempt in range(5):
    try:
        ftp = ftplib.FTP("ftpupload.net", "if0_43029836", "Dikshu140803", timeout=30)
        ftp.set_pasv(True)
        ftp.cwd("htdocs")

        # 1. Upload .htaccess
        if os.path.exists("public/.htaccess"):
            with open("public/.htaccess", "rb") as f:
                ftp.storbinary("STOR .htaccess", f)
            print("Uploaded .htaccess")

        # 2. Upload pages
        for name in ["tiers.html", "index.html"]:
            if os.path.exists(f"out/{name}"):
                with open(f"out/{name}", "rb") as f:
                    ftp.storbinary(f"STOR {name}", f, blocksize=32768)
                print(f"Uploaded {name} -> remote size: {ftp.size(name)} bytes")

        # 3. Ensure remote CSS folder and file exists
        try:
            ftp.cwd("_next")
        except:
            ftp.mkd("_next")
            ftp.cwd("_next")
        try:
            ftp.cwd("static")
        except:
            ftp.mkd("static")
            ftp.cwd("static")
        try:
            ftp.cwd("css")
        except:
            ftp.mkd("css")
            ftp.cwd("css")

        for cf in css_files:
            cname = os.path.basename(cf)
            with open(cf, "rb") as f:
                ftp.storbinary(f"STOR {cname}", f)
            print(f"Uploaded CSS {cname} to _next/static/css/ ({ftp.size(cname)} bytes)")

        ftp.quit()
        print("ALL SYNCED AND DEPLOYED SUCCESSFULLY!")
        break
    except Exception as e:
        print(f"Attempt {attempt+1} error: {e}. Retrying in 4s...")
        time.sleep(4)
