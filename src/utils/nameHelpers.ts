import { NameData } from "../data/names";

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

/**
 * Truncates name meanings elegantly for compact grid items.
 * Prioritizes the first complete sentence, and limits output to the specified max length.
 */
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

/**
 * Calculates a unique seed for the current week.
 * Seed format: YYYYWW (e.g. 202621 for the 21st week of 2026)
 */
export function getWeeklySeed(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return now.getFullYear() * 100 + weekNumber;
}

/**
 * A simple seeded random number generator (Linear Congruential Generator).
 * Returns a function that produces deterministic pseudo-random numbers between 0 and 1.
 */
export function lcg(seed: number) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}


