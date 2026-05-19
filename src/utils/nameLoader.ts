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

export async function loadNamesForLetter(letter: string): Promise<NameData[]> {
  const upperLetter = letter.trim().toUpperCase();
  if (!upperLetter) return [];

  // Cache hit → anında dön
  if (_cache.has(upperLetter)) {
    return _cache.get(upperLetter)!;
  }

  try {
    let module;
    switch (upperLetter) {
      case 'A': module = await import('../data/names_alphabetical/A'); break;
      case 'B': module = await import('../data/names_alphabetical/B'); break;
      case 'C': module = await import('../data/names_alphabetical/C'); break;
      case 'Ç': module = await import('../data/names_alphabetical/Ç'); break;
      case 'D': module = await import('../data/names_alphabetical/D'); break;
      case 'E': module = await import('../data/names_alphabetical/E'); break;
      case 'Ê': module = await import('../data/names_alphabetical/Ê'); break;
      case 'F': module = await import('../data/names_alphabetical/F'); break;
      case 'G': module = await import('../data/names_alphabetical/G'); break;
      case 'H': module = await import('../data/names_alphabetical/H'); break;
      case 'Î': module = await import('../data/names_alphabetical/Î'); break;
      case 'İ': module = await import('../data/names_alphabetical/İ'); break;
      case 'J': module = await import('../data/names_alphabetical/J'); break;
      case 'K': module = await import('../data/names_alphabetical/K'); break;
      case 'L': module = await import('../data/names_alphabetical/L'); break;
      case 'M': module = await import('../data/names_alphabetical/M'); break;
      case 'N': module = await import('../data/names_alphabetical/N'); break;
      case 'O': module = await import('../data/names_alphabetical/O'); break;
      case 'P': module = await import('../data/names_alphabetical/P'); break;
      case 'Q': module = await import('../data/names_alphabetical/Q'); break;
      case 'R': module = await import('../data/names_alphabetical/R'); break;
      case 'S': module = await import('../data/names_alphabetical/S'); break;
      case 'Ş': module = await import('../data/names_alphabetical/Ş'); break;
      case 'T': module = await import('../data/names_alphabetical/T'); break;
      case 'U': module = await import('../data/names_alphabetical/U'); break;
      case 'V': module = await import('../data/names_alphabetical/V'); break;
      case 'W': module = await import('../data/names_alphabetical/W'); break;
      case 'X': module = await import('../data/names_alphabetical/X'); break;
      case 'Y': module = await import('../data/names_alphabetical/Y'); break;
      case 'Z': module = await import('../data/names_alphabetical/Z'); break;
      default:
        return [];
    }
    const result: NameData[] = module.names || [];
    
    // Append matching static home names
    const matchingStatic = staticHomeNames.filter(
      n => n.letter.trim().toUpperCase() === upperLetter
    );
    
    // Combine and ensure uniqueness by id (prioritize database files with full translations)
    const combined = [...matchingStatic, ...result];
    const uniqueMap = new Map<string, NameData>();
    combined.forEach(n => uniqueMap.set(n.id, n));
    const uniqueResult = Array.from(uniqueMap.values());
    
    _cache.set(upperLetter, uniqueResult);
    return uniqueResult;
  } catch (error) {
    console.error(`Failed to load names for letter: ${upperLetter}`, error);
    return [];
  }
}

export const availableLetters = ['A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H', 'Î', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'Ş', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export async function loadAllNames(): Promise<NameData[]> {
  const results = await Promise.all(availableLetters.map(l => loadNamesForLetter(l)));
  return results.flat();
}

let searchIndexCache: NameData[] | null = null;
export async function fetchSearchIndex(): Promise<NameData[]> {
  if (searchIndexCache) return searchIndexCache;
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
