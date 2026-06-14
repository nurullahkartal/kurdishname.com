import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generatePath } from '../utils/routes';

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-md)",
  background: "var(--surface)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-display)",
  color: "var(--text)",
  outline: "none",
  transition: "border-color 150ms",
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';
  const langs = ['tr', 'en', 'de', 'ar'] as const;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<null | 'success'>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <>
      <Helmet>
        <title>{t('contact_title', 'İletişim')} | KurdishName</title>
        <meta name="description" content={t('contact_seo_desc')} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{ maxWidth: "540px" }}
      >
        <h1 className="page-title">{t('contact_title', 'İletişim')}</h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          {t('contact_desc', 'Soru, öneri veya katkılarınız için bize ulaşabilirsiniz.')}
          {" "}{t('contact_email_label', 'E-posta:')} <a href="mailto:info@kurdishname.com" style={{ color: "var(--accent)" }}>info@kurdishname.com</a>
        </p>

        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)", padding: "1.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div>
              <label htmlFor="name" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                {t('contact_name', 'Ad Soyad')}
              </label>
              <input
                type="text" id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                style={inputStyle}
                placeholder={t('contact_name_ph', 'Adınız')}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                {t('contact_email', 'E-posta')}
              </label>
              <input
                type="email" id="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                style={inputStyle}
                placeholder={t('contact_email_ph', 'ornek@eposta.com')}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label htmlFor="message" style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                {t('contact_msg', 'Mesaj')}
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                placeholder={t('contact_msg_ph', 'Mesajınız...')}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%", padding: "0.75rem",
                background: "var(--text)", color: "var(--surface)",
                border: "none", borderRadius: "var(--r-md)",
                fontFamily: "var(--font-display)", fontSize: "0.875rem", fontWeight: 700,
                cursor: "pointer", transition: "opacity 150ms",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {t('contact_submit', 'Gönder')}
            </button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(34,197,94,0.07)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    borderRadius: "var(--r-md)",
                    fontSize: "0.875rem",
                    color: "#15803D",
                    fontWeight: 600,
                  }}
                >
                  ✓ {t('contact_success', 'Mesajınız başarıyla iletildi.')}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </>
  );
}
