import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import {
  supportedLanguages,
  isValidLocale,
  routeTranslations,
  getRouteKeyBySegment,
  generatePath,
  RouteKey,
  Locale,
} from '@/lib/routes-config';
import { buildPageMetadata } from '@/lib/seo-metadata';
import { getBlogPostsByLang } from '@/lib/blog-registry';
import { getActiveLettersWithCounts } from '@/lib/names-data';
import FinderClient from '@/components/FinderClient';
import CompareClient from '@/components/CompareClient';
import SuggestClient from '@/components/SuggestClient';
import FavoritesClient from '@/components/FavoritesClient';
import ContactClient from '@/components/ContactClient';

const STATIC_SECTIONS: RouteKey[] = [
  'blog',
  'finder',
  'compare',
  'favorites',
  'suggest',
  'about',
  'editorial',
  'contact',
  'privacy',
  'terms',
  'cookies',
  'alphabet',
  'mythology',
  'tribes',
  'surnames',
];

export function generateStaticParams() {
  const params: { locale: string; section: string }[] = [];
  for (const locale of supportedLanguages) {
    for (const key of STATIC_SECTIONS) {
      params.push({
        locale,
        section: routeTranslations[locale][key],
      });
    }
  }
  return params;
}

const EDITORIAL_CONTENT = {
  tr: {
    title: 'KurdishName Editoryal Kurulu',
    subtitle: 'Dil ve Tarih Araştırmaları Kurulu',
    metaDesc:
      'KurdishName Editoryal Kurulu, Kürtçe isimler üzerine bağımsız akademik araştırma yürüten ve dünyanın en kapsamlı dijital Kürtçe isim sözlüğünü derleyen bir dilbilim araştırma kuruludur.',
    missionHeading: 'Misyon ve Kapsam',
    missionBody:
      'KurdishName Editoryal Kurulu; Kurmancî, Soranî ve Zazaki lehçelerini kapsayan kapsamlı Kürtçe isim belgelerini derlemek, doğrulamak ve yayımlamak amacıyla kurulmuş bağımsız bir akademik araştırma kuruludur.',
    sourcesHeading: 'Referans Havuzu',
    sources: [
      'Ferhenga Kurmancî — Kurmancî lehçesinin kapsamlı sözlükleri',
      'Kurdipedia — Kürtçe bilgi arşivi ve isim veri tabanı',
      'Kürt Dil Enstitüsü (KDI) — Dilbilim araştırmaları ve yayınları',
      'Mezopotamya Dil Arşivleri — Tarihsel isim kayıtları',
      'Sorani ve Zazaki akademik sözlükleri',
    ],
  },
  en: {
    title: 'KurdishName Editorial Board',
    subtitle: 'Linguistics & Historical Research Board',
    metaDesc:
      'The KurdishName Editorial Board is an independent academic research body that curates the most comprehensive digital Kurdish name dictionary across Kurmanji, Sorani, and Zazaki dialects.',
    missionHeading: 'Mission & Scope',
    missionBody:
      'The KurdishName Editorial Board is an independent academic research body established to compile, verify, and publish comprehensive Kurdish name documentation spanning Kurmanji, Sorani, and Zazaki dialects.',
    sourcesHeading: 'Reference Repository',
    sources: [
      'Ferhenga Kurmancî — Comprehensive dictionaries of the Kurmanji dialect',
      'Kurdipedia — Kurdish knowledge archive and name database',
      'Kurdish Language Institute (KDI) — Linguistic research and publications',
      'Mesopotamian Language Archives — Historical name records',
      'Sorani and Zazaki academic dictionaries',
    ],
  },
  de: {
    title: 'KurdishName Redaktionsrat',
    subtitle: 'Forschungsrat für Linguistik und Geschichte',
    metaDesc:
      'Der KurdishName Redaktionsrat ist ein unabhängiges akademisches Forschungsgremium, das das weltweit umfassendste digitale Wörterbuch kurdischer Namen kuratiert.',
    missionHeading: 'Mission & Umfang',
    missionBody:
      'Der KurdishName Redaktionsrat ist ein unabhängiges akademisches Forschungsgremium, das gegründet wurde, um umfassende kurdische Namendokumentationen zu sammeln, zu überprüfen und zu veröffentlichen.',
    sourcesHeading: 'Referenzrepository',
    sources: [
      'Ferhenga Kurmancî — Umfassende Wörterbücher des Kurmandschi-Dialekts',
      'Kurdipedia — Kurdisches Wissensarchiv und Namensdatenbank',
      'Kurdisches Sprachinstitut (KDI) — Linguistische Forschung und Veröffentlichungen',
      'Mesopotamische Spracharchive — Historische Namensaufzeichnungen',
      'Akademische Wörterbücher des Sorani und Zazaisch',
    ],
  },
  ar: {
    title: 'مجلس التحرير في KurdishName',
    subtitle: 'مجلس البحث اللغوي والتاريخي',
    metaDesc:
      'مجلس تحرير KurdishName هو هيئة بحثية أكاديمية مستقلة تُشرف على أشمل قاموس رقمي للأسماء الكردية في العالم عبر لهجات الكرمانجية والسورانية والزازائية.',
    missionHeading: 'الرسالة والنطاق',
    missionBody:
      'مجلس تحرير KurdishName هيئة بحثية أكاديمية مستقلة أُسِّست لجمع وتحقق ونشر التوثيق الشامل للأسماء الكردية عبر لهجات الكرمانجية والسورانية والزازائية.',
    sourcesHeading: 'مستودع المراجع',
    sources: [
      'Ferhenga Kurmancî — قواميس شاملة للهجة الكرمانجية',
      'Kurdipedia — أرشيف المعرفة الكردية وقاعدة بيانات الأسماء',
      'معهد اللغة الكردية (KDI) — أبحاث ومنشورات لغوية',
      'أرشيفات اللغة الميزوبوتامية — سجلات الأسماء التاريخية',
      'قواميس أكاديمية للسورانية والزازائية',
    ],
  },
} as const;

async function getSectionTitleAndDesc(locale: Locale, routeKey: RouteKey) {
  const t = await getTranslations({ locale });
  switch (routeKey) {
    case 'blog':
      return { title: `${t('blog_title')} | KurdishName`, description: t('seo_blog_desc') };
    case 'finder':
      return { title: `${t('finder_title')} | KurdishName`, description: t('finder_seo_desc') };
    case 'compare':
      return { title: `${t('compare_seo_title')} | KurdishName`, description: t('compare_seo_desc') };
    case 'favorites':
      return { title: `${t('favorites_title')} | KurdishName`, description: t('favorites_seo_desc') };
    case 'suggest':
      return { title: `${t('suggest_seo_title')} | KurdishName`, description: t('suggest_seo_desc') };
    case 'about':
      return { title: `${t('about_title')} | KurdishName`, description: t('about_seo_desc') };
    case 'editorial':
      return {
        title: `${EDITORIAL_CONTENT[locale].title} | KurdishName`,
        description: EDITORIAL_CONTENT[locale].metaDesc,
      };
    case 'contact':
      return { title: `${t('contact_title')} | KurdishName`, description: t('contact_seo_desc') };
    case 'privacy':
      return { title: `${t('privacy_title')} | KurdishName`, description: t('privacy_seo_desc') };
    case 'terms':
      return { title: `${t('terms_title')} | KurdishName`, description: t('terms_seo_desc') };
    case 'cookies':
      return { title: `${t('cookies_title')} | KurdishName`, description: t('cookies_seo_desc') };
    case 'alphabet':
      return { title: `${t('alphabet_title')} | KurdishName`, description: t('home_description') };
    case 'mythology':
      return { title: `Kurdish Mythology & Names | KurdishName`, description: t('home_description') };
    case 'tribes':
      return { title: `Kurdish Tribes & Heritage | KurdishName`, description: t('home_description') };
    case 'surnames':
      return { title: `Kurdish Surnames & Lineage | KurdishName`, description: t('home_description') };
    default:
      return { title: 'KurdishName', description: t('home_description') };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}): Promise<Metadata> {
  const { locale, section } = await params;
  if (!isValidLocale(locale)) return {};

  const routeKey = getRouteKeyBySegment(locale, section);
  if (!routeKey || !STATIC_SECTIONS.includes(routeKey)) {
    return {};
  }

  setRequestLocale(locale);
  const { title, description } = await getSectionTitleAndDesc(locale, routeKey);

  return buildPageMetadata({
    locale,
    title,
    description,
    routeKey,
  });
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const routeKey = getRouteKeyBySegment(locale, section);
  if (!routeKey || !STATIC_SECTIONS.includes(routeKey)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  if (routeKey === 'blog') {
    const posts = getBlogPostsByLang(locale);
    return (
      <div>
        <h1 className="page-title">{t('blog_title')}</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {posts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, lineHeight: 1.35 }}>
                <Link
                  href={generatePath(locale, 'blog', post.slug)}
                  style={{ color: 'var(--text)', textDecoration: 'none' }}
                >
                  {post.title}
                </Link>
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 600 }}>
                {post.date} • {post.author}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, flex: 1 }}>
                {post.desc}
              </p>
              <Link
                href={generatePath(locale, 'blog', post.slug)}
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  marginTop: '0.5rem',
                }}
              >
                {t('blog_read_more')} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (routeKey === 'finder') {
    return (
      <FinderClient
        locale={locale}
        labels={{
          finder_title: t('finder_title'),
          finder_intro_desc: t('finder_intro_desc'),
          finder_step_gender: t('finder_step_gender'),
          finder_step_theme: t('finder_step_theme'),
          finder_step_letter: t('finder_step_letter'),
          finder_step_results: t('finder_step_results'),
          girl_names: t('girl_names'),
          boy_names: t('boy_names'),
          theme_mixed: t('theme_mixed'),
          cat_theme_nature: t('cat_theme_nature'),
          cat_theme_power: t('cat_theme_power'),
          cat_theme_beauty: t('cat_theme_beauty'),
          cat_theme_light: t('cat_theme_light'),
          cat_theme_wisdom: t('cat_theme_wisdom'),
          home_btn_finder: t('home_btn_finder'),
          loading: { tr: 'Yükleniyor...', en: 'Loading...', de: 'Wird geladen...', ar: 'جاري التحميل...' }[locale],
          gender_female: t('gender_female'),
          gender_male: t('gender_male'),
          no_results_found: t('no_results_title'),
          try_again_flexible: t('no_results_desc'),
        }}
      />
    );
  }

  if (routeKey === 'compare') {
    return (
      <CompareClient
        locale={locale}
        labels={{
          compare_title: t('compare_title'),
          compare_desc: t('compare_desc'),
          compare_label_1: t('compare_label_1'),
          compare_label_2: t('compare_label_2'),
          compare_placeholder: t('compare_placeholder'),
          compare_harmony_score: t('compare_harmony_score'),
          compare_stat_meaning: t('compare_stat_meaning'),
          compare_stat_origin: t('compare_stat_origin'),
          compare_stat_length: t('compare_stat_length'),
          view_details: t('blog_read_more'),
          gender_female: t('gender_female'),
          gender_male: t('gender_male'),
          harmony_poor: { tr: 'Farklı Frekanslar', en: 'Different Frequencies', de: 'Unterschiedliche Frequenzen', ar: 'ترددات مختلفة' }[locale],
          harmony_neutral: t('harmony_neutral'),
          harmony_good: t('harmony_good'),
          harmony_perfect: t('harmony_perfect'),
        }}
      />
    );
  }

  if (routeKey === 'suggest') {
    return (
      <SuggestClient
        locale={locale}
        labels={{
          back_to_home: t('back_to_home'),
          suggest_badge: t('suggest_badge'),
          suggest_title: t('suggest_title'),
          suggest_desc: t('suggest_desc'),
          suggest_label_name: t('suggest_label_name'),
          suggest_placeholder_name: t('suggest_placeholder_name'),
          suggest_label_gender: t('suggest_label_gender'),
          gender_female: t('gender_female'),
          gender_male: t('gender_male'),
          suggest_label_meaning: t('suggest_label_meaning'),
          suggest_placeholder_meaning: t('suggest_placeholder_meaning'),
          suggest_label_email: t('suggest_label_email'),
          suggest_btn_submit: t('suggest_btn_submit'),
          suggest_success_title: t('suggest_success_title'),
          suggest_success_desc: t('suggest_success_desc'),
        }}
      />
    );
  }

  if (routeKey === 'favorites') {
    return (
      <FavoritesClient
        locale={locale}
        labels={{
          back_to_home: t('back_to_home'),
          favorites_title: t('favorites_title'),
          favorites_subtitle: t('favorites_subtitle'),
          favorites_clear_all: t('favorites_clear_all'),
          favorites_empty_title: t('favorites_title'),
          favorites_empty: t('favorites_empty'),
          discover_names_btn: t('favorites_browse_btn'),
          gender_female: t('gender_female'),
          gender_male: t('gender_male'),
        }}
      />
    );
  }

  if (routeKey === 'contact') {
    return (
      <ContactClient
        labels={{
          contact_title: t('contact_title'),
          contact_desc: t('contact_desc'),
          contact_email_label: t('contact_email_label'),
          contact_name: t('contact_name'),
          contact_name_ph: t('contact_name_ph'),
          contact_email: t('contact_email'),
          contact_email_ph: t('contact_email_ph'),
          contact_msg: t('contact_msg'),
          contact_msg_ph: t('contact_msg_ph'),
          contact_submit: t('contact_submit'),
          contact_success: t('contact_success'),
        }}
      />
    );
  }

  if (routeKey === 'about') {
    return (
      <div>
        <h1 className="page-title">{t('about_title')}</h1>
        {[
          { h: t('about_vision_title'), p: t('about_vision_p') },
          { h: t('about_archive_title'), p: t('about_archive_p') },
          { h: t('about_trans_title'), p: t('about_trans_p') },
          { h: t('about_feedback_title'), p: t('about_feedback_p') },
        ].map((sec, idx) => (
          <section key={idx} style={{ marginBottom: '2rem' }}>
            <h2 className="section-heading">{sec.h}</h2>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>{sec.p}</p>
          </section>
        ))}
      </div>
    );
  }

  if (routeKey === 'editorial') {
    const c = EDITORIAL_CONTENT[locale];
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://kurdishname.com/#editorial-board',
      name: 'KurdishName Editorial Board',
      url: `https://kurdishname.com${generatePath(locale, 'editorial')}`,
      logo: 'https://kurdishname.com/logo.webp',
      description: c.metaDesc,
    };
    return (
      <article style={{ maxWidth: '820px', margin: '0 auto' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <h1 className="page-title">{c.title}</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          {c.subtitle}
        </p>
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2 className="section-heading">{c.missionHeading}</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>
            {c.missionBody}
          </p>
        </section>
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.5rem',
          }}
        >
          <h2 className="section-heading">{c.sourcesHeading}</h2>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
            {c.sources.map((src, i) => (
              <li key={i}>{src}</li>
            ))}
          </ul>
        </section>
      </article>
    );
  }

  if (routeKey === 'privacy') {
    return (
      <div>
        <h1 className="page-title">{t('privacy_title')}</h1>
        {[
          { h: `1. ${t('privacy_h1')}`, p: t('privacy_p1') },
          { h: `2. ${t('privacy_h2')}`, p: t('privacy_p2') },
          { h: `3. ${t('privacy_h3')}`, p: t('privacy_p3') },
          { h: `4. ${t('privacy_h4')}`, p: t('privacy_p4') },
          { h: `5. ${t('privacy_h5')}`, p: t('privacy_p5') },
        ].map((sec, i) => (
          <section key={i} style={{ marginBottom: '1.75rem' }}>
            <h2 className="section-heading">{sec.h}</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>
              {sec.p}
            </p>
          </section>
        ))}
      </div>
    );
  }

  if (routeKey === 'terms') {
    return (
      <div>
        <h1 className="page-title">{t('terms_title')}</h1>
        {[
          { h: `1. ${t('terms_h1')}`, p: t('terms_p1') },
          { h: `2. ${t('terms_h2')}`, p: t('terms_p2') },
          { h: `3. ${t('terms_h3')}`, p: t('terms_p3') },
          { h: `4. ${t('terms_h4')}`, p: t('terms_p4') },
        ].map((sec, i) => (
          <section key={i} style={{ marginBottom: '1.75rem' }}>
            <h2 className="section-heading">{sec.h}</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>
              {sec.p}
            </p>
          </section>
        ))}
      </div>
    );
  }

  if (routeKey === 'cookies') {
    return (
      <div>
        <h1 className="page-title">{t('cookies_title')}</h1>
        {[
          { h: `1. ${t('cookies_h1')}`, p: t('cookies_p1') },
          { h: `2. ${t('cookies_h2')}`, p: t('cookies_p2') },
          { h: `3. ${t('cookies_h3')}`, p: t('cookies_p3') },
        ].map((sec, i) => (
          <section key={i} style={{ marginBottom: '1.75rem' }}>
            <h2 className="section-heading">{sec.h}</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>
              {sec.p}
            </p>
          </section>
        ))}
      </div>
    );
  }

  // alphabet, mythology, tribes, surnames
  const activeLetters = getActiveLettersWithCounts();
  return (
    <div>
      <h1 className="page-title">{t('alphabet_title')}</h1>
      <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        {t('home_description')}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {activeLetters.map(({ letter, count }) => (
          <Link
            key={letter}
            href={generatePath(locale, 'category', letter)}
            className="alpha-btn"
            style={{ width: 'auto', padding: '0 0.85rem', gap: '0.35rem' }}
          >
            <strong>{letter}</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
