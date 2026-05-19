import Fuse from 'fuse.js';
import { NameData } from '../data/names';

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
    .replaceAll('ê', 'e') // double check for edge cases
    .replaceAll('ç', 'c')
    .trim();
}

/**
 * Checks if search query matches the target string using normalized comparison.
 * Supports partial matches and simplified characters.
 * (Left as fallback for non-fuzzy simple lookups)
 */
export function fuzzyMatch(target: string, query: string): boolean {
  if (!query) return true;
  const normalizedTarget = normalizeText(target);
  const normalizedQuery = normalizeText(query);
  
  // Direct inclusion
  if (normalizedTarget.includes(normalizedQuery)) return true;
  
  // Check if query is start of target
  if (normalizedTarget.startsWith(normalizedQuery)) return true;

  return false;
}

/**
 * Perform highly optimized Fuse.js Fuzzy Search on name entities.
 * Includes 70% weighting for name, 30% for meaning (fully localized).
 * threshold: 0.4 handles 30-40% typos, and results are returned by relevance score.
 */
export function searchWithFuse(list: NameData[], query: string, lng: string): NameData[] {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const normalizedQuery = normalizeText(cleanQuery);

  // Map active language to corresponding translation field
  const meaningKey = 
    lng === 'en' ? 'meaning_en' : 
    lng === 'de' ? 'meaning_de' : 
    lng === 'ar' ? 'meaning_ar' : 
    'meaning';

  // Configure weights: Name (70%) and Meaning (30%)
  const options = {
    keys: [
      { name: 'name', weight: 0.7 },
      { name: meaningKey, weight: 0.3 }
    ],
    threshold: 0.4,
    includeScore: true,
    // Custom getter to normalize data fields so typing "sh" matches "ş" or "î" matches "i"
    getFn: (obj: any, path: string | string[]) => {
      const key = Array.isArray(path) ? path[0] : path;
      const value = obj[key];
      if (typeof value === 'string') {
        return normalizeText(value);
      }
      return value;
    }
  };

  const fuse = new Fuse(list, options);
  const searchResults = fuse.search(normalizedQuery);

  // Return NameData objects sorted by relevance (highest score first)
  return searchResults.map(res => res.item);
}

