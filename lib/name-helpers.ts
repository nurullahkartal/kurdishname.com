import MiniSearch from 'minisearch';
import { NameData } from './names-data';

export const getGenderClass = (gender: "male" | "female" | "unisex", prefix: string) => {
  return `${prefix}-${gender}`;
};

export const getGenderLabel = (gender: "male" | "female" | "unisex") => {
  if (gender === 'unisex') return 'UNİSEX';
  return gender === 'male' ? 'ERKEK' : 'KIZ';
};

export const getGenderText = (gender: "male" | "female" | "unisex") => {
  if (gender === 'unisex') return 'unisex';
  return gender === 'male' ? 'erkek' : 'kız';
};

export const getGenderPath = (gender: "male" | "female" | "unisex") => {
  if (gender === 'unisex') return null;
  return gender === 'male' ? 'erkek' : 'kiz';
};

export function truncateMeaning(text: string, maxLength = 60): string {
  if (!text) return "";

  const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
  if (sentences.length > 0) {
    const first = sentences[0] + ".";
    if (first.length <= maxLength) {
      return first;
    }
  }

  return text.length > maxLength
    ? text.substring(0, maxLength).trim() + "..."
    : text;
}

export function getWeeklySeed(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return now.getFullYear() * 100 + weekNumber;
}

export function lcg(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function getLocalizedMeaning(nameItem: NameData, lng: string): string {
  const cleanLng = (lng || "").split("-")[0].split("_")[0].toLowerCase();
  if (cleanLng === "en" && nameItem.meaning_en) return nameItem.meaning_en;
  if (cleanLng === "de" && nameItem.meaning_de) return nameItem.meaning_de;
  if (cleanLng === "ar" && nameItem.meaning_ar) return nameItem.meaning_ar;
  return nameItem.meaning;
}

export function getLocalizedOrigin(origin: string | undefined, t: (key: string, values?: Record<string, any>) => string): string {
  if (!origin) return "—";

  let clean = origin.trim();
  const lower = clean.toLowerCase();

  if (lower === "kurdish") {
    clean = "Kürtçe";
  } else if (lower === "persian") {
    clean = "Farsça";
  } else if (lower === "arabic") {
    clean = "Arapça";
  } else if (lower === "hebrew") {
    clean = "İbranice";
  } else if (lower === "latin") {
    clean = "Latince";
  } else if (lower === "greek") {
    clean = "Yunanca";
  } else if (lower === "sanskrit") {
    clean = "Sanskritçe";
  } else if (lower === "kurdish-crossover" || lower === "kurdish crossover") {
    clean = "Kurdish_Crossover";
  }

  const key = `origin_${clean.replace(/[\/, \-]+/g, "_")}`;
  try {
    const val = t(key);
    return val && val !== key ? val : origin;
  } catch {
    return origin;
  }
}

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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

export function fuzzyMatch(target: string, query: string): boolean {
  if (!query) return true;
  const normalizedTarget = normalizeText(target);
  const normalizedQuery = normalizeText(query);

  if (normalizedTarget.includes(normalizedQuery)) return true;
  if (normalizedTarget.startsWith(normalizedQuery)) return true;

  return false;
}

export function searchWithMiniSearch<T extends { id: string; name: string; [key: string]: any }>(
  list: T[],
  query: string,
  lng: string
): T[] {
  const cleanQuery = query.trim();
  if (!cleanQuery || !list || list.length === 0) return [];

  const normalizedQuery = normalizeText(cleanQuery);

  const meaningKey =
    lng === 'en' ? 'meaning_en' :
    lng === 'de' ? 'meaning_de' :
    lng === 'ar' ? 'meaning_ar' :
    'meaning';

  const miniSearch = new MiniSearch<T>({
    fields: ['name', meaningKey, 'meaning'],
    idField: 'id',
    extractField: (document, fieldName) => {
      const value = document[fieldName];
      return typeof value === 'string' ? normalizeText(value) : '';
    },
    searchOptions: {
      boost: { name: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  miniSearch.addAll(list);
  const searchResults = miniSearch.search(normalizedQuery);
  const idMap = new Map(list.map(item => [item.id, item]));
  return searchResults.map(res => idMap.get(res.id)).filter(Boolean) as T[];
}
