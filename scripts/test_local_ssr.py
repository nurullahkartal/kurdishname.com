import urllib.request
import urllib.error

def test():
    # 1. Trailing slash 301 test
    print("--- 1. Testing Trailing Slash Redirect (/tr/) ---")
    try:
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None
        opener = urllib.request.build_opener(NoRedirect)
        req1 = urllib.request.Request('http://127.0.0.1:8788/tr/')
        resp1 = opener.open(req1)
        print("Status:", resp1.status)
    except urllib.error.HTTPError as e:
        print("Status code:", e.code)
        print("Location header:", e.headers.get('Location'))

    # 2. SSR Name Page test
    print("\n--- 2. Testing SSR Name Page (/tr/isim/bahoz) ---")
    try:
        req2 = urllib.request.Request('http://127.0.0.1:8788/tr/isim/bahoz', headers={'User-Agent': 'Googlebot'})
        resp2 = urllib.request.urlopen(req2)
        html = resp2.read().decode('utf-8', errors='ignore')
        print("Status:", resp2.status)
        print("Edge Rendered Header:", resp2.headers.get('X-Edge-Rendered'))
        print("Contains Bahoz Name:", "Bahoz" in html)
        print("Contains Title Tag:", "<title>" in html)
        print("Contains Canonical Tag:", 'rel="canonical"' in html)
        print("Contains Hreflang Tags:", 'hreflang="tr"' in html and 'hreflang="de"' in html)
        print("Contains DefinedTerm Schema:", "DefinedTerm" in html)
        print("Contains FAQ Schema:", "FAQPage" in html)
        print("Total SSR HTML Length:", len(html), "bytes")
        
        # Print title line
        import re
        title_match = re.search(r'<title>(.*?)</title>', html)
        if title_match:
            print("Rendered Title:", title_match.group(1))
        canonical_match = re.search(r'<link rel="canonical" href="(.*?)"', html)
        if canonical_match:
            print("Rendered Canonical:", canonical_match.group(1))

    except Exception as e:
        print("SSR error:", e)

    # 3. Sitemap test
    print("\n--- 3. Testing Sitemap Index (/sitemap.xml) ---")
    try:
        req3 = urllib.request.Request('http://127.0.0.1:8788/sitemap.xml')
        resp3 = urllib.request.urlopen(req3)
        sm_content = resp3.read().decode('utf-8', errors='ignore')
        print("Status:", resp3.status)
        print("Contains sitemap entries:", "<sitemap>" in sm_content)
        print("Sitemap length:", len(sm_content), "bytes")
    except Exception as e:
        print("Sitemap error:", e)

if __name__ == '__main__':
    test()
