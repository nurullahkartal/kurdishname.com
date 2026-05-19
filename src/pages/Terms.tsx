import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { generatePath } from '../utils/routes';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "0.375rem", marginBottom: "0.875rem" }}>
        {title}
      </h2>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--text-muted)", whiteSpace: "pre-line" }}>{children}</div>
    </div>
  );
}

export default function Terms() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';
  const langs = ['tr', 'en', 'de', 'ar'] as const;

  return (
    <>
      <Helmet>
        <title>{t('terms_title', 'Kullanım Koşulları')} | KurdishName</title>
        <meta name="description" content={t('terms_seo_desc')} />
        <link rel="canonical" href={`https://kurdishname.com${generatePath(lng, 'terms')}`} />
        {langs.map(l => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://kurdishname.com${generatePath(l, 'terms')}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://kurdishname.com${generatePath('en', 'terms')}`}
        />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <h1 className="page-title">{t('terms_title', 'Kullanım Koşulları')}</h1>
        <Section title={`1. ${t('terms_h1', 'Hizmet Şartları ve Kabul')}`}>
          <p>{t('terms_p1')}</p>
        </Section>
        <Section title={`2. ${t('terms_h2', 'Telif Hakkı ve Fikri Mülkiyet')}`}>
          <p>{t('terms_p2')}</p>
        </Section>
        <Section title={`3. ${t('terms_h3', 'Önemli Uyarı ve Sorumluluk Reddi')}`}>
          <p>{t('terms_p3')}</p>
        </Section>
        <Section title={`4. ${t('terms_h4', 'Değişiklik Hakkı')}`}>
          <p>{t('terms_p4')}</p>
        </Section>
      </motion.div>
    </>
  );
}
