import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  isValidLocale,
  buildAlternatesMetadata,
  generatePath,
  themeSlugs,
  Locale,
} from '@/lib/routes-config';
import { getActiveLettersWithCounts } from '@/lib/names-data';
import { stats, homeGirlNames, homeBoyNames } from '@/lib/home-static-data';
import { getBlogPostsByLang } from '@/lib/blog-registry';
import { getLocalizedMeaning } from '@/lib/name-helpers';
import LazySearchClient from '@/components/LazySearchClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const alternates = buildAlternatesMetadata(locale, null);
  const title = t('site_title');
  const description = t('home_description');

  return {
    title,
    description,
    alternates,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: 'KurdishName',
      type: 'website',
      images: [{ url: 'https://kurdishname.com/og-image.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://kurdishname.com/og-image.jpg'],
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const activeLetters = getActiveLettersWithCounts();
  const recentPosts = getBlogPostsByLang(locale).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `https://kurdishname.com/${locale}#website`,
        name: 'KurdishName',
        url: `https://kurdishname.com/${locale}`,
        description: t('home_description'),
        inLanguage: locale,
      },
      {
        '@type': 'Organization',
        '@id': 'https://kurdishname.com/#editorial-board',
        name: 'KurdishName Editorial Board',
        url: 'https://kurdishname.com',
        logo: 'https://kurdishname.com/logo.webp',
        sameAs: ['https://kurdishname.com/en/editorial-board'],
      },
    ],
  };

  const themes = [
    { key: 'nature' as const, label: t('cat_theme_nature') },
    { key: 'power' as const, label: t('cat_theme_power') },
    { key: 'beauty' as const, label: t('cat_theme_beauty') },
    { key: 'light' as const, label: t('cat_theme_light') },
    { key: 'wisdom' as const, label: t('cat_theme_wisdom') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '2rem 1.25rem',
          borderRadius: 'var(--r-xl)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: '0.5rem',
          }}
        >
          {t('site_title')}
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {t('home_description')}
        </p>

        {/* Stats Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginTop: '1rem',
          }}
        >
          <span
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {stats.total.toLocaleString()} {t('names_found_count')}
          </span>
          <Link
            href={generatePath(locale, 'category', 'kiz')}
            className="badge-female"
            style={{ textDecoration: 'none', padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
          >
            {stats.female.toLocaleString()} {t('girl_names')}
          </Link>
          <Link
            href={generatePath(locale, 'category', 'erkek')}
            className="badge-male"
            style={{ textDecoration: 'none', padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
          >
            {stats.male.toLocaleString()} {t('boy_names')}
          </Link>
        </div>

        {/* Lazy Search Bar (loads /search_index.json ONLY onFocus) */}
        <LazySearchClient
          locale={locale as Locale}
          placeholder={t('search_placeholder')}
          searchBtnLabel={t('search_btn_label')}
          randomBtnLabel={t('home_btn_random')}
          girlLabel={t('gender_female')}
          boyLabel={t('gender_male')}
        />
      </section>

      {/* Alphabet Index (29 Active Letters including Ç, Ê, Î, Ş) */}
      <section>
        <h2 className="section-heading">{t('alphabet_title')}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {activeLetters.map(({ letter, count }) => (
            <Link
              key={letter}
              href={generatePath(locale, 'category', letter)}
              className="alpha-btn"
              title={`${letter} (${count})`}
            >
              {letter}
            </Link>
          ))}
        </div>
      </section>

      {/* Themes Grid */}
      <section>
        <h2 className="section-heading">{t('finder_step_theme')}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {themes.map((th) => (
            <Link
              key={th.key}
              href={generatePath(locale, 'category', themeSlugs[locale as Locale][th.key])}
              style={{
                padding: '1rem',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                textDecoration: 'none',
                color: 'var(--text)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
              className="hover:border-[var(--accent)] transition-colors"
            >
              {th.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Girl & Boy Names Two-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--female)', margin: 0 }}>
              {t('girl_names')}
            </h2>
            <Link
              href={generatePath(locale, 'category', 'kiz')}
              style={{ fontSize: '0.8rem', fontWeight: 700 }}
            >
              {t('blog_read_more')} →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {homeGirlNames.slice(0, 10).map((item) => (
              <Link
                key={item.id}
                href={generatePath(locale, 'name', item.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '0.5rem',
                  background: 'var(--surface-2)',
                  textDecoration: 'none',
                  gap: '0.75rem',
                }}
              >
                <strong style={{ color: 'var(--female)', fontSize: '0.95rem' }}>{item.name}</strong>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getLocalizedMeaning(item, locale)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--male)', margin: 0 }}>
              {t('boy_names')}
            </h2>
            <Link
              href={generatePath(locale, 'category', 'erkek')}
              style={{ fontSize: '0.8rem', fontWeight: 700 }}
            >
              {t('blog_read_more')} →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {homeBoyNames.slice(0, 10).map((item) => (
              <Link
                key={item.id}
                href={generatePath(locale, 'name', item.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '0.5rem',
                  background: 'var(--surface-2)',
                  textDecoration: 'none',
                  gap: '0.75rem',
                }}
              >
                <strong style={{ color: 'var(--male)', fontSize: '0.95rem' }}>{item.name}</strong>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getLocalizedMeaning(item, locale)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Blog Articles Section */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 className="section-heading" style={{ margin: 0, border: 'none' }}>
            {t('blog_title')}
          </h2>
          <Link href={generatePath(locale, 'blog')} style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            {t('blog_read_more')} →
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {recentPosts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <Link
                href={generatePath(locale, 'blog', post.slug)}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  textDecoration: 'none',
                  lineHeight: 1.35,
                }}
              >
                {post.title}
              </Link>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, flex: 1 }}>
                {post.desc}
              </p>
              <Link
                href={generatePath(locale, 'blog', post.slug)}
                style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.5rem' }}
              >
                {t('blog_read_more')} →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
