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
