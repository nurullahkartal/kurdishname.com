import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPostsRegistry } from '../src/data/blogPosts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://kurdishname.com';
const LANGUAGES = ['tr', 'en', 'de', 'ar'] as const;
type Language = typeof LANGUAGES[number];

// Route translations to generate paths in sync with client app
const routeTranslations = {
  tr: {
    category: 'kategori',
    name: 'isim',
    blog: 'blog',
    finder: 'isim-bul',
    privacy: 'gizlilik-politikasi',
    terms: 'kullanim-kosullari',
    cookies: 'cerez-politikasi',
    contact: 'iletisim',
    about: 'hakkimizda',
    widget: 'widget',
    favorites: 'defterim',
    girls: 'kiz',
    boys: 'erkek',
    suggest: 'isim-oner',
    compare: 'karsilastir'
  },
  en: {
    category: 'category',
    name: 'name',
    blog: 'blog',
    finder: 'find-name',
    privacy: 'privacy-policy',
    terms: 'terms-of-use',
    cookies: 'cookie-policy',
    contact: 'contact',
    about: 'about-us',
    widget: 'widget',
    favorites: 'my-favorites',
    girls: 'girls',
    boys: 'boys',
    suggest: 'suggest-name',
    compare: 'compare'
  },
  de: {
    category: 'kategorie',
    name: 'name',
    blog: 'blog',
    finder: 'name-finden',
    privacy: 'datenschutzerklaerung',
    terms: 'nutzungsbedingungen',
    cookies: 'cookie-richtlinie',
    contact: 'kontakt',
    about: 'ueber-uns',
    widget: 'widget',
    favorites: 'favoriten',
    girls: 'maedchen',
    boys: 'jungen',
    suggest: 'name-vorschlagen',
    compare: 'vergleichen'
  },
  ar: {
    category: 'فئة',
    name: 'اسم',
    blog: 'مدونة',
    finder: 'البحث-عن-اسم',
    privacy: 'سياسة-الخصوصية',
    terms: 'شروط-الاستخدام',
    cookies: 'سياسة-ملفات-تعريف-الارتباط',
    contact: 'اتصل-بنا',
    about: 'من-نحن',
    widget: 'widget',
    favorites: 'المفضلة',
    girls: 'بنات',
    boys: 'ذكور',
    suggest: 'اقتراح-اسم',
    compare: 'مقارنة'
  }
} as const;

const themeSlugs = {
  tr: { nature: 'doga', power: 'guc', beauty: 'guzellik', light: 'isik', wisdom: 'bilgelik' },
  en: { nature: 'nature', power: 'power', beauty: 'beauty', light: 'light', wisdom: 'wisdom' },
  de: { nature: 'natur', power: 'macht', beauty: 'schoenheit', light: 'licht', wisdom: 'weisheit' },
  ar: { nature: 'طبيعة', power: 'قوة', beauty: 'جمال', light: 'نور', wisdom: 'حكمة' }
} as const;

// 1. Load locales
const locales: Record<string, any> = {
  tr: JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/tr.json'), 'utf-8')),
  en: JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/en.json'), 'utf-8')),
  de: JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/de.json'), 'utf-8')),
  ar: JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/ar.json'), 'utf-8')),
};

function getTranslation(lang: string, key: string, fallback: string = ''): string {
  const dict = locales[lang] || locales.tr;
  return dict[key] || locales.tr[key] || fallback;
}

function getLocalizedMeaning(nameItem: any, lang: string): string {
  if (lang === 'tr') return nameItem.meaning || '';
  if (lang === 'en') return nameItem.meaning_en || nameItem.meaning || '';
  if (lang === 'de') return nameItem.meaning_de || nameItem.meaning_en || nameItem.meaning || '';
  if (lang === 'ar') return nameItem.meaning_ar || nameItem.meaning || '';
  return nameItem.meaning || '';
}

function getLocalizedOrigin(origin: string, lang: string): string {
  const originKey = `origin_${origin}`;
  return getTranslation(lang, originKey, origin);
}

function buildMetaDescription(lang: string, name: string, genderText: string, origin: string, meaning: string): string {
  const maxLength = 155;
  if (lang === "tr") {
    const limit = maxLength - (67 + name.length * 2 + origin.length);
    const cleanMeaning = meaning.length > limit ? meaning.slice(0, limit - 3) + "..." : meaning;
    return `${name} Kürtçe ne demek? ${genderText} ismi olan ${name} isminin kökeni ${origin} olup anlamı şudur: ${cleanMeaning}`;
  } else if (lang === "en") {
    const limit = maxLength - (48 + name.length * 2 + genderText.length + origin.length);
    const cleanMeaning = meaning.length > limit ? meaning.slice(0, limit - 3) + "..." : meaning;
    return `What does ${name} mean? Kurdish ${genderText} name ${name} (origin: ${origin}) means: ${cleanMeaning}`;
  } else if (lang === "de") {
    const limit = maxLength - (55 + name.length * 2 + genderText.length + origin.length);
    const cleanMeaning = meaning.length > limit ? meaning.slice(0, limit - 3) + "..." : meaning;
    return `Bedeutung von ${name}: Der kurdische ${genderText}name ${name} (Herkunft: ${origin}) bedeutet: ${cleanMeaning}`;
  } else if (lang === "ar") {
    const limit = maxLength - (35 + name.length + genderText.length + origin.length);
    const cleanMeaning = meaning.length > limit ? meaning.slice(0, limit - 3) + "..." : meaning;
    return `معنى اسم ${name}: اسم ${genderText} كردي من أصل ${origin} يعني: ${cleanMeaning}`;
  } else {
    const limit = maxLength - (20 + name.length);
    const cleanMeaning = meaning.length > limit ? meaning.slice(0, limit - 3) + "..." : meaning;
    return `${name} meaning: ${cleanMeaning}`;
  }
}

// 2. Localized path builder
function generatePath(lang: string, key: keyof typeof routeTranslations['tr'] | null, param?: string): string {
  if (!key) {
    return `/${lang}${param ? `/${param}` : ''}`;
  }
  const currentLangRoutes = routeTranslations[lang as keyof typeof routeTranslations] || routeTranslations['tr'];
  const segment = (currentLangRoutes as any)[key] || (routeTranslations['tr'] as any)[key];

  let resolvedParam = param;
  if (key === 'category' && param) {
    if (param === 'kiz') {
      resolvedParam = currentLangRoutes.girls;
    } else if (param === 'erkek') {
      resolvedParam = currentLangRoutes.boys;
    } else if (param in themeSlugs.tr) {
      const themes = themeSlugs[lang as keyof typeof themeSlugs] || themeSlugs['tr'];
      resolvedParam = (themes as any)[param];
    }
  }

  return `/${lang}/${segment}${resolvedParam ? `/${resolvedParam}` : ''}`;
}

// Markdown parser inside prerender script
function simpleMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  let html = markdown;

  // Escape special signs inside paragraph parsing
  const paragraphs = html.split(/\n\n+/);
  const formattedParagraphs = paragraphs.map(p => {
    let trimmed = p.trim();
    if (!trimmed) return '';

    // Check headings
    if (trimmed.startsWith('### ')) {
      return `<h3 style="font-size: 1.25rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.75rem; color: var(--text);">${trimmed.slice(4)}</h3>`;
    }
    if (trimmed.startsWith('## ')) {
      return `<h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: var(--text);">${trimmed.slice(3)}</h2>`;
    }
    if (trimmed.startsWith('# ')) {
      return `<h1 style="font-size: 2rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: var(--text);">${trimmed.slice(2)}</h1>`;
    }

    // Check list item blocks
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const items = trimmed.split(/\n[\*\-]\s+/);
      const listItems = items.map(item => {
        let cleanItem = item.replace(/^[\*\-]\s+/, '');
        cleanItem = cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        cleanItem = cleanItem.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        return `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${cleanItem}</li>`;
      }).join('');
      return `<ul style="margin-left: 1.5rem; margin-bottom: 1.25rem; list-style-type: disc;">${listItems}</ul>`;
    }

    // Bold & Links
    trimmed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    trimmed = trimmed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    return `<p style="font-size: 1rem; line-height: 1.75; color: var(--text-muted); margin-bottom: 1.25rem; text-align: justify;">${trimmed.replace(/\n/g, '<br />')}</p>`;
  });

  return formattedParagraphs.join('\n');
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function injectInternalLinks(content: string, allNames: any[], lng: string): string {
  if (!content || !allNames || allNames.length === 0) return content;
  const contentWords = new Set(
    content.toLowerCase().split(/[^a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ’]+/).map(w => w.trim()).filter(w => w.length > 1)
  );
  const candidateNames = allNames.filter(nameItem => contentWords.has(nameItem.name.toLowerCase()));
  if (candidateNames.length === 0) return content;
  candidateNames.sort((a, b) => b.name.length - a.name.length);
  
  const placeholders: string[] = [];
  let processedContent = content;
  const hidePattern = (regex: RegExp) => {
    processedContent = processedContent.replace(regex, (match) => {
      const ph = `___LINK_PH_${placeholders.length}___`;
      placeholders.push(match);
      return ph;
    });
  };
  hidePattern(/```[\s\S]*?```/g);
  hidePattern(/`[^`]+`/g);
  hidePattern(/!\[[^\]]*\]\([^)]+\)/g);
  hidePattern(/\[[^\]]+\]\([^)]+\)/g);
  hidePattern(/^#+\s+.*$/gm);

  const linkedNames = new Set<string>();
  candidateNames.forEach((nameItem) => {
    const nameStr = nameItem.name;
    const nameLower = nameStr.toLowerCase();
    if (linkedNames.has(nameLower)) return;
    const escapedName = escapeRegExp(nameStr);
    const pattern = new RegExp(`(^|[^a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ’])(${escapedName})($|’[a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ]+|[^a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ’])`, "i");
    let replaced = false;
    processedContent = processedContent.replace(pattern, (match, prefix, matchedName, suffix) => {
      if (replaced) return match;
      replaced = true;
      linkedNames.add(nameLower);
      const targetPath = generatePath(lng, "name", nameItem.id);
      return `${prefix}[${matchedName}](${targetPath})${suffix}`;
    });
  });

  for (let i = placeholders.length - 1; i >= 0; i--) {
    processedContent = processedContent.replace(`___LINK_PH_${i}___`, placeholders[i]);
  }
  return processedContent;
}

// Global layout generator reproducing Layout.tsx aesthetics and theme tokens
function renderLayout(lang: string, contentHTML: string, options: {
  pageTitle: string;
  pageDesc: string;
  canonicalUrl: string;
  alternates: { lang: string; url: string }[];
}) {
  const isRtl = lang === 'ar';
  const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);

  // Core navigation tabs sync'd with React frontend layout
  const navItems = [
    { to: generatePath(lang, null), label: t('nav_home') },
    { to: generatePath(lang, 'category', 'kiz'), label: t('nav_girls') },
    { to: generatePath(lang, 'category', 'erkek'), label: t('nav_boys') },
    { to: generatePath(lang, 'finder'), label: t('nav_finder') },
    { to: generatePath(lang, 'compare'), label: t('nav_compare', 'Karşılaştır') },
    { to: generatePath(lang, 'favorites'), label: t('nav_favorites', 'Defterim') },
  ];

  const navHTML = navItems.map(item => `
    <a href="${item.to}" style="padding: 0.55rem 0.875rem; font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); text-decoration: none; border-bottom: 2px solid transparent; white-space: nowrap; display: inline-flex; align-items: center; gap: 0.35rem;">
      ${item.label}
    </a>
  `).join('');

  // Core footer layout sync'd with React frontend layout
  const footerLinks = [
    { to: generatePath(lang, 'category', 'kiz'), label: t('nav_girls') },
    { to: generatePath(lang, 'category', 'erkek'), label: t('nav_boys') },
    { to: generatePath(lang, 'about'), label: t('footer_about', 'Hakkımızda') },
    { to: generatePath(lang, 'widget'), label: t('footer_widget', 'Widget') },
    { to: generatePath(lang, 'privacy'), label: t('footer_privacy', 'Gizlilik Politikası') },
    { to: generatePath(lang, 'terms'), label: t('footer_terms', 'Kullanım Koşulları') },
    { to: generatePath(lang, 'contact'), label: t('footer_contact', 'İletişim') },
  ];

  const footerLinksHTML = footerLinks.map(link => `
    <a href="${link.to}" style="color: var(--text-faint); font-size: 0.75rem; text-decoration: none; font-weight: 500;">
      ${link.label}
    </a>
  `).join('\n');

  return `
    <div style="background: var(--bg); color: var(--text); min-height: 100vh;" dir="${isRtl ? 'rtl' : 'ltr'}">
      <header style="border-bottom: 1px solid var(--border); background: var(--surface); position: sticky; top: 0; z-index: 50;">
        <div class="enc-container-wide">
          <div class="enc-header-wrapper">
            <div class="enc-header-logo">
              <a href="${generatePath(lang, null)}" style="text-decoration: none;" aria-label="KurdishName">
                <div style="display: flex; align-items: center; gap: 0.625rem;">
                  <img src="/logo.webp" width="56" height="56" loading="eager" alt="Logo" class="object-contain" style="height: 32px; width: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);" />
                  <span class="enc-brand-text">KurdishName</span>
                </div>
              </a>
            </div>
            <form action="${generatePath(lang, null)}" class="enc-header-search-form">
              <div class="enc-search-bar">
                <input type="text" name="q" placeholder="${t('search_placeholder', 'İsim ara...')}" autocomplete="off" aria-label="${t('search_placeholder')}" />
                <button type="submit" aria-label="Search"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
              </div>
            </form>
            <div class="enc-header-controls">
              <span style="width: 1px; height: 14px; background-color: var(--border); margin: 0 0.4rem;"></span>
              <select class="lang-select-dropdown" onchange="window.location.href=this.value" aria-label="Language Selector">
                <option value="${generatePath('tr', null)}" ${lang === 'tr' ? 'selected' : ''}>Türkçe</option>
                <option value="${generatePath('en', null)}" ${lang === 'en' ? 'selected' : ''}>English</option>
                <option value="${generatePath('de', null)}" ${lang === 'de' ? 'selected' : ''}>Deutsch</option>
                <option value="${generatePath('ar', null)}" ${lang === 'ar' ? 'selected' : ''}>العربية</option>
              </select>
            </div>
          </div>
          <nav style="display: flex; gap: 0; border-top: 1px solid var(--border-dim); overflow-x: auto;" aria-label="Navigation Links">
            ${navHTML}
          </nav>
        </div>
      </header>

      <main class="enc-container" style="padding-top: 1.75rem; padding-bottom: 4rem;">
        <div class="page-fade-in">
          ${contentHTML}
        </div>
      </main>

      <footer style="border-top: 1px solid var(--border); padding: 1.25rem 0;">
        <div class="enc-container-wide" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; font-size: 0.75rem; color: var(--text-faint);">
          <span>© ${new Date().getFullYear()} KurdishName</span>
          <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; align-items: center;">
            ${footerLinksHTML}
          </div>
        </div>
      </footer>
    </div>
  `;
}

// Injects correct head tags, hreflang alternates, dir flags, and JSON-LD schemas into Vite dist/index.html
function replaceHeadMetadata(template: string, options: {
  title: string;
  description: string;
  canonical: string;
  lang: string;
  alternates: { lang: string; url: string }[];
  schemas: string[];
}) {
  const isRtl = options.lang === 'ar';
  let html = template;

  // Replace <html> tag
  html = html.replace(/<html[^>]*>/i, `<html lang="${options.lang}"${isRtl ? ' dir="rtl"' : ''}>`);

  // Replace title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title data-rh="true">${options.title}</title>`);

  // Replace description meta
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta data-rh="true" name="description" content="${options.description}">`);

  // Replace canonical link
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${options.canonical}">`);

  // Injects alternates
  const alternatesHtml = options.alternates.map(alt =>
    `<link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />`
  ).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="https://kurdishname.com/" />`;

  // Injects JSON-LD using @graph for consolidation
  let schemasHtml = '';
  if (options.schemas && options.schemas.length > 0) {
    const parsedSchemas = options.schemas.map(s => {
      const obj = JSON.parse(s);
      delete obj['@context'];
      return obj;
    });
    const graphSchema = {
      '@context': 'https://schema.org',
      '@graph': parsedSchemas
    };
    schemasHtml = `<script type="application/ld+json">\n${JSON.stringify(graphSchema)}\n</script>`;
  }

  const headInject = `${alternatesHtml}\n${schemasHtml}\n</head>`;
  html = html.replace(/<\/head>/i, headInject);

  return html;
}

// Lightning-fast directory cache helper to bypass redundant recursive filesystem checks
const createdDirs = new Set<string>();
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (createdDirs.has(dirname)) return;
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
  createdDirs.add(dirname);
}

function isInvalidUrl(u: string): boolean {
  const decoded = decodeURIComponent(u.toLowerCase());
  return decoded.split('/').some(s => s === 'yok' || s === 'undefined' || s === 'null');
}

function safeWriteFile(outPath: string, content: string, url: string) {
  if (isInvalidUrl(url)) {
    console.log(`⚠️ Hatalı URL sitemape sızması engellendi: ${url}`);
    return;
  }
  ensureDirectoryExistence(outPath);
  fs.writeFileSync(outPath, content, 'utf-8');
}

// Pre-render executor
async function runSSGPrerendering() {
  console.log('💎 Starting Lightning-Fast Premium Statik Site Generation (SSG / Prerendering)...');
  const start = Date.now();

  const distDir = path.join(__dirname, '../dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ Error: dist/index.html not found! Run "vite build" first.');
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  // Load Names Master database
  const masterJsonPath = path.join(__dirname, '../names_master.json');
  if (!fs.existsSync(masterJsonPath)) {
    console.error('❌ Error: names_master.json not found!');
    process.exit(1);
  }
  const allNames: any[] = JSON.parse(fs.readFileSync(masterJsonPath, 'utf-8'));
  console.log(`✓ Loaded ${allNames.length} names from Master Database.`);

  // Load Blog Posts Metadata Registry
  const blogPosts = blogPostsRegistry;
  console.log(`✓ Loaded ${blogPosts.length} blog posts metadata registrar.`);

  // ──── PHASE 1: HOMEPAGES (tr, en, de, ar) ────
  console.log('⌛ Pre-rendering Homepages...');
  LANGUAGES.forEach(lang => {
    const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);
    const canonical = `${DOMAIN}/${lang}`;
    const alternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}` }));

    // Prepare home static content
    // Stats Bento
    const statsHTML = `
      <section class="stats-bento-grid" style="gap: 1rem; margin-bottom: 4rem;">
        <div class="bento-box" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: flex-end;"><span style="width: 8px; height: 8px; borderRadius: 50%; background: var(--accent);"></span></div>
          <div>
            <span style="display: block; fontSize: 0.75rem; fontWeight: 800; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">${t('total_names', 'Toplam İsim')}</span>
            <span style="display: block; fontSize: 1.75rem; fontWeight: 900; color: var(--text); line-height: 1.1;">10,239+</span>
          </div>
        </div>
        <div class="bento-box" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: flex-end;"><span style="width: 8px; height: 8px; borderRadius: 50%; background: var(--female);"></span></div>
          <div>
            <span style="display: block; fontSize: 0.75rem; fontWeight: 800; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">${t('girl_names', 'Kürtçe Kız İsimleri')}</span>
            <a href="${generatePath(lang, 'category', 'kiz')}" style="display: block; fontSize: 1.75rem; fontWeight: 900; color: var(--text); text-decoration: none; line-height: 1.1;">5,224+</a>
          </div>
        </div>
        <div class="bento-box" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 140px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: flex-end;"><span style="width: 8px; height: 8px; borderRadius: 50%; background: var(--male);"></span></div>
          <div>
            <span style="display: block; fontSize: 0.75rem; fontWeight: 800; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">${t('boy_names', 'Kürtçe Erkek İsimleri')}</span>
            <a href="${generatePath(lang, 'category', 'erkek')}" style="display: block; fontSize: 1.75rem; fontWeight: 900; color: var(--text); text-decoration: none; line-height: 1.1;">5,015+</a>
          </div>
        </div>
      </section>
    `;

    // Premium Trends widget inside ssg
    const trendsHTML = `
      <section style="margin-bottom: 4rem;">
        <h2 class="section-heading">${t('popular_searches', 'Popüler İsimler')}</h2>
        <div class="gender-grid" style="gap: 1rem;">
          <a href="${generatePath(lang, 'category', 'kiz')}" style="display: block; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); text-decoration: none; text-align: center;">
            <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🌸</span>
            <strong style="color: var(--female); font-size: 1.1rem; display: block;">${t('nav_girls')}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${t('cat_desc_kiz')?.slice(0, 50)}...</span>
          </a>
          <a href="${generatePath(lang, 'category', 'erkek')}" style="display: block; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); text-decoration: none; text-align: center;">
            <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">☀️</span>
            <strong style="color: var(--male); font-size: 1.1rem; display: block;">${t('nav_boys')}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${t('cat_desc_erkek')?.slice(0, 50)}...</span>
          </a>
          <a href="${generatePath(lang, 'finder')}" style="display: block; padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); text-decoration: none; text-align: center;">
            <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🎯</span>
            <strong style="color: var(--accent); font-size: 1.1rem; display: block;">${t('nav_finder')}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${t('finder_seo_desc')?.slice(0, 50)}...</span>
          </a>
        </div>
      </section>
    `;

    // Alphabet index links
    const alphabet = ['A','B','C','Ç','D','E','Ê','F','G','H','I','Î','J','K','L','M','N','O','P','Q','R','S','Ş','T','U','Û','V','W','X','Y','Z'];
    const alphabetHTML = alphabet.map(letter => `
      <a href="${generatePath(lang, 'category', letter)}">${letter}</a>
    `).join('');

    const homeContent = `
      <section style="padding: clamp(2rem, 8vw, 4rem) 0; text-align: center;">
        <div style="background: var(--accent-dim); color: var(--accent); padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 1.5rem;">
          ${t('home_badge', '2026 Modern Kürtçe İsimler')}
        </div>
        <h1 style="font-family: var(--font-display); font-size: clamp(2.2rem, 6vw, 3.8rem); font-weight: 900; letter-spacing: -0.04em; color: var(--text); margin-bottom: 1rem; line-height: 1.15;">
          ${t('home_h1_title', 'En Kapsamlı Kürtçe İsimler Arşivi')}
        </h1>
        <p style="font-size: clamp(1rem, 1.8vw, 1.15rem); color: var(--text-muted); margin-bottom: 2.5rem; line-height: 1.6; max-width: 680px; margin-inline: auto;">
          ${t('seo_home_description')}
        </p>
      </section>

      ${statsHTML}

      ${trendsHTML}

      <section style="margin-bottom: 4rem;">
        <h2 class="section-heading">${t('sidebar_letters', 'Harfe Göre Kürtçe İsimler')}</h2>
        <div class="alpha-index">${alphabetHTML}</div>
      </section>
    `;

    const bodyHtml = renderLayout(lang, homeContent, {
      pageTitle: t('seo_home_title'),
      pageDesc: t('seo_home_description'),
      canonicalUrl: canonical,
      alternates: alternates
    });

    const datasetSchema = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      'name': 'KurdishName Database',
      'description': t('seo_home_description'),
      'url': canonical,
      'keywords': 'Kürtçe isimler, Kurdish names, kurdische namen, الأسماء الكردية',
      'license': `${DOMAIN}/${lang === 'tr' ? 'tr/kullanim-kosullari' : 'en/terms-of-use'}`,
      'isAccessibleForFree': true,
      'size': '10,239 names'
    });

    const finalHtml = replaceHeadMetadata(templateHtml, {
      title: t('seo_home_title'),
      description: t('seo_home_description'),
      canonical: canonical,
      lang: lang,
      alternates: alternates,
      schemas: [datasetSchema]
    }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

    const outPath = path.join(distDir, `${lang}/index.html`);
    safeWriteFile(outPath, finalHtml, canonical);
  });

  // ──── PHASE 2: STATIC UTILITY PAGES (privacy, terms, cookies, contact, finder, about, suggest, compare) ────
  console.log('⌛ Pre-rendering Static Utility Pages...');
  const staticKeys: ('privacy' | 'terms' | 'cookies' | 'contact' | 'about' | 'finder' | 'suggest' | 'compare' | 'favorites')[] = [
    'privacy', 'terms', 'cookies', 'contact', 'about', 'finder', 'suggest', 'compare', 'favorites'
  ];

  staticKeys.forEach(routeKey => {
    LANGUAGES.forEach(lang => {
      const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);
      const routes = routeTranslations[lang];
      const segment = routes[routeKey];
      const canonical = `${DOMAIN}/${lang}/${segment}`;
      const alternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l][routeKey]}` }));

      let title = t(`${routeKey}_title`, routeKey.toUpperCase());
      let desc = t(`${routeKey}_seo_desc`, `${title} page of KurdishName.`);
      let content = '';

      if (routeKey === 'privacy') {
        content = `
          <h1 class="page-title">${title}</h1>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">1. ${t('privacy_h1', 'Veri Toplama')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('privacy_p1')}</p>
          </div>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">2. ${t('privacy_h2', 'Çerezler (Cookies)')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('privacy_p2')}</p>
          </div>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">3. ${t('privacy_h3', 'Üçüncü Şahıslar')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('privacy_p3')}</p>
          </div>
        `;
      } else if (routeKey === 'terms') {
        content = `
          <h1 class="page-title">${title}</h1>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">1. ${t('terms_h1', 'Hizmet Şartları')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('terms_p1')}</p>
          </div>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">2. ${t('terms_h2', 'Telif Hakları')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('terms_p2')}</p>
          </div>
        `;
      } else if (routeKey === 'cookies') {
        content = `
          <h1 class="page-title">${title}</h1>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">1. ${t('cookies_h1', 'Çerez Nedir')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('cookies_p1')}</p>
          </div>
        `;
      } else if (routeKey === 'about') {
        content = `
          <h1 class="page-title">${title}</h1>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">${t('about_vision_title', 'Misyon ve Vizyonumuz')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('about_vision_p')}</p>
          </div>
          <div style="margin-bottom: 2rem;">
            <h2 class="section-heading">${t('about_archive_title', 'Kapsamlı İsim Arşivi')}</h2>
            <p style="font-size: 0.95rem; line-height: 1.8; color: var(--text-muted);">${t('about_archive_p')}</p>
          </div>
        `;
      } else {
        // Fallback for contact, finder, suggest, compare, favorites
        content = `
          <h1 class="page-title">${title}</h1>
          <p style="font-size: 1rem; line-height: 1.8; color: var(--text-muted);">${desc}</p>
          <div class="notice-box" style="margin-top: 2rem;">
            <strong>Premium Application Module</strong><br/>
            This premium interactive tool is fully loaded and ready inside our high-performance client engine. 
            Enable JavaScript in your browser to run this module!
          </div>
        `;
      }

      const bodyHtml = renderLayout(lang, content, {
        pageTitle: title,
        pageDesc: desc,
        canonicalUrl: canonical,
        alternates: alternates
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${title} | KurdishName`,
        description: desc,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: []
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${segment}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    });
  });

  // ──── PHASE 3: CATEGORY & THEME PAGES ────
  console.log('⌛ Pre-rendering Categories and Themes...');
  // Themes definition map
  const themeKeys = ['nature', 'power', 'beauty', 'light', 'wisdom'] as const;
  const themeTags: Record<string, string> = {
    nature: 'Doğa / Yaşam',
    power: 'Cesaret / Güç',
    beauty: 'Sevgi / Güzellik',
    light: 'Işık / Aydınlık',
    wisdom: 'Bilgelik / Akıl'
  };

  LANGUAGES.forEach(lang => {
    const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);
    const routes = routeTranslations[lang];
    const categorySegment = routes.category;

    // A. Girls Category
    {
      const girlsSegment = routes.girls;
      const canonical = `${DOMAIN}/${lang}/${categorySegment}/${girlsSegment}`;
      const alternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l].girls}` }));
      const title = t('cat_title_kiz', 'Kürtçe Kız İsimleri');
      const desc = t('cat_desc_kiz');

      // Filter names
      const girlsList = allNames.filter(n => n.gender === 'female' || n.gender === 'unisex');

      // Sort alphabetically for clean pre-rendered indexing
      girlsList.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

      // Render name link tags
      const listHTML = girlsList.map(n => `
        <div class="name-list-item">
          <a href="${generatePath(lang, 'name', n.id)}" class="name-link-female">${n.name}</a>
          <span class="name-list-meaning">${getLocalizedMeaning(n, lang)?.slice(0, 48)}...</span>
        </div>
      `).join('\n');

      const content = `
        <h1 class="page-title">${title}</h1>
        <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 2rem;">${t('cat_intro_kiz') || desc}</p>
        <h2 class="section-heading">${t('sidebar_girls')} (${girlsList.length})</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${listHTML}
        </div>
      `;

      const bodyHtml = renderLayout(lang, content, {
        pageTitle: title,
        pageDesc: desc,
        canonicalUrl: canonical,
        alternates: alternates
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${title} | KurdishName`,
        description: desc,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: []
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${categorySegment}/${girlsSegment}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    }

    // B. Boys Category
    {
      const boysSegment = routes.boys;
      const canonical = `${DOMAIN}/${lang}/${categorySegment}/${boysSegment}`;
      const alternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l].boys}` }));
      const title = t('cat_title_erkek', 'Kürtçe Erkek İsimleri');
      const desc = t('cat_desc_erkek');

      // Filter names
      const boysList = allNames.filter(n => n.gender === 'male' || n.gender === 'unisex');

      // Sort alphabetically
      boysList.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

      // Render name link tags
      const listHTML = boysList.map(n => `
        <div class="name-list-item">
          <a href="${generatePath(lang, 'name', n.id)}" class="name-link-male">${n.name}</a>
          <span class="name-list-meaning">${getLocalizedMeaning(n, lang)?.slice(0, 48)}...</span>
        </div>
      `).join('\n');

      const content = `
        <h1 class="page-title">${title}</h1>
        <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 2rem;">${t('cat_intro_erkek') || desc}</p>
        <h2 class="section-heading">${t('sidebar_boys')} (${boysList.length})</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${listHTML}
        </div>
      `;

      const bodyHtml = renderLayout(lang, content, {
        pageTitle: title,
        pageDesc: desc,
        canonicalUrl: canonical,
        alternates: alternates
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${title} | KurdishName`,
        description: desc,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: []
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${categorySegment}/${boysSegment}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    }

    // C. Theme Categories
    themeKeys.forEach(themeKey => {
      const themeSlug = themeSlugs[lang][themeKey];
      const canonical = `${DOMAIN}/${lang}/${categorySegment}/${themeSlug}`;
      const alternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${themeSlugs[l][themeKey]}` }));

      const titleKey = `theme_${themeKey}_title`;
      const descKey = `theme_${themeKey}_desc`;

      const title = t(titleKey, `Kürtçe ${themeKey} İsimleri`);
      const desc = t(descKey, `Kürtçe ${themeKey} temalı en güzel bebek isimleri rehberi.`);

      const targetTag = themeTags[themeKey];
      const themeList = allNames.filter(n => n.tags?.includes(targetTag));

      // Sort alphabetically
      themeList.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

      // Render name link tags
      const listHTML = themeList.map(n => `
        <div class="name-list-item">
          <a href="${generatePath(lang, 'name', n.id)}" class="${n.gender === 'female' ? 'name-link-female' : 'name-link-male'}">${n.name}</a>
          <span class="name-list-meaning">${getLocalizedMeaning(n, lang)?.slice(0, 48)}...</span>
        </div>
      `).join('\n');

      const content = `
        <h1 class="page-title">${title}</h1>
        <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 2rem;">${desc}</p>
        <h2 class="section-heading">${title} (${themeList.length})</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${listHTML}
        </div>
      `;

      const bodyHtml = renderLayout(lang, content, {
        pageTitle: title,
        pageDesc: desc,
        canonicalUrl: canonical,
        alternates: alternates
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${title} | KurdishName`,
        description: desc,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: []
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${categorySegment}/${themeSlug}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    });

    // D. Letter-based Categories
    const alphabet = ['A','B','C','Ç','D','E','Ê','F','G','H','I','Î','J','K','L','M','N','O','P','Q','R','S','Ş','T','U','Û','V','W','X','Y','Z'];
    alphabet.forEach(letter => {
      const canonical = `${DOMAIN}/${lang}/${categorySegment}/${encodeURIComponent(letter)}`;
      const alternates = LANGUAGES.map(l => ({
        lang: l,
        url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${encodeURIComponent(letter)}`
      }));

      const rawTitle = t('cat_title_letter', '{{letter}} Harfi İle Başlayan Kürtçe İsimler');
      const title = rawTitle.replaceAll('{{letter}}', letter);
      
      const rawDesc = t('cat_desc_letter', '{{letter}} harfi ile başlayan tüm Kürtçe isimleri listeliyoruz.');
      const desc = rawDesc.replaceAll('{{letter}}', letter);

      // Filter names by letter
      const letterList = allNames.filter(n => (n.letter || n.name.charAt(0)).toUpperCase() === letter);

      // Sort alphabetically
      letterList.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

      // Render name link tags
      const listHTML = letterList.map(n => `
        <div class="name-list-item">
          <a href="${generatePath(lang, 'name', n.id)}" class="${n.gender === 'female' ? 'name-link-female' : 'name-link-male'}">${n.name}</a>
          <span class="name-list-meaning">${getLocalizedMeaning(n, lang)?.slice(0, 48)}...</span>
        </div>
      `).join('\n');

      const content = `
        <h1 class="page-title">${title}</h1>
        <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 2rem;">${desc}</p>
        <h2 class="section-heading">${title} (${letterList.length})</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${listHTML}
        </div>
      `;

      const bodyHtml = renderLayout(lang, content, {
        pageTitle: title,
        pageDesc: desc,
        canonicalUrl: canonical,
        alternates: alternates
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${title} | KurdishName`,
        description: desc,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: []
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${categorySegment}/${encodeURIComponent(letter)}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    });

    // E. Gender + Letter Categories
    const genders = [
      { key: 'girls', segment: routes.girls, label: t('nav_girls', 'Kız İsimleri'), filter: (n: any) => n.gender === 'female' },
      { key: 'boys', segment: routes.boys, label: t('nav_boys', 'Erkek İsimleri'), filter: (n: any) => n.gender === 'male' }
    ];

    genders.forEach(g => {
      alphabet.forEach(letter => {
        const canonical = `${DOMAIN}/${lang}/${categorySegment}/${g.segment}/${encodeURIComponent(letter)}`;
        const alternates = LANGUAGES.map(l => ({
          lang: l,
          url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l][g.key as 'girls'|'boys']}/${encodeURIComponent(letter)}`
        }));

        const title = `${letter} Harfi ile Başlayan Kürtçe ${g.label}`;
        const desc = `${letter} harfi ile başlayan tüm Kürtçe ${g.label} listesi, anlamları ve etimolojisi.`;

        const combinedList = allNames.filter(n => g.filter(n) && (n.letter || n.name.charAt(0)).toUpperCase() === letter);
        combinedList.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

        const listHTML = combinedList.map(n => `
          <div class="name-list-item">
            <a href="${generatePath(lang, 'name', n.id)}" class="${n.gender === 'female' ? 'name-link-female' : 'name-link-male'}">${n.name}</a>
            <span class="name-list-meaning">${getLocalizedMeaning(n, lang)?.slice(0, 48)}...</span>
          </div>
        `).join('\n');

        const content = `
          <h1 class="page-title">${title}</h1>
          <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 2rem;">${desc}</p>
          <h2 class="section-heading">${title} (${combinedList.length})</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
            ${listHTML}
          </div>
        `;

        const bodyHtml = renderLayout(lang, content, {
          pageTitle: title,
          pageDesc: desc,
          canonicalUrl: canonical,
          alternates: alternates
        });

        const finalHtml = replaceHeadMetadata(templateHtml, {
          title: `${title} | KurdishName`,
          description: desc,
          canonical: canonical,
          lang: lang,
          alternates: alternates,
          schemas: []
        }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

        const outPath = path.join(distDir, `${lang}/${categorySegment}/${g.segment}/${encodeURIComponent(letter)}/index.html`);
        safeWriteFile(outPath, finalHtml, canonical);
      });
    });

    // F. Gender + Theme Categories
    genders.forEach(g => {
      themeKeys.forEach(themeKey => {
        const themeSlug = themeSlugs[lang][themeKey];
        const canonical = `${DOMAIN}/${lang}/${categorySegment}/${g.segment}/${themeSlug}`;
        const alternates = LANGUAGES.map(l => ({
          lang: l,
          url: `${DOMAIN}/${l}/${routeTranslations[l].category}/${routeTranslations[l][g.key as 'girls'|'boys']}/${themeSlugs[l][themeKey]}`
        }));

        const themeTitle = t(`theme_${themeKey}_title`, `Kürtçe ${themeKey} İsimleri`);
        const title = `${themeTitle} - ${g.label}`;
        const desc = `${themeTitle} kategorisindeki en güzel Kürtçe ${g.label} listeleniyor.`;

        const targetTag = themeTags[themeKey];
        const combinedList = allNames.filter(n => g.filter(n) && n.tags?.includes(targetTag));
        combinedList.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

        const listHTML = combinedList.map(n => `
          <div class="name-list-item">
            <a href="${generatePath(lang, 'name', n.id)}" class="${n.gender === 'female' ? 'name-link-female' : 'name-link-male'}">${n.name}</a>
            <span class="name-list-meaning">${getLocalizedMeaning(n, lang)?.slice(0, 48)}...</span>
          </div>
        `).join('\n');

        const content = `
          <h1 class="page-title">${title}</h1>
          <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-muted); margin-bottom: 2rem;">${desc}</p>
          <h2 class="section-heading">${title} (${combinedList.length})</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
            ${listHTML}
          </div>
        `;

        const bodyHtml = renderLayout(lang, content, {
          pageTitle: title,
          pageDesc: desc,
          canonicalUrl: canonical,
          alternates: alternates
        });

        const finalHtml = replaceHeadMetadata(templateHtml, {
          title: `${title} | KurdishName`,
          description: desc,
          canonical: canonical,
          lang: lang,
          alternates: alternates,
          schemas: []
        }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

        const outPath = path.join(distDir, `${lang}/${categorySegment}/${g.segment}/${themeSlug}/index.html`);
        safeWriteFile(outPath, finalHtml, canonical);
      });
    });
  });

  // ──── PHASE 4: BLOG REGISTRY & INDIVIDUAL BLOG POSTS ────
  console.log('⌛ Pre-rendering Blog Lists & Posts...');
  LANGUAGES.forEach(lang => {
    const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);
    const routes = routeTranslations[lang];
    const blogSegment = routes.blog;

    // A. Blog Listing page
    {
      const canonical = `${DOMAIN}/${lang}/${blogSegment}`;
      const alternates = LANGUAGES.map(l => ({ lang: l, url: `${DOMAIN}/${l}/${routeTranslations[l].blog}` }));
      const title = t('blog_title', 'Blog');
      const desc = t('seo_blog_desc', 'Kürtçe isim kültürü ve Mezopotamya isim etimolojisi.');

      const postsHTML = blogPosts.map((post, idx) => {
        const pTitle = post.titles[lang] || post.titles['tr'];
        const pDesc = post.descriptions[lang] || post.descriptions['tr'];
        const pSlug = post.slugs[lang] || post.slugs['en'] || post.id;
        const detailPath = generatePath(lang, 'blog', pSlug);

        return `
          <article class="bento-box" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--border); border-radius: var(--r-lg); background: var(--surface);">
            <div style="background: linear-gradient(135deg, var(--accent)05, var(--accent)10); padding: 2rem 1.5rem; border-radius: var(--r-md); margin-bottom: 1rem; text-align: center;">
              <strong style="color: var(--accent); font-size: 1.5rem; font-family: var(--font-serif); font-weight: 800;">KN</strong>
            </div>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.3;">
                <a href="${detailPath}" style="color: var(--text); text-decoration: none;">${pTitle}</a>
              </h2>
              <p style="font-size: 0.75rem; color: var(--text-faint); font-weight: 600; margin-bottom: 0.75rem;">${post.date} &bull; ${post.author}</p>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">${pDesc}</p>
            </div>
            <a href="${detailPath}" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.6rem 1.25rem; background: var(--surface-2); color: var(--text); font-weight: 700; font-size: 0.8rem; border-radius: var(--r-sm); text-decoration: none;">
              ${t('blog_read_more', 'Devamını Oku')}
            </a>
          </article>
        `;
      }).join('\n');

      const content = `
        <h1 class="page-title">${title}</h1>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
          ${postsHTML}
        </div>
      `;

      const bodyHtml = renderLayout(lang, content, {
        pageTitle: title,
        pageDesc: desc,
        canonicalUrl: canonical,
        alternates: alternates
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${title} | KurdishName`,
        description: desc,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: []
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${blogSegment}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    }

    // B. Individual Blog Posts
    blogPosts.forEach(post => {
      const pTitle = post.titles[lang] || post.titles['tr'];
      const pDesc = post.descriptions[lang] || post.descriptions['tr'];
      const pSlug = post.slugs[lang] || post.slugs['en'] || post.id;
      const canonical = `${DOMAIN}/${lang}/${blogSegment}/${pSlug}`;
      const alternates = LANGUAGES.map(l => {
        const slug = routeTranslations[l].blog + '/' + (post.slugs[l] || post.slugs['en'] || post.id);
        return { lang: l, url: `${DOMAIN}/${l}/${slug}` };
      });

      // Load post markdown JSON file safely
      let postContentHtml = '';
      const contentFilePath = path.join(__dirname, `../src/data/blog/${lang}/${post.id}.json`);
      if (fs.existsSync(contentFilePath)) {
        try {
          const payload = JSON.parse(fs.readFileSync(contentFilePath, 'utf-8'));
          const rawMarkdown = payload.content || payload.contentPayload || '';
          const linkedMarkdown = injectInternalLinks(rawMarkdown, allNames, lang);
          postContentHtml = simpleMarkdownToHtml(linkedMarkdown);
        } catch (e) {
          postContentHtml = `<p style="color: var(--text-muted);">Content is loading dynamically inside client side engine.</p>`;
        }
      } else {
        postContentHtml = `<p style="color: var(--text-muted);">Content is loading dynamically inside client side engine.</p>`;
      }

      // Breadcrumb
      const breadcrumbHTML = `
        <nav style="font-size: 0.75rem; color: var(--text-faint); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.3rem;">
          <a href="${generatePath(lang, null)}" style="color: var(--accent); text-decoration: none;">KurdishName</a>
          <span>›</span>
          <a href="${generatePath(lang, 'blog')}" style="color: var(--accent); text-decoration: none;">${t('blog_title', 'Blog')}</a>
          <span>›</span>
          <span style="color: var(--text-muted); font-weight: 600;">${pTitle}</span>
        </nav>
      `;

      // Static internal silo box for blog crawlability
      const isPostGirl = post.id.includes('kiz') || post.id.includes('girls') || post.id.includes('maedchen') || post.id.includes('flower');
      const targetCat = isPostGirl ? 'kiz' : 'erkek';
      const targetCatName = isPostGirl ? t('nav_girls') : t('nav_boys');
      const linkSiloHTML = `
        <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.25rem; margin: 2rem 0; display: flex; align-items: flex-start; gap: 0.875rem;">
          <span style="font-size: 1.25rem;">🔗</span>
          <p style="font-size: 0.9rem; margin: 0; color: var(--text-muted); line-height: 1.6;">
            ${t('blog_silo_prefix', 'Discover all meanings, origins, and etymology indexes inside our comprehensive list of ')}
            <a href="${generatePath(lang, 'category', targetCat)}" style="color: var(--accent); font-weight: 700; text-decoration: underline;">
              ${targetCatName}
            </a>${t('blog_silo_suffix', '. Comparison modules and advanced finder tools are synchronized.')}
          </p>
        </div>
      `;

      const content = `
        ${breadcrumbHTML}
        <article style="max-width: 800px; margin-inline: auto;">
          <h1 style="font-family: var(--font-serif); font-size: clamp(1.8rem, 5vw, 2.75rem); font-weight: 900; line-height: 1.2; letter-spacing: -0.02em; color: var(--text); margin-bottom: 0.75rem;">${pTitle}</h1>
          <p style="font-size: 0.8rem; color: var(--text-faint); font-weight: 600; margin-bottom: 2.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
            ${post.date} &bull; By ${post.author}
          </p>

          <div style="font-size: 1.05rem; line-height: 1.8; color: var(--text); select: text;">
            ${postContentHtml}
          </div>

          ${linkSiloHTML}
        </article>
      `;

      const bodyHtml = renderLayout(lang, content, {
        pageTitle: pTitle,
        pageDesc: pDesc,
        canonicalUrl: canonical,
        alternates: alternates
      });

      // Prepare Blog Schema
      const blogSchema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': pTitle,
        'description': pDesc,
        'datePublished': post.date,
        'author': {
          '@type': 'Organization',
          'name': 'KurdishName'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'KurdishName',
          'logo': {
            '@type': 'ImageObject',
            'url': `${DOMAIN}/logo.png`
          }
        },
        'mainEntityOfPage': canonical
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${pTitle} | KurdishName`,
        description: pDesc,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: [blogSchema]
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${blogSegment}/${pSlug}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    });
  });

  // ──── PHASE 5: DYNAMIC NAME DETAIL PAGES (40,956 pages) ────
  console.log('⌛ Pre-rendering Name Details (40k+ pages)... This runs in seconds!');
  const nameDetailStart = Date.now();

  // Create an in-memory index by gender and letter to speed up Similar Names search
  const namesByGenderAndLetter: Record<string, Record<string, any[]>> = {
    female: {},
    male: {},
    unisex: {}
  };

  allNames.forEach(n => {
    const gen = n.gender || 'female';
    const letter = (n.letter || 'A').toUpperCase().trim();
    if (!namesByGenderAndLetter[gen]) {
      namesByGenderAndLetter[gen] = {};
    }
    if (!namesByGenderAndLetter[gen][letter]) {
      namesByGenderAndLetter[gen][letter] = [];
    }
    namesByGenderAndLetter[gen][letter].push(n);
  });

  // Helper to find alike names statically in O(1) matching NameDetail.tsx score logic
  function getAlikeNamesStatic(found: any): any[] {
    const gen = found.gender || 'female';
    const letter = (found.letter || 'A').toUpperCase().trim();
    const candidatePool = namesByGenderAndLetter[gen][letter] || [];
    
    // Sort and calculate score matching exactly NameDetail.tsx scoring rules
    const scored = candidatePool
      .filter(n => n.id !== found.id)
      .map(n => {
        let score = 0;
        if (n.letter === found.letter) score += 10;
        if (n.origin === found.origin) score += 20;
        if (n.tags && found.tags) {
          const shared = n.tags.filter((t: string) => found.tags?.includes(t));
          score += shared.length * 5;
        }
        return { ...n, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return scored;
  }

  // Richness score helper to rank names for static generation prioritization
  function getNameRichnessScore(n: any): number {
    let score = 0;
    if (n.meaning) score += n.meaning.length * 1.5;
    if (n.meaning_en) score += n.meaning_en.length * 1.0;
    if (n.meaning_de) score += n.meaning_de.length * 1.0;
    if (n.meaning_ar) score += n.meaning_ar.length * 1.0;
    if (n.description) score += n.description.length * 1.0;
    if (n.tags && n.tags.length > 0) score += n.tags.length * 20;
    return score;
  }

  // Pre-calculate and sort names to find the top zengin ones
  const namesSortedByRichness = [...allNames]
    .map(n => ({ id: n.id, score: getNameRichnessScore(n) }))
    .sort((a, b) => b.score - a.score);

  const top3000Tr = new Set(namesSortedByRichness.slice(0, 3000).map(n => n.id));
  const top1000De = new Set(namesSortedByRichness.slice(0, 1000).map(n => n.id));
  const top1000Ar = new Set(namesSortedByRichness.slice(0, 1000).map(n => n.id));

  // Pre-generate all name details loop
  let counter = 0;
  for (const nameItem of allNames) {
    const encodedId = encodeURIComponent(nameItem.id);
    const isFemale = nameItem.gender === 'female';
    const isUnisex = nameItem.gender === 'unisex';

    // Get alike names statically
    const alikeNames = getAlikeNamesStatic(nameItem);

    LANGUAGES.filter(lang => {
      if (lang === 'en') return true; // en points to all names
      if (lang === 'tr' && top3000Tr.has(nameItem.id)) return true;
      if (lang === 'de' && top1000De.has(nameItem.id)) return true;
      if (lang === 'ar' && top1000Ar.has(nameItem.id)) return true;
      return false;
    }).forEach(lang => {
      const t = (key: string, fallback?: string) => getTranslation(lang, key, fallback);
      const routes = routeTranslations[lang];
      const nameSegment = routes.name;
      const canonical = `${DOMAIN}/${lang}/${nameSegment}/${encodedId}`;

      const alternates = LANGUAGES.map(l => ({
        lang: l,
        url: `${DOMAIN}/${l}/${routeTranslations[l].name}/${encodedId}`
      }));

      // Gather translation fields
      const meaning = getLocalizedMeaning(nameItem, lang);
      const origin = getLocalizedOrigin(nameItem.origin, lang);
      const genderText = isUnisex ? t('gender_unisex', 'Unisex') : (isFemale ? t('gender_female', 'Kız') : t('gender_male', 'Erkek'));
      const genderColor = isUnisex ? 'var(--accent)' : (isFemale ? 'var(--female)' : 'var(--male)');

      const description = buildMetaDescription(lang, nameItem.name, genderText, origin, meaning);

      // Render Breadcrumbs
      const targetGenderSegment = isFemale ? 'kiz' : 'erkek';
      const breadcrumbHTML = `
        <nav style="font-size: 0.75rem; color: var(--text-faint); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.3rem;">
          <a href="${generatePath(lang, null)}" style="color: var(--accent); text-decoration: none;">KurdishName</a>
          <span>›</span>
          <a href="${generatePath(lang, 'category', targetGenderSegment)}" style="color: var(--accent); text-decoration: none;">
            ${isUnisex ? t('gender_unisex', 'Unisex') : (isFemale ? t('nav_girls') : t('nav_boys'))}
          </a>
          <span>›</span>
          <span style="color: ${genderColor}; font-weight: 700;">${nameItem.name}</span>
        </nav>
      `;

      // Render Hero Section
      const heroHTML = `
        <section style="background: linear-gradient(135deg, ${genderColor}05, ${genderColor}10); border: 1px solid ${genderColor}20; border-radius: var(--r-xl); padding: clamp(2rem, 8vw, 4rem) 2rem; margin-bottom: 3rem; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10%; right: -5%; font-size: 12rem; font-weight: 900; opacity: 0.03; color: ${genderColor}; pointer-events: none;">
            ${nameItem.letter || nameItem.name.charAt(0)}
          </div>
          <div style="position: relative; z-index: 1;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: ${genderColor}15; color: ${genderColor}; margin-bottom: 1.5rem; font-size: 2rem; font-weight: 800;">
              ${nameItem.letter || nameItem.name.charAt(0)}
            </div>
            <h1 style="font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 900; color: ${genderColor}; margin-bottom: 0.5rem; letter-spacing: -0.04em;">
              ${nameItem.name}
            </h1>
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <span class="${isUnisex ? 'badge-unisex' : (isFemale ? 'badge-female' : 'badge-male')}" style="padding: 0.5rem 1.25rem; border-radius: 100px; background: ${genderColor}15; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
                ${genderText}
              </span>
              <span style="padding: 0.5rem 1.25rem; border-radius: 100px; background: var(--surface-2); color: var(--text-muted); font-size: 0.875rem; font-weight: 600;">
                ${origin}
              </span>
            </div>
          </div>
        </section>
      `;

      // Render Alike names sidebar list for crawlability
      const alikeHTML = alikeNames.length > 0 ? `
        <div style="background: var(--surface); padding: 1.5rem; border-radius: var(--r-lg); border: 1px solid var(--border);">
          <h3 style="font-size: 1rem; font-weight: 800; margin-bottom: 1rem;">${t('detail_similar_rich', 'Benzer İsimler')?.replaceAll('{{name}}', nameItem.name).replaceAll('{{genderText}}', genderText)}</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${alikeNames.slice(0, 5).map(an => `
              <a href="${generatePath(lang, 'name', an.id)}" style="display: block; padding: 0.75rem; border-radius: var(--r-sm); background: var(--bg); text-decoration: none; color: var(--text); font-size: 0.875rem; font-weight: 600; border: 1px solid var(--border-dim);">
                ${an.name}
              </a>
            `).join('\n')}
          </div>
        </div>
      ` : '';

      // Link Silo Card
      const linkSiloCardHTML = `
        <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.25rem; margin-top: 2rem; margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.875rem;">
          <span style="font-size: 1.25rem;">🔗</span>
          <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); margin: 0;">
            ${t('name_silo_prefix', 'Bebeğiniz için anlamlı bir ad arıyorsanız, daha fazla ')}
            <a href="${generatePath(lang, 'category', targetGenderSegment)}" style="color: ${genderColor}; font-weight: 700; text-decoration: underline;">
              ${isFemale ? t('nav_girls') : t('nav_boys')}
            </a>
            ${t('name_silo_suffix', ' rehberimizi keşfedin, köken ve telaffuz analizlerini yan yana karşılaştırın.')}
          </p>
        </div>
      `;

      // Render FAQs
      const faqs = [
        {
          question: lang === 'tr' ? `${nameItem.name} isminin anlamı nedir?` : `What is the meaning of the name ${nameItem.name}?`,
          answer: lang === 'tr' ? `${nameItem.name} ismi; ${origin} kökenli bir isim olup, şu anlama gelmektedir: ${meaning}` : `The name ${nameItem.name} is of ${origin} origin and is defined as: ${meaning}`
        },
        {
          question: lang === 'tr' ? `${nameItem.name} isminin kökeni nedir?` : `What is the origin of the name ${nameItem.name}?`,
          answer: lang === 'tr' ? `${nameItem.name} isminin kökeni ${origin} kökenlidir ve geleneksel Kürt kültürü ile derin bağlara sahiptir.` : `The name ${nameItem.name} originates from ${origin} cultural and historical roots.`
        }
      ];

      const faqsHTML = faqs.map((faq, index) => `
        <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 0.75rem;">
          <div style="width: 100%; padding: 1.125rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 0.95rem; color: var(--text);">
            <span>${faq.question}</span>
          </div>
          <div style="padding: 0.875rem 1.5rem 1.25rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
            ${faq.answer}
          </div>
        </div>
      `).join('\n');

      const nameContent = `
        ${breadcrumbHTML}
        ${heroHTML}

        <div style="display: grid; grid-template-columns: 1fr 300px; gap: 2.5rem; align-items: flex-start;">
          <!-- Main details block -->
          <div style="min-width: 0;">
            <section style="background: var(--surface); padding: 2.5rem; border-radius: var(--r-lg); border: 1px solid var(--border); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); margin-bottom: 2rem;">
              <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; color: var(--text);">
                ${nameItem.name} ${t('detail_meaning', 'İsminin Anlamı')}
              </h2>
              <p style="font-size: 1.25rem; line-height: 1.7; color: var(--text); margin-bottom: 2rem; font-weight: 500;">
                ${meaning}
              </p>
              <div style="padding: 1.5rem; background: var(--bg); border-radius: var(--r-md); border-left: 4px solid ${genderColor};">
                <p style="font-size: 0.9375rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
                  ${description}
                </p>
              </div>
            </section>

            <!-- Quick info tags -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
              <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);">
                <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-faint); margin-bottom: 0.5rem; font-weight: 700;">${t('detail_gender')}</h4>
                <p style="font-weight: 700; color: ${genderColor};">${genderText}</p>
              </div>
              <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);">
                <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-faint); margin-bottom: 0.5rem; font-weight: 700;">${t('detail_origin')}</h4>
                <p style="font-weight: 700;">${origin}</p>
              </div>
              <div style="padding: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-md);">
                <h4 style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-faint); margin-bottom: 0.5rem; font-weight: 700;">${t('detail_letter')}</h4>
                <p style="font-weight: 700;">${nameItem.letter || nameItem.name.charAt(0)}</p>
              </div>
            </div>

            <!-- Silo Link Card -->
            ${linkSiloCardHTML}

            <!-- FAQ Section -->
            <section style="margin-top: 3rem;">
              <h2 class="section-heading" style="margin-bottom: 1.25rem;">
                ${t('faq_title', 'Sıkça Sorulan Sorular')?.replace('{{name}}', nameItem.name)}
              </h2>
              ${faqsHTML}
            </section>
          </div>

          <!-- Sidebar section -->
          <aside style="position: sticky; top: 2rem;">
            ${alikeHTML}
          </aside>
        </div>
      `;

      const bodyHtml = renderLayout(lang, nameContent, {
        pageTitle: nameItem.name,
        pageDesc: description,
        canonicalUrl: canonical,
        alternates: alternates
      });

      // DefinedTerm Schema
      const definedTermSchema = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        'name': nameItem.name,
        'description': description,
        'inLanguage': 'ku',
        'termCode': nameItem.id.toString(),
        'url': canonical,
        'mainEntityOfPage': canonical,
        'inDefinedTermSet': {
          '@type': 'DefinedTermSet',
          'name': 'KurdishName Dictionary',
          'description': 'Comprehensive dictionary of Kurdish names, meanings, and origins.',
          'url': 'https://kurdishname.com'
        }
      });

      const finalHtml = replaceHeadMetadata(templateHtml, {
        title: `${t('seo_name_title', { name: nameItem.name })?.replaceAll('{{name}}', nameItem.name)} | KurdishName`,
        description: description,
        canonical: canonical,
        lang: lang,
        alternates: alternates,
        schemas: [definedTermSchema]
      }).replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

      const outPath = path.join(distDir, `${lang}/${nameSegment}/${encodedId}/index.html`);
      safeWriteFile(outPath, finalHtml, canonical);
    });

    counter++;
    if (counter % 2000 === 0) {
      console.log(`  ✓ Pre-rendered ${counter}/${allNames.length} names...`);
    }
  }

  const end = Date.now();
  const nameDetailEnd = Date.now();
  console.log(`\n🎉 SSG Prerendering Completed successfully in ${((end - start) / 1000).toFixed(1)} seconds!`);
  console.log(`  - Homepages Pre-rendered: 4 pages`);
  console.log(`  - Static Pages Pre-rendered: ${staticKeys.length * LANGUAGES.length} pages`);
  console.log(`  - Categories & Themes Pre-rendered: ${28} pages`);
  console.log(`  - Blog Listings & Posts Pre-rendered: ${(1 + blogPosts.length) * LANGUAGES.length} pages`);
  console.log(`  - Dynamic Names Pre-rendered: ${allNames.length * LANGUAGES.filter(lang => lang === 'en').length} pages (took ${((nameDetailEnd - nameDetailStart) / 1000).toFixed(1)} seconds)`);
}

runSSGPrerendering().catch((error) => {
  console.error('❌ Critical Error during SSG Prerendering:', error);
  process.exit(1);
});
