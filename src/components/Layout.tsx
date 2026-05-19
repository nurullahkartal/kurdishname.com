import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Search, Heart, Menu, X } from "lucide-react";

import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { generatePath, routeTranslations, switchLanguagePath } from "../utils/routes";
import { useFavorites } from "../context/FavoritesContext";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const baseUrl = "https://kurdishname.com";
  const canonicalUrl = `${baseUrl}${location.pathname === "/" ? `/${lng}` : location.pathname}`;

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

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }} dir={isRtl ? "rtl" : "ltr"}>
      <Helmet htmlAttributes={{ lang: lng }}>
        <title>{t("site_title", "KurdishName")}</title>
        <meta name="author" content="KurdishName" />
        <meta name="publisher" content="KurdishName" />
        <meta name="description" content={t("home_description")} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        {Object.keys(routeTranslations).map((langKey) => (
          <link key={langKey} rel="alternate" hrefLang={langKey}
            href={`${baseUrl}${switchLanguagePath(location.pathname, langKey)}`} />
        ))}
        <link rel="alternate" hrefLang="x-default"
          href={`${baseUrl}${switchLanguagePath(location.pathname, "en")}`} />

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
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 50 }}>
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
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-1 text-[var(--text)] rounded-md hover:bg-[var(--surface-alt)] transition-colors"
                aria-label="Menüyü aç"
              >
                <Menu size={26} />
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
            {(() => {
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

              const footerLinks = [
                { to: generatePath(lng, "category", "kiz"), label: t("nav_girls"), titleAttr: tooltips.girls },
                { to: generatePath(lng, "category", "erkek"), label: t("nav_boys"), titleAttr: tooltips.boys },
                { to: generatePath(lng, "about"), label: t("footer_about", "Hakkımızda") },
                { to: generatePath(lng, "widget"), label: t("footer_widget", "Widget") },
                { to: generatePath(lng, "privacy"), label: t("footer_privacy", "Gizlilik Politikası") },
                { to: generatePath(lng, "terms"), label: t("footer_terms", "Kullanım Koşulları") },
                { to: generatePath(lng, "contact"), label: t("footer_contact", "İletişim") },
              ];

              return footerLinks.map(({ to, label, titleAttr }) => (
                <NavLink 
                  key={to} 
                  to={to} 
                  title={titleAttr}
                  style={{ color: "var(--text-faint)", fontSize: "0.75rem", textDecoration: "none", fontWeight: titleAttr ? 600 : 400 }} 
                  className="hover:text-[var(--text)] transition-colors"
                >
                  {label}
                </NavLink>
              ));
            })()}
          </div>
        </div>
      </footer>

      {/* ── MOBILE DRAWER ──────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex" dir={isRtl ? "rtl" : "ltr"}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className={`relative flex w-full max-w-xs flex-col overflow-y-auto bg-[var(--surface)] p-6 shadow-xl z-10 h-full animate-in ${isRtl ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo.webp" width="32" height="32" alt="Logo" className="rounded-md shadow-sm" />
                <span className="font-serif font-bold text-lg text-[var(--text)] tracking-tight">KurdishName</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--surface-alt)] rounded-full transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3 mb-8">
              {navItems.map(({ to, label, isFav, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-colors ${isActive ? 'bg-[var(--accent)] !text-white shadow-md' : 'text-[var(--text)] hover:bg-[var(--surface-alt)]'}`}
                >
                  {isFav && <Heart size={18} className={favorites.length > 0 ? "fill-current" : ""} />}
                  {label}
                  {isFav && favorites.length > 0 && (
                    <span className="ml-auto bg-white/20 text-current text-xs px-2.5 py-0.5 rounded-full">{favorites.length}</span>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="mt-auto border-t border-[var(--border)] pt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t("theme_select", "Tema")}</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">{t("language_select", "Dil")}</span>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
