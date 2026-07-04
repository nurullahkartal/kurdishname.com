import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Search, Heart, Home, Venus, Mars, Sparkles, MoreHorizontal, X, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { generatePath, routeTranslations, switchLanguagePath } from "../utils/routes";
import { useFavorites } from "../context/FavoritesContext";
import { useCanonicalAndHreflang } from "../utils/seoHook";

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { favorites } = useFavorites();
  const lng = i18n.language || "tr";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    }
  }, [lng]);
  const location = useLocation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === "rtl";
  const [searchVal, setSearchVal] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const baseUrl = "https://kurdishname.com";
  const { canonicalUrl, hreflangs, xDefault } = useCanonicalAndHreflang();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/${lng}?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const navItems = [
    { to: generatePath(lng, null), label: t("nav_home"), end: true },
    { to: generatePath(lng, "category", "kiz"), label: t("nav_girls"), end: false },
    { to: generatePath(lng, "category", "erkek"), label: t("nav_boys"), end: false },
    { to: generatePath(lng, "finder"), label: t("nav_finder"), end: false },
    { to: generatePath(lng, "compare"), label: t("nav_compare", "Karşılaştır"), end: false },
    { to: generatePath(lng, "favorites"), label: t("nav_favorites", "Defterim"), end: false, isFav: true },
  ];

  const categoryTooltips = {
    tr: {
      girls: "Kürtçe Kız İsimleri Arşivi",
      boys: "Kürtçe Erkek İsimleri Arşivi"
    },
    en: {
      girls: "Archive of Kurdish Girl Names",
      boys: "Archive of Kurdish Boy Names"
    },
    de: {
      girls: "Archiv für kurdische Mädchennamen",
      boys: "Archiv für kurdische Jungennamen"
    },
    ar: {
      girls: "أرشيف أسماء البنات الكردية",
      boys: "أرشيف أسماء الأولاد الكردية"
    }
  };

  const tooltips = categoryTooltips[lng as keyof typeof categoryTooltips] || categoryTooltips.tr;

  const corporateLinks = [
    { to: generatePath(lng, "about"), label: t("footer_about", "Hakkımızda") },
    { to: generatePath(lng, "widget"), label: t("footer_widget", "Widget") },
    { to: generatePath(lng, "privacy"), label: t("footer_privacy", "Gizlilik Politikası") },
    { to: generatePath(lng, "terms"), label: t("footer_terms", "Kullanım Koşulları") },
    { to: generatePath(lng, "contact"), label: t("footer_contact", "İletişim") },
  ];

  const fullFooterLinks: { to: string; label: string; titleAttr?: string }[] = [
    { to: generatePath(lng, "category", "kiz"), label: t("nav_girls"), titleAttr: tooltips.girls },
    { to: generatePath(lng, "category", "erkek"), label: t("nav_boys"), titleAttr: tooltips.boys },
    ...corporateLinks
  ];

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Helmet htmlAttributes={{ lang: lng }}>
        <title>{t("site_title", "KurdishName")}</title>
        <meta name="author" content="KurdishName" />
        <meta name="publisher" content="KurdishName" />
        <meta name="description" content={t("home_description")} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        {hreflangs.map((item) => (
          <link key={item.lang} rel="alternate" hrefLang={item.lang} href={item.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={xDefault} />

        {/* Global Social Media Cards */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="KurdishName" />
        <meta property="og:image" content={`${baseUrl}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />

        {/* PWA & Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#0F172A" />
      </Helmet>

      {/* ── HEADER ─────────────────────────────────────── */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 110 }}>
        <div className="enc-container-wide">
          <div className="enc-header-wrapper">

            {/* Logo */}
            <div className="enc-header-logo">
              <NavLink to={generatePath(lng, null)} style={{ textDecoration: "none" }} aria-label="KurdishName">
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <img 
                    src="/logo.webp" 
                    width="56"
                    height="56"
                    loading="eager"
                    alt="Logo" 
                    className="object-contain"
                    style={{ 
                      height: "32px", 
                      width: "32px", 
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                    }} 
                  />
                  <span className="enc-brand-text">
                    KurdishName
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Header search */}
            <form onSubmit={handleSearch} className={`enc-header-search-form ${location.pathname === '/' || location.pathname === `/${lng}` ? 'hidden md:block' : ''}`}>
              <div className="enc-search-bar">
                <input
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder={t("search_placeholder", "İsim ara...")}
                  autoComplete="off"
                  aria-label={t("aria_search_label")}
                />
                <button type="submit" aria-label={t("aria_search_button")}>
                  <Search size={16} />
                </button>
              </div>
            </form>
 
            {/* Header Controls (Theme, Lang, Hamburger) */}
            <div className="enc-header-controls">
              {/* Desktop Only Controls */}
              <div className="hidden md:flex items-center">
                <ThemeToggle />
                <span style={{ width: "1px", height: "14px", backgroundColor: "var(--border)", margin: "0 0.4rem" }} />
                <LanguageSwitcher />
              </div>

              {/* Mobile Hamburger Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-3 -mr-2 relative z-[200] text-[var(--text)] rounded-xl hover:bg-[var(--surface-alt)] transition-colors"
                aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <motion.div
                    animate={isMenuOpen ? "open" : "closed"}
                    className="relative w-6 h-5 flex flex-col justify-between py-0.5"
                  >
                    <motion.span
                      variants={{
                        closed: { rotate: 0, y: 0 },
                        open: { rotate: 45, y: 7.5 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-6 h-0.5 bg-[var(--text)] rounded-full block"
                    />
                    <motion.span
                      variants={{
                        closed: { opacity: 1, scale: 1 },
                        open: { opacity: 0, scale: 0 }
                      }}
                      transition={{ duration: 0.15 }}
                      className="w-6 h-0.5 bg-[var(--text)] rounded-full block"
                    />
                    <motion.span
                      variants={{
                        closed: { rotate: 0, y: 0 },
                        open: { rotate: -45, y: -7.5 }
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-6 h-0.5 bg-[var(--text)] rounded-full block"
                    />
                  </motion.div>
                </div>
              </button>
            </div>
          </div>
 
          {/* Nav tabs - hide on mobile, show in drawer instead */}
          <nav className="hidden md:flex" style={{ gap: 0, borderTop: "1px solid var(--border-dim)", overflowX: "auto" }} aria-label={t("aria_nav_label")}>
            {navItems.map(({ to, label, end, isFav }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  padding: "0.55rem 0.875rem",
                  fontSize: "0.8125rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                  textDecoration: "none",
                  borderBottom: isActive ? "2px solid var(--text)" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  transition: "color 150ms, border-color 150ms",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                })}
              >
                {isFav && (
                  <Heart 
                    size={13} 
                    style={{ 
                      fill: favorites.length > 0 ? "var(--female)" : "none", 
                      color: favorites.length > 0 ? "var(--female)" : "currentColor",
                      transition: "transform 150ms"
                    }} 
                    className={favorites.length > 0 ? "animate-pulse" : ""}
                  />
                )}
                {label}
                {isFav && favorites.length > 0 && (
                  <span style={{
                    background: "var(--female)",
                    color: "white",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.05rem 0.35rem",
                    borderRadius: "10px",
                    lineHeight: "1.2"
                  }}>
                    {favorites.length}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* ── PAGE CONTENT ───────────────────────────────── */}
      <main className="enc-container" style={{ paddingTop: "1.75rem", paddingBottom: "4rem" }}>
        <div key={location.pathname} className="page-fade-in">
          <Outlet />
        </div>
      </main>

       <footer style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="enc-container-wide" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--text-faint)" }}>
          <span>© {new Date().getFullYear()} KurdishName</span>
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            {fullFooterLinks.map(({ to, label, titleAttr }) => (
              <NavLink 
                key={to} 
                to={to} 
                title={titleAttr}
                style={{ color: "var(--text-faint)", fontSize: "0.75rem", textDecoration: "none", fontWeight: titleAttr ? 600 : 400 }} 
                className="hover:text-[var(--text)] transition-colors"
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </footer>

      {/* ── TAM EKRAN PREMİUM OPAK CAM MENÜ (Overlay Navigation) ──────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] flex flex-col px-6 pb-8 overflow-y-auto menu-overlay-backdrop backdrop-blur-2xl"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Header spacer to keep alignment perfect */}
            <div className="flex justify-between items-center h-20 opacity-0 pointer-events-none">
              {/* Invisible spacer just to match header height */}
            </div>

            {/* Links Section in Center */}
            <motion.div 
              variants={{
                open: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col items-center justify-center gap-6 my-auto"
            >
              {[
                { to: generatePath(lng, null), label: t("nav_home"), end: true },
                { to: generatePath(lng, "category", "kiz"), label: t("nav_girls"), end: false },
                { to: generatePath(lng, "category", "erkek"), label: t("nav_boys"), end: false },
                { to: generatePath(lng, "finder"), label: t("nav_finder"), end: false },
              ].map(({ to, label, end }) => (
                <motion.div
                  key={to}
                  variants={{
                    closed: { opacity: 0, y: 15, scale: 0.96 },
                    open: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <NavLink
                    to={to}
                    end={end}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `text-2xl font-serif font-black tracking-wide py-2 px-6 rounded-2xl transition-colors block text-center ${
                      isActive 
                        ? 'text-white bg-[var(--accent)] dark:bg-indigo-600 shadow-lg shadow-[var(--accent)]/20' 
                        : 'text-[var(--text)] hover:bg-[var(--surface-alt)]'
                    }`}
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Controls / Tools (Language, Theme, Favorites, Compare) */}
            <motion.div
              variants={{
                closed: { opacity: 0, y: 25 },
                open: { opacity: 1, y: 0 }
              }}
              transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 20 }}
              className="mt-auto border-t border-[var(--border-dim)] pt-6 flex flex-col gap-5 max-w-lg mx-auto w-full"
            >
              {/* Grid of Tools: Favorites, Compare, Theme */}
              <div className="grid grid-cols-3 gap-3">
                {/* Defterim */}
                <NavLink
                  to={generatePath(lng, "favorites")}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-alt)] transition-colors text-center"
                >
                  <Heart
                    size={22}
                    className={favorites.length > 0 ? "fill-[var(--female)] text-[var(--female)] animate-pulse" : "text-slate-400"}
                  />
                  <span className="font-bold text-[var(--text)] text-xs mt-1.5">{t("nav_favorites", "Defterim")}</span>
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {favorites.length} {t("saved_names", "isim")}
                  </span>
                </NavLink>

                {/* Karşılaştır */}
                <NavLink
                  to={generatePath(lng, "compare")}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-alt)] transition-colors text-center"
                >
                  <ArrowLeftRight size={22} className="text-slate-400" />
                  <span className="font-bold text-[var(--text)] text-xs mt-1.5">{t("nav_compare", "Karşılaştır")}</span>
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {t("compare_sub", "Kıyasla")}
                  </span>
                </NavLink>

                {/* Tema Kontrolü */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] transition-colors text-center">
                  <ThemeToggle />
                  <span className="font-bold text-[var(--text)] text-xs mt-1.5">{t("theme_select", "Tema")}</span>
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{t("theme_change", "Görünüm")}</span>
                </div>
              </div>

              {/* Language Switcher Card */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider">
                  {t("language_select", "Dil")} / {t("region_select", "Bölge")}
                </span>
                <div onClick={() => setIsMenuOpen(false)}>
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Corporate Links */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--text-faint)] justify-center">
                {corporateLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-[var(--text)] transition-colors py-0.5 px-1.5 rounded hover:bg-[var(--surface-alt)]"
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
