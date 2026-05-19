# 🚀 KurdishName - Kürtçe İsimler Sözlüğü

Kürtçe kız ve erkek isimlerini anlamları, köken bilgileri ve benzer isim önerileriyle birlikte keşfedebileceğiniz, modern ve performans odaklı bir web uygulaması.

View your app in AI Studio: https://ai.studio/apps/134c0808-19d7-499c-b5ba-21fe699791c0

---

## 🏆 Proje Durumu (6 Mayıs 2026 - Lansman Hazır)

Proje, 14MB'lık monolitik yapıdan harf bazlı dinamik modüler yapıya geçirilerek tam kapasiteyle yayına hazır hale getirilmiştir.

### 🏗️ Performans ve Mimari
- **Code-Splitting:** Vite dynamic import altyapısı ile harf bazlı (A-Z) yükleme mimarisi.
- **Bundle Boyutu:** Ana bundle **70KB**, Vendor JS (gzip) **178KB**.
- **Kalite:** SonarQube **Grade A** analizi tamamlandı.

### 📱 Mobil Responsive & UI
- **Zero-Overflow:** %100 mobil uyumlu, yatay kaydırma sıfır.
- **Optimizasyon:** Uzun isimler için `break-word` ve `hyphens` desteği ile her cihazda mükemmel görünüm.

### 🌐 SEO ve İçerik
- **Veritabanı:** 10.276+ özgün isim.
- **Sitemap:** 30 adet sitemap dosyası üzerinden **41.152 URL** indeksi.
- **Çoklu Dil:** TR, EN, DE, AR dilleri ile global erişim.

---

## 🛠️ Yerel Kurulum

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```
2. **API Anahtarı:**
   `.env.local` dosyasına `GEMINI_API_KEY` değerinizi ekleyin.
3. **Uygulamayı Çalıştırın:**
   ```bash
   npm run dev
   ```

## 📦 Build ve Production
Production build almak için:
```bash
npm run build
```
Bu komut, en temiz `dist` klasörünü üretecektir.
