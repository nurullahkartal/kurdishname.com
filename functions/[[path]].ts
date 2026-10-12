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

  // 1b. Query parameter cleanup: remove literal template placeholders (Soft 404 fix)
  if (url.search.includes('{search_term_string}') || url.search.includes('%7Bsearch_term_string%7D')) {
    const cleanUrl = new URL(context.request.url);
    cleanUrl.search = '';
    cleanUrl.pathname = cleanUrl.pathname.length > 1 ? cleanUrl.pathname.replace(/\/$/, '') : cleanUrl.pathname;
    return Response.redirect(cleanUrl.toString(), 301);
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

  // 3b. /widget endpoints (removed legacy feature) -> 410 Gone with noindex, follow (Soft 404 fix)
  if (path === '/widget' || path.endsWith('/widget') || path.includes('/widget/')) {
    return new Response(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, follow" /><title>410 Gone</title></head><body style="font-family:sans-serif;text-align:center;padding:50px"><h1>410 Gone</h1><p>Widget feature is no longer available.</p><a href="/">← Return to Homepage</a></body></html>`,
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, follow',
          'Cache-Control': 'public, max-age=86400'
        }
      }
    );
  }

  // 3c. Unlocalized /favorites URLs -> 301 Permanent Redirect to localized favorites route
  if (path.match(/^\/(tr|en|de|ar)\/favorites$/i) || path === '/favorites') {
    const targetMap: Record<string, string> = {
      tr: '/tr/favorilerim',
      en: '/en/my-favorites',
      de: '/de/meine-favoriten',
      ar: '/ar/%D9%85%D9%81%D8%B6%D9%84%D8%AA%D9%8A'
    };
    const targetLang = path.startsWith('/en') ? 'en' : (path.startsWith('/de') ? 'de' : (path.startsWith('/ar') ? 'ar' : 'tr'));
    return Response.redirect(`${DOMAIN}${targetMap[targetLang] || '/tr/favorilerim'}`, 301);
  }

  // 4. Dynamic Name Detail SSR via Cloudflare KV
  // Matches: /tr/isim/{slug}, /en/name/{slug}, /de/name/{slug}, /ar/اسم/{slug}
  const nameMatch = path.match(/^\/(tr|en|de|ar)\/(isim|name|%D8%A7%D8%B3%D9%85|اسم)\/([^/]+)$/);
  if (nameMatch) {
    const [, lang, typeSegment, rawSlug] = nameMatch;
    return await renderNamePage(context, lang, typeSegment, rawSlug);
  }

  // 5. Pre-rendered static pages & SPA fallback
  const response = await context.next();

  // Attach X-Robots-Tag: noindex, follow to internal search results or user favorite pages
  if (url.searchParams.has('q') || path.includes('favori') || path.includes('favorite') || path.includes('%D9%85%D9%81%D8%B6%D9%84%D8%AA%D9%8A')) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Robots-Tag', 'noindex, follow');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }

  return response;
};

/**
 * Farklı yazım/encoding varyasyonlarını tek bir "canonical" forma indirger.
 * afrinî, afrini, afrinÎ, afrin → afrin
 * serko_3, serko-2, serko → serko
 */
function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // combining diacritics
    .replace(/î/g, "i")
    .replace(/ê/g, "e")
    .replace(/û/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[-_]\d+$/, "")            // _2, _3, -2 suffix'lerini sil
    .replace(/[^a-z0-9\u0600-\u06FF]/g, ""); // alfanümerik & arapça dışını sil
}

const LETTER_CACHE = new Map<string, Map<string, any>>();

const BASE_TO_LETTERS: Record<string, string[]> = {
  C: ['C', 'Ç'],
  E: ['E', 'Ê'],
  I: ['I', 'Î'],
  S: ['S', 'Ş'],
  U: ['U', 'Û']
};

async function lookupNameFromAssetsOrKV(
  context: EventContext<Env, any, any>,
  lang: string,
  slug: string
): Promise<any | null> {
  if (!slug || !/^[a-z0-9_-]+$/.test(slug)) {
    // Non-ASCII slug: check KV directly if available
    const raw = await kvGetSafe(context.env.NAMES_KV, `name:${lang}:${slug}`, 500, 1)
      || await kvGetSafe(context.env.NAMES_KV, `name:${slug}`, 500, 1);
    if (raw) {
      try { return JSON.parse(raw); } catch (_) {}
    }
    return null;
  }

  const firstChar = slug.charAt(0).toUpperCase();
  const candidateLetters = BASE_TO_LETTERS[firstChar] || [firstChar];

  if (context.env.ASSETS) {
    let assetsLoaded = false;
    for (const letter of candidateLetters) {
      let map = LETTER_CACHE.get(letter);
      if (!map) {
        try {
          const assetUrl = new URL(`/data/names/${encodeURIComponent(letter)}.json`, context.request.url);
          const res = await context.env.ASSETS.fetch(new Request(assetUrl.toString()));
          if (res.ok) {
            const arr: any[] = await res.json();
            map = new Map<string, any>();
            for (const item of arr) {
              if (item && item.id) {
                map.set(String(item.id).toLowerCase(), item);
              }
            }
            LETTER_CACHE.set(letter, map);
          }
        } catch (err) {
          console.error(`[ASSETS] Failed to load ${letter}.json`, err);
        }
      }
      if (map) {
        assetsLoaded = true;
        const found = map.get(slug);
        if (found) return found;
      }
    }
    // If ASSETS loaded the authoritative letter JSONs and the slug isn't in them, it does not exist
    if (assetsLoaded) {
      return null;
    }
  }

  // Fallback to KV if ASSETS binding is not present
  const kv = context.env.NAMES_KV;
  const raw = await kvGetSafe(kv, `name:${lang}:${slug}`, 500, 1)
    || await kvGetSafe(kv, `name:${slug}`, 500, 1);
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }
  return null;
}

async function renderNamePage(
  context: EventContext<Env, any, any>,
  lang: string,
  typeSegment: string,
  rawSlug: string
): Promise<Response> {
  const decodedSlug = decodeURIComponent(rawSlug).trim().toLowerCase();

  // 1. Direct lookup from static CDN JSON (or KV fallback)
  let nameData: any = await lookupNameFromAssetsOrKV(context, lang, decodedSlug);

  if (!nameData) {
    // Fallback 1: Normalize edilmiş slug ile ara
    const normalized = normalizeSlug(decodedSlug);
    if (normalized !== decodedSlug && normalized.length > 0) {
      const alt = await lookupNameFromAssetsOrKV(context, lang, normalized);
      if (alt) {
        const canonicalSlug = alt.id || normalized;
        return Response.redirect(
          `${DOMAIN}/${lang}/${typeSegment}/${encodeURIComponent(canonicalSlug)}`,
          301
        );
      }
    }

    // Fallback 1b: Sondaki 'i' ekini silip dene (nisba eki varyasyonu: afrini -> afrin)
    const noTrailingI = normalized.replace(/i$/, "");
    if (noTrailingI !== normalized && noTrailingI.length > 2) {
      const alt2 = await lookupNameFromAssetsOrKV(context, lang, noTrailingI);
      if (alt2) {
        const canonicalSlug2 = alt2.id || noTrailingI;
        return Response.redirect(
          `${DOMAIN}/${lang}/${typeSegment}/${encodeURIComponent(canonicalSlug2)}`,
          301
        );
      }
    }

    // Fallback 2: Sondaki _2, _3, -2, -3 suffix'lerini sil ve dene
    const suffixStripped = decodedSlug.replace(/[-_]\d+$/, "");
    if (suffixStripped !== decodedSlug && suffixStripped.length > 0) {
      const base = await lookupNameFromAssetsOrKV(context, lang, suffixStripped);
      if (base) {
        const canonicalSlug = base.id || suffixStripped;
        return Response.redirect(
          `${DOMAIN}/${lang}/${typeSegment}/${encodeURIComponent(canonicalSlug)}`,
          301
        );
      }
    }

    // Fallback 3: Kalıcı olarak silinmiş / bulunamayan içerik için 410 Gone dön (Google hızlı siler)
    const s = ssrStrings(lang);
    const isRtl = lang === 'ar';
    const goneTitle = lang === 'tr' ? '410 Gone — İsim Mevcut Değil' :
                      lang === 'de' ? '410 Gone — Name nicht mehr verfügbar' :
                      lang === 'ar' ? '410 Gone — هذا الاسم لم يعد متوفراً' :
                      '410 Gone — Name No Longer Available';
    const goneHeading = lang === 'tr' ? 'Bu isim artık mevcut değil' :
                        lang === 'de' ? 'Dieser Name ist nicht mehr verfügbar' :
                        lang === 'ar' ? 'هذا الاسم لم يعد متوفراً' :
                        'This name is no longer available';
    const goneBody = lang === 'tr' ? 'Aradığınız isim arşivimizden kalıcı olarak kaldırılmıştır veya güncellenmiştir.' :
                     lang === 'de' ? 'Der gesuchte Name wurde dauerhaft aus unserem Verzeichnis entfernt.' :
                     lang === 'ar' ? 'تمت إزالة هذا الاسم بشكل دائم من دليلنا.' :
                     'The requested name has been permanently removed from our directory.';

    const goneHtml = `<!doctype html>
<html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <title>${goneTitle} — KurdishName</title>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <style>
      body{margin:0;background:#0b0f19;color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}
      .box{max-width:480px}
      h1{font-size:3.5rem;margin:0;color:#ef4444}
      h2{font-size:1.25rem;margin:.5rem 0 1rem}
      p{color:#9ca3af;line-height:1.6}
      a{display:inline-block;margin-top:1.5rem;padding:.75rem 1.5rem;background:#4f46e5;color:#fff;text-decoration:none;border-radius:.5rem;font-weight:700}
    </style>
  </head>
  <body>
    <div class="box">
      <h1>410</h1>
      <h2>${goneHeading}</h2>
      <p>${goneBody}</p>
      <a href="/${lang}">← ${s.home}</a>
    </div>
  </body>
</html>`;

    return new Response(goneHtml, {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
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

  const canonicalUrl = `${DOMAIN}/${lang}/${typeSegment}/${encodeURIComponent(decodedSlug)}`.replace(/\/$/, "");

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

        <!-- Internal Silo Navigation Link & Category Exploration -->
        <div class="card" style="display:flex; flex-direction:column; gap:1rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span style="font-size:1.5rem;">🔗</span>
            <p style="margin:0; font-size:0.9375rem; color:var(--text-muted);">
              ${ssrStrings(lang).discoverPrefix}
              <a href="/${lang}/kategori/${targetCategorySegment}" class="silo-link">${ssrStrings(lang).categoryLabel} ${genderText}</a>
              ${ssrStrings(lang).discoverSuffix}
            </p>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; pt:0.5rem; border-top:1px solid var(--surface-2); padding-top:0.75rem;">
            <a href="/${lang}/kategori/${targetCategorySegment}/${encodeURIComponent((name[0] || 'A').toUpperCase())}" style="font-size:0.8125rem; color:var(--accent); text-decoration:none; padding:0.35rem 0.75rem; background:var(--surface-2); border-radius:0.375rem; border:1px solid var(--border);">
              🔤 ${ssrStrings(lang).categoryLabel} ${genderText} (${(name[0] || 'A').toUpperCase()})
            </a>
            <a href="/${lang}/kategori/${isFemale ? (routeSegments[lang]?.boys || 'erkek') : (routeSegments[lang]?.girls || 'kiz')}" style="font-size:0.8125rem; color:var(--text-muted); text-decoration:none; padding:0.35rem 0.75rem; background:var(--surface-2); border-radius:0.375rem; border:1px solid var(--border);">
              👥 ${isFemale ? ssrStrings(lang).boys : ssrStrings(lang).girls}
            </a>
            <a href="/${lang}/blog/${isFemale ? (lang === 'tr' ? 'kuranda-gecen-kurtce-kiz-isimleri-ve-anlamlari' : lang === 'en' ? 'kurdish-islamic-girl-names-and-quranic-analysis' : lang === 'de' ? 'kurdische-islamische-maedchennamen-bedeutung' : 'اسماء-بنات-كردية-اسلامية-ومعانيها') : (lang === 'tr' ? 'eski-ve-tarihi-kurt-erkek-isimleri-ve-kokenleri' : lang === 'en' ? 'ancient-and-historical-kurdish-boy-names' : lang === 'de' ? 'alte-und-historische-kurdische-jungennamen' : 'اسماء-ذكور-كردية-قديمة-وتاريخية')}" style="font-size:0.8125rem; color:#10b981; text-decoration:none; padding:0.35rem 0.75rem; background:var(--surface-2); border-radius:0.375rem; border:1px solid var(--border);">
              📖 ${lang === 'tr' ? 'İsim Kültürü ve Anlam Rehberi' : lang === 'en' ? 'Cultural Heritage & Naming Guide' : lang === 'de' ? 'Namensratgeber & Kultur' : 'دليل التسمية والثقافة الكردية'}
            </a>
          </div>
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
