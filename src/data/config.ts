// Drip-Feed Configuration for Programmatic Content Indexing
// Only names and categories belonging to these letters will be exposed in sitemaps 
// and marked as 'index, follow'. All other letters remain fully searchable for real 
// human utility but are hidden from crawl bots via 'noindex, follow' to prevent spam triggers.
export const ACTIVE_LETTERS = ['A', 'B', 'H'] as const;

export type ActiveLetter = typeof ACTIVE_LETTERS[number];

export function isLetterActive(letter: string): boolean {
  return ACTIVE_LETTERS.includes(letter.trim().toUpperCase() as any);
}
