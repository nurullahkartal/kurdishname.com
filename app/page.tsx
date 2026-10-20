import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, supportedLanguages } from '@/lib/routes-config';

export const metadata: Metadata = {
  title: 'KurdishName — En Kapsamlı Kürtçe İsimler Arşivi & Sözlüğü',
  description:
    '10.233+ Kürtçe kız ve erkek bebek ismi, anlamları, etimolojik kökenleri ve telaffuz rehberi.',
  alternates: {
    canonical: SITE_URL,
    languages: {
      tr: `${SITE_URL}/tr`,
      en: `${SITE_URL}/en`,
      de: `${SITE_URL}/de`,
      ar: `${SITE_URL}/ar`,
      'x-default': `${SITE_URL}/en`,
    },
  },
};

const languageLabels: Record<string, string> = {
  tr: 'Türkçe — Kürtçe İsimler Sözlüğü',
  en: 'English — Kurdish Names Dictionary',
  de: 'Deutsch — Kurdisches Namenlexikon',
  ar: 'العربية — قاموس الأسماء الكردية',
};

export default function RootPage() {
  const redirectScript = `(function(){try{var l=(navigator.language||navigator.userLanguage||'').toLowerCase();if(l.indexOf('tr')===0){window.location.replace('/tr');}else if(l.indexOf('en')===0){window.location.replace('/en');}else if(l.indexOf('de')===0){window.location.replace('/de');}else if(l.indexOf('ar')===0){window.location.replace('/ar');}else{window.location.replace('/en');}}catch(e){}})();`;

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <h1 className="text-4xl font-bold mb-4">KurdishName</h1>
      <p className="text-lg opacity-80 mb-8">
        10,233+ Kurdish Baby Names, Meanings, Origins &amp; Etymology Encyclopedia
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {supportedLanguages.map((lang) => (
          <Link
            key={lang}
            href={`/${lang}`}
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] font-semibold transition-colors"
          >
            {languageLabels[lang]}
          </Link>
        ))}
      </div>
    </main>
  );
}
