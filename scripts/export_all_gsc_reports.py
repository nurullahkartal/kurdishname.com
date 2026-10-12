import os
import sys
import socket
import csv
import json
from datetime import datetime, timedelta

# Force IPv4 for reliable connection
_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/webmasters'
]
KEY_FILE = os.path.join(os.path.dirname(__file__), '..', 'service_account.json')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'gsc_reports')

SITE_URL = 'sc-domain:kurdishname.com'

def init_service():
    if not os.path.exists(KEY_FILE):
        raise FileNotFoundError(f"{KEY_FILE} dosyasi bulunamadi.")
    credentials = service_account.Credentials.from_service_account_file(
        KEY_FILE, scopes=SCOPES
    )
    return build('searchconsole', 'v1', credentials=credentials)

def save_csv(filename, fieldnames, rows):
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f" -> Kaydedildi (CSV): {filename} ({len(rows)} satir)")

def save_json(filename, data):
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f" -> Kaydedildi (JSON): {filename}")

def fetch_search_analytics(service, dimensions, start_date, end_date, row_limit=25000):
    body = {
        'startDate': start_date,
        'endDate': end_date,
        'dimensions': dimensions,
        'rowLimit': row_limit
    }
    try:
        response = service.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
        return response.get('rows', [])
    except Exception as e:
        print(f"Hata ({dimensions}): {e}")
        return []

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    service = init_service()
    
    # 16 months is max available in GSC (~480 days)
    end_date = (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=480)).strftime('%Y-%m-%d')
    
    print(f"=== GSC VERI INDIRME BASLADI ===")
    print(f"Muluk: {SITE_URL}")
    print(f"Tarih Araligi: {start_date} - {end_date}\n")

    # 1. SITEMAPS
    print("1. Site Haritalari (Sitemaps) aliniyor...")
    try:
        sitemaps_res = service.sitemaps().list(siteUrl=SITE_URL).execute()
        sitemaps_list = sitemaps_res.get('sitemap', [])
        save_json('sitemaps.json', sitemaps_list)
        if sitemaps_list:
            sitemap_csv_rows = []
            for sm in sitemaps_list:
                sitemap_csv_rows.append({
                    'path': sm.get('path', ''),
                    'lastSubmitted': sm.get('lastSubmitted', ''),
                    'isPending': sm.get('isPending', ''),
                    'type': sm.get('type', ''),
                    'lastDownloaded': sm.get('lastDownloaded', ''),
                    'warnings': sm.get('warnings', 0),
                    'errors': sm.get('errors', 0)
                })
            save_csv('sitemaps.csv', ['path', 'lastSubmitted', 'isPending', 'type', 'lastDownloaded', 'warnings', 'errors'], sitemap_csv_rows)
    except Exception as e:
        print(f"Sitemap cekme hatasi: {e}")

    # 2. QUERIES (Anahtar Kelimeler)
    print("\n2. Anahtar Kelimeler (Queries) aliniyor...")
    queries_data = fetch_search_analytics(service, ['query'], start_date, end_date)
    query_rows = []
    for r in queries_data:
        query_rows.append({
            'query': r['keys'][0],
            'clicks': r.get('clicks', 0),
            'impressions': r.get('impressions', 0),
            'ctr': round(r.get('ctr', 0) * 100, 2),
            'position': round(r.get('position', 0), 1)
        })
    save_csv('anahtar_kelimeler_tum_zamanlar.csv', ['query', 'clicks', 'impressions', 'ctr', 'position'], query_rows)
    save_json('anahtar_kelimeler_tum_zamanlar.json', query_rows)

    # 3. PAGES (Sayfalar)
    print("\n3. Sayfalar (Pages) aliniyor...")
    pages_data = fetch_search_analytics(service, ['page'], start_date, end_date)
    page_rows = []
    for r in pages_data:
        page_rows.append({
            'page': r['keys'][0],
            'clicks': r.get('clicks', 0),
            'impressions': r.get('impressions', 0),
            'ctr': round(r.get('ctr', 0) * 100, 2),
            'position': round(r.get('position', 0), 1)
        })
    save_csv('sayfalar_tum_zamanlar.csv', ['page', 'clicks', 'impressions', 'ctr', 'position'], page_rows)
    save_json('sayfalar_tum_zamanlar.json', page_rows)

    # 4. QUERY + PAGE (Kelime - Sayfa Eslestirmesi)
    print("\n4. Kelime ve Sayfa Eslestirmeleri (Query + Page) aliniyor...")
    qp_data = fetch_search_analytics(service, ['query', 'page'], start_date, end_date)
    qp_rows = []
    for r in qp_data:
        qp_rows.append({
            'query': r['keys'][0],
            'page': r['keys'][1],
            'clicks': r.get('clicks', 0),
            'impressions': r.get('impressions', 0),
            'ctr': round(r.get('ctr', 0) * 100, 2),
            'position': round(r.get('position', 0), 1)
        })
    save_csv('kelime_ve_sayfa_detay.csv', ['query', 'page', 'clicks', 'impressions', 'ctr', 'position'], qp_rows)
    save_json('kelime_ve_sayfa_detay.json', qp_rows)

    # 5. DATES (Gunluk Performans Trendi)
    print("\n5. Gunluk Performans Trendi (Daily Date Performance) aliniyor...")
    date_data = fetch_search_analytics(service, ['date'], start_date, end_date)
    date_rows = []
    for r in date_data:
        date_rows.append({
            'date': r['keys'][0],
            'clicks': r.get('clicks', 0),
            'impressions': r.get('impressions', 0),
            'ctr': round(r.get('ctr', 0) * 100, 2),
            'position': round(r.get('position', 0), 1)
        })
    # Sort chronologically
    date_rows.sort(key=lambda x: x['date'])
    save_csv('gunluk_performans.csv', ['date', 'clicks', 'impressions', 'ctr', 'position'], date_rows)
    save_json('gunluk_performans.json', date_rows)

    # 6. COUNTRIES (Ulkeler)
    print("\n6. Ulkelere Gore Performans (Countries) aliniyor...")
    country_data = fetch_search_analytics(service, ['country'], start_date, end_date)
    country_rows = []
    for r in country_data:
        country_rows.append({
            'country': r['keys'][0],
            'clicks': r.get('clicks', 0),
            'impressions': r.get('impressions', 0),
            'ctr': round(r.get('ctr', 0) * 100, 2),
            'position': round(r.get('position', 0), 1)
        })
    save_csv('ulkeler_performans.csv', ['country', 'clicks', 'impressions', 'ctr', 'position'], country_rows)
    save_json('ulkeler_performans.json', country_rows)

    # 7. DEVICES (Cihazlar)
    print("\n7. Cihazlara Gore Performans (Devices) aliniyor...")
    device_data = fetch_search_analytics(service, ['device'], start_date, end_date)
    device_rows = []
    for r in device_data:
        device_rows.append({
            'device': r['keys'][0],
            'clicks': r.get('clicks', 0),
            'impressions': r.get('impressions', 0),
            'ctr': round(r.get('ctr', 0) * 100, 2),
            'position': round(r.get('position', 0), 1)
        })
    save_csv('cihazlar_performans.csv', ['device', 'clicks', 'impressions', 'ctr', 'position'], device_rows)
    save_json('cihazlar_performans.json', device_rows)

    # 8. URL INSPECTION (Sayfa Indeks Durumlari)
    print("\n8. Onemli Sayfalar Icin URL Denetimi (URL Inspection) yapiliyor...")
    inspection_results = []
    # Test top 15 pages
    top_pages = [p['page'] for p in page_rows[:15]]
    for url in top_pages:
        try:
            inspect_body = {
                'inspectionUrl': url,
                'siteUrl': SITE_URL
            }
            res = service.urlInspection().index().inspect(body=inspect_body).execute()
            result_item = res.get('inspectionResult', {})
            idx_result = result_item.get('indexStatusResult', {})
            
            inspection_results.append({
                'url': url,
                'verdict': idx_result.get('verdict', ''),
                'coverageState': idx_result.get('coverageState', ''),
                'indexingState': idx_result.get('indexingState', ''),
                'lastCrawlTime': idx_result.get('lastCrawlTime', ''),
                'crawledAs': idx_result.get('crawledAs', ''),
                'googleCanonical': idx_result.get('googleCanonical', ''),
                'userCanonical': idx_result.get('userCanonical', ''),
                'pageFetchState': idx_result.get('pageFetchState', '')
            })
            print(f" -> Denetlendi: {url} => {idx_result.get('coverageState', 'OK')}")
        except Exception as e:
            print(f" -> URL denetim hatasi ({url}): {e}")
            
    if inspection_results:
        save_csv('url_indeks_denetimi.csv', [
            'url', 'verdict', 'coverageState', 'indexingState', 'lastCrawlTime',
            'crawledAs', 'googleCanonical', 'userCanonical', 'pageFetchState'
        ], inspection_results)
        save_json('url_indeks_denetimi.json', inspection_results)

    # 9. SUMMARY MARKDOWN GENERATION
    print("\n9. Ozet Rapor (OZET_RAPOR.md) olusturuluyor...")
    total_clicks = sum(r['clicks'] for r in query_rows)
    total_impressions = sum(r['impressions'] for r in query_rows)
    overall_ctr = round((total_clicks / total_impressions * 100), 2) if total_impressions > 0 else 0

    md_content = f"""# Google Search Console Kapsamlı Raporu
**Mülk:** `{SITE_URL}`  
**Tarih Aralığı:** {start_date} ile {end_date} arası  
**Rapor Oluşturulma Tarihi:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  

---

## 1. Genel Performans Özeti
* **Toplam Tıklama:** {total_clicks:,}
* **Toplam Gösterim:** {total_impressions:,}
* **Ortalama CTR (Tıklama Oranı):** %{overall_ctr}
* **Sıralanan Toplam Benzersiz Anahtar Kelime:** {len(query_rows):,}
* **Trafik Alan Benzersiz Sayfa Sayısı:** {len(page_rows):,}

---

## 2. En Çok Tıklanan İlk 10 Anahtar Kelime
| Sıra | Anahtar Kelime | Tıklama | Gösterim | CTR (%) | Ort. Pozisyon |
| :---: | :--- | :---: | :---: | :---: | :---: |
"""
    for i, q in enumerate(query_rows[:10], 1):
        md_content += f"| {i} | **{q['query']}** | {q['clicks']} | {q['impressions']} | %{q['ctr']} | {q['position']} |\n"

    md_content += """
---

## 3. Fırsat Kelimeleri (Yüksek Gösterim, Düşük CTR)
*Bu kelimeler aramalarda çok görüntüleniyor ancak tıklama oranı düşük. Başlık (Title) ve Meta Açıklamaları optimize edilirse hızlı trafik artışı sağlar:*

| Anahtar Kelime | Tıklama | Gösterim | CTR (%) | Ort. Pozisyon |
| :--- | :---: | :---: | :---: | :---: |
"""
    # High impressions (> 50) and CTR < 5%
    opps = [q for q in query_rows if q['impressions'] >= 50 and q['ctr'] < 5.0]
    opps.sort(key=lambda x: x['impressions'], reverse=True)
    for q in opps[:10]:
        md_content += f"| **{q['query']}** | {q['clicks']} | {q['impressions']} | %{q['ctr']} | {q['position']} |\n"

    md_content += """
---

## 4. En Çok Trafik Çeken İlk 10 Sayfa
| Sıra | URL | Tıklama | Gösterim | CTR (%) | Ort. Pozisyon |
| :---: | :--- | :---: | :---: | :---: | :---: |
"""
    for i, p in enumerate(page_rows[:10], 1):
        md_content += f"| {i} | `{p['page']}` | {p['clicks']} | {p['impressions']} | %{p['ctr']} | {p['position']} |\n"

    md_content += """
---

## 5. Cihaz Dağılımı
| Cihaz | Tıklama | Gösterim | CTR (%) |
| :--- | :---: | :---: | :---: |
"""
    for d in device_rows:
        md_content += f"| **{d['device']}** | {d['clicks']} | {d['impressions']} | %{d['ctr']} |\n"

    md_content += """
---

## 6. İndirilen Dosyalar Listesi
Tüm ham veriler `gsc_reports` klasörüne hem Excel uyumlu CSV hem de JSON olarak kaydedildi:
* `anahtar_kelimeler_tum_zamanlar.csv` (.json)
* `sayfalar_tum_zamanlar.csv` (.json)
* `kelime_ve_sayfa_detay.csv` (.json)
* `gunluk_performans.csv` (.json)
* `ulkeler_performans.csv` (.json)
* `cihazlar_performans.csv` (.json)
* `url_indeks_denetimi.csv` (.json)
* `sitemaps.json`
"""

    report_md_path = os.path.join(OUTPUT_DIR, 'OZET_RAPOR.md')
    with open(report_md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f" -> Kaydedildi (Markdown): OZET_RAPOR.md")

    print("\n=== TUM RAPORLAR BASARIYLA INDIRILDI ===")

if __name__ == '__main__':
    main()
