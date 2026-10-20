import fs from 'fs';
import path from 'path';

interface MasterNameItem {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  letter: string;
  meaning: string;
  meaning_en?: string;
  meaning_de?: string;
  meaning_ar?: string;
  origin?: string;
  tags?: string[];
}

function main() {
  const rootDir = process.cwd();
  const masterPath = path.join(rootDir, 'names_master.json');
  const outPath = path.join(rootDir, 'public', 'search_index.json');

  if (!fs.existsSync(masterPath)) {
    throw new Error(`names_master.json not found at ${masterPath}`);
  }

  const masterNames: MasterNameItem[] = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  const slimIndex = masterNames.map((item) => ({
    id: item.id,
    name: item.name,
    gender: item.gender,
    letter: item.letter,
    tags: item.tags || [],
    meaning: item.meaning,
  }));

  const jsonOutput = JSON.stringify(slimIndex);
  fs.writeFileSync(outPath, jsonOutput, 'utf-8');

  const sizeKb = (Buffer.byteLength(jsonOutput, 'utf-8') / 1024).toFixed(1);
  console.log(
    `Generated public/search_index.json with ${slimIndex.length} entries (${sizeKb} KB, UTF-8).`
  );
}

main();
