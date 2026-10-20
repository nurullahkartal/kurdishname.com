const WIKIDATA_CACHE_KEY = "kurdishname_wikidata_cache";

interface WikidataCache {
  [key: string]: string[];
}

const memoryCache: { [key: string]: string[] } = {};

const STOP_WORDS = new Set([
  "ve", "veya", "bir", "olan", "gibi", "ile", "için", "en", "da", "de", "adı", "adıdır",
  "isidir", "ismidir", "temsil", "eder", "kişidir", "kimsedir", "dur", "dür", "tır", "tir",
  "yönünü", "coğrafyasını", "yöresinde", "bulunan", "büyükbaba", "baba", "kız", "erkek",
  "isim", "isminin", "anlamı", "kökeni", "birer", "biri", "ya", "çok", "her", "şey", "she",
  "şehridir", "ilidir", "ilçesidir", "dağdır", "nehirdir", "akarsuyudur", "gölüdür", "ovasıdır",
  "name", "meaning", "origin", "kurdish", "traditional", "character", "representing"
]);

export function extractMeaningKeywords(text: string): string[] {
  if (!text) return [];

  const cleanText = text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, " ")
    .trim();

  const words = cleanText.split(/\s+/);
  const keywords: string[] = [];

  for (const word of words) {
    const trimmed = word.trim();
    if (trimmed.length >= 3 && !STOP_WORDS.has(trimmed)) {
      keywords.push(trimmed);
    }
  }

  return Array.from(new Set(keywords)).slice(0, 3);
}

async function searchWikidata(query: string, lang: string = "tr", signal?: AbortSignal): Promise<string | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(cleanQuery)}&language=${lang}&format=json&limit=1&origin=*`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.search && data.search.length > 0) {
      const entity = data.search[0];
      return `https://www.wikidata.org/wiki/${entity.id}`;
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') return null;
  }
  return null;
}

export async function getWikidataSameAs(
  name: string,
  meaning: string,
  origin: string,
  lang: string = "tr",
  signal?: AbortSignal
): Promise<string[]> {
  const cacheKey = `${name.toLowerCase()}_${lang}`;

  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }

  if (typeof window !== 'undefined') {
    try {
      const cachedStr = localStorage.getItem(WIKIDATA_CACHE_KEY);
      if (cachedStr) {
        const cache: WikidataCache = JSON.parse(cachedStr);
        if (cache[cacheKey]) {
          memoryCache[cacheKey] = cache[cacheKey];
          return cache[cacheKey];
        }
      }
    } catch {
      // ignore
    }
  }

  const terms: string[] = [name];
  const meaningKeywords = extractMeaningKeywords(meaning);
  terms.push(...meaningKeywords);

  if (origin && !STOP_WORDS.has(origin.toLowerCase())) {
    terms.push(origin);
  }

  const uniqueTerms = Array.from(new Set(terms)).slice(0, 4);

  const urls: string[] = [];
  const searchPromises = uniqueTerms.map(async (term) => {
    let url = await searchWikidata(term, lang, signal);
    if (!url && lang !== "en") {
      url = await searchWikidata(term, "en", signal);
    }
    return url;
  });

  const results = await Promise.all(searchPromises);
  if (signal?.aborted) return [];

  results.forEach((url) => {
    if (url && !urls.includes(url)) {
      urls.push(url);
    }
  });

  memoryCache[cacheKey] = urls;
  if (typeof window !== 'undefined') {
    try {
      const cachedStr = localStorage.getItem(WIKIDATA_CACHE_KEY);
      const cache: WikidataCache = cachedStr ? JSON.parse(cachedStr) : {};
      cache[cacheKey] = urls;
      localStorage.setItem(WIKIDATA_CACHE_KEY, JSON.stringify(cache));
    } catch {
      // ignore
    }
  }

  return urls;
}
