import { NameData } from "../data/names";

/**
 * Returns the localized meaning of a name based on the current language.
 * Falls back to the Turkish meaning if the localized one is not available.
 */
export function getLocalizedMeaning(nameItem: NameData, lng: string): string {
  const cleanLng = (lng || "").split("-")[0].split("_")[0].toLowerCase();
  if (cleanLng === "en" && nameItem.meaning_en) return nameItem.meaning_en;
  if (cleanLng === "de" && nameItem.meaning_de) return nameItem.meaning_de;
  if (cleanLng === "ar" && nameItem.meaning_ar) return nameItem.meaning_ar;
  return nameItem.meaning;
}

/**
 * Returns the localized origin text.
 * Expects origin strings like "Kürtçe", "Arapça", "Krt/Frs".
 */
export function getLocalizedOrigin(origin: string | undefined, t: any): string {
  if (!origin) return t("default_origin", "—");
  
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
  return t(key, { defaultValue: origin });
}
