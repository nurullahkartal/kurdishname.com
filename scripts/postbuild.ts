import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

console.log('Starting automated post-build optimization...');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  // Find the compiled CSS file inside the HTML
  const cssRegex = /href="\/assets\/(index-.*?\.css)"/;
  const cssMatch = html.match(cssRegex);

  // Find the compiled JS file inside the HTML
  const jsRegex = /src="\/assets\/(index-.*?\.js)"/;
  const jsMatch = html.match(jsRegex);

  let preloads = '';

  if (cssMatch && cssMatch[1]) {
    const cssFile = cssMatch[1];
    preloads += `    <link rel="preload" href="/assets/${cssFile}" as="style">\n`;
    console.log(`✨ Dynamically preloaded CSS: /assets/${cssFile}`);
  }

  if (jsMatch && jsMatch[1]) {
    const jsFile = jsMatch[1];
    preloads += `    <link rel="modulepreload" href="/assets/${jsFile}">\n`;
    console.log(`✨ Dynamically preloaded JS: /assets/${jsFile}`);
  }

  if (preloads) {
    // Insert the preloads right before the preconnect fonts link
    const insertTag = '<link rel="preconnect" href="https://fonts.googleapis.com">';
    if (html.includes(insertTag)) {
      html = html.replace(insertTag, `${preloads}${insertTag}`);
      fs.writeFileSync(indexPath, html, 'utf8');
      console.log('🎉 Successfully injected dynamic preloads into dist/index.html!');
    } else {
      console.warn('⚠️ Could not find preconnect fonts tag in dist/index.html');
    }
  }
} else {
  console.error('❌ dist/index.html not found!');
}
