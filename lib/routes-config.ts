export const SITE_URL = 'https://kurdishname.com';

export const supportedLanguages = ['tr', 'en', 'de', 'ar'] as const;
export const locales = supportedLanguages;
export type LangKey = (typeof supportedLanguages)[number];
export type Locale = LangKey;
export const defaultLocale: LangKey = 'tr';

export function isValidLocale(locale: string): locale is LangKey {
  return (supportedLanguages as readonly string[]).includes(locale);
}

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
    favorites: 'defterim',
    girls: 'kiz',
    boys: 'erkek',
    suggest: 'isim-oner',
    compare: 'karsilastir',
    alphabet: 'alfabe',
    mythology: 'mitoloji',
    tribes: 'boylar',
    surnames: 'soyadlari',
    editorial: 'editoryal-kurul',
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
    favorites: 'my-favorites',
    girls: 'girls',
    boys: 'boys',
    suggest: 'suggest-name',
    compare: 'compare',
    alphabet: 'alphabet',
    mythology: 'mythology',
    tribes: 'tribes',
    surnames: 'surnames',
    editorial: 'editorial-board',
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
    favorites: 'favoriten',
    girls: 'maedchen',
    boys: 'jungen',
    suggest: 'name-vorschlagen',
    compare: 'vergleichen',
    alphabet: 'alphabet',
    mythology: 'mythologie',
    tribes: 'staemme',
    surnames: 'nachnamen',
    editorial: 'redaktionsrat',
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
    favorites: 'المفضلة',
    girls: 'بنات',
    boys: 'ذكور',
    suggest: 'اقتراح-اسم',
    compare: 'مقارنة',
    alphabet: 'الابجدية',
    mythology: 'ميثولوجيا',
    tribes: 'عشائر',
    surnames: 'القاب',
    editorial: 'مجلس-التحرير',
  },
} as const;

export const themeSlugs = {
  tr: { nature: 'doga', power: 'guc', beauty: 'guzellik', light: 'isik', wisdom: 'bilgelik' },
  en: { nature: 'nature', power: 'power', beauty: 'beauty', light: 'light', wisdom: 'wisdom' },
  de: { nature: 'natur', power: 'macht', beauty: 'schoenheit', light: 'licht', wisdom: 'weisheit' },
  ar: { nature: 'طبيعة', power: 'قوة', beauty: 'جمال', light: 'نور', wisdom: 'حكمة' },
} as const;

export type RouteKey = keyof typeof routeTranslations['tr'];
export type ThemeKey = keyof typeof themeSlugs['tr'];

const reverseRouteMap: Record<string, RouteKey> = {};
const reverseSlugMap: Record<string, ThemeKey> = {};

Object.values(routeTranslations).forEach((translations) => {
  Object.entries(translations).forEach(([key, value]) => {
    reverseRouteMap[value.toLowerCase()] = key as RouteKey;
  });
});

Object.values(themeSlugs).forEach((themes) => {
  Object.entries(themes).forEach(([key, value]) => {
    reverseSlugMap[value.toLowerCase()] = key as ThemeKey;
  });
});

export function getRouteKeyBySegment(locale: string, segment: string): RouteKey | null {
  const safeLang: LangKey = isValidLocale(locale) ? locale : defaultLocale;
  const decoded = decodeURIComponent(segment).toLowerCase();
  const entries = Object.entries(routeTranslations[safeLang]) as [RouteKey, string][];
  for (const [key, val] of entries) {
    if (val.toLowerCase() === decoded) {
      return key;
    }
  }
  return null;
}

export const getRoutePath = (lang: string, key: RouteKey): string => {
  const safeLang: LangKey = isValidLocale(lang) ? lang : defaultLocale;
  return routeTranslations[safeLang][key];
};

export const generatePath = (
  lang: string,
  key: RouteKey | null,
  param?: string,
  subParam?: string
): string => {
  const safeLang: LangKey = isValidLocale(lang) ? lang : defaultLocale;
  if (!key) return `/${safeLang}${param ? `/${param}` : ''}`;

  const segment = routeTranslations[safeLang][key];
  let path = `/${safeLang}/${segment}`;

  if (param) {
    let resolvedParam = param;
    if (key === 'category') {
      if (param.length === 1) {
        resolvedParam = param.toLowerCase();
      } else if (param === 'kiz' || param === 'girls' || param === 'maedchen' || param === 'بنات') {
        resolvedParam = routeTranslations[safeLang].girls;
      } else if (param === 'erkek' || param === 'boys' || param === 'jungen' || param === 'ذكور') {
        resolvedParam = routeTranslations[safeLang].boys;
      } else if (param in themeSlugs.tr) {
        resolvedParam = themeSlugs[safeLang][param as ThemeKey];
      } else if (reverseSlugMap[param.toLowerCase()]) {
        resolvedParam = themeSlugs[safeLang][reverseSlugMap[param.toLowerCase()]];
      }
    }
    path += `/${resolvedParam}`;
  }

  if (subParam) {
    let resolvedSub = subParam;
    if (subParam in themeSlugs.tr) {
      resolvedSub = themeSlugs[safeLang][subParam as ThemeKey];
    }
    path += `/${resolvedSub}`;
  }

  return path;
};

export function getAllCategorySlugs(locale: LangKey, activeLetters: string[]): string[] {
  const letters = activeLetters.map((l) => l.toLowerCase());
  const genders = [routeTranslations[locale].girls, routeTranslations[locale].boys];
  const themes = Object.values(themeSlugs[locale]);
  return [...letters, ...genders, ...themes];
}

export const switchLanguagePath = (currentPath: string, targetLang: string): string => {
  const safeTargetLang: LangKey = isValidLocale(targetLang) ? targetLang : defaultLocale;
  const parts = currentPath.split('/').filter(Boolean);

  if (parts.length === 0) return `/${safeTargetLang}`;

  const currentLang = parts[0];
  if (!isValidLocale(currentLang)) return `/${safeTargetLang}`;
  if (parts.length === 1) return `/${safeTargetLang}`;

  const currentSegment = decodeURIComponent(parts[1]).toLowerCase();
  const routeKey = reverseRouteMap[currentSegment];

  if (!routeKey) {
    return `/${safeTargetLang}/${parts.slice(1).join('/')}`;
  }

  const targetSegment = routeTranslations[safeTargetLang][routeKey];
  let remaining = parts.slice(2).join('/');

  if (routeKey === 'category' && remaining) {
    const remainingParts = remaining.split('/');
    const rawFirst = decodeURIComponent(remainingParts[0]);
    const firstParam = rawFirst.toLowerCase();

    const genderKey = reverseRouteMap[firstParam];
    let resolvedFirst = rawFirst.length === 1 ? rawFirst.toLowerCase() : firstParam;
    if (genderKey === 'girls' || genderKey === 'boys') {
      resolvedFirst = routeTranslations[safeTargetLang][genderKey];
    } else {
      const themeKey = reverseSlugMap[firstParam];
      if (themeKey) {
        resolvedFirst = themeSlugs[safeTargetLang][themeKey];
      }
    }

    if (remainingParts.length > 1) {
      const secondParam = decodeURIComponent(remainingParts[1]).toLowerCase();
      const themeKey = reverseSlugMap[secondParam];
      const resolvedSecond = themeKey ? themeSlugs[safeTargetLang][themeKey] : secondParam;
      remaining = `${resolvedFirst}/${resolvedSecond}`;
    } else {
      remaining = resolvedFirst;
    }
  }

  return `/${safeTargetLang}/${targetSegment}${remaining ? `/${remaining}` : ''}`;
};

export const getGenderFromSlug = (
  _lang: string,
  slug: string | undefined
): 'female' | 'male' | 'letter' | null => {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  const mappedKey = reverseRouteMap[decodedSlug];
  if (mappedKey === 'girls') return 'female';
  if (mappedKey === 'boys') return 'male';

  if (
    ['kiz', 'kız', 'girls', 'girl', 'female', 'woman', 'women', 'maedchen', 'mädchen', 'بنات', 'اناث'].includes(
      decodedSlug
    )
  ) {
    return 'female';
  }
  if (
    ['erkek', 'boys', 'boy', 'male', 'man', 'men', 'jungen', 'junge', 'ذكور', 'ذكر'].includes(
      decodedSlug
    )
  ) {
    return 'male';
  }

  if (decodeURIComponent(slug).length === 1) return 'letter';

  return null;
};

export const getThemeFromSlug = (
  _lang: string,
  slug: string | undefined
): ThemeKey | null => {
  if (!slug) return null;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  const themeKey = reverseSlugMap[decodedSlug];
  if (themeKey) return themeKey;

  if (['doga', 'nature', 'natur', 'طبيعة'].includes(decodedSlug)) return 'nature';
  if (['guc', 'power', 'macht', 'قوة'].includes(decodedSlug)) return 'power';
  if (['guzellik', 'beauty', 'schoenheit', 'جمال'].includes(decodedSlug)) return 'beauty';
  if (['isik', 'light', 'licht', 'نور'].includes(decodedSlug)) return 'light';
  if (['bilgelik', 'wisdom', 'weisheit', 'حكمة'].includes(decodedSlug)) return 'wisdom';

  return null;
};

/**
 * Generates self-referencing canonical URL and hreflang alternates.
 * RED LINE #2: Canonical is always self-referencing.
 * RED LINE #6: x-default ALWAYS points to the /en/ equivalent of the page.
 */
export function buildAlternatesMetadata(
  locale: LangKey,
  key: RouteKey | null,
  param?: string | Record<LangKey, string>,
  subParam?: string
) {
  const resolveParam = (l: LangKey): string | undefined => {
    if (!param) return undefined;
    if (typeof param === 'string') return param;
    return param[l];
  };

  const canonicalPath = generatePath(locale, key, resolveParam(locale), subParam);
  const enPath = generatePath('en', key, resolveParam('en'), subParam);

  const languages: Record<string, string> = {};
  for (const l of supportedLanguages) {
    languages[l] = `${SITE_URL}${generatePath(l, key, resolveParam(l), subParam)}`;
  }
  languages['x-default'] = `${SITE_URL}${enPath}`;

  return {
    canonical: `${SITE_URL}${canonicalPath}`,
    languages,
  };
}
