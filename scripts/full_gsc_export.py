import os
import sys
import socket
import json
import pandas as pd
from datetime import date, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

# ============ NETWORK AYARI (Windows IPv6 Bug Onleyici) ============
_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

# ============ AYARLAR ============
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), "..", "service_account.json")
SITE_URL = "sc-domain:kurdishname.com"   # GSC'deki property ile birebir ayni
EXPORT_DIR = os.path.join(os.path.dirname(__file__), "..", "gsc_export")
DAYS_BACK = 480                          # Tum gecmis (GSC max ~16 ay)
SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/webmasters"
]
# =================================

os.makedirs(EXPORT_DIR, exist_ok=True)

if not os.path.exists(SERVICE_ACCOUNT_FILE):
    raise FileNotFoundError(f"{SERVICE_ACCOUNT_FILE} bulunamadi!")

creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
service = build("searchconsole", "v1", credentials=creds)

end_date = date.today() - timedelta(days=2)   # GSC 2 gun gecikmeli
start_date = end_date - timedelta(days=DAYS_BACK)

start_str = start_date.isoformat()
end_str = end_date.isoformat()

print(f"=== GSC TAM DIŞA AKTARIM BAŞLADI ===")
print(f"Site/Mulk: {SITE_URL}")
print(f"Tarih Araligi: {start_str} -> {end_str}")


# =========================================================
# 1) PERFORMANCE EKRANI - Tum Boyutlarla & Pagination
# =========================================================
def query_performance(dimensions, row_limit=25000, filters=None):
    rows = []
    start_row = 0
    while True:
        body = {
            "startDate": start_str,
            "endDate": end_str,
            "dimensions": dimensions,
            "rowLimit": min(row_limit, 25000),
            "startRow": start_row,
        }
        if filters:
            body["dimensionFilterGroups"] = filters
        try:
            resp = service.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
            batch = resp.get("rows", [])
            rows.extend(batch)
            if len(batch) < 25000 or len(rows) >= row_limit:
                break
            start_row += 25000
        except Exception as e:
            print(f"  [Uyari] Performance sorgu hatasi ({dimensions}): {e}")
            break
    return rows


def rows_to_df(rows, dims):
    data = []
    for r in rows:
        item = {d: k for d, k in zip(dims, r["keys"])}
        item["clicks"] = r.get("clicks", 0)
        item["impressions"] = r.get("impressions", 0)
        item["ctr"] = round(r.get("ctr", 0) * 100, 2)  # Yuzde olarak
        item["position"] = round(r.get("position", 0), 2)
        data.append(item)
    return pd.DataFrame(data)


print("\n1) PERFORMANCE EKRANLARI CEKILIYOR...")
print(" -> Sorgular (Queries)...")
perf_queries   = rows_to_df(query_performance(["query"]), ["query"])
print(f"    Alindi: {len(perf_queries)} sorgu")

print(" -> Sayfalar (Pages)...")
perf_pages     = rows_to_df(query_performance(["page"]), ["page"])
print(f"    Alindi: {len(perf_pages)} sayfa")

print(" -> Ulkeler (Countries)...")
perf_countries = rows_to_df(query_performance(["country"]), ["country"])
print(f"    Alindi: {len(perf_countries)} ulke")

print(" -> Cihazlar (Devices)...")
perf_devices   = rows_to_df(query_performance(["device"]), ["device"])
print(f"    Alindi: {len(perf_devices)} cihaz")

print(" -> Gunluk Trend (Dates)...")
perf_dates     = rows_to_df(query_performance(["date"]), ["date"])
if not perf_dates.empty:
    perf_dates.sort_values(by="date", inplace=True)
print(f"    Alindi: {len(perf_dates)} gunluk veri")

print(" -> Sorgu + Sayfa Eslestirmesi (Query + Page)...")
perf_qp        = rows_to_df(query_performance(["query", "page"]), ["query", "page"])
print(f"    Alindi: {len(perf_qp)} eslesme")

print(" -> Sorgu + Ulke (Query + Country)...")
perf_qc        = rows_to_df(query_performance(["query", "country"]), ["query", "country"])
print(f"    Alindi: {len(perf_qc)} eslesme")

print(" -> Sayfa + Cihaz (Page + Device)...")
perf_pd        = rows_to_df(query_performance(["page", "device"]), ["page", "device"])
print(f"    Alindi: {len(perf_pd)} eslesme")

print(" -> Arama Gorunumu (Search Appearance)...")
perf_sa        = rows_to_df(query_performance(["searchAppearance"]), ["searchAppearance"])
print(f"    Alindi: {len(perf_sa)} gorunum tipi")


# =========================================================
# 2) DIZIN OLUŞTURMA / SITEMAPS
# =========================================================
print("\n2) DIZIN OLUŞTURMA & SITEMAPS EKRANI...")
sitemaps_resp = service.sitemaps().list(siteUrl=SITE_URL).execute()
sitemaps = sitemaps_resp.get("sitemap", [])

sitemap_rows = []
for sm in sitemaps:
    sitemap_rows.append({
        "path": sm.get("path"),
        "type": sm.get("type"),
        "lastSubmitted": sm.get("lastSubmitted"),
        "lastDownloaded": sm.get("lastDownloaded"),
        "isPending": sm.get("isPending"),
        "isSitemapsIndex": sm.get("isSitemapsIndex"),
        "warnings": sm.get("warnings", 0),
        "errors": sm.get("errors", 0),
        "contents": json.dumps(sm.get("contents", []), ensure_ascii=False),
    })
sitemaps_df = pd.DataFrame(sitemap_rows)
print(f"    Alindi: {len(sitemaps_df)} sitemap kaydi")


# =========================================================
# 3) URL INSPECTION (Dizin Durumu - Ilk 50 URL Detayli)
# =========================================================
print("\n3) URL INSPECTION (Dizin Durumu Denetimi)...")
inspect_urls = perf_pages["page"].head(50).tolist() if not perf_pages.empty else []
print(f" -> En onemli {len(inspect_urls)} URL taranacak ve indeks durumlari incelenecek...")

inspect_rows = []
for idx_i, url in enumerate(inspect_urls, 1):
    try:
        resp = service.urlInspection().index().inspect(body={
            "inspectionUrl": url,
            "siteUrl": SITE_URL,
        }).execute()
        r = resp.get("inspectionResult", {})
        idx = r.get("indexStatusResult", {})
        mobile = r.get("mobileUsabilityResult", {})
        rich = r.get("richResultsResult", {})
        
        inspect_rows.append({
            "url": url,
            "verdict": idx.get("verdict"),
            "coverageState": idx.get("coverageState"),
            "indexingState": idx.get("indexingState"),
            "robotsTxtState": idx.get("robotsTxtState"),
            "lastCrawlTime": idx.get("lastCrawlTime"),
            "pageFetchState": idx.get("pageFetchState"),
            "googleCanonical": idx.get("googleCanonical"),
            "userCanonical": idx.get("userCanonical"),
            "crawledAs": idx.get("crawledAs"),
            "mobileUsabilityVerdict": mobile.get("verdict"),
            "richResultsVerdict": rich.get("verdict"),
        })
        print(f"   [{idx_i}/{len(inspect_urls)}] {url[:45]}... -> {idx.get('coverageState', 'OK')}")
    except Exception as e:
        print(f"   [{idx_i}/{len(inspect_urls)}] {url[:45]}... -> HATA: {e}")
        inspect_rows.append({"url": url, "coverageState": "ERROR", "verdict": str(e)})

inspect_df = pd.DataFrame(inspect_rows)


# =========================================================
# 4) DIŞA AKTARMA - Excel (Coklu Sekme) + JSON + CSV
# =========================================================
print("\n4) DOSYALAR KAYDEDILIYOR...")

# 4.1 Cok Sayfali Excel
excel_filename = f"gsc_full_{end_str}.xlsx"
excel_path = os.path.join(EXPORT_DIR, excel_filename)
with pd.ExcelWriter(excel_path, engine="openpyxl") as writer:
    perf_queries.to_excel(writer, sheet_name="Queries", index=False)
    perf_pages.to_excel(writer, sheet_name="Pages", index=False)
    perf_countries.to_excel(writer, sheet_name="Countries", index=False)
    perf_devices.to_excel(writer, sheet_name="Devices", index=False)
    perf_dates.to_excel(writer, sheet_name="Dates", index=False)
    perf_qp.to_excel(writer, sheet_name="Query_Page", index=False)
    perf_qc.to_excel(writer, sheet_name="Query_Country", index=False)
    perf_pd.to_excel(writer, sheet_name="Page_Device", index=False)
    if not perf_sa.empty:
        perf_sa.to_excel(writer, sheet_name="Search_Appearance", index=False)
    sitemaps_df.to_excel(writer, sheet_name="Sitemaps", index=False)
    inspect_df.to_excel(writer, sheet_name="URL_Inspection", index=False)

print(f" -> Cok Sekmeli Excel Olusturuldu: {excel_path}")

# 4.2 Bireysel CSV Dosyalari (Kolay erisim icin)
csv_dir = os.path.join(EXPORT_DIR, "csv")
os.makedirs(csv_dir, exist_ok=True)
perf_queries.to_csv(os.path.join(csv_dir, "queries.csv"), index=False, encoding="utf-8-sig")
perf_pages.to_csv(os.path.join(csv_dir, "pages.csv"), index=False, encoding="utf-8-sig")
perf_countries.to_csv(os.path.join(csv_dir, "countries.csv"), index=False, encoding="utf-8-sig")
perf_devices.to_csv(os.path.join(csv_dir, "devices.csv"), index=False, encoding="utf-8-sig")
perf_dates.to_csv(os.path.join(csv_dir, "dates.csv"), index=False, encoding="utf-8-sig")
perf_qp.to_csv(os.path.join(csv_dir, "query_page.csv"), index=False, encoding="utf-8-sig")
perf_qc.to_csv(os.path.join(csv_dir, "query_country.csv"), index=False, encoding="utf-8-sig")
perf_pd.to_csv(os.path.join(csv_dir, "page_device.csv"), index=False, encoding="utf-8-sig")
sitemaps_df.to_csv(os.path.join(csv_dir, "sitemaps.csv"), index=False, encoding="utf-8-sig")
inspect_df.to_csv(os.path.join(csv_dir, "url_inspection.csv"), index=False, encoding="utf-8-sig")
print(f" -> CSV Dosyalari Olusturuldu: {csv_dir}")

# 4.3 Tek JSON Dizin (Ajan / LLM icin eksiksiz sema)
export_index = {
    "site": SITE_URL,
    "period": {"start": start_str, "end": end_str},
    "totals": {
        "clicks": int(perf_queries["clicks"].sum()) if not perf_queries.empty else 0,
        "impressions": int(perf_queries["impressions"].sum()) if not perf_queries.empty else 0,
        "avg_ctr": round(perf_queries["ctr"].mean(), 2) if not perf_queries.empty else 0,
        "avg_position": round(perf_queries["position"].mean(), 2) if not perf_queries.empty else 0,
    },
    "screens": {
        "queries": perf_queries.to_dict(orient="records"),
        "pages": perf_pages.to_dict(orient="records"),
        "countries": perf_countries.to_dict(orient="records"),
        "devices": perf_devices.to_dict(orient="records"),
        "dates": perf_dates.to_dict(orient="records"),
        "query_page": perf_qp.to_dict(orient="records"),
        "query_country": perf_qc.to_dict(orient="records"),
        "page_device": perf_pd.to_dict(orient="records"),
        "search_appearance": perf_sa.to_dict(orient="records") if not perf_sa.empty else [],
        "sitemaps": sitemaps_df.to_dict(orient="records"),
        "url_inspection": inspect_df.to_dict(orient="records"),
    },
}

json_filename = f"gsc_index_{end_str}.json"
json_path = os.path.join(EXPORT_DIR, json_filename)
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(export_index, f, ensure_ascii=False, indent=2)

print(f" -> Tek JSON Dizini Olusturuldu: {json_path}")

print(f"\n==========================================")
print(f"[OK] EXPORT BASARIYLA TAMAMLANDI!")
print(f"[*] Toplam Sorgu  : {len(perf_queries)}")
print(f"[*] Toplam Sayfa  : {len(perf_pages)}")
print(f"[*] URL Inceleme  : {len(inspect_df)}")
print(f"[*] Klasor        : {EXPORT_DIR}")
print(f"==========================================")

