import socket
import json
import sys
from datetime import date, timedelta
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

def analyze_traffic():
    print("="*60)
    print("📈 GOOGLE SEARCH CONSOLE - DETAYLI PERFORMANS ANALİZİ")
    print("="*60)

    # 1. Last 28 days
    end_date = date.today() - timedelta(days=2)
    start_date = end_date - timedelta(days=28)
    
    req = {
        'startDate': start_date.isoformat(),
        'endDate': end_date.isoformat(),
        'dimensions': ['date'],
        'rowLimit': 30
    }
    res = service.searchanalytics().query(siteUrl=SITE_URL, body=req).execute()
    rows = res.get('rows', [])
    total_clicks = sum(r.get('clicks', 0) for r in rows)
    total_impressions = sum(r.get('impressions', 0) for r in rows)
    avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
    print(f"Son 28 Gün Özeti ({start_date} -> {end_date}):")
    print(f"  Toplam Tıklama : {int(total_clicks):,}")
    print(f"  Toplam Gösterim: {int(total_impressions):,}")
    print(f"  Ortalama TO (CTR): %{avg_ctr:.2f}\n")

    # 2. Top pages in Google
    req_pages = {
        'startDate': start_date.isoformat(),
        'endDate': end_date.isoformat(),
        'dimensions': ['page'],
        'rowLimit': 25
    }
    res_pages = service.searchanalytics().query(siteUrl=SITE_URL, body=req_pages).execute()
    print("🏆 Google'da En Çok Tıklanan / Gösterilen İlk 15 Sayfa:")
    for i, r in enumerate(res_pages.get('rows', [])[:15], 1):
        p = r['keys'][0]
        c = int(r.get('clicks', 0))
        imp = int(r.get('impressions', 0))
        pos = r.get('position', 0)
        print(f"  {i}. {p} | Tıklama: {c} | Gösterim: {imp:,} | Sıra: {pos:.1f}")

    # 3. Top queries
    req_queries = {
        'startDate': start_date.isoformat(),
        'endDate': end_date.isoformat(),
        'dimensions': ['query'],
        'rowLimit': 15
    }
    res_queries = service.searchanalytics().query(siteUrl=SITE_URL, body=req_queries).execute()
    print("\n🔍 Google'da Sitenizi Getiren İlk 15 Arama Terimi (Keywords):")
    for i, r in enumerate(res_queries.get('rows', [])[:15], 1):
        q = r['keys'][0]
        c = int(r.get('clicks', 0))
        imp = int(r.get('impressions', 0))
        pos = r.get('position', 0)
        print(f"  {i}. \"{q}\" | Tıklama: {c} | Gösterim: {imp:,} | Ortalama Sıra: {pos:.1f}")

    # 4. Device breakdown
    req_dev = {
        'startDate': start_date.isoformat(),
        'endDate': end_date.isoformat(),
        'dimensions': ['device']
    }
    res_dev = service.searchanalytics().query(siteUrl=SITE_URL, body=req_dev).execute()
    print("\n📱 Cihaz Dağılımı:")
    for r in res_dev.get('rows', []):
        d = r['keys'][0]
        c = int(r.get('clicks', 0))
        imp = int(r.get('impressions', 0))
        print(f"  {d.upper()}: Tıklama: {c} (%{c/total_clicks*100:.1f}%) | Gösterim: {imp:,}")

    # 5. Total unique pages with impressions in last 90 days
    start_90 = end_date - timedelta(days=90)
    req_all_pages = {
        'startDate': start_90.isoformat(),
        'endDate': end_date.isoformat(),
        'dimensions': ['page'],
        'rowLimit': 25000
    }
    res_all = service.searchanalytics().query(siteUrl=SITE_URL, body=req_all_pages).execute()
    active_pages = len(res_all.get('rows', []))
    print(f"\n📊 Son 90 Günde Google Arama Sonuçlarında En Az 1 Kere Gösterilen Toplam Sayfa Sayısı: {active_pages}")

if __name__ == '__main__':
    analyze_traffic()
