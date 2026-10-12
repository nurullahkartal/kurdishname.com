const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, '../src/data/names_alphabetical');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

// Helper function to fetch translation from Google Translate free endpoint with retry mechanism
function translateText(text, targetLang, retries = 3) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const attempt = (remaining) => {
      https.get(url, (res) => {
        if (res.statusCode !== 200) {
          if (remaining > 0) {
            console.log(`⚠️ Status ${res.statusCode} on translation to ${targetLang}. Retrying in 1s...`);
            setTimeout(() => attempt(remaining - 1), 1000);
          } else {
            reject(new Error(`Failed with status code: ${res.statusCode}`));
          }
          return;
        }

        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const translated = json[0].map(item => item[0]).join('');
            resolve(translated.trim());
          } catch (err) {
            if (remaining > 0) {
              setTimeout(() => attempt(remaining - 1), 1000);
            } else {
              reject(err);
            }
          }
        });
      }).on('error', (err) => {
        if (remaining > 0) {
          setTimeout(() => attempt(remaining - 1), 1000);
        } else {
          reject(err);
        }
      });
    };

    attempt(retries);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function autoTranslate() {
  console.log(`🚀 Starting database auto-translation...`);
  
  let totalTranslated = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Clean TS syntax to parse array
    let jsonContent = content.replace(/import\s+[\s\S]*?;\s*/g, '');
    jsonContent = jsonContent.replace(/export\s+const\s+names\s*:\s*NameData\[\]\s*=\s*/, '');
    jsonContent = jsonContent.replace(/export\s+const\s+names\s*=\s*/, '');
    jsonContent = jsonContent.trim();
    if (jsonContent.endsWith(';')) {
      jsonContent = jsonContent.slice(0, -1);
    }
    
    let names = [];
    try {
      names = eval(jsonContent);
    } catch (err) {
      console.error(`❌ Parse error in ${file}:`, err.message);
      continue;
    }

    let fileUpdated = false;

    for (const nameItem of names) {
      const needsEn = !nameItem.meaning_en;
      const needsDe = !nameItem.meaning_de;
      const needsAr = !nameItem.meaning_ar;

      if (needsEn || needsDe || needsAr) {
        console.log(`\n🔍 Translating [${nameItem.name}] in ${file}...`);
        console.log(`   Turkish: "${nameItem.meaning}"`);
        
        try {
          if (needsEn) {
            const enVal = await translateText(nameItem.meaning, 'en');
            nameItem.meaning_en = enVal;
            console.log(`   -> EN: "${enVal}"`);
            await sleep(50);
          }
          if (needsDe) {
            const deVal = await translateText(nameItem.meaning, 'de');
            nameItem.meaning_de = deVal;
            console.log(`   -> DE: "${deVal}"`);
            await sleep(50);
          }
          if (needsAr) {
            const arVal = await translateText(nameItem.meaning, 'ar');
            nameItem.meaning_ar = arVal;
            console.log(`   -> AR: "${arVal}"`);
            await sleep(50);
          }
          
          fileUpdated = true;
          totalTranslated++;
          
          // Throttling to prevent API abuse
          await sleep(100);
        } catch (err) {
          console.error(`❌ Failed to translate [${nameItem.name}]:`, err.message);
          // Wait longer on error to let rate limiter cool down
          await sleep(2000);
        }
      }
    }

    if (fileUpdated) {
      // Re-serialize with clean TS imports and exports
      const output = `import { NameData } from '../names';\n\nexport const names: NameData[] = ${JSON.stringify(names, null, 2)};\n`;
      fs.writeFileSync(filePath, output, 'utf8');
      console.log(`\n💾 Saved updated file: ${file}`);
    }
  }

  console.log(`\n🎉 Done! Translated a total of ${totalTranslated} names.`);
}

autoTranslate();
