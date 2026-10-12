const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/data/names_alphabetical');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

let totalNames = 0;
let missingAr = 0;
let missingEn = 0;
let missingDe = 0;

const sampleMissingAr = [];
const sampleMissingEn = [];
const sampleMissingDe = [];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Clean TS imports and export const names = [...] to make it JSON-like
  content = content.replace(/import\s+[\s\S]*?;\s*/g, '');
  content = content.replace(/export\s+const\s+names\s*:\s*NameData\[\]\s*=\s*/, '');
  content = content.replace(/export\s+const\s+names\s*=\s*/, '');
  
  // Strip trailing semicolon if any
  content = content.trim();
  if (content.endsWith(';')) {
    content = content.slice(0, -1);
  }
  
  try {
    // We can evaluate it safely since we know it is our local TS data array
    const names = eval(content);
    totalNames += names.length;
    
    names.forEach(n => {
      if (!n.meaning_ar) {
        missingAr++;
        if (sampleMissingAr.length < 5) sampleMissingAr.push(`${n.name} (${file})`);
      }
      if (!n.meaning_en) {
        missingEn++;
        if (sampleMissingEn.length < 5) sampleMissingEn.push(`${n.name} (${file})`);
      }
      if (!n.meaning_de) {
        missingDe++;
        if (sampleMissingDe.length < 5) sampleMissingDe.push(`${n.name} (${file})`);
      }
    });
  } catch (err) {
    console.error(`❌ Failed to parse ${file}:`, err.message);
  }
});

console.log(`\n📊 [DATABASE TRANSLATION AUDIT]`);
console.log(`-----------------------------------`);
console.log(`✅ Total Names Evaluated: ${totalNames}`);
console.log(`❌ Missing Arabic (AR):   ${missingAr} (${((missingAr/totalNames)*100).toFixed(1)}%)`);
console.log(`❌ Missing English (EN):  ${missingEn} (${((missingEn/totalNames)*100).toFixed(1)}%)`);
console.log(`❌ Missing German (DE):   ${missingDe} (${((missingDe/totalNames)*100).toFixed(1)}%)`);

if (sampleMissingAr.length > 0) {
  console.log(`\nSample Missing Arabic:`, sampleMissingAr);
}
if (sampleMissingEn.length > 0) {
  console.log(`\nSample Missing English:`, sampleMissingEn);
}
if (sampleMissingDe.length > 0) {
  console.log(`\nSample Missing German:`, sampleMissingDe);
}
