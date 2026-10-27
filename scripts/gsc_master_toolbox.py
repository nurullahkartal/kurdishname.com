import socket
import sys
import json
from datetime import date, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# IPv4 force fix for Windows DNS/SSL stability
_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

creds = service_account.Credentials.from_service_account_file(
    'service_account.json',
    scopes=['https://www.googleapis.com/auth/webmasters']
)
service = build('searchconsole', 'v1', credentials=creds)
SITE_URL = 'sc-domain:kurdishname.com'

report = {}

print("="*70)
print("🚀 GOOGLE SEARCH CONSOLE API - FULL AUDIT & EXECUTION SUITE")
print("="*70)

# 1. SITES API
print("\n[1/6] 🌐 Doğrulanmış Mülkler (Sites API)...")
try:
    sites_list = service.sites().list().execute()
    report['sites'] = sites_list.get('siteEntry', [])
    for s in report['sites']:
        print(f"  - Mülk: {s.get('siteUrl')} | İzin: {s.get('permissionLevel')}")
except Exception as e:
    print(f"  Hata: {e}")

# 2. SITEMAPS API - DETAILED DRILL-DOWN
print("\n[2/6] 🗺️ Sitemap Ayrıntılı Durum ve İndeksleme Sayıları...")
try:
    sitemaps_list = service.sitemaps().list(siteUrl=SITE_URL).execute().get('sitemap', [])
    report['sitemaps_summary'] = []
    
    total_submitted = 0
    total_indexed = 0
    
    for s in sitemaps_list:
        path = s.get('path')
        # Detailed get
        try:
            details = service.sitemaps().get(siteUrl=SITE_URL, feedpath=path).execute()
        except:
            details = s
        
        contents = details.get('contents', [])
        sub_cnt = 0
        idx_cnt = 0
        for c in contents:
            sub_cnt += int(c.get('submitted', 0))
            idx_cnt += int(c.get('indexed', 0))
        
        total_submitted += sub_cnt
        total_indexed += idx_cnt
        
        info = {
            'path': path,
            'lastDownloaded': details.get('lastDownloaded'),
            'isPending': details.get('isPending', False),
            'submitted_urls': sub_cnt,
            'indexed_urls': idx_cnt,
            'errors': details.get('errors', 0)
        }
        report['sitemaps_summary'].append(info)
    
    print(f"  Toplam Kayıtlı Sitemap: {len(report['sitemaps_summary'])}")
    print(f"  Sitemap'lerde Bildirilen Toplam URL: {total_submitted:,}")
    print(f"  Google Tarafından Şu Ana Kadar İndekslenen: {total_indexed:,}")
    # Print sample
    for s in report['sitemaps_summary'][:5]:
        print(f"    - {s['path'].split('/')[-1]} -> Gönderilen: {s['submitted_urls']} | İndekslenen: {s['indexed_urls']} | Hata: {s['errors']}")
except Exception as e:
    print(f"  Hata: {e}")

# 3. SEARCH ANALYTICS - COUNTRIES & DEVICES
print("\n[3/6] 🌍 Ülke ve Uluslararası Trafik Analizi (Son 3 Ay)...")
end_d = date.today() - timedelta(days=2)
start_d = end_d - timedelta(days=90)
try:
    req_country = {
        'startDate': start_d.isoformat(),
        'endDate': end_d.isoformat(),
        'dimensions': ['country'],
        'rowLimit': 15
    }
    c_res = service.searchanalytics().query(siteUrl=SITE_URL, body=req_country).execute()
    c_rows = c_res.get('rows', [])
    report['countries'] = c_rows
    print(f"  Google'da Gösterim Alan Ülke Sayısı: {len(c_rows)}")
    for r in c_rows[:8]:
        country = r['keys'][0].upper()
        clicks = int(r.get('clicks', 0))
        imp = int(r.get('impressions', 0))
        ctr = r.get('ctr', 0) * 100
        pos = r.get('position', 0)
        print(f"    - {country}: Tıklama: {clicks:3d} | Gösterim: {imp:5d} | CTR: %{ctr:.1f} | Ortalama Sıra: {pos:.1f}")
except Exception as e:
    print(f"  Hata: {e}")

# 4. OPPORTUNITY MINING: "Striking Distance" Keywords (Sıra 4 - 20)
print("\n[4/6] 💎 Altın Fırsatlar: Sıra 4-20 Arası Yüksek Gösterimli Kelimeler...")
try:
    req_opp = {
        'startDate': start_d.isoformat(),
        'endDate': end_d.isoformat(),
        'dimensions': ['query', 'page'],
        'rowLimit': 500
    }
    opp_res = service.searchanalytics().query(siteUrl=SITE_URL, body=req_opp).execute()
    opp_rows = opp_res.get('rows', [])
    
    striking = []
    ctr_killers = []
    
    for r in opp_rows:
        q = r['keys'][0]
        p = r['keys'][1]
        clicks = int(r.get('clicks', 0))
        imp = int(r.get('impressions', 0))
        ctr = r.get('ctr', 0) * 100
        pos = r.get('position', 0)
        
        # Striking distance: pos between 3.5 and 20 with impressions >= 10
        if 3.5 <= pos <= 20 and imp >= 15:
            striking.append({'query': q, 'page': p, 'imp': imp, 'clicks': clicks, 'pos': pos, 'ctr': ctr})
        
        # High impressions, low CTR (< 1.5%) and position < 5
        if pos <= 5 and imp >= 100 and ctr < 2.0:
            ctr_killers.append({'query': q, 'page': p, 'imp': imp, 'clicks': clicks, 'pos': pos, 'ctr': ctr})

    striking.sort(key=lambda x: x['imp'], reverse=True)
    ctr_killers.sort(key=lambda x: x['imp'], reverse=True)
    
    report['striking_distance'] = striking[:10]
    report['ctr_killers'] = ctr_killers[:10]
    
    print(f"  İlk Sayfaya / İlk 3'e Sıçrayabilecek Kelimeler (Striking Distance):")
    for s in striking[:6]:
        print(f"    ⭐ '{s['query']}' | Gösterim: {s['imp']} | Sıra: {s['pos']:.1f} | Sayfa: {s['page'].replace('https://kurdishname.com','')}")
        
    print(f"\n  Başlık/Açıklama Optimize Edilerek Tıklaması Katlanabilecek Kelimeler (Düşük CTR):")
    for c in ctr_killers[:6]:
        print(f"    ⚠️ '{c['query']}' | Gösterim: {c['imp']} | Tık: {c['clicks']} | CTR: %{c['ctr']:.1f} | Sıra: {c['pos']:.1f}")

except Exception as e:
    print(f"  Hata: {e}")

# 5. CANNIBALIZATION CHECK
print("\n[5/6] ⚔️ Keyword Cannibalization (Birbirini Yiyen Sayfalar Analizi)...")
try:
    query_pages = {}
    for r in opp_rows:
        q = r['keys'][0]
        p = r['keys'][1]
        imp = int(r.get('impressions', 0))
        if imp >= 5:
            query_pages.setdefault(q, []).append((p, imp))
    
    cannibalized = {k: v for k, v in query_pages.items() if len(v) > 1}
    print(f"  Aynı Kelimede Yarışan Çift Sayfa Sayısı: {len(cannibalized)}")
    report['cannibalization'] = []
    for k, v in list(cannibalized.items())[:5]:
        print(f"    - Kelime: '{k}'")
        for p, imp in v:
            print(f"        -> {p} ({imp} gösterim)")
        report['cannibalization'].append({'query': k, 'pages': v})
except Exception as e:
    print(f"  Hata: {e}")

# 6. LIVE URL INSPECTIONS (Pilot Sayfalar)
print("\n[6/6] 🔍 Canlı URL Inspection API Testi (En Kritik 5 Sayfa)...")
pilot_urls = [
    'https://kurdishname.com/',
    'https://kurdishname.com/tr',
    'https://kurdishname.com/tr/kategori/kiz',
    'https://kurdishname.com/tr/isim/delal',
    'https://kurdishname.com/en/name/delal'
]

report['inspections'] = []
for url in pilot_urls:
    try:
        req = {'inspectionUrl': url, 'siteUrl': SITE_URL}
        res = service.urlInspection().index().inspect(body=req).execute()
        res_data = res.get('inspectionResult', {})
        idx_res = res_data.get('indexStatusResult', {})
        mob_res = res_data.get('mobileUsabilityResult', {})
        rich_res = res_data.get('richResultsResult', {})
        
        status = idx_res.get('coverageState', 'Bilinmiyor')
        verdict = idx_res.get('verdict', 'NEUTRAL')
        last_c = idx_res.get('lastCrawlTime', 'Hiç taranmadı')
        bot = idx_res.get('crawledAs', 'Bilinmiyor')
        u_canon = idx_res.get('userCanonical', 'Yok')
        g_canon = idx_res.get('googleCanonical', 'Yok')
        mob_verdict = mob_res.get('verdict', 'UNKNOWN')
        
        rich_types = [item.get('richResultType') for item in rich_res.get('detectedItems', [])]
        
        print(f"  📄 URL: {url.replace('https://kurdishname.com', '') or '/'}")
        print(f"     Verdict: {verdict} | Kapsam: {status}")
        print(f"     Son Tarama: {last_c} | Bot: {bot}")
        print(f"     Mobil Uyumluluk: {mob_verdict} | Zengin Sonuçlar: {rich_types or 'Yok'}")
        print(f"     User Canonical: {u_canon} | Google Canonical: {g_canon}")
        print("-" * 50)
        
        report['inspections'].append({
            'url': url,
            'verdict': verdict,
            'coverage': status,
            'lastCrawl': last_c,
            'bot': bot,
            'userCanonical': u_canon,
            'googleCanonical': g_canon,
            'mobile': mob_verdict,
            'richResults': rich_types
        })
    except Exception as e:
        print(f"  Hata ({url}): {e}")

with open('scripts/gsc_full_audit_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print("\n✅ TÜM GSC API ANALİZİ TAMAMLANDI! Rapor scripts/gsc_full_audit_report.json dosyasına yazıldı.")
