export interface NameData {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  letter: string;
  description?: string;
  meaning: string;
  meaning_en?: string;
  meaning_de?: string;
  meaning_ar?: string;
  origin?: string;
  tags?: string[];
  etymology_tr?: string;
  etymology_en?: string;
  etymology_de?: string;
  etymology_ar?: string;
  spellings?: {
    latin?: string;
    arabic?: string;
    cyrillic?: string;
  };
  famousPeople?: string[];
}

export const namesData: NameData[] = [];

export const getCombinedNames = (): NameData[] => {
  if (typeof window === 'undefined') return [];
  try {
    const localNamesStr = localStorage.getItem('addedNames');
    const localNames: NameData[] = localNamesStr ? JSON.parse(localNamesStr) : [];
    return localNames;
  } catch (e) {
    return [];
  }
};
