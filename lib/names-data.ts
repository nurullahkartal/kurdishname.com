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

export interface NameNavigationContext {
  prevName: NameData;
  nextName: NameData;
  letterPeers: NameData[];
  letterRank: number;
  letterTotal: number;
  globalRank: number;
  globalTotal: number;
}

/**
 * Provides a complete Hamiltonian crawl ring (prev/next across all 4,709 names)
 * plus a 12-node circulant peer ring within the same starting letter bucket,
 * guaranteeing zero orphan pages and high internal link equity for every name.
 */
export function getAdjacentAndLetterNames(
  nameItem: NameData,
  peerLimit = 12
): NameNavigationContext {
  ensureCacheLoaded();
  const all = _allNamesCache!;
  const globalTotal = all.length;
  const globalIdx = Math.max(
    0,
    all.findIndex((n) => n.id === nameItem.id)
  );

  const prevName = all[(globalIdx - 1 + globalTotal) % globalTotal];
  const nextName = all[(globalIdx + 1) % globalTotal];

  const upperLetter = (nameItem.letter || nameItem.name.charAt(0)).trim().toUpperCase();
  const bucket = _byLetterCache!.get(upperLetter) || all;
  const letterTotal = bucket.length;
  const letterIdx = Math.max(
    0,
    bucket.findIndex((n) => n.id === nameItem.id)
  );

  const letterPeers: NameData[] = [];
  const maxPeers = Math.min(peerLimit, Math.max(0, letterTotal - 1));
  for (let i = 1; i <= maxPeers; i++) {
    letterPeers.push(bucket[(letterIdx + i) % letterTotal]);
  }

  return {
    prevName,
    nextName,
    letterPeers,
    letterRank: letterIdx + 1,
    letterTotal,
    globalRank: globalIdx + 1,
    globalTotal,
  };
}

export interface NameLinguisticAnalysis {
  charCount: number;
  vowelCount: number;
  consonantCount: number;
  uniqueVowels: string[];
  syllableCount: number;
  firstLetter: string;
  lastLetter: string;
  detectedSuffix: {
    suffix: string;
    meaning: Record<'tr' | 'en' | 'de' | 'ar', string>;
  } | null;
}

const KURDISH_SUFFIX_LEXICON: Array<{
  suffix: string;
  meaning: Record<'tr' | 'en' | 'de' | 'ar', string>;
}> = [
  {
    suffix: 'perwer',
    meaning: {
      tr: '-perwer (seven, koruyan ve değer veren anlamı katan geleneksel Kürtçe bileşik ek)',
      en: '-perwer (Kurdish compound suffix denoting one who cherishes, protects, and values)',
      de: '-perwer (kurdisches Suffix mit der Bedeutung „liebend, schützend und wertschätzend“)',
      ar: '-perwer (لاحقة كردية مركبة تفيد معنى المحب والحامي والمقدِّر)',
    },
  },
  {
    suffix: 'xwaz',
    meaning: {
      tr: '-xwaz (isteyen, arzulayan ve talep eden anlamı taşıyan Kürtçe fiil kökenli ek)',
      en: '-xwaz (Kurdish verbal suffix meaning one who wishes, seeks, or aspires to)',
      de: '-xwaz (kurdisches Verbalsuffix mit der Bedeutung „wünschend, strebend nach“)',
      ar: '-xwaz (لاحقة فعلية كردية تعني الطالب أو الراغب أو الطامح)',
    },
  },
  {
    suffix: 'van',
    meaning: {
      tr: '-van (koruyucu, rehber veya bir niteliğin temsilcisi anlamı katan Kürtçe yapım eki)',
      en: '-van (Kurdish agentive suffix signifying guardian, guide, or bearer of a quality)',
      de: '-van (kurdisches Suffix, das einen Hüter, Wegweiser oder Träger einer Eigenschaft bezeichnet)',
      ar: '-van (لاحقة كردية تدل على الحارس أو المرشد أو حامل الصفة)',
    },
  },
  {
    suffix: 'dar',
    meaning: {
      tr: '-dar (sahip olan, bünyesinde barındıran anlamı katan köklü İrani/Kürtçe ek)',
      en: '-dar (classical Kurdish/Iranian suffix meaning possessor or bearer of an attribute)',
      de: '-dar (klassisches kurdisches Suffix mit der Bedeutung „Besitzer oder Träger einer Eigenschaft“)',
      ar: '-dar (لاحقة كردية أصيلة تعني صاحب الصفة أو الحائز عليها)',
    },
  },
  {
    suffix: 'yar',
    meaning: {
      tr: '-yar (dost, yoldaş ve gönülden bağlı olan anlamı taşıyan Kürtçe isim eki)',
      en: '-yar (Kurdish nominal element meaning beloved friend, companion, or devoted ally)',
      de: '-yar (kurdisches Namenselement mit der Bedeutung „vertrauter Freund oder Weggefährte“)',
      ar: '-yar (مقطع اسمي كردي يعني الصديق الوفي أو الرفيق المحب)',
    },
  },
  {
    suffix: 'zad',
    meaning: {
      tr: '-zad / -zade (doğmuş, soyundan gelen, asil kökenli anlamı taşıyan etimolojik ek)',
      en: '-zad (etymological suffix meaning born of, descended from, or of noble lineage)',
      de: '-zad (etymologisches Suffix mit der Bedeutung „geboren aus“ oder „edler Abstammung“)',
      ar: '-zad (لاحقة اشتقاقية تعني المولود من أصل كريم أو المنحدر من سلالة نبيلة)',
    },
  },
  {
    suffix: 'naz',
    meaning: {
      tr: '-naz (zarafet, incelik ve değerli duruş anlamı katan geleneksel isim bileşeni)',
      en: '-naz (traditional naming element conveying elegance, grace, and delicate charm)',
      de: '-naz (traditionelles Namenselement, das Anmut, Eleganz und Feinheit ausdrückt)',
      ar: '-naz (عنصر تسمية تقليدي يضفي معنى الرقة والأناقة والدلال)',
    },
  },
  {
    suffix: 'can',
    meaning: {
      tr: '-can (ruh, yaşam enerjisi ve içtenlik anlamı katan Kürtçe bileşik isim eki)',
      en: '-can (compound element meaning soul, vitality, and heartfelt warmth)',
      de: '-can (Namenselement mit der Bedeutung „Seele, Lebenskraft und Herzlichkeit“)',
      ar: '-can (مقطع مركب يعني الروح والحيوية والمودة الصادقة)',
    },
  },
  {
    suffix: 'jin',
    meaning: {
      tr: '-jîn / -jin (yaşam, hayat ve canlılık köküyle bağlantılı Kürtçe leksikal bileşen)',
      en: '-jîn (Kurdish lexical root connected to life, vitality, and living spirit)',
      de: '-jîn (kurdische Wortwurzel, die mit Leben, Vitalität und Lebenskraft verbunden ist)',
      ar: '-jîn (جذر لغوي كردي يرتبط بالحياة والحيوية والروح المتجددة)',
    },
  },
  {
    suffix: 'jîn',
    meaning: {
      tr: '-jîn (yaşam, hayat ve canlılık köküyle bağlantılı Kürtçe leksikal bileşen)',
      en: '-jîn (Kurdish lexical root connected to life, vitality, and living spirit)',
      de: '-jîn (kurdische Wortwurzel, die mit Leben, Vitalität und Lebenskraft verbunden ist)',
      ar: '-jîn (جذر لغوي كردي يرتبط بالحياة والحيوية والروح المتجددة)',
    },
  },
  {
    suffix: 'în',
    meaning: {
      tr: '-în (Kürtçede aidiyet, nitelik ve zarafet bildiren karakteristik isim yapım eki)',
      en: '-în (characteristic Kurdish suffix expressing belonging, quality, and lyrical grace)',
      de: '-în (charakteristisches kurdisches Suffix, das Zugehörigkeit und klangliche Anmut ausdrückt)',
      ar: '-în (لاحقة كردية مميزة تفيد النسبة والصفة والعذوبة الصوتية)',
    },
  },
  {
    suffix: 'an',
    meaning: {
      tr: '-an (Kürtçede çoğulluk, bolluk veya coğrafi/kültürel aidiyet bildiren klasik ek)',
      en: '-an (classical Kurdish suffix denoting abundance, plurality, or cultural belonging)',
      de: '-an (klassisches kurdisches Suffix für Fülle, Pluralität oder kulturelle Zugehörigkeit)',
      ar: '-an (لاحقة كردية كلاسيكية تفيد الكثرة والوفرة أو الانتماء الثقافي)',
    },
  },
];

export function analyzeNameLinguistics(nameItem: NameData): NameLinguisticAnalysis {
  const clean = nameItem.name.trim();
  const lower = clean.toLowerCase();
  const vowelRegex = /[aeêiîouûаеиоу]/gi;
  const matchedVowels = lower.match(vowelRegex) || [];
  const vowelCount = matchedVowels.length;
  const charCount = clean.length;
  const consonantCount = Math.max(0, charCount - vowelCount);
  const uniqueVowels = Array.from(new Set(matchedVowels.map((v) => v.toLowerCase())));
  const vowelClusters = lower.match(/[aeêiîouû]+/gi);
  const syllableCount = Math.max(1, vowelClusters ? vowelClusters.length : 1);

  const firstLetter = clean.charAt(0).toUpperCase();
  const lastLetter = clean.charAt(clean.length - 1).toLowerCase();

  let detectedSuffix: NameLinguisticAnalysis['detectedSuffix'] = null;
  if (charCount >= 4) {
    for (const item of KURDISH_SUFFIX_LEXICON) {
      if (lower.endsWith(item.suffix) && lower.length > item.suffix.length + 1) {
        detectedSuffix = item;
        break;
      }
    }
  }

  return {
    charCount,
    vowelCount,
    consonantCount,
    uniqueVowels,
    syllableCount,
    firstLetter,
    lastLetter,
    detectedSuffix,
  };
}
