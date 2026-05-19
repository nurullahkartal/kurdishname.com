import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { generatePath } from '../utils/routes';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 700, color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "0.375rem", marginBottom: "0.875rem" }}>
        {title}
      </h2>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--text-muted)", whiteSpace: "pre-line" }}>
        {children}
      </div>
    </div>
  );
}

export default function Cookies() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';
  const langs = ['tr', 'en', 'de', 'ar'] as const;

  return (
    <>
      <Helmet>
        <title>{t('cookies_title', 'Çerez Politikası')} | KurdishName</title>
        <meta name="description" content={t('cookies_seo_desc')} />
        <link rel="canonical" href={`https://kurdishname.com${generatePath(lng, 'cookies')}`} />
        {langs.map(l => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://kurdishname.com${generatePath(l, 'cookies')}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://kurdishname.com${generatePath('en', 'cookies')}`}
        />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <h1 className="page-title">{t('cookies_title', 'Çerez Politikası')}</h1>

        <Section title={`1. ${t('cookies_h1', 'Çerez (Cookie) Nedir?')}`}>
          <p>{t('cookies_p1')}</p>
        </Section>
        <Section title={`2. ${t('cookies_h2', 'Çerezleri Nasıl Kullanıyoruz?')}`}>
          <p>{t('cookies_p2')}</p>
        </Section>
        <Section title={`3. ${t('cookies_h3', 'Çerezleri Yönetme')}`}>
          <p>{t('cookies_p3')}</p>
        </Section>
      </motion.div>
    </>
  );
}
