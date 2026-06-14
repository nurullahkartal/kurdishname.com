import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPostsRegistry } from '../src/data/blogPosts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSafeFilenameLetter(letter: string): string {
  const char = letter.toLowerCase().trim();
  const mapping: Record<string, string> = {
    'ç': 'c-special',
    'ê': 'e-special',
    'î': 'i-special',
    'ş': 's-special',
    'ö': 'o-special'
  };
  if (char.includes('i̇') || char.includes('\u0307') || char === 'i') {
    // Handle Turkish dotted i vs dotless i specifically
    return char === 'i' ? 'i' : 'i-dotted';
  }
  return mapping[char] || char;
}

const DOMAIN = 'https://kurdishname.com';
const LANGUAGES = ['tr', 'en', 'de', 'ar'] as const;
type Language = typeof LANGUAGES[number];

const routeTranslations = {
  tr: {
    category: 'kategori',
    name: 'isim',
    blog: 'blog',
    privacy: 'gizlilik-politikasi',
    terms: 'kullanim-kosullari',
    cookies: 'cerez-politikasi',
    contact: 'iletisim',
    finder: 'isim-bul',
    about: 'hakkimizda',
    girls: 'kiz',
    boys: 'erkek'
  },
  en: {
    category: 'category',
    name: 'name',
    blog: 'blog',
    privacy: 'privacy-policy',
    terms: 'terms-of-use',
    cookies: 'cookie-policy',
    contact: 'contact',
    finder: 'find-name',
    about: 'about',
    girls: 'girls',
    boys: 'boys'
  },
  de: {
    category: 'kategorie',
    name: 'name',
    blog: 'blog',
    privacy: 'datenschutzerklaerung',
    terms: 'nutzungsbedingungen',
    cookies: 'cookie-richtlinie',
    contact: 'kontakt',
    finder: 'name-finden',
    about: 'ueber-uns',
    girls: 'maedchen',
    boys: 'jungen'
  },
  ar: {
    category: encodeURIComponent('فئة'),
    name: encodeURIComponent('اسم'),
    blog: encodeURIComponent('مدونة'),
    privacy: encodeURIComponent('سياسة-الخصوصية'),
    terms: encodeURIComponent('شروط-الاستخدام'),
    cookies: encodeURIComponent('سياسة-ملفات-تعريف-الارتباط'),
    contact: encodeURIComponent('اتصل-بنا'),
    finder: encodeURIComponent('البحث-عن-اسم'),
    about: encodeURIComponent('من-نحن'),
    girls: encodeURIComponent('بنات'),
    boys: encodeURIComponent('ذكور')
  },
} as const;

// Helper to escape XML characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to create a single URL entry with hreflang alternate links
function createUrlEntry(
  loc: string,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
  priority: number,
  alternateLinks?: { lang: string; url: string }[]
): string {
  // URL sitemap'e veya SSG klasörüne yazılmadan hemen önce:
  if (loc.includes('yok') || loc.includes('undefined') || loc.includes('null')) {
    console.log(`⚠️ Hatalı URL sitemape sızması engellendi: ${loc}`);
    return ''; // Scripti durdur, bu linki üretme!
  }

  let alternatesXml = '';
  if (alternateLinks && alternateLinks.length > 0) {
    const validAlternates = alternateLinks.filter(alt => 
      !(alt.url.includes('yok') || alt.url.includes('undefined') || alt.url.includes('null'))
    );

    alternatesXml = '\n' + validAlternates.map(alt => 
      `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${escapeXml(alt.url)}"/>`
    ).join('\n');
    // x-default language fallback (points to Kurdish Name default page version, typically English or Turkish)
    const defaultAlt = validAlternates.find(a => a.lang === 'tr') || validAlternates[0];
    if (defaultAlt) {
      alternatesXml += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultAlt.url)}"/>`;
    }
  }

  return `  <url>
    <loc>${escapeXml(loc)}</loc>${alternatesXml}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

// Helper to create a sitemap reference entry in the sitemap index
function createSitemapIndexEntry(loc: string, lastmod?: string): string {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <sitemap>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}
  </sitemap>`;
}

interface NameData {
  id: string;
  name: string;
  gender: 'male' | 'female';
  letter: string;
}

async function generateSitemaps() {
  const publicDir = path.join(__dirname, '..', 'public');
  const now = new Date().toISOString();

  console.log('🚀 Launching Multilingual & All-Letter SEO Sitemap Generator...');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  } else {
    // Clean up any old sitemap files to prevent stale special character files remaining
    const existingFiles = fs.readdirSync(publicDir);
    existingFiles.forEach(file => {
      if (file.startsWith('sitemap-names-') && file.endsWith('.xml')) {
        try {
          fs.unlinkSync(path.join(publicDir, file));
        } catch (e) {
          // Ignore removal errors
        }
      }
    });
  }

  // 1. Load names from Master database
  const masterJsonPath = path.join(__dirname, '..', 'names_master.json');
  if (!fs.existsSync(masterJsonPath)) {
    console.error('❌ Error: names_master.json file not found! Unable to generate sitemaps.');
    process.exit(1);
  }

  const allNames: NameData[] = JSON.parse(fs.readFileSync(masterJsonPath, 'utf-8'));

  // All names are indexed in all 4 languages — no filtering, no limits.
  const namesByLetter: Record<string, NameData[]> = {};

  allNames.forEach((name) => {
    const rawLetter = name.letter || (name.name ? name.name.charAt(0) : 'A');
    const letter = rawLetter.toUpperCase().trim();
    if (!namesByLetter[letter]) {
      namesByLetter[letter] = [];
    }
    namesByLetter[letter].push(name);
  });

  console.log(`✓ Loaded ${allNames.length} names across ${Object.keys(namesByLetter).length} letters.`);

  // 2. Load blog posts registry dynamically from imported module
  const blogPosts = blogPostsRegistry;
  console.log(`✓ Loaded ${blogPosts.length} blog posts dynamically.`);

  // 3. Generate static sitemap (Home, categories, search tools, policy pages)
  const staticUrls: string[] = [];

  // Home page alternates
  const homeAlternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}` }));
  LANGUAGES.forEach((lang) => {
    staticUrls.push(createUrlEntry(`${DOMAIN}/${lang}`, 'daily', 1.0, homeAlternates));
  });

  // Category pages (girls / boys) alternates
  const girlsAlternates = LANGUAGES.map(l => ({ 
    lang: l, 
    url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l].girls}` 
  }));
  const boysAlternates = LANGUAGES.map(l => ({ 
    lang: l, 
    url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l].boys}` 
  }));
  LANGUAGES.forEach((lang) => {
    const categorySegment = routeTranslations[lang].category;
    const girlsSegment = routeTranslations[lang].girls;
    const boysSegment = routeTranslations[lang].boys;
    staticUrls.push(
      createUrlEntry(`${DOMAIN}/${lang}/${categorySegment}/${girlsSegment}`, 'weekly', 0.8, girlsAlternates),
      createUrlEntry(`${DOMAIN}/${lang}/${categorySegment}/${boysSegment}`, 'weekly', 0.8, boysAlternates)
    );
  });

  // Theme pages (nature, power, beauty, light, wisdom) alternates
  const themeSlugsLocal = {
    tr: { nature: 'doga', power: 'guc', beauty: 'guzellik', light: 'isik', wisdom: 'bilgelik' },
    en: { nature: 'nature', power: 'power', beauty: 'beauty', light: 'light', wisdom: 'wisdom' },
    de: { nature: 'natur', power: 'macht', beauty: 'schoenheit', light: 'licht', wisdom: 'weisheit' },
    ar: { nature: 'طبيعة', power: 'قوة', beauty: 'جمال', light: 'نور', wisdom: 'حكمة' }
  } as const;

  const themeKeys = ['nature', 'power', 'beauty', 'light', 'wisdom'] as const;

  themeKeys.forEach((themeKey) => {
    const alternates = LANGUAGES.map(l => ({
      lang: l,
      url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${themeSlugsLocal[l][themeKey]}`
    }));
    
    LANGUAGES.forEach((lang) => {
      const categorySegment = routeTranslations[lang].category;
      const themeSlug = themeSlugsLocal[lang][themeKey];
      staticUrls.push(
        createUrlEntry(`${DOMAIN}/${lang}/${categorySegment}/${themeSlug}`, 'weekly', 0.8, alternates)
      );
    });
  });

  // Static utility & info pages
  const getAlternates = (routeKey: keyof typeof routeTranslations['tr']) => 
    LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l][routeKey]}` }));

  LANGUAGES.forEach((lang) => {
    const routes = routeTranslations[lang];
    staticUrls.push(
      createUrlEntry(`${DOMAIN}/${lang}/${routes.privacy}`, 'monthly', 0.3, getAlternates('privacy')),
      createUrlEntry(`${DOMAIN}/${lang}/${routes.terms}`, 'monthly', 0.3, getAlternates('terms')),
      createUrlEntry(`${DOMAIN}/${lang}/${routes.cookies}`, 'monthly', 0.3, getAlternates('cookies')),
      createUrlEntry(`${DOMAIN}/${lang}/${routes.contact}`, 'monthly', 0.4, getAlternates('contact')),
      createUrlEntry(`${DOMAIN}/${lang}/${routes.finder}`, 'weekly', 0.6, getAlternates('finder')),
      createUrlEntry(`${DOMAIN}/${lang}/${routes.about}`, 'monthly', 0.5, getAlternates('about'))
    );
  });

  // Blog listing pages alternates
  const blogListAlternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l].blog}` }));
  LANGUAGES.forEach((lang) => {
    const blogSegment = routeTranslations[lang].blog;
    staticUrls.push(createUrlEntry(`${DOMAIN}/${lang}/${blogSegment}`, 'daily', 0.9, blogListAlternates));
  });

  // Gender + Letter Categories alternates
  const alphabet = ['A','B','C','Ç','D','E','Ê','F','G','H','I','Î','J','K','L','M','N','O','P','Q','R','S','Ş','T','U','Û','V','W','X','Y','Z'];
  const genders = [
    { key: 'girls' },
    { key: 'boys' }
  ];

  genders.forEach(g => {
    alphabet.forEach(letter => {
      const alternates = LANGUAGES.map(l => ({
        lang: l,
        url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l][g.key as 'girls'|'boys']}/${encodeURIComponent(letter)}`
      }));

      LANGUAGES.forEach(lang => {
        const categorySegment = routeTranslations[lang].category;
        const genderSegment = routeTranslations[lang][g.key as 'girls'|'boys'];
        staticUrls.push(
          createUrlEntry(
            `${DOMAIN}/${lang}/${categorySegment}/${genderSegment}/${encodeURIComponent(letter)}`,
            'weekly',
            0.7,
            alternates
          )
        );
      });
    });
  });

  // Gender + Theme Categories alternates
  genders.forEach(g => {
    themeKeys.forEach(themeKey => {
      const alternates = LANGUAGES.map(l => ({
        lang: l,
        url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l][g.key as 'girls'|'boys']}/${themeSlugsLocal[l][themeKey]}`
      }));

      LANGUAGES.forEach(lang => {
        const categorySegment = routeTranslations[lang].category;
        const genderSegment = routeTranslations[lang][g.key as 'girls'|'boys'];
        const themeSlug = themeSlugsLocal[lang][themeKey];
        staticUrls.push(
          createUrlEntry(
            `${DOMAIN}/${lang}/${categorySegment}/${genderSegment}/${themeSlug}`,
            'weekly',
            0.7,
            alternates
          )
        );
      });
    });
  });

  const staticXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls.filter(Boolean).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-static.xml'), staticXml, 'utf-8');
  console.log(`✓ Generated sitemap-static.xml with ${staticUrls.length} static URLs`);

  // 4. Generate name sitemaps by letter (Full coverage: A-Z)
  const letters = Object.keys(namesByLetter).sort((a, b) => a.localeCompare(b, 'tr'));
  const nameSitemaps: string[] = [];

  // Track real URL counts for accurate reporting
  let totalNameUrlsGenerated = 0;

  for (const letter of letters) {
    const names = namesByLetter[letter];
    const nameUrls: string[] = [];

    names.forEach((nameData) => {
      const encodedId = encodeURIComponent(nameData.id);

      // All 4 languages — no filters, no limits
      const nameAlternates = LANGUAGES.map(l => ({
        lang: l,
        url: `${DOMAIN}/${l}/${routeTranslations[l].name}/${encodedId}`
      }));

      LANGUAGES.forEach((lang) => {
        const nameSegment = routeTranslations[lang].name;
        nameUrls.push(
          createUrlEntry(
            `${DOMAIN}/${lang}/${nameSegment}/${encodedId}`,
            'monthly',
            0.6,
            nameAlternates
          )
        );
      });
    });

    const nameXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${nameUrls.filter(Boolean).join('\n')}
</urlset>`;

    const filename = `sitemap-names-${getSafeFilenameLetter(letter)}.xml`;
    fs.writeFileSync(path.join(publicDir, filename), nameXml, 'utf-8');
    nameSitemaps.push(filename);
    totalNameUrlsGenerated += nameUrls.length;
    console.log(`✓ Generated ${filename} with ${nameUrls.length} URLs for letter ${letter}`);
  }

  // 5. Generate blog posts sitemap
  const blogUrls: string[] = [];

  blogPosts.forEach((post) => {
    const blogAlternates = LANGUAGES.map(l => {
      const slug = encodeURIComponent(post.slugs[l] || post.slugs['en'] || post.id);
      return { lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l].blog}/${slug}` };
    });
    LANGUAGES.forEach((lang) => {
      const blogSegment = routeTranslations[lang].blog;
      const slug = encodeURIComponent(post.slugs[lang] || post.slugs['en'] || post.id);
      blogUrls.push(
        createUrlEntry(
          `${DOMAIN}/${lang}/${blogSegment}/${slug}`,
          'weekly',
          0.7,
          blogAlternates
        )
      );
    });
  });

  const blogXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blogUrls.filter(Boolean).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogXml, 'utf-8');
  console.log(`✓ Generated sitemap-blog.xml with ${blogUrls.length} URLs`);

  // 6. Generate the Master Sitemap Index (sitemap-index.xml)
  const indexEntries: string[] = [];

  // Index reference to static sitemap
  indexEntries.push(createSitemapIndexEntry(`${DOMAIN}/sitemap-static.xml`, now));

  // Index references to letter-specific sitemaps
  nameSitemaps.forEach((filename) => {
    indexEntries.push(createSitemapIndexEntry(`${DOMAIN}/${filename}`, now));
  });

  // Index reference to blog sitemap
  indexEntries.push(createSitemapIndexEntry(`${DOMAIN}/sitemap-blog.xml`, now));

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexEntries.join('\n')}
</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml, 'utf-8');
  console.log(`✓ Generated sitemap-index.xml file with ${indexEntries.length} sitemap references`);

  // Final summary statistics (accurate counts based on actual generated URLs)
  const totalSitemaps = 1 + nameSitemaps.length + 1; // static + name sitemaps + blog
  const totalUrls = staticUrls.length + totalNameUrlsGenerated + blogUrls.length;

  console.log(`\n🎉 Full Multilingual SEO Sitemap Index generated successfully!`);
  console.log(`  Target Domain: ${DOMAIN}`);
  console.log(`  Total Sitemap Files: ${totalSitemaps}`);
  console.log(`  Total Indexed URLs: ${totalUrls}`);
  console.log(`  Breakdown:`);
  console.log(`    - Static Pages: ${staticUrls.length} URLs`);
  console.log(`    - Name Pages (TR/EN/DE/AR, all ${allNames.length} names): ${totalNameUrlsGenerated} URLs across ${letters.length} letter files`);
  console.log(`    - Blog Pages: ${blogUrls.length} URLs`);
  console.log(`  Output Location: ${publicDir}`);
}

generateSitemaps().catch((error) => {
  console.error('❌ Critical Error during sitemap generation:', error);
  process.exit(1);
});
