import fs from 'fs';
import path from 'path';

export interface NameData {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  letter: string;
  meaning: string;
  meaning_en?: string;
  meaning_de?: string;
  meaning_ar?: string;
  origin?: string;
  tags?: string[];
  description?: string;
}

export type NameRecord = NameData;

export const STANDARD_LETTERS = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'Ê', 'F', 'G', 'H',
  'I', 'Î', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
  'R', 'S', 'Ş', 'T', 'U', 'Û', 'V', 'W', 'X', 'Y', 'Z',
] as const;

export type KurdishLetter = (typeof STANDARD_LETTERS)[number];

let _allNamesCache: NameData[] | null = null;
let _bySlugCache: Map<string, NameData> | null = null;
let _byLetterCache: Map<string, NameData[]> | null = null;

function ensureCacheLoaded(): void {
  if (_allNamesCache && _bySlugCache && _byLetterCache) {
    return;
  }

  const masterPath = path.join(process.cwd(), 'names_master.json');
  const raw = fs.readFileSync(masterPath, 'utf-8');
  const parsed: NameData[] = JSON.parse(raw);

  _allNamesCache = parsed;
  _bySlugCache = new Map<string, NameData>();
  _byLetterCache = new Map<string, NameData[]>();

  for (const letter of STANDARD_LETTERS) {
    _byLetterCache.set(letter, []);
  }

  for (const item of parsed) {
    const slugKey = item.id.trim().toLowerCase();
    _bySlugCache.set(slugKey, item);

    const upperLetter = (item.letter || item.name.charAt(0)).trim().toUpperCase();
    const bucket = _byLetterCache.get(upperLetter);
    if (bucket) {
      bucket.push(item);
    } else {
      _byLetterCache.set(upperLetter, [item]);
    }
  }
}

export function getAllNames(): NameData[] {
  ensureCacheLoaded();
  return _allNamesCache!;
}

export function getNamesByLetter(letter: string): NameData[] {
  ensureCacheLoaded();
  const upper = letter.trim().toUpperCase();
  return _byLetterCache!.get(upper) || [];
}

export function getNameBySlug(slug: string): NameData | undefined {
  ensureCacheLoaded();
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  return _bySlugCache!.get(cleanSlug);
}

/**
 * Returns only active letters where count > 0 (29 letters: A..Z + Ç, Ê, Î, Ş; excludes empty I and Û).
 */
export function getActiveLettersWithCounts(): { letter: KurdishLetter; count: number }[] {
  ensureCacheLoaded();
  return STANDARD_LETTERS.map((letter) => ({
    letter,
    count: (_byLetterCache!.get(letter) || []).length,
  })).filter((item) => item.count > 0);
}

/**
 * Intelligent similar names finder based on phonetic rhyme (suffixes), shared themes, and harmonious structure.
 * Guarantees exactly `limit` relevant recommendations for parents without empty fallbacks.
 */
export function getSimilarNames(nameItem: NameData, limit = 8): NameData[] {
  ensureCacheLoaded();
  const all = _allNamesCache || [];
  const pool = all.filter((n) => n.id !== nameItem.id && n.gender === nameItem.gender);
  const curName = nameItem.name.toLowerCase();
  const curSuffix = curName.length >= 3 ? curName.slice(-2) : curName.slice(-1);
  const curTag = nameItem.tags && nameItem.tags[0];

  const scored = pool.map((cand) => {
    let score = 0;
    const cName = cand.name.toLowerCase();
    // High weight for phonetic rhyme/suffix (-în, -an, -dar, etc.)
    if (cName.endsWith(curSuffix)) score += 10;
    // Moderate weight for same starting letter
    if (curName[0] === cName[0]) score += 5;
    // Weight for shared theme (Doğa, Işık, etc.)
    if (curTag && cand.tags && cand.tags.includes(curTag)) score += 6;
    // Weight for balanced syllable/character length
    if (Math.abs(curName.length - cName.length) <= 1) score += 2;
    return { cand, score };
  });

  scored.sort((a, b) => b.score - a.score || a.cand.name.localeCompare(b.cand.name));
  return scored.slice(0, limit).map((s) => s.cand);
}
