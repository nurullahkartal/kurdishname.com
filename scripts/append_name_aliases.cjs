const fs = require('fs');
const path = require('path');

const namesPath = path.join(__dirname, '..', 'names_master.json');
const redirectsPath = path.join(__dirname, '..', 'public', '_redirects');

const names = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
let redirectsContent = fs.readFileSync(redirectsPath, 'utf8');

// Strip out existing auto-generated alias block if any
const marker = '# Auto-generated Name Spelling Aliases';
if (redirectsContent.includes(marker)) {
  redirectsContent = redirectsContent.split(marker)[0].trimEnd() + '\n';
}

const rules = [];
const langPrefixes = [
  { lang: 'tr', seg: 'isim' },
  { lang: 'en', seg: 'name' },
  { lang: 'de', seg: 'name' },
  { lang: 'ar', seg: 'اسم' }
];

// 1. Double-i names (114 names) -> single-i redirects
for (const n of names) {
  if (n.id.endsWith('ii')) {
    const singleI = n.id.slice(0, -1);
    for (const p of langPrefixes) {
      rules.push(`/${p.lang}/${p.seg}/${singleI} /${p.lang}/${p.seg}/${n.id} 301`);
    }
  }
}

// 2. Specific known aliases
const specificAliases = [
  { from: 'lorin', to: 'lorin2' },
  { from: 'reber', to: 'reber2' },
  { from: 'xane', to: 'xane2' },
  { from: 'bese', to: 'bese-erkek' },
  { from: 'ahmedixani', to: 'ahmedi_xani' },
  { from: 'ahmedi-xani', to: 'ahmedi_xani' },
  { from: 'ristemizal', to: 'ristem_i_zal' },
  { from: 'ristem-zal', to: 'ristem_i_zal' },
  { from: 'evindar', to: 'evindare' },
  { from: 'neriman', to: 'nerimani' },
  { from: 'ozan', to: 'hozan' }
];

for (const a of specificAliases) {
  for (const p of langPrefixes) {
    rules.push(`/${p.lang}/${p.seg}/${a.from} /${p.lang}/${p.seg}/${a.to} 301`);
  }
}

const newBlock = `\n${marker} (${rules.length} rules)\n` + rules.join('\n') + '\n';
fs.writeFileSync(redirectsPath, redirectsContent.trimEnd() + newBlock, 'utf8');
console.log(`✅ ${rules.length} adet isim alias yönlendirme kuralı public/_redirects dosyasına eklendi.`);
