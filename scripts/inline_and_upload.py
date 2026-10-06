import ftplib
import os
import time

css_path = "out/_next/static/css/7ac90c0a392da88c.css"
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

style_tag = f"<style id=\"critical-styles\">{css_content}</style></head>"

files_to_inline = ["out/index.html", "out/tiers.html"]
for file_path in files_to_inline:
    with open(file_path, "r", encoding="utf-8") as f:
        html = f.read()
    if 'id="critical-styles"' not in html:
        html = html.replace("</head>", style_tag, 1)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Inlined CSS into {file_path}")
    else:
        print(f"Already inlined in {file_path}")

print("Uploading updated index.html and tiers.html to InfinityFree...")
ftp = ftplib.FTP("ftpupload.net", "if0_43029836", "Dikshu140803", timeout=20)
ftp.set_pasv(True)
ftp.cwd("htdocs")

for filename in ["index.html", "tiers.html"]:
    local_p = os.path.join("out", filename)
    with open(local_p, "rb") as f:
        ftp.storbinary(f"STOR {filename}", f)
    print(f"Uploaded {filename} OK! Size: {ftp.size(filename)}")

ftp.quit()
print("DONE!")
