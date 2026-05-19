import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MASTER_JSON = path.join(__dirname, '../names_master.json');
const OUTPUT_DIR = path.join(__dirname, '../src/data/names_alphabetical');
const STORIES_DIR = path.join(__dirname, '../src/data/stories_alphabetical');
const INDEX_FILE = path.join(__dirname, '../public/search_index.json');
const LOADER_FILE = path.join(__dirname, '../src/utils/nameLoader.ts');

async function processNames() {
  console.log('🔄 Processing master names list...');

  if (!fs.existsSync(MASTER_JSON)) {
    console.error('❌ Error: names_master.json not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(MASTER_JSON, 'utf-8');
  const allNames = JSON.parse(rawData);

  // 1. Group by letter and generate Slim Index
  const namesByLetter: Record<string, any[]> = {};
  const storiesByLetter: Record<string, any[]> = {};
  const searchIndex: any[] = [];

  allNames.forEach((name: any) => {
    const letter = name.letter.toUpperCase();
    if (!namesByLetter[letter]) {
      namesByLetter[letter] = [];
      storiesByLetter[letter] = [];
    }

    // Slim Search Index Data (No stories, ultra-light)
    searchIndex.push({
      id: name.id,
      name: name.name,
      gender: name.gender,
      letter: name.letter,
      tags: name.tags || [],
      meaning: name.meaning || ""
    });

    // Splitting Logic
    const { story, ...lightName } = name;
    namesByLetter[letter].push(lightName);

    if (story) {
      storiesByLetter[letter].push({ id: name.id, story });
    }
  });

  // Write Slim Index to public directory for fast fetch()
  fs.writeFileSync(INDEX_FILE, JSON.stringify(searchIndex));
  console.log(`✅ Generated search_index.json (${searchIndex.length} items) - File size: ${(fs.statSync(INDEX_FILE).size / 1024).toFixed(2)} KB`);

  // 2. Clean and create output directories
  [OUTPUT_DIR, STORIES_DIR].forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => fs.unlinkSync(path.join(dir, file)));
    } else {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // 3. Write letter files (Light) and Story files (Heavy)
  const letters = Object.keys(namesByLetter).sort((a, b) => a.localeCompare(b, 'tr'));
  letters.forEach(letter => {
    // Light Names
    const nameContent = `import { NameData } from '../names';\n\nexport const names: NameData[] = ${JSON.stringify(namesByLetter[letter], null, 2)};\n`;
    fs.writeFileSync(path.join(OUTPUT_DIR, `${letter}.ts`), nameContent);
    
    // Heavy Stories
    const storyContent = `export const stories = ${JSON.stringify(storiesByLetter[letter], null, 2)};\n`;
    fs.writeFileSync(path.join(STORIES_DIR, `${letter}.ts`), storyContent);
    
    console.log(`✅ Generated ${letter}.ts (Light) and stories_${letter}.ts (Heavy)`);
  });

  // 4. Update nameLoader.ts availableLetters and switch cases
  let loaderContent = fs.readFileSync(LOADER_FILE, 'utf-8');

  // Update availableLetters
  const lettersArrayStr = `['${letters.join("', '")}']`;
  loaderContent = loaderContent.replace(
    /export const availableLetters = \[.*?\];/s,
    `export const availableLetters = ${lettersArrayStr};`
  );

  // Update switch cases
  const switchCases = letters.map(l => `      case '${l}': module = await import('../data/names_alphabetical/${l}'); break;`).join('\n');
  
  // We need to find the switch block and replace its contents
  // The switch block is between 'switch (upperLetter) {' and 'default:'
  const switchRegex = /switch\s*\(upperLetter\)\s*\{([\s\S]*?)default:/;
  loaderContent = loaderContent.replace(switchRegex, (match, p1) => {
    return `switch (upperLetter) {\n${switchCases}\n      default:`;
  });

  fs.writeFileSync(LOADER_FILE, loaderContent);
  console.log(`✅ Updated nameLoader.ts with ${letters.length} letters: ${letters.join(', ')}`);

  console.log('🎉 Name processing completed successfully!');
}

processNames().catch(err => {
  console.error('❌ Error processing names:', err);
  process.exit(1);
});
