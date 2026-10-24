import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';
import {
  supportedLanguages,
  isValidLocale,
  routeTranslations,
  themeSlugs,
  getRouteKeyBySegment,
  getGenderFromSlug,
  getThemeFromSlug,
  generatePath,
  Locale,
  ThemeKey,
} from '@/lib/routes-config';
import {
  getAllNames,
  getNameBySlug,
  getNamesByLetter,
  getActiveLettersWithCounts,
  getSimilarNames,
  NameData,
} from '@/lib/names-data';
import {
  getBlogPostsByLang,
  getBlogPostBySlug,
} from '@/lib/blog-registry';
import {
  getBlogPostContent,
  getBlogPostFaqs,
  injectServerInternalLinks,
} from '@/lib/blog-loader';
import { generateDynamicFaqs } from '@/lib/faq-generator';
import { buildPageMetadata, generateContextualHook } from '@/lib/seo-metadata';
import { getLocalizedMeaning, getLocalizedOrigin } from '@/lib/name-helpers';
import { FavoriteButton } from '@/components/FavoritesContext';
import NameCardShareActions from '@/components/NameCardShareActions';

function generatePronunciation(name: string): string {
  let phonetic = name
    .replace(/[Ê]/g, 'Ay')
    .replace(/[ê]/g, 'ay')
    .replace(/[Î]/g, 'Ee')
    .replace(/[î]/g, 'ee')
    .replace(/[Û]/g, 'Oo')
    .replace(/[û]/g, 'oo')
    .replace(/[Ş]/g, 'Sh')
    .replace(/[ş]/g, 'sh')
    .replace(/[Ç]/g, 'Ch')
    .replace(/[ç]/g, 'ch')
    .replace(/[X]/g, 'Kh')
    .replace(/[x]/g, 'kh')
    .replace(/[Q]/g, 'Q')
    .replace(/[q]/g, 'q')
    .replace(/[J]/g, 'Zh')
    .replace(/[j]/g, 'zh')
    .replace(/[W]/g, 'W')
    .replace(/[w]/g, 'w');

  const syllables: string[] = [];
  let curr = '';
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
  for (let ci = 0; ci < phonetic.length; ci++) {
    curr += phonetic[ci];
    const next = phonetic[ci + 1];
    const afterNext = phonetic[ci + 2];
    if (next && afterNext && !vowels.has(phonetic[ci]) && vowels.has(next) && curr.length > 1) {
      syllables.push(curr);
      curr = '';
    }
  }
  if (curr) syllables.push(curr);
  const result = syllables.length > 1 ? syllables.join('-') : phonetic;
  return `[${result}]`;
}

function detectDialect(origin: string | undefined) {
  if (!origin) return null;
  const o = origin.toLowerCase();
  if (o.includes('kurmanci') || o.includes('kurmanc') || o.includes('kurmanji')) {
    return {
      label: { tr: 'Kurmancî', en: 'Kurmanji', de: 'Kurmandschi', ar: 'الكرمانجية' },
      color: '#15803d',
      bg: '#f0fdf4',
      border: '#86efac',
    };
  }
  if (o.includes('sorani') || o.includes('soranî') || o.includes('sorans')) {
    return {
      label: { tr: 'Soranî', en: 'Sorani', de: 'Soranisch', ar: 'السورانية' },
      color: '#1d4ed8',
      bg: '#eff6ff',
      border: '#93c5fd',
    };
  }
  if (o.includes('zazaki') || o.includes('zaza') || o.includes('dimli')) {
    return {
      label: { tr: 'Zazaki', en: 'Zazaki', de: 'Zazaisch', ar: 'الزازائية' },
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#c4b5fd',
    };
  }
  if (o.includes('gorani') || o.includes('goranî') || o.includes('hawrami')) {
    return {
      label: { tr: 'Goranî', en: 'Gorani', de: 'Goranisch', ar: 'الغورانية' },
      color: '#c2410c',
      bg: '#fff7ed',
      border: '#fdba74',
    };
  }
  return null;
}

const THEME_TAG_MAP: Record<ThemeKey, string[]> = {
  nature: ['Doğa / Yaşam', 'Doğa ve Tabiat'],
  power: ['Cesaret / Güç', 'Güç ve Cesaret'],
  beauty: ['Sevgi / Güzellik', 'Sevgi ve Güzellik'],
  light: ['Işık / Aydınlık', 'Işık ve Aydınlık', 'Işık'],
  wisdom: ['Bilgelik / Akıl', 'Bilgelik ve Akıl'],
};

function getNamesForCategory(
  letterSlug: string | null,
  genderCategory: 'female' | 'male' | null,
  themeCategory: ThemeKey | null
): NameData[] {
  if (letterSlug) {
    return getNamesByLetter(letterSlug);
  }
  const all = getAllNames();
  if (genderCategory === 'female') {
    return all.filter((n) => n.gender === 'female');
  }
  if (genderCategory === 'male') {
    return all.filter((n) => n.gender === 'male');
  }
  if (themeCategory) {
    const matchTags = THEME_TAG_MAP[themeCategory];
    return all.filter((n) => n.tags?.some((tag) => matchTags.includes(tag)));
  }
  return [];
}

export function generateStaticParams() {
  const group = process.env.SSG_BUILD_GROUP || 'all';
  const activeLetters = getActiveLettersWithCounts();
  const params: { locale: string; section: string; slug: string }[] = [];

  // Select names to build based on SSG_BUILD_GROUP
  let selectedNameIds: string[] = [];
  if (group === 'verify') {
    const idSet = new Set<string>(['azad', 'berfin', 'ciya', 'evin', 'baran', 'dara']);
    for (const { letter } of activeLetters) {
      const namesInLetter = getNamesByLetter(letter).slice(0, 5);
      for (const n of namesInLetter) {
        idSet.add(n.id);
      }
    }
    selectedNameIds = Array.from(idSet);
  } else {
    selectedNameIds = getAllNames().map((n) => n.id);
  }

  for (const locale of supportedLanguages) {
    const nameSection = routeTranslations[locale].name;
    const categorySection = routeTranslations[locale].category;
    const blogSection = routeTranslations[locale].blog;

    // 1. Name Detail Routes
    for (const id of selectedNameIds) {
      params.push({ locale, section: nameSection, slug: id });
    }

    // 2. Category Routes (29 active letters with count > 0 + 5 themes + 2 genders)
    for (const { letter } of activeLetters) {
      params.push({ locale, section: categorySection, slug: letter.toLowerCase() });
    }
    params.push({ locale, section: categorySection, slug: routeTranslations[locale].girls });
    params.push({ locale, section: categorySection, slug: routeTranslations[locale].boys });
    for (const themeKey of Object.keys(themeSlugs[locale]) as ThemeKey[]) {
      params.push({ locale, section: categorySection, slug: themeSlugs[locale][themeKey] });
    }

    // 3. Blog Post Routes (135 posts per locale)
    const blogPosts = getBlogPostsByLang(locale);
    for (const post of blogPosts) {
      params.push({ locale, section: blogSection, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, section, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const decodedSlug = decodeURIComponent(slug);
  const routeKey = getRouteKeyBySegment(locale, section);
  if (!routeKey) return {};

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // MODULE A: Name Detail Metadata
  if (routeKey === 'name') {
    const nameItem = getNameBySlug(decodedSlug);
    if (!nameItem) return {};

    const meaning = getLocalizedMeaning(nameItem, locale);
    const origin = getLocalizedOrigin(nameItem.origin, (k) => t(k as any));
    const genderText =
      nameItem.gender === 'female' ? t('gender_female') : t('gender_male');

    const title = `${t('seo_name_title', { name: nameItem.name })} | KurdishName`;
    const description = t('name_description_template', {
      name: nameItem.name,
      origin,
      gender: genderText,
      meaning,
    });

    return buildPageMetadata({
      locale,
      title,
      description,
      routeKey: 'name',
      slugByLocale: nameItem.id,
    });
  }

  // MODULE B: Category Metadata
  if (routeKey === 'category') {
    const activeLetters = getActiveLettersWithCounts();
    const upperLetter = decodedSlug.length === 1 ? decodedSlug.toUpperCase() : null;
    const isLetterValid =
      upperLetter !== null && activeLetters.some((l) => l.letter === upperLetter);
    const genderCategory =
      !isLetterValid ? getGenderFromSlug(locale, decodedSlug) : null;
    const themeCategory =
      !isLetterValid && !genderCategory ? getThemeFromSlug(locale, decodedSlug) : null;

    if (!isLetterValid && genderCategory !== 'female' && genderCategory !== 'male' && !themeCategory) {
      return {};
    }

    let title = 'KurdishName';
    let description = t('home_description');
    let slugByLocale: string | Record<Locale, string> = decodedSlug;

    if (isLetterValid && upperLetter) {
      title = `${t('cat_title_letter', { letter: upperLetter })} | KurdishName`;
      description = t('cat_desc_letter', { letter: upperLetter });
      slugByLocale = upperLetter.toLowerCase();
    } else if (genderCategory === 'female') {
      title = `${t('cat_title_kiz')} | KurdishName`;
      description = t('cat_desc_kiz');
      slugByLocale = {
        tr: routeTranslations.tr.girls,
        en: routeTranslations.en.girls,
        de: routeTranslations.de.girls,
        ar: routeTranslations.ar.girls,
      };
    } else if (genderCategory === 'male') {
      title = `${t('cat_title_erkek')} | KurdishName`;
      description = t('cat_desc_erkek');
      slugByLocale = {
        tr: routeTranslations.tr.boys,
        en: routeTranslations.en.boys,
        de: routeTranslations.de.boys,
        ar: routeTranslations.ar.boys,
      };
    } else if (themeCategory) {
      title = `${t(`theme_${themeCategory}_title` as any)} | KurdishName`;
      description = t(`theme_${themeCategory}_desc` as any);
      slugByLocale = {
        tr: themeSlugs.tr[themeCategory],
        en: themeSlugs.en[themeCategory],
        de: themeSlugs.de[themeCategory],
        ar: themeSlugs.ar[themeCategory],
      };
    }

    return buildPageMetadata({
      locale,
      title,
      description,
      routeKey: 'category',
      slugByLocale,
    });
  }

  // MODULE C: Blog Detail Metadata
  if (routeKey === 'blog') {
    const post = getBlogPostBySlug(locale, decodedSlug);
    if (!post) return {};

    const loaded = getBlogPostContent(locale, post.id);
    const title = `${loaded?.payload.title || post.titles[locale] || post.id} | KurdishName`;
    const description = loaded?.payload.desc || post.descriptions[locale] || '';

    return buildPageMetadata({
      locale,
      title,
      description,
      routeKey: 'blog',
      slugByLocale: post.slugs as Record<Locale, string>,
      ogType: 'article',
    });
  }

  return {};
}

export default async function SlugDetailPage({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string }>;
}) {
  const { locale, section, slug } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const decodedSlug = decodeURIComponent(slug);
  const routeKey = getRouteKeyBySegment(locale, section);
  if (!routeKey || !['name', 'category', 'blog'].includes(routeKey)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  /* ═══════════════════════════════════════════════════════════════════════════
   * MODULE A: NAME DETAIL PAGE (/tr/isim/azad, /en/name/azad, etc.)
   * ═══════════════════════════════════════════════════════════════════════════ */
  if (routeKey === 'name') {
    const nameItem = getNameBySlug(decodedSlug);
    if (!nameItem) {
      notFound();
    }

    const meaning = getLocalizedMeaning(nameItem, locale);
    const origin = getLocalizedOrigin(nameItem.origin, (k) => t(k as any));
    const isFemale = nameItem.gender === 'female';
    const genderText = isFemale ? t('gender_female') : t('gender_male');
    const pronunciation = generatePronunciation(nameItem.name);
    const dialect = detectDialect(nameItem.origin);
    const faqs = generateDynamicFaqs(nameItem, locale, meaning, origin || 'Kürtçe', genderText);

    const similarNames = getSimilarNames(nameItem, 8);

    const pageUrl = `https://kurdishname.com${generatePath(locale, 'name', nameItem.id)}`;
    const categoryGenderParam = isFemale ? 'kiz' : 'erkek';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'DefinedTerm',
          '@id': `${pageUrl}#term`,
          name: nameItem.name,
          description: meaning,
          inDefinedTermSet: `https://kurdishname.com/${locale}`,
          termCode: nameItem.id,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t('nav_home'),
              item: `https://kurdishname.com/${locale}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: isFemale ? t('girl_names') : t('boy_names'),
              item: `https://kurdishname.com${generatePath(locale, 'category', categoryGenderParam)}`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: nameItem.name,
              item: pageUrl,
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        },
      ],
    };

    return (
      <article className="flex flex-col gap-8 pb-24 md:pb-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}
        >
          <Link href={generatePath(locale, null)}>{t('nav_home')}</Link>
          <span>/</span>
          <Link href={generatePath(locale, 'category', categoryGenderParam)}>
            {isFemale ? t('girl_names') : t('boy_names')}
          </Link>
          <span>/</span>
          <Link href={generatePath(locale, 'category', nameItem.letter)}>{nameItem.letter}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)', fontWeight: 600 }}>{nameItem.name}</span>
        </nav>

        {/* Main Name Card */}
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            padding: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className={isFemale ? 'badge-female' : 'badge-male'}>{genderText}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '4px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {origin}
                </span>
                {dialect && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px',
                      background: dialect.bg,
                      color: dialect.color,
                      border: `1px solid ${dialect.border}`,
                    }}
                  >
                    {dialect.label[locale] || dialect.label.tr}
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 900,
                  color: isFemale ? 'var(--female)' : 'var(--male)',
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {nameItem.name}
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  color: 'var(--text-faint)',
                  margin: '0.35rem 0 0 0',
                }}
              >
                {{
                  tr: 'Telaffuz',
                  en: 'Pronunciation',
                  de: 'Aussprache',
                  ar: 'النطق',
                }[locale]}: {pronunciation}
              </p>
            </div>

            <FavoriteButton
              item={nameItem}
              addLabel={t('favorites_add')}
              removeLabel={t('favorites_remove')}
              size={20}
            />
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />

          <div>
            <h2
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
              }}
            >
              {t('detail_meaning')}
            </h2>
            <p
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.75,
                color: 'var(--text)',
                margin: 0,
                fontWeight: 500,
              }}
            >
              {meaning}
            </p>
          </div>

          {/* Info Table */}
          <div style={{ marginTop: '1.75rem' }}>
            <table className="infobox" style={{ width: '100%', maxWidth: '460px', float: 'none', margin: 0 }}>
              <tbody>
                <tr>
                  <td>{t('detail_gender')}</td>
                  <td>{genderText}</td>
                </tr>
                <tr>
                  <td>{t('detail_origin')}</td>
                  <td>{origin}</td>
                </tr>
                <tr>
                  <td>{t('detail_letter')}</td>
                  <td>
                    <Link href={generatePath(locale, 'category', nameItem.letter)}>{nameItem.letter}</Link>
                  </td>
                </tr>
                <tr>
                  <td>{t('compare_stat_length')}</td>
                  <td>
                    {nameItem.name.length}{' '}
                    {{
                      tr: 'harf',
                      en: 'letters',
                      de: 'Buchstaben',
                      ar: 'أحرف',
                    }[locale]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons: WhatsApp Share & HTML5 Canvas Card Download */}
          <NameCardShareActions
            name={nameItem.name}
            meaning={meaning}
            gender={nameItem.gender}
            genderText={genderText}
            origin={origin}
            locale={locale}
            pageUrl={pageUrl}
            labels={{
              whatsappBtn: t('whatsapp_share_btn'),
              whatsappMsg: t('whatsapp_share_msg', { name: nameItem.name, meaning }),
              downloadCardBtn: t('download_card_btn'),
              copyLinkBtn: t('share_btn'),
              copiedNotice:
                {
                  tr: 'Bağlantı kopyalandı!',
                  en: 'Link copied!',
                  de: 'Link kopiert!',
                  ar: 'تم نسخ الرابط!',
                }[locale] || 'Link copied!',
            }}
          />
        </section>

        {/* Similar Names Section */}
        {similarNames.length > 0 && (
          <section>
            <h2 className="section-heading">{t('similar_names')}</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {similarNames.map((sim) => (
                <Link
                  key={sim.id}
                  href={generatePath(locale, 'name', sim.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--r-lg)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    textDecoration: 'none',
                  }}
                >
                  <strong style={{ color: isFemale ? 'var(--female)' : 'var(--male)', fontSize: '1rem' }}>
                    {sim.name}
                  </strong>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getLocalizedMeaning(sim, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic 15 FAQs Section (Server-Rendered in HTML for Googlebot) */}
        <section>
          <h2 className="section-heading">
            {{
              tr: `${nameItem.name} İsmi Hakkında Sıkça Sorulan Sorular`,
              en: `Frequently Asked Questions About ${nameItem.name}`,
              de: `Häufig gestellte Fragen zum Namen ${nameItem.name}`,
              ar: `الأسئلة الشائعة حول اسم ${nameItem.name}`,
            }[locale]}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '1.15rem 1.25rem',
                }}
              >
                <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.45rem 0' }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-muted)', margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * MODULE B: CATEGORY PAGE (/tr/kategori/A, /tr/kategori/Ç, /tr/kategori/kiz, etc.)
   * ═══════════════════════════════════════════════════════════════════════════ */
  if (routeKey === 'category') {
    const activeLetters = getActiveLettersWithCounts();
    const upperLetter = decodedSlug.length === 1 ? decodedSlug.toUpperCase() : null;
    const isLetterValid =
      upperLetter !== null && activeLetters.some((l) => l.letter === upperLetter);
    const genderCategory =
      !isLetterValid ? getGenderFromSlug(locale, decodedSlug) : null;
    const themeCategory =
      !isLetterValid && !genderCategory ? getThemeFromSlug(locale, decodedSlug) : null;

    if (!isLetterValid && genderCategory !== 'female' && genderCategory !== 'male' && !themeCategory) {
      notFound();
    }

    const categoryNames = getNamesForCategory(
      isLetterValid ? upperLetter : null,
      genderCategory === 'female' || genderCategory === 'male' ? genderCategory : null,
      themeCategory
    );

    let title = '';
    let description = '';
    if (isLetterValid && upperLetter) {
      title = t('cat_title_letter', { letter: upperLetter });
      description = t('cat_desc_letter', { letter: upperLetter });
    } else if (genderCategory === 'female') {
      title = t('cat_title_kiz');
      description = t('cat_desc_kiz');
    } else if (genderCategory === 'male') {
      title = t('cat_title_erkek');
      description = t('cat_desc_erkek');
    } else if (themeCategory) {
      title = t(`theme_${themeCategory}_title` as any);
      description = t(`theme_${themeCategory}_desc` as any);
    }

    const hookCategory =
      genderCategory === 'female' ? 'female' : genderCategory === 'male' ? 'male' : 'search';
    const contextualHook = generateContextualHook(decodedSlug, hookCategory, locale, title);
    const pageUrl = `https://kurdishname.com${generatePath(locale, 'category', decodedSlug)}`;

    // Limit displayed DOM nodes on huge gender pages while rendering full letter categories
    const displayList = isLetterValid ? categoryNames : categoryNames.slice(0, 200);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#collection`,
          name: title,
          description,
          url: pageUrl,
          inLanguage: locale,
        },
        {
          '@type': 'ItemList',
          name: title,
          numberOfItems: categoryNames.length,
          itemListElement: displayList.slice(0, 50).map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            url: `https://kurdishname.com${generatePath(locale, 'name', item.id)}`,
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t('nav_home'),
              item: `https://kurdishname.com/${locale}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: pageUrl,
            },
          ],
        },
      ],
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div>
          <h1 className="page-title">{title}</h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
            {description} {contextualHook}
          </p>
          <p style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--accent)', marginTop: '0.5rem' }}>
            {categoryNames.length} {t('names_found_count')}
          </p>
        </div>

        {/* Alphabet Navigation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {activeLetters.map(({ letter }) => (
            <Link
              key={letter}
              href={generatePath(locale, 'category', letter)}
              className={`alpha-btn ${upperLetter === letter ? 'active' : ''}`}
            >
              {letter}
            </Link>
          ))}
        </div>

        {/* Server-Rendered Name Table / Grid */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
          }}
        >
          <table className="wiki-table">
            <thead>
              <tr>
                <th>{t('admin_names_col_name')}</th>
                <th>{t('admin_names_col_gender')}</th>
                <th>{t('admin_names_col_meaning')}</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((item) => {
                const isFemale = item.gender === 'female';
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      <Link
                        href={generatePath(locale, 'name', item.id)}
                        style={{ color: isFemale ? 'var(--female)' : 'var(--male)' }}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className={isFemale ? 'badge-female' : 'badge-male'}>
                        {isFemale ? t('gender_female') : t('gender_male')}
                      </span>
                    </td>
                    <td>{getLocalizedMeaning(item, locale)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * MODULE C: BLOG DETAIL PAGE (/tr/blog/[slug], /en/blog/[slug], etc.)
   * ═══════════════════════════════════════════════════════════════════════════ */
  const post = getBlogPostBySlug(locale, decodedSlug);
  if (!post) {
    notFound();
  }

  const loadedPost = getBlogPostContent(locale, post.id);
  const payload = loadedPost?.payload;
  const title = payload?.title || post.titles[locale] || post.id;
  const desc = payload?.desc || post.descriptions[locale] || '';
  const rawMarkdown = (payload?.content || '').replaceAll('\\n', '\n');
  const linkedMarkdown = injectServerInternalLinks(rawMarkdown, locale);
  const faqItems = getBlogPostFaqs(post.id, locale);
  const pageUrl = `https://kurdishname.com${generatePath(locale, 'blog', post.slugs[locale])}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        headline: title,
        description: desc,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          '@type': 'Organization',
          '@id': 'https://kurdishname.com/#editorial-board',
          name: 'KurdishName Editorial Board',
          url: `https://kurdishname.com${generatePath(locale, 'editorial')}`,
        },
        publisher: {
          '@type': 'Organization',
          '@id': 'https://kurdishname.com/#editorial-board',
          name: 'KurdishName Editorial Board',
          logo: {
            '@type': 'ImageObject',
            url: 'https://kurdishname.com/logo.webp',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('nav_home'),
            item: `https://kurdishname.com/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('blog_title'),
            item: `https://kurdishname.com${generatePath(locale, 'blog')}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: pageUrl,
          },
        ],
      },
      ...(faqItems.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)',
        padding: '2rem',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ marginBottom: '1.25rem' }}>
        <Link href={generatePath(locale, 'blog')} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          ← {t('blog_title')}
        </Link>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.65rem, 4vw, 2.5rem)',
          fontWeight: 900,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: '1rem',
        }}
      >
        {title}
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span>
          ✍️{' '}
          <Link href={generatePath(locale, 'editorial')} style={{ fontWeight: 600 }}>
            KurdishName Editorial Board
          </Link>
        </span>
        <span>🗓️ {post.date}</span>
      </div>

      <div className="prose-premium">
        <Markdown>{linkedMarkdown}</Markdown>
      </div>

      {payload?.isListicle && payload.listicleNames && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payload.listicleNames.map((listName: string, idx: number) => {
            const matched = getNameBySlug(listName);
            if (!matched) return null;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-alt)',
                  padding: '1.25rem',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 900, color: 'var(--accent)' }}>#{idx + 1}</span>
                  <Link
                    href={generatePath(locale, 'name', matched.id)}
                    style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', textDecoration: 'none' }}
                  >
                    {matched.name}
                  </Link>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {getLocalizedMeaning(matched, locale)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {faqItems.length > 0 && (
        <section style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <h2 className="section-heading">FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqItems.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '1rem 1.25rem',
                }}
              >
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>{faq.question}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.65 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
