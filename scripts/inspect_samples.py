import socket
import urllib.request
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = getaddrinfo_ipv4

urls = [
    "https://preview.kurdishname.pages.dev/tr/isim/bejna",
    "https://preview.kurdishname.pages.dev/tr/isim/bax",
    "https://preview.kurdishname.pages.dev/en/name/bahoz",
    "https://preview.kurdishname.pages.dev/de/name/bahoz",
    "https://preview.kurdishname.pages.dev/ar/%D8%A7%D8%B3%D9%85/bahoz",
    "https://preview.kurdishname.pages.dev/ar/name/bahoz"
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Googlebot/2.1"})
        resp = urllib.request.urlopen(req)
        html = resp.read().decode('utf-8')
        title_m = re.search(r'<title>(.*?)</title>', html)
        canon_m = re.search(r'<link rel="canonical" href="(.*?)"', html)
        desc_m = re.search(r'<meta name="description" content="(.*?)"', html)
        title = title_m.group(1) if title_m else "N/A"
        canon = canon_m.group(1) if canon_m else "N/A"
        desc = desc_m.group(1) if desc_m else "N/A"
        print(f"\nURL: {url}")
        print(f"Status: {resp.status}")
        print(f"Title: {title}")
        print(f"Canonical: {canon}")
        print(f"Description: {desc[:80]}...")
    except Exception as e:
        print(f"\nURL: {url} -> ERROR: {e}")
