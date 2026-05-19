// Wikidata Integration Utility for KurdishName SEO
// This module provides dynamic entity search and sameAs link extraction.

const WIKIDATA_CACHE_KEY = "kurdishname_wikidata_cache";

interface WikidataCache {
  [key: string]: string[];
}

// In-memory cache fallback
const memoryCache: { [key: string]: string[] } = {};

const STOP_WORDS = new Set([
  "ve", "veya", "bir", "olan", "gibi", "ile", "için", "en", "da", "de", "adı", "adıdır",
  "isidir", "ismidir", "temsil", "eder", "kişidir", "kimsedir", "dur", "dür", "tır", "tir",
  "yönünü", "coğrafyasını", "yöresinde", "bulunan", "büyükbaba", "baba", "kız", "erkek",
  "isim", "isminin", "anlamı", "kökeni", "birer", "biri", "ya", "çok", "her", "şey", "she",
  "şehridir", "ilidir", "ilçesidir", "dağdır", "nehirdir", "akarsuyudur", "gölüdür", "ovasıdır",
  "name", "meaning", "origin", "kurdish", "traditional", "character", "representing"
]);

/**
 * Tokenizes and extracts high-value keywords from a meaning or description string.
 */
export function extractMeaningKeywords(text: string): string[] {
  if (!text) return [];
  
  // Clean text: remove HTML tags, punctuation, and convert to lowercase
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
  
  // Deduplicate and limit to top 3 keywords
  return Array.from(new Set(keywords)).slice(0, 3);
}

/**
 * Searches Wikidata for a single query term.
 * Uses wbsearchentities with CORS support.
 */
async function searchWikidata(query: string, lang: string = "tr"): Promise<string | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;
  
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(cleanQuery)}&language=${lang}&format=json&limit=1&origin=*`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.search && data.search.length > 0) {
      const entity = data.search[0];
      return `https://www.wikidata.org/wiki/${entity.id}`;
    }
  } catch (error) {
    console.warn(`Wikidata search failed for query: "${cleanQuery}"`, error);
  }
  return null;
}

/**
 * Fetches Wikidata sameAs URLs for a name and its meaning/origin keywords.
 * Includes LocalStorage and In-Memory caching.
 */
export async function getWikidataSameAs(name: string, meaning: string, origin: string, lang: string = "tr"): Promise<string[]> {
  const cacheKey = `${name.toLowerCase()}_${lang}`;
  
  // 1. Check in-memory cache
  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }
  
  // 2. Check local storage cache
  try {
    const cachedStr = localStorage.getItem(WIKIDATA_CACHE_KEY);
    if (cachedStr) {
      const cache: WikidataCache = JSON.parse(cachedStr);
      if (cache[cacheKey]) {
        memoryCache[cacheKey] = cache[cacheKey];
        return cache[cacheKey];
      }
    }
  } catch (e) {
    console.warn("Local storage read for Wikidata cache failed", e);
  }
  
  // 3. Compile terms to search
  const terms: string[] = [name];
  
  // Extract keywords from meaning
  const meaningKeywords = extractMeaningKeywords(meaning);
  terms.push(...meaningKeywords);
  
  // Extract keywords from origin
  if (origin && !STOP_WORDS.has(origin.toLowerCase())) {
    terms.push(origin);
  }
  
  // Deduplicate terms
  const uniqueTerms = Array.from(new Set(terms)).slice(0, 4);
  
  // 4. Run searches in parallel
  const urls: string[] = [];
  const searchPromises = uniqueTerms.map(async (term) => {
    // Attempt language-specific search
    let url = await searchWikidata(term, lang);
    
    // Fallback to English if Turkish returned nothing and language is different
    if (!url && lang !== "en") {
      url = await searchWikidata(term, "en");
    }
    
    return url;
  });
  
  const results = await Promise.all(searchPromises);
  results.forEach((url) => {
    if (url && !urls.includes(url)) {
      urls.push(url);
    }
  });
  
  // 5. Update caches
  memoryCache[cacheKey] = urls;
  try {
    const cachedStr = localStorage.getItem(WIKIDATA_CACHE_KEY);
    const cache: WikidataCache = cachedStr ? JSON.parse(cachedStr) : {};
    cache[cacheKey] = urls;
    localStorage.setItem(WIKIDATA_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // Ignore storage quota or disabled storage errors
  }
  
  return urls;
}
