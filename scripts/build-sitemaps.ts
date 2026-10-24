import fs from 'fs';
import path from 'path';
import {
  SITE_URL,
  supportedLanguages,
  routeTranslations,
  themeSlugs,
  generatePath,
  RouteKey,
  ThemeKey,
  Locale,
} from '../lib/routes-config';
import { getActiveLettersWithCounts, getNamesByLetter } from '../lib/names-data';
import { blogPostsRegistry } from '../lib/blog-registry';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const TODAY = new Date().toISOString().split('T')[0];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlBlock(
  locByLocale: Record<Locale, string>,
  priority: string,
  changefreq: string,
  lastmod: string = TODAY
): string {
  const blocks: string[] = [];
  const xDefaultHref = escapeXml(`${SITE_URL}${locByLocale.en}`);

  for (const locale of supportedLanguages) {
    const loc = escapeXml(`${SITE_URL}${locByLocale[locale]}`);
    const altLinks = supportedLanguages
      .map(
        (altLang) =>
          `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${escapeXml(
            `${SITE_URL}${locByLocale[altLang]}`
          )}" />`
      )
      .join('\n');

    blocks.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${altLinks}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />
  </url>`);
  }

  return blocks.join('\n');
}

function wrapUrlset(body: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
}

function main() {
  const outDir = path.join(process.cwd(), 'out');
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const sitemapFiles: string[] = [];

  // 1. sitemap-static.xml
  const staticUrlBlocks: string[] = [];
  // Homepages
  staticUrlBlocks.push(
    buildUrlBlock(
      {
        tr: '/tr',
        en: '/en',
        de: '/de',
        ar: '/ar',
      },
      '1.0',
      'daily'
    )
  );

  const staticSections: RouteKey[] = [
    'blog',
    'finder',
    'compare',
    'favorites',
    'suggest',
    'about',
    'editorial',
    'contact',
    'privacy',
    'terms',
    'cookies',
    'alphabet',
    'mythology',
    'tribes',
    'surnames',
  ];

  for (const key of staticSections) {
    staticUrlBlocks.push(
      buildUrlBlock(
        {
          tr: generatePath('tr', key),
          en: generatePath('en', key),
          de: generatePath('de', key),
          ar: generatePath('ar', key),
        },
        '0.8',
        'weekly'
      )
    );
  }

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'sitemap-static.xml'),
    wrapUrlset(staticUrlBlocks.join('\n')),
    'utf-8'
  );
  sitemapFiles.push('sitemap-static.xml');

  // 2. sitemap-categories.xml (29 active letters + 2 genders + 5 themes)
  const categoryUrlBlocks: string[] = [];
  const activeLetters = getActiveLettersWithCounts(); // only count > 0 (29 letters, excludes I and Û)

  // Gender categories
  for (const genderKey of ['kiz', 'erkek'] as const) {
    categoryUrlBlocks.push(
      buildUrlBlock(
        {
          tr: generatePath('tr', 'category', genderKey),
          en: generatePath('en', 'category', genderKey),
          de: generatePath('de', 'category', genderKey),
          ar: generatePath('ar', 'category', genderKey),
        },
        '0.9',
        'weekly'
      )
    );
  }

  // Theme categories
  for (const themeKey of Object.keys(themeSlugs.tr) as ThemeKey[]) {
    categoryUrlBlocks.push(
      buildUrlBlock(
        {
          tr: generatePath('tr', 'category', themeKey),
          en: generatePath('en', 'category', themeKey),
          de: generatePath('de', 'category', themeKey),
          ar: generatePath('ar', 'category', themeKey),
        },
        '0.8',
        'weekly'
      )
    );
  }

  // 29 Active Letter categories
  for (const { letter } of activeLetters) {
    categoryUrlBlocks.push(
      buildUrlBlock(
        {
          tr: generatePath('tr', 'category', letter),
          en: generatePath('en', 'category', letter),
          de: generatePath('de', 'category', letter),
          ar: generatePath('ar', 'category', letter),
        },
        '0.8',
        'weekly'
      )
    );
  }

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'sitemap-categories.xml'),
    wrapUrlset(categoryUrlBlocks.join('\n')),
    'utf-8'
  );
  sitemapFiles.push('sitemap-categories.xml');

  // 3. sitemap-blog.xml (135 posts x 4 locales = 540 URLs)
  const blogUrlBlocks: string[] = [];
  for (const post of blogPostsRegistry) {
    blogUrlBlocks.push(
      buildUrlBlock(
        {
          tr: generatePath('tr', 'blog', post.slugs.tr),
          en: generatePath('en', 'blog', post.slugs.en),
          de: generatePath('de', 'blog', post.slugs.de),
          ar: generatePath('ar', 'blog', post.slugs.ar),
        },
        '0.8',
        'monthly',
        post.date || TODAY
      )
    );
  }

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'sitemap-blog.xml'),
    wrapUrlset(blogUrlBlocks.join('\n')),
    'utf-8'
  );
  sitemapFiles.push('sitemap-blog.xml');

  // 4. sitemap-names-{letter}.xml for all 29 active letters (count > 0)
  let totalNameUrls = 0;
  for (const { letter } of activeLetters) {
    const names = getNamesByLetter(letter);
    if (names.length === 0) continue;

    const nameBlocks: string[] = [];
    for (const item of names) {
      nameBlocks.push(
        buildUrlBlock(
          {
            tr: generatePath('tr', 'name', item.id),
            en: generatePath('en', 'name', item.id),
            de: generatePath('de', 'name', item.id),
            ar: generatePath('ar', 'name', item.id),
          },
          '0.7',
          'monthly'
        )
      );
      totalNameUrls += 4;
    }

    const fileName = `sitemap-names-${letter}.xml`;
    const xmlContent = wrapUrlset(nameBlocks.join('\n'));
    fs.writeFileSync(path.join(PUBLIC_DIR, fileName), xmlContent, 'utf-8');
    
    // Also write lowercase copy for Linux / Cloudflare Pages case-insensitivity
    const lowerFileName = `sitemap-names-${letter.toLowerCase()}.xml`;
    if (lowerFileName !== fileName) {
      fs.writeFileSync(path.join(PUBLIC_DIR, lowerFileName), xmlContent, 'utf-8');
    }
    sitemapFiles.push(fileName);
  }

  // 5. sitemap.xml (Master Sitemap Index - fully RFC 3986 percent-encoded for non-ASCII letters)
  const indexEntries = sitemapFiles
    .map(
      (file) => `  <sitemap>
    <loc>${escapeXml(encodeURI(`${SITE_URL}/${file}`))}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexEntries}
</sitemapindex>
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndexXml, 'utf-8');

  console.log(
    `[build-sitemaps] Generated ${sitemapFiles.length + 1} sitemap files (29 active letter sitemaps, ${totalNameUrls} name URLs).`
  );
}

main();
