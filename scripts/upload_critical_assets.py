import ftplib
import os
import sys
import time

HOST = "ftpupload.net"
USER = "if0_43029836"
PASS = "Dikshu140803"
LOCAL_OUT = os.path.abspath("out")

# List of critical assets to ensure are present in their exact folders
TARGETS = [
    # CSS
    "_next/static/css/7ac90c0a392da88c.css",
    # Manifest
    "_next/static/PSuivNr5c8Zp3gWPbSNev/_buildManifest.js",
    "_next/static/PSuivNr5c8Zp3gWPbSNev/_ssgManifest.js",
    # Main chunks
    "_next/static/chunks/0e142730-6e6d0f8058b260a6.js",
    "_next/static/chunks/1255-caadb4189e84d899.js",
    "_next/static/chunks/1416-f28c10706cf85ef5.js",
    "_next/static/chunks/2220-8689f42150a8330a.js",
    "_next/static/chunks/2619-04bc32f026a0d946.js",
    "_next/static/chunks/4230-e81e73125dbefc2c.js",
    "_next/static/chunks/446-c4e9022d27935b1a.js",
    "_next/static/chunks/4909-64796d901b595af7.js",
    "_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js",
    "_next/static/chunks/5824-5abe5fdaf1a4d3d3.js",
    "_next/static/chunks/6419-d03cb0e29ba6acc9.js",
    "_next/static/chunks/6613-0215ac2b41a9e27c.js",
    "_next/static/chunks/711f8d0a-5605c38a26423310.js",
    "_next/static/chunks/9228-7c42c24bd3f93de0.js",
    "_next/static/chunks/9449-d91a9301c089ba9f.js",
    "_next/static/chunks/b2b8fa22-2e1cf24725490160.js",
    "_next/static/chunks/main-app-ecf8d140de131ccf.js",
    "_next/static/chunks/polyfills-42372ed130431b0a.js",
    "_next/static/chunks/webpack-ce60027f5f1cbddc.js",
    # App-specific chunks
    "_next/static/chunks/app/layout-b837859af17e59e2.js",
    "_next/static/chunks/app/not-found-e68af731481c6355.js",
    "_next/static/chunks/app/page-88c389055eb0cea4.js",
    "_next/static/chunks/app/tiers/page-7d50d97c6a20bb98.js",
]

def connect():
    for attempt in range(5):
        try:
            ftp = ftplib.FTP(HOST, USER, PASS, timeout=20)
            ftp.set_pasv(True)
            return ftp
        except Exception as e:
            print(f"[FTP] Connect error: {e}. Retrying in 3s...")
            time.sleep(3)
    raise RuntimeError("Failed to connect")

def ensure_path(ftp, rel_dir):
    """Navigates to rel_dir starting from htdocs, creating dirs if missing"""
    ftp.cwd("/htdocs")
    if not rel_dir:
        return
    parts = [p for p in rel_dir.replace("\\", "/").strip("/").split("/") if p]
    for p in parts:
        try:
            ftp.cwd(p)
        except Exception:
            try:
                ftp.mkd(p)
            except Exception:
                pass
            ftp.cwd(p)

def main():
    print("=" * 60)
    print("UPLOADING CRITICAL RUNTIME ASSETS TO INFINITYFREE")
    print("=" * 60)
    
    ftp = connect()
    print("[FTP] Connected OK!")
    
    for item in TARGETS:
        local_path = os.path.join(LOCAL_OUT, item)
        if not os.path.exists(local_path):
            print(f"Local file missing: {item}")
            continue
            
        rel_dir = os.path.dirname(item).replace("\\", "/")
        filename = os.path.basename(item)
        size = os.path.getsize(local_path)
        
        print(f"Uploading {item} ({size} bytes)...", end=" ", flush=True)
        
        uploaded = False
        for attempt in range(3):
            try:
                ensure_path(ftp, rel_dir)
                with open(local_path, "rb") as fp:
                    ftp.storbinary(f"STOR {filename}", fp)
                print("OK")
                uploaded = True
                break
            except Exception as e:
                print(f"[RETRY {attempt+1}: {e}]", end=" ", flush=True)
                time.sleep(2)
                try:
                    ftp = connect()
                except Exception:
                    pass
        if not uploaded:
            print("FAILED!")

    print("\nVerifying uploaded files...")
    ftp.cwd("/htdocs")
    ftp.cwd("_next")
    ftp.cwd("static")
    ftp.cwd("css")
    print("CSS files in _next/static/css:", ftp.nlst())
    
    ftp.quit()
    print("\nALL CRITICAL ASSETS UPLOADED AND VERIFIED!")

if __name__ == "__main__":
    main()
