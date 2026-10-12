import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const masterJsonPath = path.join(__dirname, '..', 'names_master.json');
  console.log(`📖 Loading names_master.json from ${masterJsonPath}...`);
  const names: any[] = JSON.parse(fs.readFileSync(masterJsonPath, 'utf-8'));
  console.log(`✓ Loaded ${names.length} names.`);

  const languages = ['tr', 'en', 'de', 'ar'];
  
  // Use Map to ensure 100% key uniqueness
  const kvMap = new Map<string, string>();

  // Key: names:all -> list of all unique ids
  const uniqueIds = Array.from(new Set(names.map(n => n.id.toLowerCase())));
  kvMap.set('names:all', JSON.stringify(uniqueIds));

  // For each name, populate kvMap with the richest version if duplicated
  for (const nameItem of names) {
    const slug = encodeURIComponent(nameItem.id.toLowerCase());
    const jsonStr = JSON.stringify(nameItem);

    // Helper to pick the richer entry if duplicate key encountered
    const setOrMerge = (key: string, val: string) => {
      if (!kvMap.has(key)) {
        kvMap.set(key, val);
      } else {
        const existing = JSON.parse(kvMap.get(key)!);
        // keep the one with more content or longer meaning
        const existingLen = (existing.meaning || '').length + (existing.description || '').length;
        const newLen = (nameItem.meaning || '').length + (nameItem.description || '').length;
        if (newLen > existingLen) {
          kvMap.set(key, val);
        }
      }
    };

    // Direct key: name:{slug}
    setOrMerge(`name:${slug}`, jsonStr);

    // Language-prefixed keys: name:{lang}:{slug}
    for (const lang of languages) {
      setOrMerge(`name:${lang}:${slug}`, jsonStr);
    }
  }

  const allEntries: { key: string; value: string }[] = [];
  kvMap.forEach((value, key) => {
    allEntries.push({ key, value });
  });

  console.log(`📦 Prepared ${allEntries.length} unique KV entries (duplicates eliminated).`);

  // Upload in batches of 5,000 entries
  const BATCH_SIZE = 5000;
  const tempDir = path.join(__dirname, '..', 'scratch');
  fs.mkdirSync(tempDir, { recursive: true });

  const totalBatches = Math.ceil(allEntries.length / BATCH_SIZE);
  console.log(`🚀 Starting bulk upload in ${totalBatches} batches...`);

  for (let i = 0; i < totalBatches; i++) {
    const batch = allEntries.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const batchFile = path.join(tempDir, `kv_batch_${i + 1}.json`);
    fs.writeFileSync(batchFile, JSON.stringify(batch), 'utf-8');

    console.log(`  -> Uploading Batch ${i + 1}/${totalBatches} (${batch.length} keys)...`);
    try {
      execSync(`npx wrangler kv bulk put "${batchFile}" --binding=NAMES_KV --remote`, {
        stdio: 'inherit',
        shell: 'powershell.exe'
      });
      console.log(`  ✓ Batch ${i + 1} completed.`);
    } catch (e: any) {
      console.error(`  ❌ Error in Batch ${i + 1}:`, e.message);
      try { fs.unlinkSync(batchFile); } catch (_) {}
      throw e;
    } finally {
      try { fs.unlinkSync(batchFile); } catch (_) {}
    }
  }

  console.log(`🎉 All ${allEntries.length} entries successfully uploaded to Cloudflare KV!`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
