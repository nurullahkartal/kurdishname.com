import fs from 'fs';
import path from 'path';

interface MasterNameItem {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  letter: string;
  meaning: string;
  meaning_en: string;
  meaning_de: string;
  meaning_ar: string;
  origin: string;
  tags: string[];
  description: string;
}

const STANDARD_LETTERS = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H',
  'I', 'Î', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
  'R', 'S', 'Ş', 'T', 'U', 'Û', 'V', 'W', 'X', 'Y', 'Z',
] as const;

function main() {
  const rootDir = process.cwd();
  const masterPath = path.join(rootDir, 'names_master.json');
  const backupPath = path.join(rootDir, 'names_master.json.bak-2026-10-20');
  const outDir = path.join(rootDir, 'public', 'data', 'names');

  if (!fs.existsSync(masterPath)) {
    throw new Error(`names_master.json not found at ${masterPath}`);
  }

  // 1. Mandatory backup before modifying names_master.json
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(masterPath, backupPath);
    console.log(`Created mandatory backup: ${backupPath}`);
  } else {
    console.log(`Backup already exists: ${backupPath}`);
  }

  // 2. Read master database
  const rawContent = fs.readFileSync(masterPath, 'utf-8');
  const masterNames: MasterNameItem[] = JSON.parse(rawContent);
  const inputCount = masterNames.length;

  // 3. Normalize letter field based on actual first character of item.name
  let normalizedCount = 0;
  for (const item of masterNames) {
    const actualLetter = item.name.trim().charAt(0).toUpperCase();
    if (item.letter !== actualLetter) {
      item.letter = actualLetter;
      normalizedCount++;
    }
  }

  // 4. Persist normalized names_master.json in UTF-8
  if (normalizedCount > 0) {
    fs.writeFileSync(masterPath, JSON.stringify(masterNames, null, 2) + '\n', 'utf-8');
    console.log(`Normalized ${normalizedCount} records in names_master.json (UTF-8).`);
  } else {
    console.log('All records in names_master.json already have normalized letter fields.');
  }

  // 5. Group by the 29 standard Kurdish letters
  const buckets = new Map<string, MasterNameItem[]>();
  for (const letter of STANDARD_LETTERS) {
    buckets.set(letter, []);
  }

  for (const item of masterNames) {
    const letter = item.letter.trim().toUpperCase();
    const bucket = buckets.get(letter);
    if (!bucket) {
      throw new Error(`Unexpected letter "${letter}" on item id="${item.id}" (${item.name})`);
    }
    bucket.push(item);
  }

  // 6. Clean output directory and write 29 UTF-8 JSON files
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  let outputTotalCount = 0;
  let totalBytes = 0;
  const indexSummary: { letter: string; count: number; bytes: number }[] = [];

  for (const letter of STANDARD_LETTERS) {
    const names = buckets.get(letter) || [];
    const payload = {
      letter,
      count: names.length,
      names,
    };
    const jsonString = JSON.stringify(payload, null, 2) + '\n';
    const filePath = path.join(outDir, `${letter}.json`);
    fs.writeFileSync(filePath, jsonString, 'utf-8');

    const byteLength = Buffer.byteLength(jsonString, 'utf-8');
    outputTotalCount += names.length;
    totalBytes += byteLength;
    indexSummary.push({
      letter,
      count: names.length,
      bytes: byteLength,
    });
  }

  // 7. Strict zero-data-loss verification
  if (inputCount !== outputTotalCount) {
    throw new Error(
      `Data loss detected! Input count (${inputCount}) !== Output count (${outputTotalCount})`
    );
  }

  // 8. Write _index.json metadata summary
  const indexPayload = {
    generatedAt: new Date().toISOString(),
    totalLetters: STANDARD_LETTERS.length,
    totalNames: outputTotalCount,
    totalBytes,
    letters: indexSummary,
  };
  fs.writeFileSync(
    path.join(outDir, '_index.json'),
    JSON.stringify(indexPayload, null, 2) + '\n',
    'utf-8'
  );

  console.log(
    `Successfully generated ${STANDARD_LETTERS.length} letter JSON files in public/data/names/.`
  );
  console.log(`Total names verified: ${outputTotalCount} (Input: ${inputCount}, Loss: 0)`);
}

main();
