const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

const BASE_URL = 'https://kurdishname.com';
const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const CONCURRENCY = 25; // Aynı anda kontrol edilecek URL sayısı
const TIMEOUT = 15000; // 15 saniye zaman aşımı

// 1. ADIM: Sitemap index'ini çek ve tüm alt sitemap URL'lerini topla
async function fetchSitemapIndex() {
  console.log('📡 Sitemap index taranıyor...');
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;
  const xml = await fetchRaw(sitemapUrl);
  const sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  console.log(`✅ ${sitemapUrls.length} alt sitemap bulundu.`);
  return sitemapUrls;
}

// 2. ADIM: Alt sitemap'leri çek ve tüm URL'leri topla
async function fetchAllSitemapUrls(sitemapUrls) {
  const allUrls = [];
  for (const sitemapUrl of sitemapUrls) {
    try {
      const xml = await fetchRaw(sitemapUrl);
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
      allUrls.push(...urls);
      console.log(`  ✓ ${sitemapUrl.split('/').pop()}: ${urls.length} URL`);
    } catch (e) {
      console.error(`  ✗ ${sitemapUrl} alınamadı: ${e.message}`);
    }
  }
  console.log(`\n📊 Toplam ${allUrls.length} URL toplandı.`);
  return allUrls;
}

// 3. ADIM: Her URL'yi Googlebot gibi kontrol et
function checkUrl(url) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const startTime = Date.now();

    const req = client.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'tr,en;q=0.9',
      },
      timeout: TIMEOUT,
    }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const isHtml = (res.headers['content-type'] || '').includes('text/html');
        const hasTitle = isHtml ? /<title>[^<]+<\/title>/i.test(body) : true;
        const hasCanonical = isHtml ? /rel=["']canonical["']/i.test(body) : true;
        const hasRobots = isHtml ? /name=["']robots["']/i.test(body) : true;
        const hasHreflang = isHtml ? /hreflang=/i.test(body) : true;
        // Gerçek soft-404: Durum 200 ama sayfada 404 başlığı veya not-found h2 render edilmiş
        const isSoft404 = status === 200 && isHtml && (body.includes('<title>404') || body.includes('<h2>Sayfa Bulunamadı'));

        resolve({
          url,
          status,
          duration,
          hasTitle,
          hasCanonical,
          hasRobots,
          hasHreflang,
          isSoft404,
          contentType: res.headers['content-type'],
          size: body.length,
        });
      });
    });

    req.on('error', (err) => resolve({ url, status: 'ERR', error: err.message, duration: Date.now() - startTime }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT', duration: TIMEOUT }); });
    req.end();
  });
}

// Toplu kontrol (concurrency limitli)
async function checkAllUrls(urls) {
  console.log(`\n🚀 ${urls.length} URL kontrol ediliyor (${CONCURRENCY} paralel)...`);
  const results = [];
  let index = 0;
  let completed = 0;

  async function worker() {
    while (index < urls.length) {
      const i = index++;
      const result = await checkUrl(urls[i]);
      results.push(result);
      completed++;
      if (completed % 250 === 0 || completed === urls.length) {
        process.stdout.write(`\r  İlerleme: ${completed}/${urls.length} (${((completed/urls.length)*100).toFixed(1)}%)`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`\n✅ Kontrol tamamlandı.`);
  return results;
}

// 4. ADIM: Rapor oluştur
function generateReport(results) {
  const stats = {
    total: results.length,
    ok: 0,
    redirect: 0,
    notFound: 0,
    serverError: 0,
    timeout: 0,
    error: 0,
    soft404: 0,
    missingTitle: 0,
    missingCanonical: 0,
    missingRobots: 0,
    missingHreflang: 0,
  };

  const issues = [];
  const byStatus = {};

  for (const r of results) {
    if (typeof r.status === 'number') {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      if (r.status >= 200 && r.status < 300) stats.ok++;
      else if (r.status >= 300 && r.status < 400) stats.redirect++;
      else if (r.status === 404) stats.notFound++;
      else if (r.status >= 500) stats.serverError++;
    } else if (r.status === 'TIMEOUT') stats.timeout++;
    else stats.error++;

    if (r.isSoft404) stats.soft404++;
    if (r.hasTitle === false) stats.missingTitle++;
    if (r.hasCanonical === false) stats.missingCanonical++;
    if (r.hasRobots === false) stats.missingRobots++;
    if (r.hasHreflang === false) stats.missingHreflang++;

    if (r.status !== 200 || r.isSoft404 || r.hasTitle === false || r.hasCanonical === false) {
      if (issues.length < 100) { // Sadece ilk 100 sorunu göster
        issues.push(r);
      }
    }
  }

  // Durum kodu dağılımı
  console.log('\n📊 DURUM KODU DAĞILIMI');
  console.log('─'.repeat(40));
  const sortedStatus = Object.entries(byStatus).sort((a, b) => b[1] - a[1]);
  for (const [code, count] of sortedStatus) {
    const emoji = code.startsWith('2') ? '✅' : code.startsWith('3') ? '↪️' : code.startsWith('4') ? '❌' : '💥';
    console.log(`  ${emoji} ${code}: ${count}`);
  }
  if (stats.timeout > 0) console.log(`  ⏱️ TIMEOUT: ${stats.timeout}`);
  if (stats.error > 0) console.log(`  ⚠️ ERROR: ${stats.error}`);

  // Özet
  console.log('\n📋 ÖZET');
  console.log('─'.repeat(40));
  console.log(`  Toplam URL: ${stats.total}`);
  console.log(`  ✅ 200 OK: ${stats.ok} (${((stats.ok/stats.total)*100).toFixed(1)}%)`);
  console.log(`  ↪️ 3xx Yönlendirme: ${stats.redirect}`);
  console.log(`  ❌ 404: ${stats.notFound}`);
  console.log(`  💥 5xx: ${stats.serverError}`);
  console.log(`  ⏱️ Timeout: ${stats.timeout}`);
  console.log(`  ⚠️ Diğer Hata: ${stats.error}`);

  console.log('\n🔍 SEO SAĞLIK KONTROLÜ');
  console.log('─'.repeat(40));
  console.log(`  🚨 Soft 404 (200 + "bulunamadı" içerik): ${stats.soft404}`);
  console.log(`  🏷️ Eksik <title>: ${stats.missingTitle}`);
  console.log(`  🔗 Eksik canonical: ${stats.missingCanonical}`);
  console.log(`  🤖 Eksik robots meta: ${stats.missingRobots}`);
  console.log(`  🌍 Eksik hreflang: ${stats.missingHreflang}`);

  // Sorunlu URL'ler
  if (issues.length > 0) {
    console.log('\n⚠️ SORUNLU URL\'LER (İlk 100)');
    console.log('─'.repeat(40));
    for (const issue of issues) {
      const reasons = [];
      if (issue.status !== 200) reasons.push(`HTTP ${issue.status}`);
      if (issue.isSoft404) reasons.push('SOFT-404');
      if (issue.hasTitle === false) reasons.push('NO-TITLE');
      if (issue.hasCanonical === false) reasons.push('NO-CANONICAL');
      console.log(`  ${issue.url} → ${reasons.join(', ')}`);
    }
  }

  // Performans
  const durations = results.filter(r => typeof r.duration === 'number').map(r => r.duration);
  if (durations.length > 0) {
    durations.sort((a, b) => a - b);
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const p95 = durations[Math.floor(durations.length * 0.95)];
    const p99 = durations[Math.floor(durations.length * 0.99)];
    console.log('\n⚡ PERFORMANS');
    console.log('─'.repeat(40));
    console.log(`  Ortalama yanıt süresi: ${avg.toFixed(0)} ms`);
    console.log(`  P95 yanıt süresi: ${p95} ms`);
    console.log(`  P99 yanıt süresi: ${p99} ms`);
    console.log(`  En yavaş: ${durations[durations.length - 1]} ms`);
  }

  // Kritik özet
  const criticalIssues = stats.notFound + stats.serverError + stats.timeout + stats.error + stats.soft404 + stats.missingTitle + stats.missingCanonical;
  if (criticalIssues === 0) {
    console.log('\n🎉 MÜKEMMEL! Hiçbir kritik sorun bulunamadı.');
  } else {
    console.log(`\n⚠️ ${criticalIssues} kritik sorun var. Detaylar yukarıda.`);
  }

  return { stats, issues, criticalIssues };
}

// Yardımcı: Raw XML/HTML çek
function fetchRaw(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept': '*/*' },
      timeout: TIMEOUT,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchRaw(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ANA ÇALIŞTIRICI
(async () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  KURDISHNAME.COM — GOOGLEBOT DOĞRULAMA  ║');
  console.log('╚══════════════════════════════════════════╝\n');

  try {
    const sitemapUrls = await fetchSitemapIndex();
    const allUrls = await fetchAllSitemapUrls(sitemapUrls);

    if (allUrls.length === 0) {
      console.error('❌ Hiç URL bulunamadı. Sitemap boş veya erişilemiyor.');
      process.exit(1);
    }

    // URL'leri tekilleştir
    const uniqueUrls = [...new Set(allUrls)];
    console.log(`📌 Tekil URL sayısı: ${uniqueUrls.length}`);

    const results = await checkAllUrls(uniqueUrls);
    const report = generateReport(results);

    // Raporu dosyaya kaydet
    fs.writeFileSync('live-site-audit-report.json', JSON.stringify({ stats: report.stats, issues: report.issues.slice(0, 1000) }, null, 2));
    console.log('\n💾 Detaylı rapor: live-site-audit-report.json');

    process.exit(report.criticalIssues > 0 ? 1 : 0);
  } catch (err) {
    console.error('❌ Kritik hata:', err.message);
    process.exit(1);
  }
})();
