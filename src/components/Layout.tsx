import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Search, Heart, ArrowLeftRight, Instagram, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { generatePath } from "../utils/routes";
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
  const [searchVal, setSearchVal] = useState("");

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
 
            {/* Header Controls (Theme, Lang) */}
            <div className="enc-header-controls">
              <div className="flex items-center">
                <ThemeToggle />
                <span style={{ width: "1px", height: "14px", backgroundColor: "var(--border)", margin: "0 0.4rem" }} />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
 
          {/* Nav tabs */}
          <nav className="flex" style={{ gap: 0, borderTop: "1px solid var(--border-dim)", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }} aria-label={t("aria_nav_label")}>
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
      <main className="enc-container pb-[2rem]" style={{ paddingTop: "1.75rem" }}>
        <div key={location.pathname} className="page-fade-in">
          <Outlet />
        </div>
      </main>

       <footer style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0" }}>
        <div className="enc-container-wide" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--text-faint)" }}>
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
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <a href="mailto:kurdishname.com@gmail.com" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }} className="hover:text-[var(--female)] transition-colors">
              <Mail size={22} color="var(--text-muted)" />
              <span>kurdishname.com@gmail.com</span>
            </a>
            <a href="https://instagram.com/kurdishnamecom" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }} className="hover:text-[var(--female)] transition-colors">
              <Instagram size={22} color="#E1306C" />
              <span>@kurdishnamecom</span>
            </a>
            <a href="https://instagram.com/naven.kurdi" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }} className="hover:text-[var(--female)] transition-colors">
              <Instagram size={22} color="#E1306C" />
              <span>@naven.kurdi</span>
            </a>
            <a href="https://tiktok.com/@kurdishname.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }} className="hover:text-[var(--female)] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.95v7.4c0 1.97-.78 3.86-2.17 5.25-1.39 1.39-3.28 2.17-5.25 2.17-1.97 0-3.86-.78-5.25-2.17-1.39-1.39-2.17-3.28-2.17-5.25 0-1.97.78-3.86 2.17-5.25 1.39-1.39 3.28-2.17 5.25-2.17.65 0 1.3.11 1.91.31v4.02c-.59-.16-1.22-.2-1.84-.11-.63.09-1.22.37-1.69.83-.47.45-.81 1.05-.96 1.68-.15.63-.1 1.29.13 1.88.24.59.67 1.09 1.22 1.42.55.33 1.19.46 1.83.39.63-.07 1.23-.33 1.71-.75.48-.42.82-.99.96-1.62.15-.65.17-1.33.06-1.99V0h4.22z"/>
              </svg>
              <span>@kurdishname.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
