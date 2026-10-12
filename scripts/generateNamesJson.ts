// scripts/generateNamesJson.ts
// Converts src/data/names_alphabetical/*.ts → public/data/names/*.json
// Removes 13 MB TypeScript from Vite bundle, serves via CDN instead.

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const LETTERS = [
  'A','B','C','Ç','D','E','Ê','F','G','H','I','Î','J','K','L','M',
  'N','O','P','Q','R','S','Ş','T','U','Û','V','W','X','Y','Z'
];

async function main() {
  const srcDir = path.join(process.cwd(), 'src', 'data', 'names_alphabetical');
  const outDir = path.join(process.cwd(), 'public', 'data', 'names');
  fs.mkdirSync(outDir, { recursive: true });

  if (!fs.existsSync(srcDir)) {
    console.log('ℹ️  src/data/names_alphabetical not present — using existing public/data/names/*.json');
    return;
  }

  const index: { letter: string; count: number; bytes: number }[] = [];
  let totalNames = 0;
  let totalBytes = 0;

  for (const letter of LETTERS) {
    const tsPath = path.join(srcDir, `${letter}.ts`);
    if (!fs.existsSync(tsPath)) {
      console.warn(`⚠️  Missing: ${letter}.ts (skipping)`);
      continue;
    }

    const fileUrl = pathToFileURL(tsPath).href;
    const mod = await import(fileUrl);
    const names = mod.names || [];

    // Minified JSON (no whitespace) — CDN gzip/brotli ile daha da küçülür
    const json = JSON.stringify(names);
    const outPath = path.join(outDir, `${letter}.json`);
    fs.writeFileSync(outPath, json, 'utf-8');

    index.push({ letter, count: names.length, bytes: json.length });
    totalNames += names.length;
    totalBytes += json.length;
    console.log(`✅ ${letter}.json — ${names.length} names, ${(json.length / 1024).toFixed(1)} KB`);
  }

  const meta = {
    generatedAt: new Date().toISOString(),
    totalLetters: index.length,
    totalNames,
    totalBytes,
    letters: index
  };
  fs.writeFileSync(path.join(outDir, '_index.json'), JSON.stringify(meta, null, 2));

  console.log(`\n🎉 Generated ${index.length} letter files.`);
  console.log(`   Total: ${totalNames.toLocaleString()} names, ${(totalBytes / 1024 / 1024).toFixed(2)} MB raw JSON`);
}

main().catch((e) => {
  console.error('❌ Generation failed:', e);
  process.exit(1);
});
