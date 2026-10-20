import fs from 'fs';
import path from 'path';
import { getBlogPostBySlug, getBlogPostById, type BlogPostMeta } from './blog-registry';
import { getAllNames } from './names-data';
import { generatePath } from './routes-config';

export interface BlogContentPayload {
  title: string;
  desc: string;
  content: string;
  isListicle?: boolean;
  listicleNames?: string[];
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

const _contentCache = new Map<string, BlogContentPayload>();
let _faqsCache: Record<string, Record<string, BlogFaqItem[]>> | null = null;

function ensureFaqsLoaded(): Record<string, Record<string, BlogFaqItem[]>> {
  if (_faqsCache) return _faqsCache;
  const faqsPath = path.join(process.cwd(), 'content', 'blog-faqs.json');
  if (fs.existsSync(faqsPath)) {
    _faqsCache = JSON.parse(fs.readFileSync(faqsPath, 'utf-8'));
  } else {
    _faqsCache = {};
  }
  return _faqsCache!;
}

export function getBlogPostContent(
  locale: string,
  idOrSlug: string
): { meta: BlogPostMeta; payload: BlogContentPayload } | null {
  const cleanLang = ['tr', 'en', 'de', 'ar'].includes(locale) ? locale : 'tr';
  const meta = getBlogPostBySlug(cleanLang, idOrSlug) || getBlogPostById(idOrSlug);
  if (!meta) return null;

  const cacheKey = `${cleanLang}:${meta.id}`;
  if (_contentCache.has(cacheKey)) {
    return { meta, payload: _contentCache.get(cacheKey)! };
  }

  const filePath = path.join(process.cwd(), 'content', 'blog', cleanLang, `${meta.id}.json`);
  let payload: BlogContentPayload;

  if (fs.existsSync(filePath)) {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    payload = {
      title: raw.title || meta.titles[cleanLang] || meta.titles.tr,
      desc: raw.desc || meta.descriptions[cleanLang] || meta.descriptions.tr,
      content: raw.content || raw.contentPayload || '',
      isListicle: raw.isListicle,
      listicleNames: raw.listicleNames,
    };
  } else {
    payload = {
      title: meta.titles[cleanLang] || meta.titles.tr,
      desc: meta.descriptions[cleanLang] || meta.descriptions.tr,
      content: '',
    };
  }

  _contentCache.set(cacheKey, payload);
  return { meta, payload };
}

export function getBlogPostFaqs(postId: string, locale: string): BlogFaqItem[] {
  const faqs = ensureFaqsLoaded();
  const cleanId = postId.toLowerCase();
  const activeLng = ['tr', 'en', 'de', 'ar'].includes(locale) ? locale : 'tr';
  const entry = faqs[cleanId] || faqs['girls-names-list'];
  const rawList = (entry?.[activeLng] || entry?.['en'] || entry?.['tr'] || []) as Array<{
    question?: string;
    answer?: string;
    q?: string;
    a?: string;
  }>;
  return rawList.map((item) => ({
    question: item.question || item.q || '',
    answer: item.answer || item.a || '',
  }));
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Server-side internal linking injector using singleton getAllNames() cache.
 * Runs exclusively at build time (0 client network/CPU cost).
 */
export function injectServerInternalLinks(content: string, locale: string): string {
  if (!content) return '';
  const allNames = getAllNames();
  if (allNames.length === 0) return content;

  const contentWords = new Set(
    content
      .toLowerCase()
      .split(/[^a-zA-Z0-9çğîûşêıİÖÜöüÇĞÎÛŞÊ’]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 1)
  );

  const candidateNames = allNames.filter((item) => contentWords.has(item.name.toLowerCase()));
  if (candidateNames.length === 0) return content;

  candidateNames.sort((a, b) => b.name.length - a.name.length);

  const placeholders: string[] = [];
  let processedContent = content;

  const hidePattern = (regex: RegExp) => {
    processedContent = processedContent.replace(regex, (match) => {
      const ph = `___LINK_PH_${placeholders.length}___`;
      placeholders.push(match);
      return ph;
    });
  };

  hidePattern(/```[\s\S]*?```/g);
  hidePattern(/`[^`]+`/g);
  hidePattern(/!\[[^\]]*\]\([^)]+\)/g);
  hidePattern(/\[[^\]]+\]\([^)]+\)/g);
  hidePattern(/^#+\s+.*$/gm);

  const linkedNames = new Set<string>();

  for (const nameItem of candidateNames) {
    const nameStr = nameItem.name;
    const nameLower = nameStr.toLowerCase();
    if (linkedNames.has(nameLower)) continue;

    const escapedName = escapeRegExp(nameStr);
    const pattern = new RegExp(
      `(^|[^a-zA-Z0-9çğîûşêıİÖÜöüÇĞÎÛŞÊ’])(${escapedName})($|’[a-zA-Z0-9çğîûşêıİÖÜöüÇĞÎÛŞÊ]+|[^a-zA-Z0-9çğîûşêıİÖÜöüÇĞÎÛŞÊ’])`,
      'i'
    );

    let replaced = false;
    processedContent = processedContent.replace(
      pattern,
      (match, prefix, matchedName, suffix) => {
        if (replaced) return match;
        replaced = true;
        linkedNames.add(nameLower);
        const linkPath = generatePath(locale, 'name', nameItem.id);
        return `${prefix}[${matchedName}](${linkPath})${suffix}`;
      }
    );
  }

  for (let i = placeholders.length - 1; i >= 0; i--) {
    processedContent = processedContent.replace(`___LINK_PH_${i}___`, () => placeholders[i]);
  }

  return processedContent;
}
