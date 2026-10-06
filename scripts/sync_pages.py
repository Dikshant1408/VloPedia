import ftplib
import os
import time

css_file = "out/_next/static/css/7ac90c0a392da88c.css"
with open(css_file, "r", encoding="utf-8") as f:
    css = f.read()

style_tag = f"<style id=\"critical-styles\">{css}</style></head>"
for page in ["out/tiers.html", "out/index.html"]:
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
        for name in ["tiers.html", "index.html"]:
            with open(f"out/{name}", "rb") as f:
                ftp.storbinary(f"STOR {name}", f, blocksize=32768)
            print(f"Uploaded {name} -> remote size: {ftp.size(name)} bytes")
        ftp.quit()
        print("ALL DONE SUCCESSFULLY!")
        break
    except Exception as e:
        print(f"Attempt {attempt+1} error: {e}. Retrying in 4s...")
        time.sleep(4)
