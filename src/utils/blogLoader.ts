/**
 * Dynamic, content-driven multi-lingual blog engine loader.
 * Employs Vite's dynamic code-splitting imports to pull localized JSON datasets on demand.
 * This guarantees that your core bundle is never bloated by the 400+ SEO articles.
 */

export interface BlogContentPayload {
  title: string;
  desc: string;
  content: string;
  author?: {
    name: string;
    url?: string;
  };
  dateModified?: string;
  isListicle?: boolean;
  listicleNames?: string[];
}

export async function loadBlogPostContent(
  lang: string,
  postId: string
): Promise<BlogContentPayload | null> {
  const cleanLang = (lang || "tr").toLowerCase();
  const activeLang = ["tr", "en", "de", "ar"].includes(cleanLang) ? cleanLang : "tr";

  try {
    let module;
    // Explicit static string templates are used to allow Vite to compile each file as a split chunk on build.
    switch (activeLang) {
      case "tr":
        module = await import(`../data/blog/tr/${postId}.json`);
        break;
      case "en":
        module = await import(`../data/blog/en/${postId}.json`);
        break;
      case "de":
        module = await import(`../data/blog/de/${postId}.json`);
        break;
      case "ar":
        module = await import(`../data/blog/ar/${postId}.json`);
        break;
      default:
        module = await import(`../data/blog/tr/${postId}.json`);
    }

    return module.default || module;
  } catch (error) {
    console.warn(`Dynamic loading of blog post content skipped/not found for: ${activeLang}/${postId}`, error);
    return null;
  }
}
