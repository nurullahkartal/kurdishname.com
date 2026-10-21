const fs = require('fs');
const path = require('path');

function delTxt(dir) {
  let deleted = 0;
  if (!fs.existsSync(dir)) return deleted;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      deleted += delTxt(fullPath);
    } else if (
      entry.name.endsWith('.txt') &&
      entry.name !== 'robots.txt' &&
      entry.name !== 'llms.txt'
    ) {
      fs.unlinkSync(fullPath);
      deleted++;
    }
  }
  return deleted;
}

function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return count;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  return count;
}

const outDir = path.join(__dirname, '..', 'out');
console.log('🧹 out/ dizinindeki gereksiz RSC .txt dosyaları temizleniyor...');
const deletedCount = delTxt(outDir);
console.log(`✅ Silinen .txt dosya sayısı: ${deletedCount}`);

const remainingFiles = countFiles(outDir);
console.log(`📊 out/ dizinindeki kalan toplam dosya sayısı: ${remainingFiles}`);

if (remainingFiles < 20000) {
  console.log(`🎉 Başarılı! Dosya sayısı (${remainingFiles}) Cloudflare Pages Free limiti (20.000) altında.`);
} else {
  console.warn(`⚠️ UYARI: Dosya sayısı (${remainingFiles}) 20.000 limitini aşıyor!`);
}
