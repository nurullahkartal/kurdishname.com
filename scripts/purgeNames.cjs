const fs = require('fs');
const path = require('path');

const MASTER_JSON = path.join(__dirname, '../names_master.json');

// --- PURE KURDISH ARCHIVE PURIFICATION BLACKLIST ---
// Comprehensive list of Arabic (religious), Persian (common crossover), Turkish/Mongolian, and transitional loanwords.
const BLACKLIST = new Set([
  // 1. Arabic & Islamic Religious Names
  'ali', 'eli', 'omer', 'omar', 'fatma', 'fatima', 'ayse', 'aisha', 'zeynep', 'zeinab', 
  'hasan', 'hesen', 'huseyin', 'huseyn', 'osman', 'ebubekir', 'yusuf', 'ibrahim', 'suleyman', 
  'mustafa', 'meryem', 'maryam', 'halil', 'bekir', 'salih', 'kadir', 'arif', 'murat', 
  'ahmet', 'ahmed', 'mehmet', 'seyid', 'xidir', 'derwes', 'hizir', 'dervis', 'ahmad', 
  'kurani', 'farisi', 'hasmet', 'ismet', 'izzet', 'kemal', 'celal', 'cemal',

  // 2. Arabic-Origin Religious Compound Names
  'bahdin', 'tajdin', 'semdin', 'eledin', 'ezdin', 'eladin',

  // 3. Persian Loanwords & Crossover Names
  'azad', 'bahar', 'baran', 'can', 'dara', 'delal', 'ferhat', 'lale', 'nergis', 'nevruz', 
  'peri', 'ruya', 'sadi', 'serap', 'sahin', 'sirin', 'yasemin', 'zehra', 'naz', 'banu', 
  'dilara', 'gulbahar', 'gulistan', 'pervin', 'rusen', 'simge', 'reyhan', 'cihan', 'rehan', 
  'rihan', 'rusen', 'sahan', 'sahin', 'sirin', 'sah_in', 'sirin', 'sirine', 'cano', 'nazli',

  // 4. Turkish & Mongolian Loanwords / Crossovers
  'hakan', 'oguz', 'cengiz', 'kaan', 'alparslan', 'mete', 'burak', 'mert', 'yigit', 
  'eren', 'emre', 'onur', 'ozan', 'serkan', 'volkan', 'tarkan', 'tolga', 'tuna', 
  'kaya', 'demir', 'celik', 'aslan'
]);

function normalize(name) {
  return name.toLowerCase()
    .replace(/î/g, 'i')
    .replace(/ê/g, 'e')
    .replace(/û/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/[^a-z]/g, '');
}

async function purgeNonKurdish() {
  console.log('🚀 [PURGE OPERATION] Deleting non-Kurdish and transitional names...');

  if (!fs.existsSync(MASTER_JSON)) {
    console.error('❌ Error: names_master.json not found!');
    process.exit(1);
  }

  const allNames = JSON.parse(fs.readFileSync(MASTER_JSON, 'utf-8'));
  const originalCount = allNames.length;
  
  // Keep ONLY pure 'Kurdish' names and filter out blacklist & transitional suffixes
  const purifiedNames = allNames.filter(entry => {
    // Check master origin (must be Kurdish)
    if (entry.origin !== 'Kurdish') return false;

    const norm = normalize(entry.name);

    // Filter out if present in Blacklist
    if (BLACKLIST.has(norm)) return false;

    // Filter out Turkish/Mongolian/Arabic transition suffixes like -han, -bey, -beg
    if (norm.endsWith('han') || norm.endsWith('bey') || norm.endsWith('beg')) return false;

    return true;
  });

  const deletedCount = originalCount - purifiedNames.length;
  const deletedSamples = allNames.filter(entry => {
    const norm = normalize(entry.name);
    return entry.origin !== 'Kurdish' || BLACKLIST.has(norm) || norm.endsWith('han') || norm.endsWith('bey') || norm.endsWith('beg');
  }).map(e => e.name);

  // Write back the clean, pure database
  fs.writeFileSync(MASTER_JSON, JSON.stringify(purifiedNames, null, 2));

  console.log('\n🔥 [PURGE REPORT]');
  console.log(`- Toplam İsim Sayısı (Başlangıç): ${originalCount}`);
  console.log(`- Silinen (Gayri-Kürtçe, Dini, Farsça, Türkçe, Geçişsel) İsim Sayısı: ${deletedCount}`);
  console.log(`- Kalan Saf Kürtçe İsim Sayısı (Bitiş): ${purifiedNames.length}`);
  
  if (deletedCount > 0) {
    console.log(`- Silinenlerden Bazıları: ${deletedSamples.slice(0, 15).join(', ')}...`);
  }
}

purgeNonKurdish();
