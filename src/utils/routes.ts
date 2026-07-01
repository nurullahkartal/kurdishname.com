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
export type LangKey = keyof typeof routeTranslations;

// Pre-compute reverse maps for O(1) ultra-fast lookups
// e.g. reverseRouteMap['kategori'] = 'category'
const reverseRouteMap: Record<string, RouteKey> = {};
const reverseSlugMap: Record<string, string> = {};

Object.entries(routeTranslations).forEach(([lang, translations]) => {
  Object.entries(translations).forEach(([key, value]) => {
    reverseRouteMap[value.toLowerCase()] = key as RouteKey;
  });
});

Object.entries(themeSlugs).forEach(([lang, themes]) => {
  Object.entries(themes).forEach(([key, value]) => {
    reverseSlugMap[value.toLowerCase()] = key;
  });
});

export const getRoutePath = (lang: string, key: RouteKey) => {
  const safeLang = (lang in routeTranslations ? lang : 'tr') as LangKey;
  return routeTranslations[safeLang][key];
};

/**
 * Super fast, direct path generation without heavy logic
 */
export const generatePath = (lang: string, key: RouteKey | null, param?: string, subParam?: string) => {
  const safeLang = (lang in routeTranslations ? lang : 'tr') as LangKey;
  if (!key) return `/${safeLang}${param ? `/${param}` : ''}`;
  
  const segment = routeTranslations[safeLang][key];
  let path = `/${safeLang}/${segment}`;
  
  if (param) {
    // Check if param is a known key (like 'girls' mapped to 'kiz' internally? No, just pass it)
    // Actually, in the old logic we passed "kiz" and it translated to "girls". 
    // Now we rely on the component to pass the correct universal key or the translated value directly.
    // To not break existing `generatePath(lng, "category", "kiz")` calls, we do a quick lookup:
    let resolvedParam = param;
    if (key === 'category') {
       if (param === 'kiz' || param === 'erkek') {
         resolvedParam = routeTranslations[safeLang][param === 'kiz' ? 'girls' : 'boys'];
       } else if (param in themeSlugs.tr) {
         resolvedParam = themeSlugs[safeLang][param as keyof typeof themeSlugs.tr];
       }
    }
    path += `/${resolvedParam}`;
  }

  if (subParam) {
    let resolvedSub = subParam;
    if (subParam in themeSlugs.tr) {
      resolvedSub = themeSlugs[safeLang][subParam as keyof typeof themeSlugs.tr];
    }
    path += `/${resolvedSub}`;
  }

  return path;
};

/**
 * Very flat, direct language switcher.
 * Uses O(1) Maps instead of nested loops.
 */
export const switchLanguagePath = (currentPath: string, targetLang: string) => {
  const safeTargetLang = (targetLang in routeTranslations ? targetLang : 'tr') as LangKey;
  const parts = currentPath.split('/').filter(Boolean);
  
  if (parts.length === 0) return `/${safeTargetLang}`;
  
  const currentLang = parts[0];
  if (!(currentLang in routeTranslations)) return `/${safeTargetLang}`;
  if (parts.length === 1) return `/${safeTargetLang}`;
  
  // Translate main segment
  const currentSegment = decodeURIComponent(parts[1]).toLowerCase();
  const routeKey = reverseRouteMap[currentSegment];
  
  if (!routeKey) {
    // If not a known route, just replace lang
    return `/${safeTargetLang}/${parts.slice(1).join('/')}`;
  }
  
  const targetSegment = routeTranslations[safeTargetLang][routeKey];
  let remaining = parts.slice(2).join('/');
  
  if (routeKey === 'category' && remaining) {
    const remainingParts = remaining.split('/');
    const firstParam = decodeURIComponent(remainingParts[0]).toLowerCase();
    
    // Check if it's a gender param
    const genderKey = reverseRouteMap[firstParam];
    let resolvedFirst = firstParam;
    if (genderKey === 'girls' || genderKey === 'boys') {
      resolvedFirst = routeTranslations[safeTargetLang][genderKey];
    } else {
       // Check if it's a theme param
       const themeKey = reverseSlugMap[firstParam];
       if (themeKey) {
         resolvedFirst = themeSlugs[safeTargetLang][themeKey as keyof typeof themeSlugs.tr];
       }
    }
    
    // Check second param (subParam)
    if (remainingParts.length > 1) {
      const secondParam = decodeURIComponent(remainingParts[1]).toLowerCase();
      const themeKey = reverseSlugMap[secondParam];
      const resolvedSecond = themeKey ? themeSlugs[safeTargetLang][themeKey as keyof typeof themeSlugs.tr] : secondParam;
      remaining = `${resolvedFirst}/${resolvedSecond}`;
    } else {
      remaining = resolvedFirst;
    }
  }
  
  return `/${safeTargetLang}/${targetSegment}${remaining ? `/${remaining}` : ''}`;
};

export const getGenderFromSlug = (lang: string, slug: string | undefined): "female" | "male" | "letter" | null => {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  
  const mappedKey = reverseRouteMap[decodedSlug];
  if (mappedKey === 'girls') return 'female';
  if (mappedKey === 'boys') return 'male';
  
  // Legacy backups for direct SEO links
  if (["kiz", "kız", "girls", "girl", "female", "woman", "women", "maedchen", "mädchen", "بنات", "اناث"].includes(decodedSlug)) return "female";
  if (["erkek", "boys", "boy", "male", "man", "men", "jungen", "junge", "ذكور", "ذكر"].includes(decodedSlug)) return "male";
  
  if (slug.length === 1) return "letter";
  
  return null;
};

export const getThemeFromSlug = (lang: string, slug: string | undefined): "nature" | "power" | "beauty" | "light" | "wisdom" | null => {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const themeKey = reverseSlugMap[decodedSlug];
  if (themeKey) return themeKey as "nature" | "power" | "beauty" | "light" | "wisdom";
  
  // Legacy backups
  if (['doga', 'nature', 'natur', 'طبيعة'].includes(decodedSlug)) return 'nature';
  if (['guc', 'power', 'macht', 'قوة'].includes(decodedSlug)) return 'power';
  if (['guzellik', 'beauty', 'schoenheit', 'جمal'].includes(decodedSlug)) return 'beauty';
  if (['isik', 'light', 'licht', 'نور'].includes(decodedSlug)) return 'light';
  if (['bilgelik', 'wisdom', 'weisheit', 'حكمة'].includes(decodedSlug)) return 'wisdom';
  
  return null;
};
