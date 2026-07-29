const fs = require('fs');
const path = require('path');

const filesToTest = [
  'dist/index.html', // Homepage
  'dist/tr/isim/agir/index.html', // Name Detail
  'dist/tr/blog/100-kurtce-doga-ismi-ve-anlamlari/index.html', // Blog Post
  'dist/tr/kategori/kiz/index.html', // Category
];

let allValid = true;

filesToTest.forEach(file => {
  console.log(`\n--- Checking ${file} ---`);
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }

  const content = fs.readFileSync(file, 'utf8');
  
  // 3. JS Çalıştırmayan Botlar İçin SSG Uyumluğu: Check if schema is in HTML
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let blockCount = 0;
  const typesFound = [];

  while ((match = regex.exec(content)) !== null) {
    blockCount++;
    const jsonStr = match[1].trim();
    
    // 1. JSON Geçerliliği:
    try {
      const parsed = JSON.parse(jsonStr);
      console.log(`Block ${blockCount} parsed successfully.`);
      
      // Analyze types
      if (parsed['@graph']) {
        parsed['@graph'].forEach(item => typesFound.push(item['@type']));
      } else {
        typesFound.push(parsed['@type']);
      }
      
    } catch (e) {
      console.error(`Block ${blockCount} parsing failed:`, e.message);
      console.log(`Problematic string: \n${jsonStr.substring(0, 200)}...`);
      allValid = false;
    }
  }

  console.log(`Total JSON-LD blocks: ${blockCount}`);
  console.log(`Schema Types Found: ${typesFound.join(', ')}`);
});

console.log(`\nFinal Verdict: ${allValid ? 'PASS' : 'FAIL'}`);
