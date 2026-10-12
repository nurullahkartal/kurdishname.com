import { NameData } from '../data/names';
import { homeGirlNames, homeBoyNames, featuredNames } from '../data/homeStaticData';

// Combine static premium home names without duplicates
const staticHomeNames: NameData[] = [];
const seenIds = new Set<string>();
[...homeGirlNames, ...homeBoyNames, ...featuredNames].forEach(item => {
  if (item && item.id && !seenIds.has(item.id)) {
    seenIds.add(item.id);
    staticHomeNames.push(item);
  }
});

// In-memory cache: aynı harf chunk'ı bir kez yüklenir
const _cache = new Map<string, NameData[]>();
const _inflight = new Map<string, Promise<NameData[]>>();

const NAMES_DATA_BASE = '/data/names';

export async function loadNamesForLetter(letter: string): Promise<NameData[]> {
  const upperLetter = letter.trim().toUpperCase();
  if (!upperLetter) return [];

  // Cache hit
  if (_cache.has(upperLetter)) {
    return _cache.get(upperLetter)!;
  }

  // Dedupe concurrent requests (aynı harf için 2 fetch atılmaz)
  if (_inflight.has(upperLetter)) {
    return _inflight.get(upperLetter)!;
  }

  const promise = (async (): Promise<NameData[]> => {
    try {
      const res = await fetch(
        `${NAMES_DATA_BASE}/${encodeURIComponent(upperLetter)}.json`,
        { headers: { Accept: 'application/json' } }
      );

      // 404 → harf için veri yok, boş dizi cache'le
      if (res.status === 404) {
        _cache.set(upperLetter, []);
        return [];
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for letter ${upperLetter}`);
      }

      const data: NameData[] = await res.json();

      // Statik home isimlerini ekle (id dedup)
      const matchingStatic = staticHomeNames.filter(
        (n) => n.letter.trim().toUpperCase() === upperLetter
      );

      const combined = [...matchingStatic, ...data];
      const uniqueMap = new Map<string, NameData>();
      combined.forEach((n) => uniqueMap.set(n.id, n));
      const uniqueResult = Array.from(uniqueMap.values());

      _cache.set(upperLetter, uniqueResult);
      return uniqueResult;
    } catch (error) {
      console.error(`Failed to load names for letter: ${upperLetter}`, error);
      _cache.set(upperLetter, []);
      return [];
    } finally {
      _inflight.delete(upperLetter);
    }
  })();

  _inflight.set(upperLetter, promise);
  return promise;
}

export const availableLetters = ['A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'Î', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export async function loadAllNames(): Promise<NameData[]> {
  const results = await Promise.all(availableLetters.map(l => loadNamesForLetter(l)));
  return results.flat();
}

let searchIndexCache: NameData[] | null = null;
export async function fetchSearchIndex(): Promise<NameData[]> {
  if (searchIndexCache) return searchIndexCache;
  if (typeof window === "undefined") return [];
  try {
    const res = await fetch('/search_index.json');
    searchIndexCache = await res.json();
    return searchIndexCache || [];
  } catch (err) {
    console.error('Failed to load search index:', err);
    return [];
  }
}

export async function loadNamesForSearch(q: string): Promise<NameData[]> {
  const cleanQ = q.trim();
  if (!cleanQ) return [];
  
  // Zayıf İndeks (Slim Index) kullanılıyor.
  return await fetchSearchIndex();
}

export function getLettersForId(id: string): string[] {
  const firstChar = id.trim().charAt(0).toLowerCase();
  switch (firstChar) {
    case 'c': return ['C', 'Ç'];
    case 's': return ['S', 'Ş'];
    case 'e': return ['E', 'Ê'];
    case 'i': return ['I', 'Î', 'İ'];
    case 'u': return ['U', 'Û'];
    default: return [firstChar.toUpperCase()];
  }
}
