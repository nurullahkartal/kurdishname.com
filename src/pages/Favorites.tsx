import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { generatePath } from '../utils/routes';
import { getLocalizedMeaning, getLocalizedOrigin } from '../utils/localization';

export default function Favorites() {
  const { t, i18n } = useTranslation();
  const { favorites, removeFavorite, toggleFavorite } = useFavorites();
  const lng = i18n.language || 'tr';

  const handleClearAll = () => {
    if (window.confirm(t('favorites_clear_confirm', 'Tüm defterinizi temizlemek istediğinize emin misiniz?'))) {
      favorites.forEach((fav) => removeFavorite(fav.id));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('favorites_title', 'İsim Defterim')} | KurdishName</title>
        <meta name="description" content={t('favorites_seo_desc')} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link
            to={generatePath(lng, null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
            className="hover:text-[var(--accent)]"
          >
            <ArrowLeft size={14} />
            {t('back_to_home', 'Ana Sayfaya Dön')}
          </Link>
        </div>

        {/* Title Block */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.8rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--text)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {t('favorites_title', 'İsim Defterim')}
            </h1>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                margin: '0.25rem 0 0 0',
              }}
            >
              {t('favorites_subtitle', 'Özel Seçim Defteriniz')}
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--female)',
                background: 'var(--female-dim)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--r-sm)',
                transition: 'opacity 150ms',
              }}
              className="hover:opacity-80"
            >
              <Trash2 size={13} />
              {t('favorites_clear_all', 'Tümünü Temizle')}
            </button>
          )}
        </div>

        {/* Info Bento Card */}
        {favorites.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                {favorites.length}
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {t(favorites.length === 1 ? 'favorites_count' : 'favorites_count_plural', {
                  count: favorites.length,
                })}
              </p>
            </div>

            {/* Premium Comparison Link CTA */}
            {favorites.length >= 2 && (
              <div
                style={{
                  background: 'rgba(var(--accent-rgb), 0.04)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>
                  {t('favorites_compare_cta_title', 'İsimleri Karşılaştırın')}
                  </h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t('favorites_compare_cta_desc', 'Defterinize eklediğiniz isimleri yan yana koyup anlamları ve harf uyumlarıyla kıyaslayın.')}
                  </p>
                </div>
                <Link
                  to={generatePath(lng, 'compare')}
                  style={{
                    background: 'var(--accent)',
                    color: '#FFFFFF',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--r-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'opacity 150ms'
                  }}
                  className="hover:opacity-90 active:scale-95"
                >
                  {t('favorites_compare_cta_btn', 'Hemen Karşılaştır')}
                </Link>
              </div>
            )}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {favorites.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <Heart
                size={48}
                style={{
                  color: 'var(--female)',
                  opacity: 0.4,
                  margin: '0 auto 1.25rem',
                  animation: 'pulse 2s infinite',
                }}
              />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                {t('favorites_empty_title', 'Defteriniz Henüz Boş')}
              </h2>
              <p style={{ maxWidth: '460px', margin: '0 auto', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {t('favorites_empty')}
              </p>
              <div style={{ marginTop: '1.75rem' }}>
                <Link
                  to={generatePath(lng, null)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.625rem 1.25rem',
                    background: 'var(--accent)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--r-md)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'opacity 150ms',
                  }}
                  className="hover:opacity-90"
                >
                  {t('discover_names_btn', 'İsimleri Keşfet')}
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="favorites-list"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              {favorites.map((item) => {
                const isFemale = item.gender === 'female';
                const isUnisex = item.gender === 'unisex';
                const genderColor = isUnisex ? 'var(--accent)' : isFemale ? 'var(--female)' : 'var(--male)';
                const genderText = isUnisex
                  ? t('gender_unisex', 'Unisex')
                  : isFemale
                  ? t('gender_female', 'Kız')
                  : t('gender_male', 'Erkek');

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--r-lg)',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    className="hover:border-[var(--text-muted)] transition-colors duration-200"
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <Link
                          to={generatePath(lng, 'name', item.id)}
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: genderColor,
                            textDecoration: 'none',
                          }}
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                        <span className={isUnisex ? 'badge-unisex' : isFemale ? 'badge-female' : 'badge-male'}>
                          {genderText}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8125rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {getLocalizedMeaning(item, lng)}
                      </p>
                      {item.origin && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-faint)',
                            marginTop: '0.35rem',
                            fontWeight: 500,
                          }}
                        >
                          {t('detail_origin', 'Köken')}: {getLocalizedOrigin(item.origin, t)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleFavorite(item)}
                      style={{
                        padding: '0.5rem',
                        color: 'var(--female)',
                        background: 'var(--female-dim)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 150ms',
                      }}
                      className="hover:scale-110 active:scale-95"
                      title={t('favorites_remove')}
                    >
                      <Heart size={18} fill="var(--female)" />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
