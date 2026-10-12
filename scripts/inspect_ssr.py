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

url = "https://preview.kurdishname.pages.dev/tr/isim/bahoz"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"})

resp = urllib.request.urlopen(req)
print(f"Status: {resp.status}")
print(f"Cache-Control: {resp.headers.get('Cache-Control')}")

html = resp.read().decode('utf-8')

print("\n--- HEAD ELEMENTS ---")
for line in html.splitlines():
    if any(k in line for k in ["<title>", "canonical", "alternate", "name=\"description\"", "application/ld+json"]):
        print(line.strip())

print("\n--- FIRST 200 CHARS OF BODY CONTENT ---")
root_match = re.search(r'<div id="root">(.*?)</div>', html, re.DOTALL)
if root_match:
    content = root_match.group(1).strip()
    print(f"Length inside #root: {len(content)} characters")
    print(content[:300])
else:
    print("#root was empty or not matched!")
