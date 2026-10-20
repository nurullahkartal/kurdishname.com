import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { supportedLanguages, isValidLocale, Locale } from '@/lib/routes-config';
import { FavoritesProvider } from '@/components/FavoritesContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return supportedLanguages.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  const headerLabels = {
    nav_home: t('nav_home'),
    nav_girls: t('girl_names'),
    nav_boys: t('boy_names'),
    nav_finder: t('nav_finder'),
    nav_compare: t('nav_compare'),
    nav_favorites: t('favorites_title'),
    nav_blog: t('blog_title'),
  };

  const footerLabels = {
    nav_girls: t('girl_names'),
    nav_boys: t('boy_names'),
    footer_about: t('about_title'),
    footer_editorial:
      locale === 'ar'
        ? 'مجلس التحرير'
        : locale === 'de'
        ? 'Redaktionsrat'
        : locale === 'en'
        ? 'Editorial Board'
        : 'Editoryal Kurul',
    footer_privacy: t('privacy_title'),
    footer_terms: t('terms_title'),
    footer_cookies: t('cookies_title'),
    footer_contact: t('contact_title'),
    footer_suggest: t('suggest_title'),
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <FavoritesProvider>
        <div
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          lang={locale}
          style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
          <Header locale={locale as Locale} labels={headerLabels} />
          <main className="enc-container" style={{ paddingTop: '1.75rem', paddingBottom: '4rem', flex: 1 }}>
            {children}
          </main>
          <Footer locale={locale as Locale} labels={footerLabels} />
        </div>
      </FavoritesProvider>
    </NextIntlClientProvider>
  );
}
