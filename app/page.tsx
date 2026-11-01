import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, supportedLanguages, generatePath } from '@/lib/routes-config';
import { getActiveLettersWithCounts } from '@/lib/names-data';
import { homeGirlNames, homeBoyNames, stats } from '@/lib/home-static-data';

export const metadata: Metadata = {
  title: 'KurdishName — En Kapsamlı Kürtçe İsimler Arşivi & Sözlüğü (4.709+ İsim)',
  description:
    '4.709+ Kürtçe kız ve erkek bebek ismi, anlamları, etimolojik kökenleri, duyulmamış nadir Kürtçe isimler ve telaffuz rehberi.',
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
  openGraph: {
    title: 'KurdishName — En Kapsamlı Kürtçe İsimler Arşivi & Sözlüğü',
    description:
      '4.709+ otantik Kürtçe kız ve erkek bebek ismi, anlamları, etimolojik kökenleri ve telaffuz rehberi.',
    url: SITE_URL,
    siteName: 'KurdishName',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KurdishName — En Kapsamlı Kürtçe İsimler Arşivi & Sözlüğü',
    description:
      '4.709+ otantik Kürtçe kız ve erkek bebek ismi, anlamları, etimolojik kökenleri ve telaffuz rehberi.',
  },
};

const languagePortals: Array<{
  lang: 'tr' | 'en' | 'de' | 'ar';
  title: string;
  subtitle: string;
  girlsHref: string;
  girlsLabel: string;
  boysHref: string;
  boysLabel: string;
}> = [
  {
    lang: 'tr',
    title: 'Türkçe — Kürtçe İsimler Sözlüğü',
    subtitle: '4.709+ Kürtçe kız ve erkek ismi, anlamları ve köken analizi',
    girlsHref: '/tr/kategori/kiz',
    girlsLabel: 'Kürtçe Kız İsimleri (2.568)',
    boysHref: '/tr/kategori/erkek',
    boysLabel: 'Kürtçe Erkek İsimleri (2.117)',
  },
  {
    lang: 'en',
    title: 'English — Kurdish Names Encyclopedia',
    subtitle: '4,709+ authentic Kurdish baby names, meanings & etymology',
    girlsHref: '/en/category/girls',
    girlsLabel: 'Kurdish Girl Names (2,568)',
    boysHref: '/en/category/boys',
    boysLabel: 'Kurdish Boy Names (2,117)',
  },
  {
    lang: 'de',
    title: 'Deutsch — Kurdisches Namenlexikon',
    subtitle: '4.709+ kurdische Mädchen- und Jungennamen mit Bedeutung',
    girlsHref: '/de/kategorie/maedchen',
    girlsLabel: 'Kurdische Mädchennamen (2.568)',
    boysHref: '/de/kategorie/jungen',
    boysLabel: 'Kurdische Jungennamen (2.117)',
  },
  {
    lang: 'ar',
    title: 'العربية — قاموس الأسماء الكردية',
    subtitle: 'أكثر من ٤٧٠٩ اسم كردي للبنات والأولاد مع المعاني والأصول',
    girlsHref: '/ar/فئة/بنات',
    girlsLabel: 'أسماء بنات كردية (٢٥٦٨)',
    boysHref: '/ar/فئة/ذكور',
    boysLabel: 'أسماء أولاد كردية (٢١١٧)',
  },
];

export default function RootPage() {
  const activeLetters = getActiveLettersWithCounts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'KurdishName',
        description:
          '4.709+ Kürtçe kız ve erkek bebek ismi, anlamları, etimolojik kökenleri ve telaffuz rehberi.',
        inLanguage: ['tr', 'en', 'de', 'ar'],
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'KurdishName Editorial Board',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.webp`,
      },
    ],
  };

  return (
    <main className="enc-container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          padding: '2.25rem 2rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '0.75rem',
          }}
        >
          <img
            src="/logo.webp"
            alt="KurdishName Logo"
            width={40}
            height={40}
            style={{ borderRadius: '10px' }}
          />
          <span style={{ fontWeight: 900, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
            KurdishName
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.65rem)',
            fontWeight: 900,
            color: 'var(--text)',
            margin: '0 0 0.75rem 0',
            lineHeight: 1.2,
          }}
        >
          En Kapsamlı Kürtçe İsimler Arşivi &amp; Etimoloji Sözlüğü
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 1.5rem auto',
            lineHeight: 1.65,
          }}
        >
          {stats.total.toLocaleString('tr-TR')} otantik Kürtçe kız ({stats.female.toLocaleString('tr-TR')}) ve erkek ({stats.male.toLocaleString('tr-TR')}) bebek isminin anlamı, dilbilimsel kökeni, duyulmamış nadir Kürtçe isim analizleri ve telaffuz rehberi.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/tr" className="btn-primary">
            Türkçe Sözlüğe Gir (/tr) →
          </Link>
          <Link href="/tr/kategori/kiz" className="btn-ghost">
            Kürtçe Kız İsimleri
          </Link>
          <Link href="/tr/kategori/erkek" className="btn-ghost">
            Kürtçe Erkek İsimleri
          </Link>
          <Link href="/tr/isim-bul" className="btn-ghost">
            İsim Bulucu
          </Link>
        </div>
      </section>

      {/* 4 Language Portals */}
      <section style={{ marginBottom: '2.25rem' }}>
        <h2 className="section-heading">Dil Seçimi / Choose Language / Sprache / اللغة</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {languagePortals.map((p) => (
            <div
              key={p.lang}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <Link
                href={`/${p.lang}`}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
              >
                {p.title} →
              </Link>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                {p.subtitle}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <Link
                  href={p.girlsHref}
                  style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--female)' }}
                >
                  {p.girlsLabel}
                </Link>
                <span style={{ color: 'var(--border)' }}>•</span>
                <Link
                  href={p.boysHref}
                  style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--male)' }}
                >
                  {p.boysLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alphabetical Directory Hub (All 29 Active Letters) */}
      <section
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          padding: '1.5rem',
          marginBottom: '2.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <h2 className="section-heading" style={{ margin: 0 }}>
            Harfe Göre Kürtçe İsimler Fihristi (A–Z)
          </h2>
          <Link href="/tr/alfabe" style={{ fontSize: '0.825rem', fontWeight: 700 }}>
            Tam Alfabe Rehberi →
          </Link>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {activeLetters.map(({ letter, count }) => (
            <Link
              key={letter}
              href={generatePath('tr', 'category', letter)}
              className="alpha-btn"
              title={`${letter} harfi ile başlayan ${count} Kürtçe isim`}
              style={{ width: 'auto', padding: '0 0.65rem', gap: '0.3rem' }}
            >
              <span>{letter}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)', fontWeight: 500 }}>
                ({count})
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Girl & Boy Names Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.25rem',
        }}
      >
        {/* Girl Names */}
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--female)', margin: 0 }}>
              Popüler &amp; Duyulmamış Kürtçe Kız İsimleri
            </h2>
            <Link href="/tr/kategori/kiz" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Tümü ({stats.female}) →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '0.5rem' }}>
            {homeGirlNames.map((item) => (
              <Link
                key={item.id}
                href={generatePath('tr', 'name', item.id)}
                style={{
                  padding: '0.55rem 0.7rem',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border-dim)',
                  background: 'var(--surface-alt)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <strong style={{ color: 'var(--female)', fontSize: '0.9rem' }}>{item.name}</strong>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.meaning}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Boy Names */}
        <section
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--male)', margin: 0 }}>
              Popüler &amp; Otantik Kürtçe Erkek İsimleri
            </h2>
            <Link href="/tr/kategori/erkek" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Tümü ({stats.male}) →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '0.5rem' }}>
            {homeBoyNames.map((item) => (
              <Link
                key={item.id}
                href={generatePath('tr', 'name', item.id)}
                style={{
                  padding: '0.55rem 0.7rem',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border-dim)',
                  background: 'var(--surface-alt)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <strong style={{ color: 'var(--male)', fontSize: '0.9rem' }}>{item.name}</strong>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.meaning}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Cultural & Thematic Hubs */}
      <section
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          padding: '1.5rem',
        }}
      >
        <h2 className="section-heading">Kültürel Arşiv, Tematik Koleksiyonlar ve Rehberler</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <Link href="/tr/kategori/doga" className="btn-ghost">Doğa &amp; Yaşam İsimleri</Link>
          <Link href="/tr/kategori/guc" className="btn-ghost">Cesaret &amp; Güç İsimleri</Link>
          <Link href="/tr/kategori/guzellik" className="btn-ghost">Sevgi &amp; Güzellik İsimleri</Link>
          <Link href="/tr/kategori/isik" className="btn-ghost">Işık &amp; Güneş İsimleri</Link>
          <Link href="/tr/kategori/bilgelik" className="btn-ghost">Bilgelik &amp; Akıl İsimleri</Link>
          <Link href="/tr/alfabe" className="btn-ghost">Kürtçe Alfabe Rehberi</Link>
          <Link href="/tr/mitoloji" className="btn-ghost">Kürt Mitolojisi İsimleri</Link>
          <Link href="/tr/boylar" className="btn-ghost">Tarihi Kürt Boyları &amp; Aşiretleri</Link>
          <Link href="/tr/soyadlari" className="btn-ghost">Kürtçe Soyadları</Link>
          <Link href="/tr/blog" className="btn-ghost">Kürtçe İsim Rehberi Blogu</Link>
          <Link href="/tr/karsilastir" className="btn-ghost">İsim Karşılaştırıcı</Link>
          <Link href="/tr/editoryal-kurul" className="btn-ghost">Editoryal Kurul</Link>
        </div>
      </section>
    </main>
  );
}
