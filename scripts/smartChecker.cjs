const fs = require('fs');
const path = require('path');
// Note: You must install puppeteer before running this: npm install puppeteer
const puppeteer = require('puppeteer');

const SITEMAP_INDEX = path.join(__dirname, '../dist/sitemap-index.xml');
const BASE_URL = 'http://localhost:4173'; // Vite preview default
const BROKEN_LINKS_FILE = path.join(__dirname, '../broken_links.txt');

async function getUrlsFromSitemap() {
  if (!fs.existsSync(SITEMAP_INDEX)) {
    console.error('❌ Sitemap index not found in dist/. Please run npm run build first.');
    return [];
  }

  const content = fs.readFileSync(SITEMAP_INDEX, 'utf-8');
  // Simple regex to find <loc> tags
  const sitemapFiles = content.match(/<loc>(.*?)<\/loc>/g).map(l => l.replace(/<\/?loc>/g, ''));
  
  let allUrls = [];
  
  for (const sitemapUrl of sitemapFiles) {
    // If it's a local path in sitemap, we might need to adjust.
    // For now, let's assume the sitemaps are in dist/ too.
    const sitemapName = path.basename(sitemapUrl);
    const localSitemapPath = path.join(__dirname, '../dist', sitemapName);
    
    if (fs.existsSync(localSitemapPath)) {
      const sitemapContent = fs.readFileSync(localSitemapPath, 'utf-8');
      const urls = sitemapContent.match(/<loc>(.*?)<\/loc>/g).map(l => {
        const url = l.replace(/<\/?loc>/g, '');
        // Replace production domain with localhost for checking
        return url.replace('https://kurdishname.com', BASE_URL);
      });
      allUrls = allUrls.concat(urls);
    }
  }
  
  return allUrls;
}

async function smartCheck() {
  console.log('🕵️ Starting Smart Link Checker...');
  
  const urls = await getUrlsFromSitemap();
  if (urls.length === 0) {
    console.error('❌ No URLs found to check.');
    return;
  }

  console.log(`🔍 Found ${urls.length} URLs in sitemaps. Starting scan...`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const brokenLinks = [];
  
  // Chunking to handle concurrency (max 10 pages)
  const CONCURRENCY = 10;
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const chunk = urls.slice(i, i + CONCURRENCY);
    console.log(`🚀 Checking batch ${Math.floor(i/CONCURRENCY) + 1}/${Math.ceil(urls.length/CONCURRENCY)}...`);
    
    await Promise.all(chunk.map(async (url) => {
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Check for "İsim Bulunamadı" or "404"
        const isBroken = await page.evaluate(() => {
          const text = document.body.innerText;
          const title = document.title;
          return text.includes('İsim Bulunamadı') || 
                 text.includes('404') || 
                 title.includes('404') || 
                 title.includes('Bulunamadı');
        });
        
        if (isBroken) {
          console.log(`⚠️  BROKEN: ${url}`);
          brokenLinks.push(url);
        }
      } catch (err) {
        console.error(`❌ ERROR visiting ${url}:`, err.message);
        brokenLinks.push(`${url} (TIMEOUT/ERROR)`);
      } finally {
        await page.close();
      }
    }));
  }

  await browser.close();

  fs.writeFileSync(BROKEN_LINKS_FILE, brokenLinks.join('\n'));
  console.log(`\n✅ Scan complete!`);
  console.log(`📊 Total Broken Links: ${brokenLinks.length}`);
  console.log(`📄 Report saved to: broken_links.txt`);
}

smartCheck();
