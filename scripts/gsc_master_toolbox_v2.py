import socket
import sys
import os
import json
import time
from datetime import date, timedelta
from collections import defaultdict
from google.oauth2 import service_account
from googleapiclient.discovery import build

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# IPv4 force fix for Windows DNS/SSL stability
_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

SITE_URL = 'sc-domain:kurdishname.com'
SERVICE_ACCOUNT_FILE = 'service_account.json'

creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=[
        'https://www.googleapis.com/auth/webmasters',
        'https://www.googleapis.com/auth/indexing'
    ]
)
service = build('searchconsole', 'v1', credentials=creds)

master_report = {}

print("="*75)
print("👑 GOOGLE SEARCH CONSOLE API - MASTER TOOLBOX V2 (FULL CAPABILITY SUITE)")
print("="*75)

# ==============================================================================
# MODÜL 1: SITES API (MÜLK BİLGİSİ VE İZİN DÜZEYİ)
# ==============================================================================
print("\n[MODÜL 1] 🌐 Sites API - Doğrulanmış Mülkler ve İzin Seviyesi")
try:
    sites_res = service.sites().list().execute()
    sites = sites_res.get('siteEntry', [])
    master_report['sites'] = sites
    for s in sites:
        print(f"  ✅ Mülk: {s.get('siteUrl')} | Yetki Seviyesi: {s.get('permissionLevel')}")
except Exception as e:
    print(f"  ❌ Sites API Hatası: {e}")

# ==============================================================================
# MODÜL 2: SITEMAPS API (DETAYLI VE YAZMA DESTEKLİ)
# ==============================================================================
print("\n[MODÜL 2] 🗺️ Sitemaps API - 33 Sitemap Ayrıştırma ve İndeksleme Sayımları")
try:
    sitemaps_list = service.sitemaps().list(siteUrl=SITE_URL).execute().get('sitemap', [])
    master_report['sitemaps'] = []
    total_submitted = 0
    total_indexed = 0
    
    for s in sitemaps_list:
        path = s.get('path')
        try:
            details = service.sitemaps().get(siteUrl=SITE_URL, feedpath=path).execute()
        except:
            details = s
            
        sub_cnt = 0
        idx_cnt = 0
        for c in details.get('contents', []):
            sub_cnt += int(c.get('submitted', 0))
            idx_cnt += int(c.get('indexed', 0))
            
        total_submitted += sub_cnt
        total_indexed += idx_cnt
        master_report['sitemaps'].append({
            'path': path,
            'lastDownloaded': details.get('lastDownloaded'),
            'submitted': sub_cnt,
            'indexed': idx_cnt,
            'errors': details.get('errors', 0)
        })
    print(f"  Toplam Kayıtlı Sitemap : {len(master_report['sitemaps'])}")
    print(f"  Bildirilen Toplam URL  : {total_submitted:,}")
    print(f"  Google İndekslenen     : {total_indexed:,}")
except Exception as e:
    print(f"  ❌ Sitemaps API Hatası: {e}")

# ==============================================================================
# MODÜL 3: ADVANCED SEARCH ANALYTICS (PAGINATION, REGEX & FRESH DATA)
# ==============================================================================
print("\n[MODÜL 3] 📊 Gelişmiş Search Analytics (Taze Veri + Regex + Sayfalama)")
end_d = date.today() - timedelta(days=1)
start_d = end_d - timedelta(days=28)

try:
    # 1. Taze Veri (dataState='all') ve Regex Filtresi
    req_fresh = {
        'startDate': start_d.isoformat(),
        'endDate': end_d.isoformat(),
        'dimensions': ['query', 'page'],
        'rowLimit': 25000,
        'dataState': 'all',  # Taze veriler dahil
        'dimensionFilterGroups': [{
            'filters': [{
                'dimension': 'query',
                'operator': 'includingRegex',
                'expression': 'kurt|kürt|isim|kiz|kız|erkek|name'
            }]
        }]
    }
    res_fresh = service.searchanalytics().query(siteUrl=SITE_URL, body=req_fresh).execute()
    fresh_rows = res_fresh.get('rows', [])
    print(f"  Taze Veri + Regex Eşleşen Sorgu Sayısı: {len(fresh_rows)}")
    master_report['fresh_regex_queries_sample'] = fresh_rows[:10]
    for r in fresh_rows[:5]:
        print(f"    - Sorgu: '{r['keys'][0]}' | Tık: {r['clicks']} | Gösterim: {r['impressions']} | Sıra: {r['position']:.1f}")

    # 2. Sayfalama Simülasyonu (Tüm Veri Kümesi)
    all_rows = []
    start_row = 0
    while True:
        p_req = {
            'startDate': start_d.isoformat(),
            'endDate': end_d.isoformat(),
            'dimensions': ['query', 'page'],
            'rowLimit': 25000,
            'startRow': start_row
        }
        resp = service.searchanalytics().query(siteUrl=SITE_URL, body=p_req).execute()
        rows = resp.get('rows', [])
        if not rows:
            break
        all_rows.extend(rows)
        start_row += 25000
        if start_row >= 50000:
            break
    print(f"  Sayfalama ile Çekilen Toplam Tekil Query/Page Satırı: {len(all_rows)}")
    master_report['total_query_page_rows'] = len(all_rows)
except Exception as e:
    print(f"  ❌ Advanced Analytics Hatası: {e}")

# ==============================================================================
# MODÜL 4: DÖNEM KARŞILAŞTIRMASI (PERIOD-OVER-PERIOD DELTA: SON 28 GÜN VS ÖNCEKİ 28 GÜN)
# ==============================================================================
print("\n[MODÜL 4] 📈 Dönem Karşılaştırması (Son 28 Gün vs Önceki 28 Gün Delta Analizi)")
try:
    cur_end = date.today() - timedelta(days=2)
    cur_start = cur_end - timedelta(days=28)
    prev_end = cur_start - timedelta(days=1)
    prev_start = prev_end - timedelta(days=28)
    
    def fetch_period(s_date, e_date):
        req = {
            'startDate': s_date.isoformat(),
            'endDate': e_date.isoformat(),
            'dimensions': ['query'],
            'rowLimit': 25000
        }
        res = service.searchanalytics().query(siteUrl=SITE_URL, body=req).execute()
        return {r['keys'][0]: r for r in res.get('rows', [])}
        
    cur_data = fetch_period(cur_start, cur_end)
    prev_data = fetch_period(prev_start, prev_end)
    
    deltas = []
    all_q = set(cur_data.keys()) | set(prev_data.keys())
    for q in all_q:
        c = cur_data.get(q, {'clicks': 0, 'impressions': 0, 'position': 0})
        p = prev_data.get(q, {'clicks': 0, 'impressions': 0, 'position': 0})
        d_clicks = c['clicks'] - p['clicks']
        d_imp = c['impressions'] - p['impressions']
        d_pos = p['position'] - c['position'] if p['position'] > 0 and c['position'] > 0 else 0 # Pozitif = sıra yükseldi
        if abs(d_clicks) > 0 or abs(d_imp) >= 10:
            deltas.append({
                'query': q,
                'delta_clicks': d_clicks,
                'delta_impressions': d_imp,
                'delta_position': round(d_pos, 1),
                'cur_clicks': c['clicks'],
                'prev_clicks': p['clicks'],
                'cur_imp': c['impressions'],
                'prev_imp': p['impressions']
            })
    deltas.sort(key=lambda x: x['delta_clicks'], reverse=True)
    master_report['period_deltas'] = deltas[:20]
    
    print(f"  En Çok Büyüyen Kelimeler (Son 28 Günde Artış):")
    for d in deltas[:5]:
        print(f"    🟢 '{d['query']}' -> Tıklama Artışı: +{d['delta_clicks']} (Şimdi: {d['cur_clicks']}) | Gösterim Artışı: +{d['delta_impressions']}")
    
    deltas_declining = sorted(deltas, key=lambda x: x['delta_clicks'])
    print(f"  Trafik Kaybeden Kelimeler (İyileştirme Gereken):")
    for d in deltas_declining[:5]:
        if d['delta_clicks'] < 0:
            print(f"    🔴 '{d['query']}' -> Tıklama Düşüşü: {d['delta_clicks']} | Gösterim Düşüşü: {d['delta_impressions']}")
except Exception as e:
    print(f"  ❌ Dönem Karşılaştırması Hatası: {e}")

# ==============================================================================
# MODÜL 5: GELİŞMİŞ BOYUTLAR (DATE TRENDİ VE SEARCH APPEARANCE)
# ==============================================================================
print("\n[MODÜL 5] 📅 Gelişmiş Boyutlar (Günlük Trend ve Zengin Arama Görünümü)")
try:
    # Günlük Trend
    req_daily = {
        'startDate': (date.today() - timedelta(days=14)).isoformat(),
        'endDate': (date.today() - timedelta(days=2)).isoformat(),
        'dimensions': ['date'],
        'rowLimit': 100
    }
    daily_res = service.searchanalytics().query(siteUrl=SITE_URL, body=req_daily).execute()
    master_report['daily_trend'] = daily_res.get('rows', [])
    print(f"  Son 14 Günün Günlük Trafik Özeti:")
    for d in master_report['daily_trend'][-7:]:
        print(f"    - {d['keys'][0]}: Tık: {d['clicks']} | Gösterim: {d['impressions']} | TO: %{d['ctr']*100:.1f}")

    # Search Appearance (Zengin Sonuçlar)
    req_sa = {
        'startDate': (date.today() - timedelta(days=90)).isoformat(),
        'endDate': (date.today() - timedelta(days=2)).isoformat(),
        'dimensions': ['searchAppearance'],
        'rowLimit': 100
    }
    sa_res = service.searchanalytics().query(siteUrl=SITE_URL, body=req_sa).execute()
    master_report['search_appearance'] = sa_res.get('rows', [])
    print(f"  Arama Görünümü (Search Appearance) Türleri:")
    if master_report['search_appearance']:
        for sa in master_report['search_appearance']:
            print(f"    - {sa['keys'][0]}: Tıklama: {sa['clicks']} | Gösterim: {sa['impressions']}")
    else:
        print("    ℹ️ Henüz özel Search Appearance (Rich snippet rozeti) kaydı ayrışmamış.")
except Exception as e:
    print(f"  ❌ Gelişmiş Boyutlar Hatası: {e}")

# ==============================================================================
# MODÜL 6: BATCH URL INSPECTION & CATEGORIZATION (TOPLU DENETİM)
# ==============================================================================
print("\n[MODÜL 6] 🔬 Toplu URL Denetimi (Batch Inspection) ve Sorun Kategorilendirme")
test_urls = [
    'https://kurdishname.com/',
    'https://kurdishname.com/tr',
    'https://kurdishname.com/en',
    'https://kurdishname.com/de',
    'https://kurdishname.com/ar',
    'https://kurdishname.com/tr/kategori/kiz',
    'https://kurdishname.com/tr/kategori/erkek',
    'https://kurdishname.com/tr/kategori/unisex',
    'https://kurdishname.com/tr/kategori/kiz/A',
    'https://kurdishname.com/tr/kategori/erkek/B',
    'https://kurdishname.com/tr/isim/delal',
    'https://kurdishname.com/tr/isim/bahoz',
    'https://kurdishname.com/tr/isim/lorin',
    'https://kurdishname.com/tr/isim/azad',
    'https://kurdishname.com/tr/isim/ciwan',
    'https://kurdishname.com/en/name/delal',
    'https://kurdishname.com/de/name/delal',
    'https://kurdishname.com/tr/blog'
]

batch_results = []
issues = defaultdict(list)

print(f"  {len(test_urls)} Kritik Sayfa Denetleniyor...")
for i, url in enumerate(test_urls):
    try:
        res = service.urlInspection().index().inspect(
            body={'inspectionUrl': url, 'siteUrl': SITE_URL}
        ).execute()
        
        idx = res.get('inspectionResult', {}).get('indexStatusResult', {})
        mob = res.get('inspectionResult', {}).get('mobileUsabilityResult', {})
        rich = res.get('inspectionResult', {}).get('richResultsResult', {})
        
        cov = idx.get('coverageState', 'Unknown')
        verdict = idx.get('verdict', 'NEUTRAL')
        user_c = idx.get('userCanonical')
        goog_c = idx.get('googleCanonical')
        canon_match = (user_c == goog_c) if (user_c and goog_c) else False
        mob_ok = (mob.get('verdict') == 'PASS')
        
        item = {
            'url': url,
            'coverage': cov,
            'verdict': verdict,
            'lastCrawl': idx.get('lastCrawlTime'),
            'userCanonical': user_c,
            'googleCanonical': goog_c,
            'canonical_match': canon_match,
            'mobile_verdict': mob.get('verdict'),
            'rich_types': [it.get('richResultType') for it in rich.get('detectedItems', [])]
        }
        batch_results.append(item)
        
        # Kategorilendirme
        if cov == 'Crawled - currently not indexed':
            issues['crawled_not_indexed'].append(url)
        elif cov == 'Discovered - currently not indexed':
            issues['discovered_not_indexed'].append(url)
        elif cov == 'Page with redirect':
            issues['redirect_pages'].append(url)
        elif not canon_match and user_c:
            issues['canonical_mismatch'].append(url)
        elif verdict == 'PASS':
            issues['indexed_success'].append(url)
            
        time.sleep(0.15) # Kota dostu micro-delay
    except Exception as e:
        issues['api_error'].append({'url': url, 'error': str(e)})

master_report['batch_inspection'] = batch_results
master_report['categorized_issues'] = {k: v for k, v in issues.items()}

print(f"\n  🎯 Denetim Sonuçları ve Kategori Özeti:")
print(f"    - Başarıyla İndekslenmiş Sayfalar : {len(issues['indexed_success'])}")
print(f"    - Taranmış / Henüz İndekslenmemiş: {len(issues['crawled_not_indexed'])}")
print(f"    - Yönlendirme Sayfaları           : {len(issues['redirect_pages'])}")
print(f"    - Canonical Uyuşmazlığı          : {len(issues['canonical_mismatch'])}")
print(f"    - API Hataları                   : {len(issues['api_error'])}")

# ==============================================================================
# MODÜL 7: INDEXING API TESTİ VE KONTROLÜ
# ==============================================================================
print("\n[MODÜL 7] ⚡ Indexing API Uyumluluk Kontrolü")
try:
    indexing_service = build('indexing', 'v3', credentials=creds)
    # Test metadata query for root
    meta = indexing_service.urlNotifications().getMetadata(url='https://kurdishname.com/').execute()
    print(f"  Indexing API Yanıtı: {meta}")
    master_report['indexing_api_status'] = 'Active'
    master_report['indexing_api_meta'] = meta
except Exception as e:
    err_str = str(e)
    if 'PERMISSION_DENIED' in err_str or '403' in err_str:
        print(f"  ℹ️ Indexing API Bilgisi: Servis hesabı henüz Google Cloud Console'da 'Indexing API' için etkinleştirilmemiş (Sadece JobPosting/BroadcastEvent sayfalarında kullanılır).")
        master_report['indexing_api_status'] = 'Disabled (Expected for dictionary sites)'
    else:
        print(f"  ℹ️ Indexing API Yanıtı: {e}")
        master_report['indexing_api_status'] = str(e)

# SAVE FULL REPORT
with open('scripts/gsc_master_v2_report.json', 'w', encoding='utf-8') as f:
    json.dump(master_report, f, ensure_ascii=False, indent=2)

print("\n" + "="*75)
print("🎉 MASTER TOOLBOX V2 BAŞARIYLA ÇALIŞTIRILDI!")
print("📁 Tüm veri scripts/gsc_master_v2_report.json dosyasına kaydedildi.")
print("="*75)
