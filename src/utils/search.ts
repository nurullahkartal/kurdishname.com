/**
 * Scale-Safe Fast Search Engine (O(1) Bucket Lookup)
 * Removes MiniSearch entirely for a deterministic, graph-boosted, diacritic-safe prefix search.
 */

export type SearchIndexItem = {
  id: string;
  n: string; // Original Name
  nn: string; // Normalized Name
  g: string; // Gender ('f' | 'm')
  s: number; // SEO/Graph score
};

export type SearchIndexBucket = Record<string, SearchIndexItem[]>;

/**
 * Flattens the bucketed search index into a single array for components that need the entire list
 */
export function flattenSearchIndex(index: SearchIndexBucket | null): SearchIndexItem[] {
  if (!index) return [];
  const result: SearchIndexItem[] = [];
  for (const bucket of Object.values(index)) {
    result.push(...bucket);
  }
  return result;
}

/**
 * Kurdish & Turkish Character Normalizer
 * Converts special characters to their basic Latin counterparts for fuzzy searching.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove standard accents
    .replaceAll('ê', 'e')
    .replaceAll('î', 'i')
    .replaceAll('û', 'u')
    .replaceAll('ç', 'c')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ı', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
    .trim();
}

/**
 * Performs ultra-fast bucketed search using the precomputed index.
 */
export function performFastSearch(index: SearchIndexBucket, query: string): SearchIndexItem[] {
  const cleanQuery = query.trim();
  if (!cleanQuery || !index) return [];

  const nQuery = normalizeText(cleanQuery);
  if (!nQuery) return [];

  let candidates: SearchIndexItem[] = [];

  if (nQuery.length === 1) {
    // 1-letter search: collect all buckets starting with that letter
    for (const key of Object.keys(index)) {
      if (key.startsWith(nQuery)) {
        candidates.push(...index[key]);
      }
    }
  } else {
    // 2+ letters search: instantly grab the bucket
    const prefix = nQuery.substring(0, 2);
    candidates = index[prefix] || [];
  }

  // Score and filter candidates
  const scoredItems = candidates.map(item => {
    let matchScore = 0;

    if (item.nn === nQuery) {
      matchScore = 1000; // Exact match
    } else if (item.nn.startsWith(nQuery)) {
      matchScore = 500; // Prefix match
    } else if (item.nn.includes(nQuery)) {
      matchScore = 100; // Fuzzy includes
    }

    if (matchScore > 0) {
      // Add the Graph/SEO boost to rank popular items higher
      return { item, score: matchScore + item.s };
    }
    return null;
  }).filter(Boolean) as { item: SearchIndexItem, score: number }[];

  // Sort by final score descending
  scoredItems.sort((a, b) => b.score - a.score);

  return scoredItems.map(i => i.item).slice(0, 60);
}

/**
 * Fallback search for client-side filtering of full NameData arrays
 * (e.g. Category pages where we already have the full list loaded)
 */
export function searchFullNames(list: any[], query: string): any[] {
  const cleanQuery = query.trim();
  if (!cleanQuery || !list || list.length === 0) return list;

  const nQuery = normalizeText(cleanQuery);
  if (!nQuery) return list;

  const scoredItems = list.map(item => {
    let matchScore = 0;
    const nn = normalizeText(item.name || "");

    if (nn === nQuery) matchScore = 1000;
    else if (nn.startsWith(nQuery)) matchScore = 500;
    else if (nn.includes(nQuery)) matchScore = 100;

    if (matchScore > 0) {
      return { item, score: matchScore };
    }
    return null;
  }).filter(Boolean) as { item: any, score: number }[];

  scoredItems.sort((a, b) => b.score - a.score);
  return scoredItems.map(i => i.item);
}
