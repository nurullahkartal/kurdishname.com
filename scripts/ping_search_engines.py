import urllib.request
import urllib.parse
import sys

sys.stdout.reconfigure(encoding='utf-8')

SITEMAP_URL = "https://kurdishname.com/sitemap.xml"

def ping_google():
    try:
        url = f"https://www.google.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"Google Sitemap Ping: Status {resp.status}")
    except Exception as e:
        print(f"Google Sitemap Ping error: {e}")

def ping_bing():
    try:
        url = f"https://www.bing.com/ping?sitemap={urllib.parse.quote(SITEMAP_URL)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"Bing Sitemap Ping: Status {resp.status}")
    except Exception as e:
        print(f"Bing Sitemap Ping error: {e}")

if __name__ == "__main__":
    print(f"Pinging search engines with {SITEMAP_URL}...")
    ping_google()
    ping_bing()
