"use client";

import { usePathname, useRouter } from 'next/navigation';
import { switchLanguagePath, routeTranslations, isValidLocale, Locale } from '@/lib/routes-config';
import { getBlogPostBySlug } from '@/lib/blog-registry';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname() || `/${currentLocale}`;
  const router = useRouter();

  const languages: { code: Locale; label: string }[] = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'ar', label: 'AR' },
  ];

  const resolveTargetPath = (targetLang: Locale): string => {
    const pathParts = pathname.split('/').filter(Boolean);
    const currentLocalePart = pathParts[0] && isValidLocale(pathParts[0]) ? pathParts[0] : currentLocale;
    const currentSegment = pathParts[1] ? decodeURIComponent(pathParts[1]) : '';
    const blogSegment = routeTranslations[currentLocalePart].blog;

    if (currentSegment === blogSegment && pathParts[2]) {
      const currentSlug = pathParts[2];
      const post = getBlogPostBySlug(currentLocalePart, currentSlug);
      if (post && post.slugs[targetLang]) {
        const targetBlogSeg = routeTranslations[targetLang].blog;
        return `/${targetLang}/${targetBlogSeg}/${post.slugs[targetLang]}`;
      }
    }

    return switchLanguagePath(pathname, targetLang);
  };

  const changeLang = (code: Locale) => {
    const newPath = resolveTargetPath(code);
    router.push(newPath);
  };

  return (
    <div>
      <div className="inline-block sm:hidden relative">
        <select
          value={currentLocale}
          onChange={(e) => changeLang(e.target.value as Locale)}
          aria-label="Language Select"
          className="lang-select-dropdown"
        >
          {languages.map((lng) => (
            <option key={lng.code} value={lng.code}>
              {lng.label}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden sm:flex items-center">
        {languages.map((lng, idx) => (
          <span key={lng.code} style={{ display: 'flex', alignItems: 'center' }}>
            {idx > 0 && (
              <span
                style={{
                  width: '1px',
                  height: '14px',
                  backgroundColor: 'var(--border)',
                  margin: '0 0.4rem',
                }}
              />
            )}
            <button
              type="button"
              onClick={() => changeLang(lng.code)}
              aria-label={`Switch language to ${lng.label}`}
              className="lang-switch-btn"
              style={{
                color: currentLocale === lng.code ? 'var(--text)' : 'var(--accent)',
                fontWeight: currentLocale === lng.code ? 700 : 400,
                textDecoration: currentLocale === lng.code ? 'none' : 'underline',
              }}
            >
              {lng.label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
