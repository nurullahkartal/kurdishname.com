import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { generatePath } from '../utils/routes';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "0.9375rem",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: "var(--text)",
        borderBottom: "1px solid var(--border)",
        paddingBottom: "0.375rem",
        marginBottom: "0.875rem",
      }}>
        {title}
      </h2>
      <div style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--text-muted)", whiteSpace: "pre-line" }}>
        {children}
      </div>
    </div>
  );
}

export default function Privacy() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';
  const langs = ['tr', 'en', 'de', 'ar'] as const;

  return (
    <>
      <Helmet>
        <title>{t('privacy_title', 'Gizlilik Politikası')} | KurdishName</title>
        <meta name="description" content={t('privacy_seo_desc')} />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <h1 className="page-title">{t('privacy_title', 'Gizlilik Politikası')}</h1>
        <Section title={`1. ${t('privacy_h1', 'Veri Toplama')}`}>
          <p>{t('privacy_p1')}</p>
        </Section>
        <Section title={`2. ${t('privacy_h2', 'Çerezler (Cookies)')}`}>
          <p>{t('privacy_p2')}</p>
        </Section>
        <Section title={`3. ${t('privacy_h3', 'Üçüncü Şahıslar')}`}>
          <p>{t('privacy_p3')}</p>
        </Section>
        <Section title={`4. ${t('privacy_h4', 'Güvenlik')}`}>
          <p>{t('privacy_p4')}</p>
        </Section>
        <Section title={`5. ${t('privacy_h5', 'İletişim')}`}>
          <p>{t('privacy_p5')}</p>
        </Section>
      </motion.div>
    </>
  );
}
