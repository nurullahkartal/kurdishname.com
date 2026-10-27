import socket
import json
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

creds = service_account.Credentials.from_service_account_file(
    'service_account.json',
    scopes=['https://www.googleapis.com/auth/webmasters.readonly']
)
service = build('searchconsole', 'v1', credentials=creds)
SITE_URL = 'sc-domain:kurdishname.com'

def check_sitemaps():
    print("=== GSC SİTE HARİTALARI ===")
    try:
        sitemaps = service.sitemaps().list(siteUrl=SITE_URL).execute()
        for sm in sitemaps.get('sitemap', []):
            print(f"Harita: {sm.get('path')}")
            print(f"  Son İndirme: {sm.get('lastDownloaded')}")
            print(f"  Son Gönderim: {sm.get('lastSubmitted')}")
            print(f"  Hata Sayısı: {sm.get('errors')}")
            print(f"  Uyarı Sayısı: {sm.get('warnings')}")
            contents = sm.get('contents', [])
            for c in contents:
                print(f"  Tip: {c.get('type')}, Gönderilen: {c.get('submitted')}, İndekslenen: {c.get('indexed')}")
            print()
    except Exception as e:
        print(f"Sitemap hatası: {e}")

def inspect_urls():
    urls_to_test = [
        'https://kurdishname.com/',
        'https://kurdishname.com/tr',
        'https://kurdishname.com/tr/isim/delal',
        'https://kurdishname.com/tr/isim/bahoz',
        'https://kurdishname.com/tr/isim/lorin',
        'https://kurdishname.com/tr/isim/azad'
    ]

    print("\n=== GOOGLE URL INSPECTION (CANLI GOOGLE VERİSİ) ===")
    for u in urls_to_test:
        print(f"\n🔍 İnceleniyor: {u}")
        try:
            req = {
                'inspectionUrl': u,
                'siteUrl': SITE_URL
            }
            res = service.urlInspection().index().inspect(body=req).execute()
            result = res.get('inspectionResult', {})
            idx_status = result.get('indexStatusResult', {})
            
            verdict = idx_status.get('verdict')
            coverage_state = idx_status.get('coverageState')
            robots_txt = idx_status.get('robotsTxtState')
            indexing_state = idx_status.get('indexingState')
            last_crawl = idx_status.get('lastCrawlTime')
            crawled_as = idx_status.get('crawledAs')
            page_fetch = idx_status.get('pageFetchState')
            google_canonical = idx_status.get('googleCanonical')
            user_canonical = idx_status.get('userCanonical')
            referring = idx_status.get('referringUrls', [])
            
            print(f"  📌 Genel Karar (Verdict) : {verdict}")
            print(f"  📌 Kapsam Durumu        : {coverage_state}")
            print(f"  📌 İndeks Durumu         : {indexing_state}")
            print(f"  📌 Sayfa Çekme Durumu    : {page_fetch}")
            print(f"  📌 Robots.txt Durumu     : {robots_txt}")
            print(f"  📌 Son Tarama Tarihi     : {last_crawl}")
            print(f"  📌 Taranan Bot Türü      : {crawled_as}")
            print(f"  📌 Google Canonical      : {google_canonical}")
            print(f"  📌 Kullanıcı Canonical   : {user_canonical}")
            if referring:
                print(f"  📌 Yönlendiren URL'ler   : {referring[:3]}")

        except Exception as e:
            print(f"  Hata: {e}")

if __name__ == '__main__':
    check_sitemaps()
    inspect_urls()
