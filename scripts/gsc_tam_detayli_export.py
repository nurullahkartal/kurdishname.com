import os
import sys
import socket
import json
from datetime import date, timedelta
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build

# UTF-8 stdout configuration for Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# ============ NETWORK AYARI (Windows IPv6 Bug Onleyici) ============
_orig_getaddrinfo = socket.getaddrinfo
def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = _getaddrinfo_ipv4

# ============ AYARLAR ============
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SERVICE_ACCOUNT_FILE = os.path.join(BASE_DIR, "service_account.json")
SITE_URL = "sc-domain:kurdishname.com"
EXPORT_DIR = os.path.join(BASE_DIR, "gsc_export")
REPORTS_DIR = os.path.join(BASE_DIR, "gsc_reports")
DAYS_BACK = 480  # Tum gecmis (GSC max ~16 ay)

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/webmasters"
]

os.makedirs(EXPORT_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

if not os.path.exists(SERVICE_ACCOUNT_FILE):
    raise FileNotFoundError(f"{SERVICE_ACCOUNT_FILE} dosyasi bulunamadi!")

print("Google Search Console API'ye baglaniliyor...")
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
service = build("searchconsole", "v1", credentials=creds)

end_date = date.today() - timedelta(days=2)  # GSC 2 gun geriden gelir
start_date = end_date - timedelta(days=DAYS_BACK)
start_str = start_date.isoformat()
end_str = end_date.isoformat()

print(f"\n=======================================================")
print(f"🚀 GSC EN DETAYLI VERİ ÇEKME MOTORU BAŞLATILDI")
print(f"Mülk: {SITE_URL}")
print(f"Tarih Aralığı: {start_str}  -->  {end_str} (~16 Ay)")
print(f"=======================================================\n")

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

print("1. Ham Arama Performansı Verileri İndiriliyor...")

print("  -> Arama Terimleri (Queries)...")
df_queries = rows_to_df(query_performance(["query"]), ["query"])
print(f"     ✓ {len(df_queries)} benzersiz anahtar kelime çekildi.")

print("  -> Sayfalar (Pages)...")
df_pages = rows_to_df(query_performance(["page"]), ["page"])
print(f"     ✓ {len(df_pages)} benzersiz sayfa URL'si çekildi.")

print("  -> Sorgu + Sayfa Eşleşmesi (Query + Page)...")
df_qp = rows_to_df(query_performance(["query", "page"]), ["query", "page"])
print(f"     ✓ {len(df_qp)} kelime-sayfa kombinasyonu çekildi.")

print("  -> Ülkeler (Countries)...")
df_countries = rows_to_df(query_performance(["country"]), ["country"])
print(f"     ✓ {len(df_countries)} ülke verisi çekildi.")

print("  -> Cihazlar (Devices)...")
df_devices = rows_to_df(query_performance(["device"]), ["device"])
print(f"     ✓ {len(df_devices)} cihaz tipi çekildi.")

print("  -> Günlük Trend (Dates)...")
df_dates = rows_to_df(query_performance(["date"]), ["date"])
if not df_dates.empty:
    df_dates.sort_values(by="date", ascending=True, inplace=True)
print(f"     ✓ {len(df_dates)} günlük performans kaydı çekildi.")

print("  -> Sayfa + Cihaz Dağılımı...")
df_pd = rows_to_df(query_performance(["page", "device"]), ["page", "device"])

print("  -> Arama Görünümü (Search Appearance)...")
df_sa = rows_to_df(query_performance(["searchAppearance"]), ["searchAppearance"])

# =========================================================
# 2) İLERİ DÜZEY ANALİZLER (Gelişmiş Fırsat & Segmentasyon)
# =========================================================
print("\n2. İleri Düzey SEO & Fırsat Analizleri Hesaplanıyor...")

# 2.1) Fırsat Kelimeleri (High Impression, Low CTR - Başlık/Meta optimizasyonuyla hızla trafik getirecekler)
df_opps = pd.DataFrame()
if not df_queries.empty:
    df_opps = df_queries[(df_queries["impressions"] >= 30) & (df_queries["ctr"] < 4.0)].copy()
    df_opps.sort_values(by="impressions", ascending=False, inplace=True)
print(f"     ✓ {len(df_opps)} potansiyel fırsat kelimesi tespit edildi.")

# 2.2) Sayfa 1 Adayları (Pozisyon 4 ile 15 arasında olan, ufak dokunuşla ilk 3'e fırlayacak kelimeler)
df_page1_candidates = pd.DataFrame()
if not df_queries.empty:
    df_page1_candidates = df_queries[(df_queries["position"] >= 4.0) & (df_queries["position"] <= 15.0)].copy()
    df_page1_candidates.sort_values(by="impressions", ascending=False, inplace=True)
print(f"     ✓ {len(df_page1_candidates)} Sayfa-1 aday kelimesi tespit edildi.")

# 2.3) Dil Segmentasyonu (TR, EN, DE, AR)
def detect_lang(url):
    if "/tr" in url:
        return "Türkçe (TR)"
    if "/en" in url:
        return "English (EN)"
    if "/de" in url:
        return "Deutsch (DE)"
    if "/ar" in url:
        return "العربية (AR)"
    return "Diğer / Kök"

df_langs = pd.DataFrame()
if not df_pages.empty:
    df_pages_copy = df_pages.copy()
    df_pages_copy["language"] = df_pages_copy["page"].apply(detect_lang)
    df_langs = df_pages_copy.groupby("language").agg(
        clicks=("clicks", "sum"),
        impressions=("impressions", "sum"),
        page_count=("page", "count"),
        avg_position=("position", "mean")
    ).reset_index()
    df_langs["ctr"] = round((df_langs["clicks"] / df_langs["impressions"]) * 100, 2)
    df_langs["avg_position"] = round(df_langs["avg_position"], 1)
    df_langs.sort_values(by="clicks", ascending=False, inplace=True)
    print(f"     ✓ Dil kırılımı başarıyla analiz edildi.")

# 2.4) Sayfa Tipi Segmentasyonu (İsimler, Kategoriler, Blog, Ana Sayfa)
def detect_page_type(url):
    if "/isim/" in url or "/name/" in url:
        return "İsim Detay Sayfası"
    if "/kategori/" in url or "/category/" in url:
        return "Harf / Cinsiyet / Tema Kategorisi"
    if "/blog" in url:
        return "Blog / Rehber İçerik"
    if url.rstrip("/").endswith((".com", ".com/tr", ".com/en", ".com/de", ".com/ar")):
        return "Ana Sayfa"
    return "Diğer Araçlar / Sayfalar"

df_page_types = pd.DataFrame()
if not df_pages.empty:
    df_pages_copy2 = df_pages.copy()
    df_pages_copy2["page_type"] = df_pages_copy2["page"].apply(detect_page_type)
    df_page_types = df_pages_copy2.groupby("page_type").agg(
        clicks=("clicks", "sum"),
        impressions=("impressions", "sum"),
        page_count=("page", "count"),
        avg_position=("position", "mean")
    ).reset_index()
    df_page_types["ctr"] = round((df_page_types["clicks"] / df_page_types["impressions"]) * 100, 2)
    df_page_types["avg_position"] = round(df_page_types["avg_position"], 1)
    df_page_types.sort_values(by="clicks", ascending=False, inplace=True)
    print(f"     ✓ Sayfa tipleri segmentasyonu tamamlandı.")

# =========================================================
# 3) SİTEMAP VE URL İNDEKS DENETİMİ
# =========================================================
print("\n3. Site Haritaları ve Kritik URL İndeks Denetimi Yapılıyor...")
sitemaps_list = []
try:
    sitemaps_resp = service.sitemaps().list(siteUrl=SITE_URL).execute()
    sitemaps_list = sitemaps_resp.get("sitemap", [])
    print(f"     ✓ {len(sitemaps_list)} sitemap kaydı GSC'den okundu.")
except Exception as e:
    print(f"  [Uyari] Sitemaps okuma hatasi: {e}")

df_sitemaps = pd.DataFrame(sitemaps_list) if sitemaps_list else pd.DataFrame()

# En çok trafik alan ve kritik sayfalardan 20 tanesini canlı URL Inspection API ile denetleyelim
inspect_rows = []
inspect_candidates = []
if not df_pages.empty:
    inspect_candidates.extend(df_pages["page"].head(15).tolist())

extra_test_urls = [
    "https://kurdishname.com/tr",
    "https://kurdishname.com/tr/kategori/kiz",
    "https://kurdishname.com/tr/kategori/erkek",
    "https://kurdishname.com/tr/isim/rojin",
    "https://kurdishname.com/tr/isim/berfin",
    "https://kurdishname.com/en",
    "https://kurdishname.com/de",
    "https://kurdishname.com/ar",
]
for u in extra_test_urls:
    if u not in inspect_candidates:
        inspect_candidates.append(u)

inspect_candidates = inspect_candidates[:25]
print(f"  -> {len(inspect_candidates)} kritik URL için Google Index Status denetleniyor...")

for idx_i, url in enumerate(inspect_candidates, 1):
    try:
        body = {"inspectionUrl": url, "siteUrl": SITE_URL}
        res = service.urlInspection().index().inspect(body=body).execute()
        item = res.get("inspectionResult", {})
        idx_res = item.get("indexStatusResult", {})
        mob_res = item.get("mobileUsabilityResult", {})
        
        inspect_rows.append({
            "url": url,
            "verdict": idx_res.get("verdict", ""),
            "coverageState": idx_res.get("coverageState", ""),
            "indexingState": idx_res.get("indexingState", ""),
            "lastCrawlTime": idx_res.get("lastCrawlTime", ""),
            "googleCanonical": idx_res.get("googleCanonical", ""),
            "userCanonical": idx_res.get("userCanonical", ""),
            "crawledAs": idx_res.get("crawledAs", ""),
            "pageFetchState": idx_res.get("pageFetchState", ""),
            "mobileVerdict": mob_res.get("verdict", "PASS"),
        })
        print(f"     [{idx_i}/{len(inspect_candidates)}] {url} -> {idx_res.get('coverageState', 'OK')}")
    except Exception as e:
        print(f"     [{idx_i}/{len(inspect_candidates)}] {url} -> Hata: {e}")
        inspect_rows.append({"url": url, "coverageState": "ERROR", "verdict": str(e)})

df_inspect = pd.DataFrame(inspect_rows)

# =========================================================
# 4) ÇIKTILARIN OLUŞTURULMASI (Excel, CSV, JSON, Markdown)
# =========================================================
print("\n4. Çıktılar Kaydediliyor...")

# 4.1) Genel KPI Özeti Tablosu
total_clicks = int(df_queries["clicks"].sum()) if not df_queries.empty else 0
total_impressions = int(df_queries["impressions"].sum()) if not df_queries.empty else 0
overall_ctr = round((total_clicks / total_impressions * 100), 2) if total_impressions > 0 else 0
avg_pos = round(df_queries["position"].mean(), 2) if not df_queries.empty else 0

summary_data = [
    {"Metrik": "Mülk (Property)", "Değer": SITE_URL},
    {"Metrik": "Tarih Aralığı", "Değer": f"{start_str} - {end_str}"},
    {"Metrik": "Toplam Tıklama (Clicks)", "Değer": f"{total_clicks:,}"},
    {"Metrik": "Toplam Gösterim (Impressions)", "Değer": f"{total_impressions:,}"},
    {"Metrik": "Ortalama CTR (Tıklama Oranı)", "Değer": f"%{overall_ctr}"},
    {"Metrik": "Ortalama Sıralama (Position)", "Değer": str(avg_pos)},
    {"Metrik": "Trafik Alan Toplam Kelime Sayısı", "Değer": f"{len(df_queries):,}"},
    {"Metrik": "Trafik Alan Toplam Sayfa Sayısı", "Değer": f"{len(df_pages):,}"},
    {"Metrik": "İndekslenen Sitemap Sayısı", "Değer": str(len(df_sitemaps))},
]
df_summary = pd.DataFrame(summary_data)

# 4.2) Çok Sekmeli Excel Raporu (Master Excel)
master_excel_filename = f"GSC_Detayli_Rapor_{end_str}.xlsx"
master_excel_path = os.path.join(REPORTS_DIR, master_excel_filename)
export_excel_path = os.path.join(EXPORT_DIR, f"gsc_full_{end_str}.xlsx")

for out_path in [master_excel_path, export_excel_path]:
    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        df_summary.to_excel(writer, sheet_name="Genel_Ozet", index=False)
        if not df_opps.empty:
            df_opps.to_excel(writer, sheet_name="Firsat_Kelimeleri", index=False)
        if not df_page1_candidates.empty:
            df_page1_candidates.to_excel(writer, sheet_name="Sayfa1_Adaylari", index=False)
        if not df_langs.empty:
            df_langs.to_excel(writer, sheet_name="Dil_Performansi", index=False)
        if not df_page_types.empty:
            df_page_types.to_excel(writer, sheet_name="Sayfa_Tipleri", index=False)
        if not df_queries.empty:
            df_queries.to_excel(writer, sheet_name="Tum_Kelimeler", index=False)
        if not df_pages.empty:
            df_pages.to_excel(writer, sheet_name="Tum_Sayfalar", index=False)
        if not df_qp.empty:
            df_qp.to_excel(writer, sheet_name="Kelime_Sayfa_Eslestirme", index=False)
        if not df_countries.empty:
            df_countries.to_excel(writer, sheet_name="Ulkeler", index=False)
        if not df_devices.empty:
            df_devices.to_excel(writer, sheet_name="Cihazlar", index=False)
        if not df_dates.empty:
            df_dates.to_excel(writer, sheet_name="Gunluk_Trend", index=False)
        if not df_sitemaps.empty:
            df_sitemaps.to_excel(writer, sheet_name="Sitemaps", index=False)
        if not df_inspect.empty:
            df_inspect.to_excel(writer, sheet_name="URL_Denetimi", index=False)

print(f"  ✓ Çok Sekmeli Master Excel Oluşturuldu:\n     -> {master_excel_path}")

# 4.3) CSV Exportları
csv_dir = os.path.join(REPORTS_DIR, "csv_guncel")
os.makedirs(csv_dir, exist_ok=True)
if not df_queries.empty:
    df_queries.to_csv(os.path.join(csv_dir, "anahtar_kelimeler.csv"), index=False, encoding="utf-8-sig")
if not df_pages.empty:
    df_pages.to_csv(os.path.join(csv_dir, "sayfalar.csv"), index=False, encoding="utf-8-sig")
if not df_opps.empty:
    df_opps.to_csv(os.path.join(csv_dir, "firsat_kelimeleri.csv"), index=False, encoding="utf-8-sig")
if not df_qp.empty:
    df_qp.to_csv(os.path.join(csv_dir, "kelime_ve_sayfa_detay.csv"), index=False, encoding="utf-8-sig")
if not df_dates.empty:
    df_dates.to_csv(os.path.join(csv_dir, "gunluk_performans.csv"), index=False, encoding="utf-8-sig")
if not df_inspect.empty:
    df_inspect.to_csv(os.path.join(csv_dir, "url_indeks_denetimi.csv"), index=False, encoding="utf-8-sig")

# 4.4) Kapsamlı Yönetici Özeti (GUNCEL_GSC_OZETI.md)
md_lines = []
md_lines.append(f"# 📊 Google Search Console Güncel Performans & SEO Raporu")
md_lines.append(f"**Mülk:** `{SITE_URL}`  ")
md_lines.append(f"**Veri Aralığı:** `{start_str}` ile `{end_str}` arası (~16 Ay)  ")
md_lines.append(f"**Oluşturulma Zamanı:** `{date.today().isoformat()}`  \n")
md_lines.append(f"---\n")

md_lines.append(f"## 1. 📈 Temel Performans Göstergeleri (KPI)")
md_lines.append(f"* **Toplam Tıklama:** **{total_clicks:,}**")
md_lines.append(f"* **Toplam Gösterim:** **{total_impressions:,}**")
md_lines.append(f"* **Ortalama CTR:** **%{overall_ctr}**")
md_lines.append(f"* **Sıralanan Benzersiz Kelime:** **{len(df_queries):,}**")
md_lines.append(f"* **Trafik Alan Benzersiz Sayfa:** **{len(df_pages):,}**\n")

md_lines.append(f"---\n")
md_lines.append(f"## 2. 🏆 En Çok Tıklanan İlk 15 Anahtar Kelime")
md_lines.append(f"| Sıra | Anahtar Kelime | Tıklama | Gösterim | CTR (%) | Ort. Sıralama |")
md_lines.append(f"| :---: | :--- | :---: | :---: | :---: | :---: |")
for i, r in enumerate(df_queries.head(15).to_dict(orient="records"), 1):
    md_lines.append(f"| {i} | **{r['query']}** | {r['clicks']} | {r['impressions']} | %{r['ctr']} | {r['position']} |")

md_lines.append(f"\n---\n")
md_lines.append(f"## 3. 🎯 Hızlı Trafik Fırsatları (Yüksek Gösterim, Düşük CTR)")
md_lines.append(f"*Bu kelimeler Google'da çok aranıyor ve siteniz görünür durumda. Başlık ve açıklama etiketleri güçlendirildiğinde hızla yüksek trafik getirecektir:*")
md_lines.append(f"\n| Anahtar Kelime | Tıklama | Gösterim | CTR (%) | Pozisyon |")
md_lines.append(f"| :--- | :---: | :---: | :---: | :---: |")
for r in df_opps.head(12).to_dict(orient="records"):
    md_lines.append(f"| **{r['query']}** | {r['clicks']} | {r['impressions']} | %{r['ctr']} | {r['position']} |")

md_lines.append(f"\n---\n")
md_lines.append(f"## 4. 🚀 1. Sayfa Adayları (Pozisyon 4 - 15 Arası)")
md_lines.append(f"*Bu kelimeler ilk sayfanın hemen eşiğinde (veya alt sıralarında). Ufak bir iç linkleme veya blog desteğiyle ilk 3'e taşınabilir:*")
md_lines.append(f"\n| Kelime | Tıklama | Gösterim | CTR (%) | Pozisyon |")
md_lines.append(f"| :--- | :---: | :---: | :---: | :---: |")
for r in df_page1_candidates.head(10).to_dict(orient="records"):
    md_lines.append(f"| **{r['query']}** | {r['clicks']} | {r['impressions']} | %{r['ctr']} | {r['position']} |")

md_lines.append(f"\n---\n")
md_lines.append(f"## 5. 🌐 Dil Performans Kırılımı")
if not df_langs.empty:
    md_lines.append(f"| Dil | Sayfa Sayısı | Tıklama | Gösterim | CTR (%) | Ort. Sıralama |")
    md_lines.append(f"| :--- | :---: | :---: | :---: | :---: | :---: |")
    for r in df_langs.to_dict(orient="records"):
        md_lines.append(f"| **{r['language']}** | {r['page_count']} | {r['clicks']} | {r['impressions']} | %{r['ctr']} | {r['avg_position']} |")

md_lines.append(f"\n---\n")
md_lines.append(f"## 6. 📱 Cihaz Dağılımı")
if not df_devices.empty:
    md_lines.append(f"| Cihaz | Tıklama | Gösterim | CTR (%) | Ort. Sıralama |")
    md_lines.append(f"| :--- | :---: | :---: | :---: | :---: |")
    for r in df_devices.to_dict(orient="records"):
        md_lines.append(f"| **{r['device']}** | {r['clicks']} | {r['impressions']} | %{r['ctr']} | {r['position']} |")

md_lines.append(f"\n---\n")
md_lines.append(f"## 7. 📑 URL İndeks ve Googlebot Denetim Sonuçları")
if not df_inspect.empty:
    md_lines.append(f"| URL | Google Durumu | Taranma Şekli | Son Tarama |")
    md_lines.append(f"| :--- | :--- | :--- | :--- |")
    for r in df_inspect.head(10).to_dict(orient="records"):
        md_lines.append(f"| `{r['url']}` | **{r['coverageState']}** | {r['crawledAs']} | {r['lastCrawlTime'][:10] if r['lastCrawlTime'] else '-'} |")

md_content = "\n".join(md_lines)
report_md_path = os.path.join(REPORTS_DIR, "GUNCEL_GSC_OZETI.md")
with open(report_md_path, "w", encoding="utf-8") as f:
    f.write(md_content)
print(f"  ✓ Yönetici Özeti Oluşturuldu:\n     -> {report_md_path}")

print(f"\n=======================================================")
print(f"🎉 TÜM GÜNCEL VERİLER VE DETAYLI RAPORLAR BAŞARIYLA ALINDI!")
print(f"=======================================================\n")
