import socket
import urllib.request
import urllib.parse
import json

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Force IPv4
orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = getaddrinfo_ipv4

BASE_URL = "https://preview.kurdishname.pages.dev"

class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirectHandler)

tests = [
    # (path, expected_status, description, check_content)
    ("/tr/", 301, "Trailing slash redirect /tr/ -> /tr", None),
    ("/tr/isim/bahoz/", 301, "Trailing slash redirect /tr/isim/bahoz/ -> /tr/isim/bahoz", None),
    ("/tr/isim/bahoz", 200, "TR SSR name page: bahoz", "Bahoz"),
    ("/en/name/bahoz", 200, "EN SSR name page: bahoz", "What Does Bahoz Mean"),
    ("/de/name/bahoz", 200, "DE SSR name page: bahoz", "Bahoz Bedeutung"),
    ("/ar/name/bahoz", 200, "AR SSR name page: bahoz", "باهوز"),
    ("/tr/isim/bejna", 200, "TR SSR name page: bejna (female)", "Bejna"),
    ("/tr/isim/bax", 200, "TR SSR name page: bax (unisex)", "Bax"),
    ("/", 200, "Root page canonical test", 'rel="canonical" href="https://kurdishname.com/"'),
    ("/sitemap.xml", 200, "Sitemap XML index", "sitemap-names-tr.xml"),
]

print("=== TESTING PREVIEW DEPLOYMENT ===")
print("URL:", BASE_URL)
all_passed = True

for path, expected_status, desc, content_check in tests:
    url = BASE_URL + path
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PreviewTester/1.0"})
    try:
        resp = opener.open(req)
        status = resp.status
        headers = dict(resp.headers)
        body = resp.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        status = e.code
        headers = dict(e.headers)
        body = e.read().decode('utf-8', errors='replace') if e.fp else ""
    except Exception as e:
        print(f"[FAIL] {desc}: Request exception {e}")
        all_passed = False
        continue

    # Status check
    status_ok = (status == expected_status)
    
    # Content check
    content_ok = True
    if content_check and content_check not in body:
        content_ok = False
        
    # Redirect location check
    redirect_ok = True
    if expected_status == 301:
        loc = headers.get("Location") or headers.get("location")
        expected_loc = path.rstrip("/")
        if not loc or not loc.endswith(expected_loc):
            redirect_ok = False
            print(f"  Expected location ending in {expected_loc}, got {loc}")

    if status_ok and content_ok and redirect_ok:
        print(f"[PASS] {desc} -> {status} OK")
        if "Bahoz" in body and "<title>" in body:
            # print title
            start_t = body.find("<title>")
            end_t = body.find("</title>")
            if start_t != -1 and end_t != -1:
                print(f"       Title: {body[start_t+7:end_t]}")
    else:
        print(f"[FAIL] {desc} -> got {status} (expected {expected_status}), content_ok={content_ok}, redirect_ok={redirect_ok}")
        all_passed = False
        if not content_ok:
            print(f"       Looking for: '{content_check}'")
            print(f"       Body preview: {body[:300]}...")

print("\n=== SUMMARY ===")
print("All passed!" if all_passed else "Some tests failed!")
