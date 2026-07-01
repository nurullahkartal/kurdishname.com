import MiniSearch from 'minisearch';
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
 * Perform highly optimized MiniSearch on name entities.
 * Includes boosted weighting for name, secondary for meaning.
 */
export function searchWithMiniSearch(list: NameData[], query: string, lng: string): NameData[] {
  const cleanQuery = query.trim();
  if (!cleanQuery || !list || list.length === 0) return [];

  const normalizedQuery = normalizeText(cleanQuery);

  // Map active language to corresponding translation field
  const meaningKey = 
    lng === 'en' ? 'meaning_en' : 
    lng === 'de' ? 'meaning_de' : 
    lng === 'ar' ? 'meaning_ar' : 
    'meaning';

  // Instantiate MiniSearch
  const miniSearch = new MiniSearch<NameData>({
    fields: ['name', meaningKey], // Fields to index
    idField: 'id',
    extractField: (document, fieldName) => {
      // Normalize fields during indexing so "sh" matches "ş" etc.
      const value = document[fieldName as keyof NameData];
      return typeof value === 'string' ? normalizeText(value) : (value as any);
    },
    searchOptions: {
      boost: { name: 2 }, // Name matches are 2x more important than meaning matches
      fuzzy: 0.2, // Handle typos
      prefix: true // Prefix search for as-you-type experience
    }
  });

  miniSearch.addAll(list);

  const searchResults = miniSearch.search(normalizedQuery);

  // Map back to original NameData objects
  const idMap = new Map(list.map(item => [item.id, item]));
  return searchResults.map(res => idMap.get(res.id)).filter(Boolean) as NameData[];
}
