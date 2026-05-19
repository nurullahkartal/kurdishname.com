// Internal Linking Utility for KurdishName Blog Engine
// Automatically links name mentions in blog posts to their respective name details pages.

import { NameData } from "../data/names";
import { generatePath } from "./routes";

/**
 * Escapes regex special characters.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Automatically injects internal links to name details pages inside Markdown content.
 * Follows SEO best practices: only links the first occurrence of each unique name in the article.
 */
export function injectInternalLinks(content: string, allNames: NameData[], lng: string): string {
  if (!content || !allNames || allNames.length === 0) return content;

  // 1. Optimize lookup: Tokenize blog content to find only names actually mentioned
  // This avoids running thousands of RegExp operations on the blog text.
  const contentWords = new Set(
    content
      .toLowerCase()
      .split(/[^a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ’]+/)
      .map(w => w.trim())
      .filter(w => w.length > 1)
  );

  // Filter names that are present in the text
  const candidateNames = allNames.filter(nameItem => {
    const lowercaseName = nameItem.name.toLowerCase();
    return contentWords.has(lowercaseName);
  });

  if (candidateNames.length === 0) return content;

  // Sort candidate names by length descending (e.g. "Lorin" before "Lor")
  // to avoid shorter names matching inside longer names.
  candidateNames.sort((a, b) => b.name.length - a.name.length);

  // 2. Hide Markdown elements that should NOT be linked (links, images, code blocks, headers)
  const placeholders: string[] = [];
  let processedContent = content;

  // Hidden structures regexes
  const codeBlockRegex = /```[\s\S]*?```/g;
  const inlineCodeRegex = /`[^`]+`/g;
  const imageRegex = /!\[[^\]]*\]\([^)]+\)/g;
  const linkRegex = /\[[^\]]+\]\([^)]+\)/g;
  const headerRegex = /^#+\s+.*$/gm;

  // Replace structures with placeholders
  const hidePattern = (regex: RegExp) => {
    processedContent = processedContent.replace(regex, (match) => {
      const ph = `___LINK_PH_${placeholders.length}___`;
      placeholders.push(match);
      return ph;
    });
  };

  hidePattern(codeBlockRegex);
  hidePattern(inlineCodeRegex);
  hidePattern(imageRegex);
  hidePattern(linkRegex);
  hidePattern(headerRegex);

  // 3. Replace candidate names (Only first occurrence of each unique name)
  const linkedNames = new Set<string>();

  candidateNames.forEach((nameItem) => {
    const nameStr = nameItem.name;
    const nameLower = nameStr.toLowerCase();

    if (linkedNames.has(nameLower)) return;

    // Custom boundary for Turkish/Kurdish characters to support suffixes
    // We match the name only if preceded and followed by non-alphanumeric chars (excluding apostrophe for suffixes)
    const escapedName = escapeRegExp(nameStr);
    
    // Pattern matches the name at word boundary, allowing suffixes (e.g., Berfîn'in, Berfîn'e)
    // Matches the name with a suffix or just the name
    const pattern = new RegExp(
      `(^|[^a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ’])(${escapedName})($|’[a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ]+|[^a-zA-Z0-9çğîûşêıîöüçğîûşêıİÖÜöüÇĞÎÛŞÊ’])`,
      "i"
    );

    let replaced = false;
    processedContent = processedContent.replace(pattern, (match, prefix, matchedName, suffix) => {
      if (replaced) return match; // Only replace the first occurrence
      
      // Future protection: Do not link if ID is somehow invalid or missing
      const isValidId = allNames.some(n => n.id === nameItem.id);
      if (!isValidId) {
        return `${prefix}<span>${matchedName}</span>${suffix}`; // link verme
      }
      
      replaced = true;
      linkedNames.add(nameLower);
      const targetPath = generatePath(lng, "name", nameItem.id);
      return `${prefix}[${matchedName}](${targetPath})${suffix}`;
    });
  });

  // 4. Restore the hidden markdown structures
  for (let i = placeholders.length - 1; i >= 0; i--) {
    processedContent = processedContent.replace(`___LINK_PH_${i}___`, placeholders[i]);
  }

  return processedContent;
}
