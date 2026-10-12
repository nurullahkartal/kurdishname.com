// Cloudflare Pages Functions - Full SSR & Edge Routing Engine
// Handles:
// 1. Static asset bypass
// 2. Trailing slash 301 canonical redirects
// 3. Dynamic Name SSR with Cloudflare KV (NAMES_KV)
// 4. Fallback to pre-rendered static pages & SPA

import { MAIN_SCRIPT_TAG, MAIN_STYLE_TAG } from './_assetManifest';

interface Env {
  NAMES_KV: KVNamespace;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

const DOMAIN = 'https://kurdishname.com';

// SSR tarafı i18n — React tarafına bağımlı olmadan çalışır
const SSR_STRINGS: Record<string, {
  home: string; girls: string; boys: string; faqHeading: string;
  meaningHeading: (n: string) => string;
  discoverPrefix: string; discoverSuffix: string;
  footerText: string; notFoundTitle: string; notFoundBody: string;
  categoryLabel: string;
}> = {
  tr: {
    home: 'Anasayfa',
    girls: 'Kız İsimleri',
    boys: 'Erkek İsimleri',
    faqHeading: 'Sıkça Sorulan Sorular',
    meaningHeading: (n) => `${n} İsminin Anlamı`,
    discoverPrefix: 'Daha fazla isim keşfetmek için kapsamlı',
    discoverSuffix: "'ni inceleyebilirsiniz.",
    footerText: 'Dünyanın en kapsamlı Kürtçe isim ansiklopedisi.',
    notFoundTitle: 'İsim Bulunamadı',
    notFoundBody: 'Aradığınız isim bulunamadı veya henüz veritabanımıza eklenmedi.',
    categoryLabel: 'Kürtçe'
  },
  en: {
    home: 'Home',
    girls: 'Girl Names',
    boys: 'Boy Names',
    faqHeading: 'Frequently Asked Questions',
    meaningHeading: (n) => `Meaning of the Name ${n}`,
    discoverPrefix: 'To discover more names, explore our comprehensive',
    discoverSuffix: 'guide.',
    footerText: "The world's most comprehensive Kurdish name encyclopedia.",
    notFoundTitle: 'Name Not Found',
    notFoundBody: 'The name you are looking for was not found or has not been added to our database yet.',
    categoryLabel: 'Kurdish'
  },
  de: {
    home: 'Startseite',
    girls: 'Mädchennamen',
    boys: 'Jungennamen',
    faqHeading: 'Häufig gestellte Fragen',
    meaningHeading: (n) => `Bedeutung des Namens ${n}`,
    discoverPrefix: 'Um weitere Namen zu entdecken, besuchen Sie unseren umfassenden',
    discoverSuffix: 'Ratgeber.',
    footerText: 'Die umfassendste Enzyklopädie kurdischer Namen der Welt.',
    notFoundTitle: 'Name nicht gefunden',
    notFoundBody: 'Der gesuchte Name wurde nicht gefunden oder ist noch nicht in unserer Datenbank.',
    categoryLabel: 'Kurdische'
  },
  ar: {
    home: 'الرئيسية',
    girls: 'أسماء البنات',
    boys: 'أسماء الأولاد',
    faqHeading: 'الأسئلة الشائعة',
    meaningHeading: (n) => `معنى اسم ${n}`,
    discoverPrefix: 'لاكتشاف المزيد من الأسماء، تصفح',
    discoverSuffix: 'الشامل.',
    footerText: 'الموسوعة الأكثر شمولاً للأسماء الكردية في العالم.',
    notFoundTitle: 'الاسم غير موجود',
    notFoundBody: 'الاسم الذي تبحث عنه غير موجود أو لم يُضف بعد إلى قاعدة بياناتنا.',
    categoryLabel: 'الكردية'
  }
};

function ssrStrings(lang: string) {
  return SSR_STRINGS[lang] || SSR_STRINGS.tr;
}

const routeSegments: Record<string, { name: string; girls: string; boys: string }> = {
  tr: { name: 'isim', girls: 'kiz', boys: 'erkek' },
  en: { name: 'name', girls: 'girls', boys: 'boys' },
  de: { name: 'name', girls: 'maedchen', boys: 'jungen' },
  ar: { name: 'اسم', girls: 'بنات', boys: 'ذكور' }
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // 1. Static assets bypass (JS, CSS, images, icons, robots, sitemaps)
  if (path.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|json|xml|txt|woff2?|map)$/i)) {
    return await context.next();
  }

  // 2. Trailing slash 301 Permanent Redirect (e.g. /tr/ -> /tr, /en/ -> /en, /tr/isim/bahoz/ -> /tr/isim/bahoz)
  if (path !== '/' && path.endsWith('/')) {
    const cleanUrl = new URL(context.request.url);
    cleanUrl.pathname = path.slice(0, -1);
    return Response.redirect(cleanUrl.toString(), 301);
  }

  // 3. Legacy /names/* 301 Permanent Redirect
  if (path.startsWith('/names/')) {
    const slug = path.replace('/names/', '');
    return Response.redirect(`${DOMAIN}/tr/isim/${slug}`, 301);
  }

  // 4. Dynamic Name Detail SSR via Cloudflare KV
  // Matches: /tr/isim/{slug}, /en/name/{slug}, /de/name/{slug}, /ar/اسم/{slug}
  const nameMatch = path.match(/^\/(tr|en|de|ar)\/(isim|name|%D8%A7%D8%B3%D9%85|اسم)\/([^/]+)$/);
  if (nameMatch) {
    const [, lang, typeSegment, rawSlug] = nameMatch;
    return await renderNamePage(context, lang, typeSegment, rawSlug);
  }

  // 5. Pre-rendered static pages & SPA fallback
  return await context.next();
};

async function renderNamePage(
  context: EventContext<Env, any, any>,
  lang: string,
  typeSegment: string,
  rawSlug: string
): Promise<Response> {
  const decodedSlug = decodeURIComponent(rawSlug).trim().toLowerCase();
  const kv = context.env.NAMES_KV;

  let nameData: any = null;

  // 1. Deneme: dile özel anahtar (timeout + retry korumalı)
  let raw = await kvGetSafe(kv, `name:${lang}:${decodedSlug}`, 500, 1);

  // 2. Fallback: dil-bağımsız anahtar
  if (!raw) {
    raw = await kvGetSafe(kv, `name:${decodedSlug}`, 500, 1);
  }

  if (raw) {
    try {
      nameData = JSON.parse(raw);
    } catch (parseErr) {
      console.error(`[KV] JSON parse failed for slug=${decodedSlug}`, parseErr);
    }
  }

  if (!nameData) {
    const s = ssrStrings(lang);
    const isRtl404 = lang === 'ar';
    const notFoundHtml = `<!doctype html>
<html lang="${lang}" dir="${isRtl404 ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <title>${s.notFoundTitle} — KurdishName</title>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <style>
      body{margin:0;background:#0b0f19;color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}
      .box{max-width:480px}
      h1{font-size:4rem;margin:0;color:#4f46e5}
      h2{font-size:1.25rem;margin:.5rem 0 1rem}
      p{color:#9ca3af;line-height:1.6}
      a{display:inline-block;margin-top:1.5rem;padding:.75rem 1.5rem;background:#4f46e5;color:#fff;text-decoration:none;border-radius:.5rem;font-weight:700}
    </style>
  </head>
  <body>
    <div class="box">
      <h1>404</h1>
      <h2>${s.notFoundTitle}</h2>
      <p>${s.notFoundBody}</p>
      <a href="/${lang}">← ${s.home}</a>
    </div>
  </body>
</html>`;
    return new Response(notFoundHtml, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'X-Robots-Tag': 'noindex, follow'
      }
    });
  }

  // Localized Fields
  const name = nameData.name || decodedSlug;
  const isFemale = nameData.gender === 'female';
  const isUnisex = nameData.gender === 'unisex';

  const genderTextMap: Record<string, { f: string; m: string; u: string }> = {
    tr: { f: 'Kız', m: 'Erkek', u: 'Unisex' },
    en: { f: 'Girl', m: 'Boy', u: 'Unisex' },
    de: { f: 'Mädchen', m: 'Jungen', u: 'Unisex' },
    ar: { f: 'بنات', m: 'ذكور', u: 'مشترك' }
  };
  const gMap = genderTextMap[lang] || genderTextMap.tr;
  const genderText = isUnisex ? gMap.u : (isFemale ? gMap.f : gMap.m);

  let meaning = nameData.meaning || '';
  if (lang === 'en' && nameData.meaning_en) meaning = nameData.meaning_en;
  else if (lang === 'de') meaning = nameData.meaning_de || nameData.meaning_en || nameData.meaning;
  else if (lang === 'ar') meaning = nameData.meaning_ar || nameData.meaning;

  const origin = nameData.origin || 'Kurdish';

  // Titles (Strictly under 60 characters for SERP)
  let title = `${name} Ne Demek? Kürtçe Anlamı ve Kökeni`;
  if (lang === 'en') title = `What Does ${name} Mean? Kurdish Name Origin & Meaning`;
  else if (lang === 'de') title = `${name} Bedeutung: Kurdischer ${genderText}name & Herkunft`;
  else if (lang === 'ar') title = `معنى اسم ${name}: المعنى والأصل بالكردية`;

  // Meta Descriptions (Strictly under 155 characters for SERP)
  let desc = `${name} Kürtçe'de ne anlama gelir? Anlamı, kökeni, kullanımı ve benzer isimler. Detaylı açıklama ve örnekler için tıkla.`;
  if (lang === 'en') desc = `What does ${name} mean in Kurdish? Discover the origin, meaning, gender, and pronunciation of ${name}. Full dictionary entry.`;
  else if (lang === 'de') desc = `Was bedeutet ${name} auf Kurdisch? Bedeutung, Herkunft, Aussprache und ähnliche Vornamen entdecken. Umfassendes Namenslexikon.`;
  else if (lang === 'ar') desc = `تعرف على معنى اسم ${name} باللغة الكردية، أصله، نطقه، وتفاصيل استخدامه في الثقافة الكردية.`;

  const canonicalUrl = `${DOMAIN}/${lang}/${typeSegment}/${encodeURIComponent(decodedSlug)}`;

  // Hreflang alternates
  const alternates = [
    { lang: 'tr', url: `${DOMAIN}/tr/isim/${encodeURIComponent(decodedSlug)}` },
    { lang: 'en', url: `${DOMAIN}/en/name/${encodeURIComponent(decodedSlug)}` },
    { lang: 'de', url: `${DOMAIN}/de/name/${encodeURIComponent(decodedSlug)}` },
    { lang: 'ar', url: `${DOMAIN}/ar/%D8%A7%D8%B3%D9%85/${encodeURIComponent(decodedSlug)}` },
    { lang: 'x-default', url: `${DOMAIN}/en/name/${encodeURIComponent(decodedSlug)}` }
  ];

  const hreflangsHtml = alternates
    .map(alt => `<link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />`)
    .join('\n    ');

  // FAQ generator
  const faqData = [
    {
      q: lang === 'tr' ? `${name} isminin anlamı nedir?` :
         lang === 'de' ? `Was bedeutet der Name ${name}?` :
         lang === 'ar' ? `ما هو معنى اسم ${name}؟` :
         `What is the meaning of the name ${name}?`,
      a: lang === 'tr' ? `${name} ismi ${origin} kökenli bir isim olup şu anlama gelmektedir: ${meaning}` :
         lang === 'de' ? `Der Name ${name} ist kurdischer Herkunft (${origin}) und bedeutet: ${meaning}` :
         lang === 'ar' ? `اسم ${name} من أصل ${origin} ومعناه: ${meaning}` :
         `The name ${name} is of ${origin} origin and is defined as: ${meaning}`
    },
    {
      q: lang === 'tr' ? `${name} isminin kökeni ve cinsiyeti nedir?` :
         lang === 'de' ? `Was sind Herkunft und Geschlecht von ${name}?` :
         lang === 'ar' ? `ما هو أصل وجنس اسم ${name}؟` :
         `What are the origin and gender of ${name}?`,
      a: lang === 'tr' ? `${name} ismi geleneksel olarak ${genderText} ismi olarak kullanılır ve kökeni ${origin}'dir.` :
         lang === 'de' ? `${name} wird traditionell als ${genderText}name verwendet und stammt aus der ${origin}-Kultur.` :
         lang === 'ar' ? `يستخدم اسم ${name} تقليدياً كاسم ${genderText} ويعود إلى أصول ${origin}.` :
         `${name} is traditionally used as a ${genderText} name of ${origin} cultural heritage.`
    }
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
    }))
  };

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    'name': name,
    'description': meaning,
    'inLanguage': 'ku',
    'termCode': nameData.id || decodedSlug,
    'url': canonicalUrl,
    'inDefinedTermSet': {
      '@type': 'DefinedTermSet',
      'name': 'KurdishName Dictionary',
      'url': DOMAIN
    }
  };

  const isRtl = lang === 'ar';
  const genderColor = isUnisex ? '#4f46e5' : (isFemale ? '#e11d48' : '#2563eb');
  const targetCategorySegment = isFemale ? (routeSegments[lang]?.girls || 'kiz') : (routeSegments[lang]?.boys || 'erkek');

  // SSR HTML Page with Inlined Critical CSS for Ultra-fast Performance
  const html = `<!doctype html>
<html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(desc)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    ${hreflangsHtml}
    
    <!-- Open Graph & Social -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(desc)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="KurdishName" />
    <meta property="og:image" content="${DOMAIN}/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- JSON-LD Schemas -->
    <script type="application/ld+json">${JSON.stringify(definedTermJsonLd)}</script>
    <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>

    ${MAIN_STYLE_TAG}
    
    <!-- Critical CSS for Instant SSR Layout (0 CLS) -->
    <style>
      :root {
        --bg: #0b0f19;
        --surface: #111827;
        --surface-2: #1f2937;
        --border: #374151;
        --text: #f9fafb;
        --text-muted: #9ca3af;
        --accent: #4f46e5;
      }
      body { margin: 0; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; }
      .container { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; }
      .nav-bar { border-bottom: 1px solid var(--border); padding: 1rem; background: var(--surface); display: flex; justify-content: space-between; align-items: center; }
      .brand { font-size: 1.25rem; font-weight: 800; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
      .hero { background: linear-gradient(135deg, rgba(31,41,55,0.7), rgba(17,24,39,0.9)); border: 1px solid var(--border); border-radius: 1rem; padding: 3rem 1.5rem; text-align: center; margin-bottom: 2rem; }
      .badge { display: inline-block; padding: 0.35rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; margin: 0.25rem; }
      .card { background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.75rem; margin-bottom: 1.5rem; }
      .meaning-text { font-size: 1.25rem; line-height: 1.7; font-weight: 500; color: #fff; }
      .faq-item { background: var(--surface-2); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem 1.25rem; margin-bottom: 0.75rem; }
      .faq-q { font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; color: #fff; }
      .faq-a { color: var(--text-muted); font-size: 0.9375rem; line-height: 1.6; }
      .silo-link { color: #818cf8; font-weight: 700; text-decoration: underline; }
    </style>
  </head>
  <body>
    <div id="root">
      <header class="nav-bar">
        <a href="/${lang}" class="brand">
          <img src="/logo.webp" width="32" height="32" alt="Logo" style="border-radius:6px;" />
          <span>KurdishName</span>
        </a>
        <nav style="display:flex; gap:1rem; font-size:0.875rem;">
          <a href="/${lang}" style="color:var(--text-muted); text-decoration:none;">${ssrStrings(lang).home}</a>
          <a href="/${lang}/kategori/${routeSegments[lang]?.girls || 'kiz'}" style="color:#f43f5e; text-decoration:none; font-weight:600;">${ssrStrings(lang).girls}</a>
          <a href="/${lang}/kategori/${routeSegments[lang]?.boys || 'erkek'}" style="color:#3b82f6; text-decoration:none; font-weight:600;">${ssrStrings(lang).boys}</a>
        </nav>
      </header>

      <main class="container">
        <!-- Breadcrumb -->
        <nav style="font-size:0.8125rem; color:var(--text-muted); margin-bottom:1.5rem;">
          <a href="/${lang}" style="color:var(--accent); text-decoration:none;">KurdishName</a> &gt;
          <a href="/${lang}/kategori/${targetCategorySegment}" style="color:var(--accent); text-decoration:none;">${genderText}</a> &rsaquo;
          <span style="color:#fff; font-weight:700;">${name}</span>
        </nav>

        <!-- Hero Section -->
        <section class="hero">
          <h1 style="font-size:3rem; font-weight:900; margin:0 0 1rem 0; color:${genderColor};">
            ${name}
          </h1>
          <div>
            <span class="badge" style="background:${genderColor}20; color:${genderColor}; border:1px solid ${genderColor}40;">
              ${genderText}
            </span>
            <span class="badge" style="background:var(--surface-2); color:var(--text-muted); border:1px solid var(--border);">
              ${origin}
            </span>
          </div>
        </section>

        <!-- Meaning Section -->
        <article class="card">
          <h2 style="font-size:1.25rem; font-weight:800; margin-top:0; margin-bottom:1rem; color:#fff;">
            ${escapeHtml(ssrStrings(lang).meaningHeading(name))}
          </h2>
          <p class="meaning-text">${escapeHtml(meaning)}</p>
          <div style="margin-top:1.5rem; padding:1rem; background:var(--surface-2); border-left:4px solid ${genderColor}; border-radius:0.375rem;">
            <p style="margin:0; font-size:0.9375rem; color:var(--text-muted);">${escapeHtml(desc)}</p>
          </div>
        </article>

        <!-- Internal Silo Navigation Link -->
        <div class="card" style="display:flex; align-items:center; gap:0.75rem;">
          <span style="font-size:1.5rem;">🔗</span>
          <p style="margin:0; font-size:0.9375rem; color:var(--text-muted);">
            ${ssrStrings(lang).discoverPrefix}
            <a href="/${lang}/kategori/${targetCategorySegment}" class="silo-link">${ssrStrings(lang).categoryLabel} ${genderText}</a>
            ${ssrStrings(lang).discoverSuffix}
          </p>
        </div>

        <!-- Localized FAQ Section -->
        <section class="card">
          <h2 style="font-size:1.25rem; font-weight:800; margin-top:0; margin-bottom:1.25rem; color:#fff;">
            ${ssrStrings(lang).faqHeading}
          </h2>
          ${faqData.map(f => `
            <div class="faq-item">
              <div class="faq-q">${escapeHtml(f.q)}</div>
              <div class="faq-a">${escapeHtml(f.a)}</div>
            </div>
          `).join('')}
        </section>
      </main>

      <footer style="border-top:1px solid var(--border); padding:2rem 1rem; text-align:center; font-size:0.8125rem; color:var(--text-muted);">
        <p>&copy; ${new Date().getFullYear()} KurdishName. ${ssrStrings(lang).footerText}</p>
      </footer>
    </div>

    <!-- Client Hydration Bundle (injected from dist/index.html at build time) -->
    ${MAIN_SCRIPT_TAG}
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400',
      'X-Edge-Rendered': 'Cloudflare-Functions-SSR-KV'
    }
  });
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// KV Dayanıklılık Katmanı — timeout + retry + graceful fallback
// ============================================================

/**
 * Promise'e üst sınır koyar. Süre aşılırsa fallback döner.
 * Cloudflare 30s sonra 522 döner; biz 500ms'de pes edip fallback'e düşeriz.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

/**
 * KV okumasını timeout + tek retry (exponential backoff) ile sarar.
 * Transient network hataları ve yavaş KV node'ları yutulur.
 */
async function kvGetSafe(
  kv: KVNamespace | undefined,
  key: string,
  timeoutMs = 500,
  retries = 1
): Promise<string | null> {
  if (!kv) return null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await withTimeout(kv.get(key), timeoutMs, null);
      return result;
    } catch (err) {
      if (attempt === retries) {
        console.error(`[KV] get failed after ${retries + 1} attempts: ${key}`, err);
        return null;
      }
      // 50ms → 100ms backoff
      await new Promise((r) => setTimeout(r, 50 * Math.pow(2, attempt)));
    }
  }
  return null;
}
