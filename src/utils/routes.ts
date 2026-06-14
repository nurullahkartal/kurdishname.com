export const routeTranslations = {
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

export const themeSlugs = {
  tr: { nature: 'doga', power: 'guc', beauty: 'guzellik', light: 'isik', wisdom: 'bilgelik' },
  en: { nature: 'nature', power: 'power', beauty: 'beauty', light: 'light', wisdom: 'wisdom' },
  de: { nature: 'natur', power: 'macht', beauty: 'schoenheit', light: 'licht', wisdom: 'weisheit' },
  ar: { nature: 'طبيعة', power: 'قوة', beauty: 'جمال', light: 'نور', wisdom: 'حكمة' }
} as const;

export type RouteKey = keyof typeof routeTranslations['tr'];

export const getRoutePath = (lang: string, key: RouteKey) => {
  const currentLangRoutes = routeTranslations[lang as keyof typeof routeTranslations] || routeTranslations['tr'];
  return (currentLangRoutes as any)[key] || (routeTranslations['tr'] as any)[key];
};

export const generatePath = (lang: string, key: RouteKey | null, param?: string, subParam?: string) => {
  if (!key) {
    return `/${lang}${param ? `/${param}` : ''}`;
  }
  const segment = getRoutePath(lang, key);
  
  let resolvedParam = param;
  if (key === "category" && param) {
    const currentLangRoutes = routeTranslations[lang as keyof typeof routeTranslations] || routeTranslations['tr'];
    if (param === "kiz") {
      resolvedParam = currentLangRoutes.girls;
    } else if (param === "erkek") {
      resolvedParam = currentLangRoutes.boys;
    } else if (param in themeSlugs.tr) {
      const themes = themeSlugs[lang as keyof typeof themeSlugs] || themeSlugs['tr'];
      resolvedParam = (themes as any)[param];
    }
  }
  
  let path = `/${lang}/${segment}${resolvedParam ? `/${resolvedParam}` : ''}`;
  if (subParam) {
    let resolvedSub = subParam;
    if (subParam in themeSlugs.tr) {
      const themes = themeSlugs[lang as keyof typeof themeSlugs] || themeSlugs['tr'];
      resolvedSub = (themes as any)[subParam];
    }
    path += `/${resolvedSub}`;
  }
  return path;
};

export const getGenderFromSlug = (lang: string, slug: string | undefined): "female" | "male" | "letter" | null => {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  // ─ Tüm dillerin kız (female) slug'ları ───────────────────────────────────
  const FEMALE_SLUGS = new Set([
    // TR
    "kiz", "kız", "kız-isimleri", "kız-bebek-isimleri",
    // EN — doğal İngilizce varyasyonlar
    "girls", "girl", "female", "woman", "women",
    "girl-names", "girls-names", "female-names",
    "baby-girl-names", "feminine",
    // DE
    "maedchen", "mädchen", "madchen",
    "mädchennamen", "maedchennamen",
    // AR
    "بنات", "اناث", "مؤنث",
  ]);

  // ─ Tüm dillerin erkek (male) slug'ları ─────────────────────────────────
  const MALE_SLUGS = new Set([
    // TR
    "erkek", "erkek-isimleri", "erkek-bebek-isimleri",
    // EN — doğal İngilizce varyasyonlar
    "boys", "boy", "male", "man", "men",
    "boy-names", "boys-names", "male-names",
    "baby-boy-names", "masculine",
    // DE
    "jungen", "junge", "männer", "manner",
    "jungennamen", "männernamen",
    // AR
    "ذكور", "ذكر", "مذكر",
  ]);

  if (FEMALE_SLUGS.has(decodedSlug)) return "female";
  if (MALE_SLUGS.has(decodedSlug)) return "male";

  // Dinamik routeTranslations listesinden de kontrol et
  for (const [, routes] of Object.entries(routeTranslations)) {
    if (routes.girls.toLowerCase() === decodedSlug) return "female";
    if (routes.boys.toLowerCase() === decodedSlug) return "male";
  }

  if (slug.length === 1) return "letter";

  return null;
};


export const getThemeFromSlug = (lang: string, slug: string | undefined): "nature" | "power" | "beauty" | "light" | "wisdom" | null => {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  
  for (const [, themes] of Object.entries(themeSlugs)) {
    for (const [key, value] of Object.entries(themes)) {
      if (value.toLowerCase() === decodedSlug) {
        return key as "nature" | "power" | "beauty" | "light" | "wisdom";
      }
    }
  }
  
  if (['doga', 'nature', 'natur', 'طبيعة'].includes(decodedSlug)) return 'nature';
  if (['guc', 'power', 'macht', 'قوة'].includes(decodedSlug)) return 'power';
  if (['guzellik', 'beauty', 'schoenheit', 'جمal'].includes(decodedSlug)) return 'beauty';
  if (['isik', 'light', 'licht', 'نور'].includes(decodedSlug)) return 'light';
  if (['bilgelik', 'wisdom', 'weisheit', 'حكمة'].includes(decodedSlug)) return 'wisdom';
  
  return null;
};

export const switchLanguagePath = (currentPath: string, targetLang: string) => {
  const parts = currentPath.split('/').filter(Boolean);
  if (parts.length === 0) return `/${targetLang}`;
  
  const currentLang = parts[0];
  if (!['tr', 'en', 'de', 'ar'].includes(currentLang)) {
     return `/${targetLang}`;
  }
  
  if (parts.length === 1) return `/${targetLang}`;
  
  const currentSegment = decodeURIComponent(parts[1]);
  const currentTranslations = routeTranslations[currentLang as keyof typeof routeTranslations] || routeTranslations['tr'];
  
  let routeKey: RouteKey | null = null;
  for (const [key, value] of Object.entries(currentTranslations)) {
    if (value === currentSegment) {
      routeKey = key as RouteKey;
      break;
    }
  }
  
  if (!routeKey) {
    return `/${targetLang}/${parts.slice(1).join('/')}`;
  }
  
  const targetSegment = getRoutePath(targetLang, routeKey);
  let remaining = parts.slice(2).join('/');
  
  if (routeKey === "category" && remaining) {
    const remainingParts = remaining.split('/');
    const firstRemaining = remainingParts[0];
    const rawGender = getGenderFromSlug(currentLang, firstRemaining);
    let resolvedFirst = firstRemaining;
    if (rawGender === "female") {
      const targetTranslations = routeTranslations[targetLang as keyof typeof routeTranslations] || routeTranslations['tr'];
      resolvedFirst = targetTranslations.girls;
    } else if (rawGender === "male") {
      const targetTranslations = routeTranslations[targetLang as keyof typeof routeTranslations] || routeTranslations['tr'];
      resolvedFirst = targetTranslations.boys;
    }
    
    if (remainingParts.length > 1) {
      const secondRemaining = remainingParts[1];
      const rawTheme = getThemeFromSlug(currentLang, secondRemaining);
      let resolvedSecond = secondRemaining;
      if (rawTheme) {
        const targetThemes = themeSlugs[targetLang as keyof typeof themeSlugs] || themeSlugs['tr'];
        resolvedSecond = (targetThemes as any)[rawTheme];
      }
      remaining = `${resolvedFirst}/${resolvedSecond}`;
    } else {
      remaining = resolvedFirst;
    }
  }
  
  return `/${targetLang}/${targetSegment}${remaining ? `/${remaining}` : ''}`;
};
