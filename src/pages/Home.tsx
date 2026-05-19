import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Search, Dices, ArrowRight, Heart } from "lucide-react";
// Optimized: purely native CSS fade-in animations utilized
import { NameData } from "../data/names";
import { generatePath } from "../utils/routes";
import { getLocalizedMeaning, getLocalizedOrigin } from "../utils/localization";
import { searchWithFuse } from "../utils/search";
import { loadNamesForLetter, loadNamesForSearch } from "../utils/nameLoader";
import { stats, homeGirlNames, homeBoyNames, featuredNames } from "../data/homeStaticData";
import { blogPostsRegistry } from "../data/blogPosts";
import { useFavorites } from "../context/FavoritesContext";
import PopularTrendsWidget from "../components/PopularTrendsWidget";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lng = i18n.language || "tr";
  const location = useLocation();
  const navigate = useNavigate();
  const q = new URLSearchParams(location.search).get("q") || "";
  const [localSearch, setLocalSearch] = useState(q);
  const [allNames, setAllNames] = useState<NameData[]>([]);
  const [isLoading, setIsLoading] = useState(!!q);

  useEffect(() => {
    let active = true;
    if (!q) {
      setIsLoading(false);
      return;
    }

    async function load() {
      setIsLoading(true);
      try {
        const loaded = await loadNamesForSearch(q);
        if (active) {
          const localNamesStr = localStorage.getItem('addedNames');
          const localNames: NameData[] = localNamesStr ? JSON.parse(localNamesStr) : [];
          const combined = [...loaded, ...localNames];
          
          const uniqueMap = new Map();
          combined.forEach(item => uniqueMap.set(item.id, item));
          setAllNames(Array.from(uniqueMap.values()));
        }
      } catch (err) {
        console.error("Failed to load names inside Home", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => { active = false; };
  }, [q]);

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    if (val && val.length >= 1) {
      const firstLetter = val.charAt(0).toUpperCase();
      loadNamesForLetter(firstLetter); // Prefetch the letter chunk!
    }
  };

  const searchResults = useMemo(() => {
    if (q.length < 2) return [];
    return searchWithFuse(allNames, q, lng).slice(0, 60);
  }, [q, allNames, lng]);

  const featuredGirlNames = useMemo(() => {
    return featuredNames.filter(n => n.gender === "female");
  }, []);

  const featuredBoyNames = useMemo(() => {
    return featuredNames.filter(n => n.gender === "male");
  }, []);

  const featuredGirlName = useMemo(() => {
    const today = new Date().getDate(); // 1 to 31
    const idx = (today - 1) % featuredGirlNames.length;
    return featuredGirlNames[idx];
  }, [featuredGirlNames]);

  const featuredBoyName = useMemo(() => {
    const today = new Date().getDate(); // 1 to 31
    const idx = (today - 1) % featuredBoyNames.length;
    return featuredBoyNames[idx];
  }, [featuredBoyNames]);

  const handleRandom = () => {
    const combinedList = [...featuredNames, ...homeGirlNames, ...homeBoyNames];
    const randomItem = combinedList[Math.floor(Math.random() * combinedList.length)];
    navigate(generatePath(lng, "name", randomItem.id));
  };

  const totalNames = stats.total;
  const girlCount = stats.female;
  const boyCount  = stats.male;
  const alphabet  = ["A","B","C","Ç","D","E","Ê","F","G","H","I","Î","J","K","L","M","N","O","P","Q","R","S","Ş","T","U","Û","V","W","X","Y","Z"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(localSearch.trim() ? `/${lng}?q=${encodeURIComponent(localSearch)}` : `/${lng}`);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
          {t("loading", "Yükleniyor...")}
        </p>
      </div>
    );
  }

  /* ── SEARCH RESULTS ─────────────────────────────────────── */
  if (q) {
    return (
      <>
        <Helmet>
          <title>{t("search_results_title_tag", { q })}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1 className="page-title">{t("search_results_header", { q })}</h1>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
          {searchResults.length} {t("names_found_count", "isim bulundu.")}{" "}
          <Link to={generatePath(lng, null)}>← {t("back_to_home", "KurdishName'e dön")}</Link>
        </p>

        {searchResults.length > 0 ? (
          <div className="overflow-x-auto w-full border border-[var(--border)] rounded-xl shadow-sm" style={{ background: "var(--surface)" }}>
            <table className="wiki-table" style={{ minWidth: "500px" }}>
              <thead>
                <tr>
                  <th>{t("admin_names_col_name", "İsim")}</th>
                  <th>{t("detail_gender", "Cinsiyet")}</th>
                  <th>{t("detail_meaning", "Anlamı")}</th>
                  <th>{t("detail_origin", "Köken")}</th>
                  <th style={{ width: "50px", textAlign: "center" }}>♥</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link to={generatePath(lng, "name", item.id)}
                        className={item.gender === "female" ? "name-link-female" : "name-link-male"}>
                        {item.name}
                      </Link>
                    </td>
                    <td>
                      <span className={item.gender === "female" ? "badge-female" : "badge-male"}>
                        {item.gender === "female" ? t("gender_female", "Kız") : t("gender_male", "Erkek")}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{getLocalizedMeaning(item, lng)}</td>
                    <td style={{ color: "var(--text-muted)" }}>{getLocalizedOrigin(item.origin, t)}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => toggleFavorite(item)}
                        style={{
                          color: isFavorite(item.id) ? "var(--female)" : "var(--text-faint)",
                          padding: "0.25rem",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 150ms",
                        }}
                        className="hover:scale-125 active:scale-90"
                        title={isFavorite(item.id) ? t("favorites_remove") : t("favorites_add")}
                      >
                        <Heart size={16} fill={isFavorite(item.id) ? "var(--female)" : "none"} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="notice-box">
              <strong>{t("search_no_results", "Sonuç bulunamadı.")}</strong> {t("search_try_again_hint", "Farklı bir kelime ile tekrar deneyin.")}
            </div>
            
            {/* Beautiful Suggestion CTA */}
            <div style={{
              background: "rgba(var(--accent-rgb), 0.04)",
              border: "1.5px dashed var(--border)",
              borderRadius: "1rem",
              padding: "1.5rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "0.5rem"
            }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)" }}>
                {t("search_suggest_cta_title", "Aradığınız ismi bulamadınız mı?")}
              </h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "420px", lineHeight: 1.5 }}>
                {t("search_suggest_cta_desc", "Aradığınız Kürtçe isim arşivimizde henüz yer almıyor olabilir. Hemen bize önerin, akademik incelemenin ardından veritabanımıza ekleyelim!")}
              </p>
              <Link
                to={generatePath(lng, "suggest")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  padding: "0.6rem 1.25rem",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  transition: "all 150ms"
                }}
                className="hover:opacity-95 active:scale-95"
              >
                {t("suggest_title", "Yeni İsim Öner")}
              </Link>
            </div>
          </div>
        )}
      </>
    );
  }

  /* ── HOME VIEW ──────────────────────────────────────────── */
  return (
    <>
      <Helmet>
        <title>{t("seo_home_title")}</title>
        <meta name="description" content={t("seo_home_description")} />
        <link rel="canonical" href={`https://kurdishname.com/${lng}`} />
        {["tr", "en", "de", "ar"].map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`https://kurdishname.com/${lang}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://kurdishname.com/en"
        />
        <meta property="og:title" content={t("seo_home_title")} />
        <meta property="og:description" content={t("seo_home_description")} />
        <meta property="og:url" content={`https://kurdishname.com/${lng}`} />
        <meta name="twitter:title" content={t("seo_home_title")} />
        <meta name="twitter:description" content={t("seo_home_description")} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://kurdishname.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `https://kurdishname.com/${lng}?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "KurdishName Database",
            "description": t("seo_home_description"),
            "url": `https://kurdishname.com/${lng}`,
            "keywords": "Kürtçe isimler, Kurdish names, kurdische namen, الأسماء الكردية",
            "creator": {
              "@type": "Organization",
              "name": "KurdishName",
              "url": "https://kurdishname.com"
            },
            "license": `https://kurdishname.com/${lng === 'tr' ? 'tr/kullanim-kosullari' : 'en/terms-of-use'}`,
            "isAccessibleForFree": true,
            "size": `${totalNames.toLocaleString()} names`
          })}
        </script>
      </Helmet>

      {/* ── HERO SECTION ─────────────────────── */}
      <section
        style={{ 
          padding: "clamp(2rem, 10vw, 5rem) 0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem, 6vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: "var(--text)",
          margin: "0 auto 1rem",
          lineHeight: 1.1,
          maxWidth: "900px"
        }}>
          {t("home_h1_title", "En Kapsamlı Kürtçe İsimler Arşivi")}
        </h1>
        <p style={{ 
          fontSize: "clamp(1rem, 2vw, 1.25rem)", 
          color: "var(--text-muted)", 
          marginBottom: "2.5rem", 
          lineHeight: 1.6, 
          maxWidth: "680px" 
        }}>
          {t("home_description")}
        </p>

        {/* Command Palette */}
        <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: "640px" }}>
          <div className="cmd-search" style={{ 
            padding: "0.75rem 1rem",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
            border: "2px solid var(--border)"
          }}>
            <Search size={20} className="cmd-search-icon" style={{ marginLeft: "0.5rem" }} />
            <input
              type="text"
              value={localSearch}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder={t("search_placeholder")}
              autoComplete="off"
              aria-label={t("search_placeholder")}
              style={{ fontSize: "1.125rem", padding: "0.5rem" }}
            />
            <button
              type="button"
              onClick={handleRandom}
              className="cmd-random-btn"
              style={{ background: "var(--surface-2)", borderRadius: "var(--r-md)" }}
              title={t("random_name_discover_title", "Rastgele isim keşfet")}
            >
              <Dices size={18} />
            </button>
            <button type="submit" className="cmd-search-btn" style={{ 
              background: "var(--accent)", 
              padding: "0 1.5rem",
              borderRadius: "var(--r-md)",
              height: "48px"
            }}>
              {t("search_btn_text", "Ara")}
            </button>
          </div>
        </form>

        {/* Quick Navigation Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 select-none">
          <span className="text-xs text-[var(--text-faint)] font-bold uppercase tracking-wider">{t("popular_searches", "Popüler:")}</span>
          {[
            { label: "Arîn", id: "arin" },
            { label: "Baran", id: "baran" },
            { label: "Zîn", id: "zin" },
            { label: "Rojda", id: "rojda" },
            { label: "Mîr", id: "mir" }
          ].map(chip => (
            <Link
              key={chip.id}
              to={generatePath(lng, "name", chip.id)}
              className="text-sm font-semibold bg-var(--surface) hover:bg-var(--accent) hover:text-white px-4 py-2 rounded-full border border-[var(--border)] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── BENTO STATS + TODAY'S NAME ─────────────────── */}
      {(featuredGirlName || featuredBoyName) && (
        <section className="stats-bento-grid" style={{ gap: "1rem", marginBottom: "4rem" }}>
          {[
            { label: t("total_names"), value: `${totalNames.toLocaleString()}+`, dot: "var(--accent)" },
            { label: t("girl_names"), value: `${girlCount.toLocaleString()}+`, dot: "var(--female)", link: generatePath(lng, "category", "kiz") },
            { label: t("boy_names"), value: `${boyCount.toLocaleString()}+`, dot: "var(--male)", link: generatePath(lng, "category", "erkek") },
            ...(featuredGirlName ? [{ label: t("featured_girl_name", "Günün Kız İsmi"), value: featuredGirlName.name, dot: "var(--female)", link: generatePath(lng, "name", featuredGirlName.id), isName: true, gender: "female" }] : []),
            ...(featuredBoyName ? [{ label: t("featured_boy_name", "Günün Erkek İsmi"), value: featuredBoyName.name, dot: "var(--male)", link: generatePath(lng, "name", featuredBoyName.id), isName: true, gender: "male" }] : [])
          ].map(({ label, value, dot, link, isName, gender }) => (
              <motion.div 
              whileHover={{ y: -5 }}
              key={label} 
              className="bento-box" 
              style={{ 
                border: isName ? `1px solid ${gender === 'female' ? 'var(--female-dim)' : 'var(--male-dim)'}` : "1px solid var(--border)",
                background: isName ? (gender === 'female' ? "linear-gradient(135deg, var(--surface), rgba(190, 18, 60, 0.03))" : "linear-gradient(135deg, var(--surface), rgba(29, 78, 216, 0.03))") : "var(--surface)",
                boxShadow: isName ? "0 4px 12px rgba(0,0,0,0.04)" : "0 4px 6px -1px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
              </div>
              <div>
                <span className="bento-label">
                  {label}
                </span>
                {link ? (
                  <Link to={link} className={`bento-value ${isName ? 'is-name' : ''}`} style={{
                    color: isName ? (gender === "female" ? "var(--female)" : "var(--male)") : "var(--text)"
                  }}>
                    {value}
                  </Link>
                ) : (
                  <span className="bento-value">{value}</span>
                )}
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* ── LIVE WEEKLY POPULAR TRENDS WIDGET ─────────── */}
      <PopularTrendsWidget />




      {/* ── ALPHABET INDEX ────────────────────────────── */}
      <section
        id="alfabe"
        style={{ marginBottom: "1.75rem" }}
      >
        <h2 className="section-heading">{t("alphabetical_index")}</h2>
        <div className="alpha-index">
          {alphabet.map(letter => (
            <Link key={letter} to={generatePath(lng, "category", letter)} aria-label={t("aria_alphabet_letter_label", { defaultValue: `${letter} harfi ile başlayan isimler`, letter })} className="py-2">
              {letter}
            </Link>
          ))}
        </div>
      </section>

      {/* Subtle Section Divider */}
      <hr className="border-[var(--border)] opacity-60 my-10" />

      {/* ── NAME COLUMNS ──────────────────────────────── */}
      <div className="home-names-grid">

        {/* Girl names */}
        <section
          id="kiz-isimleri"
        >
          <h2 className="section-heading">
            <span style={{ color: "var(--female)" }}>●</span> {t("girl_names")}{" "}
            <Link to={generatePath(lng, "category", "kiz")} aria-label={t("aria_view_girls_label", "Kız isimlerini gör")} className="py-1 inline-block" style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--accent)" }}>
              {t("sidebar_view_all", { gender: "" }).replace("()", "")} →
            </Link>
          </h2>
          <div>
            {homeGirlNames.slice(0, 7).map((item) => (
              <div
                key={item.id}
                className="name-list-item"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => toggleFavorite(item)}
                    style={{
                      color: isFavorite(item.id) ? "var(--female)" : "var(--text-faint)",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 150ms",
                    }}
                    className="hover:scale-120 active:scale-90"
                    title={isFavorite(item.id) ? t("favorites_remove") : t("favorites_add")}
                  >
                    <Heart size={13} fill={isFavorite(item.id) ? "var(--female)" : "none"} />
                  </button>
                  <Link to={generatePath(lng, "name", item.id)} className="name-link-female">
                    {item.name}
                  </Link>
                </div>
                <span className="name-list-meaning">
                  {getLocalizedMeaning(item, lng)?.slice(0, 26)}
                </span>
              </div>
            ))}
            
            <Link 
              to={generatePath(lng, "category", "kiz")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
                padding: "0.75rem 1rem",
                background: "var(--surface-alt)",
                color: "var(--female)",
                fontWeight: 700,
                fontSize: "0.875rem",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--border-dim)",
                transition: "all 200ms"
              }}
              className="hover:bg-[var(--female-dim)] hover:border-[var(--female)]"
            >
              {t("view_all_girls", "Tüm Kız İsimlerini Keşfet")} <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Boy names */}
        <section
          id="erkek-isimleri"
        >
          <h2 className="section-heading">
            <span style={{ color: "var(--male)" }}>●</span> {t("boy_names")}{" "}
            <Link to={generatePath(lng, "category", "erkek")} aria-label={t("aria_view_boys_label", "Erkek isimlerini gör")} className="py-1 inline-block" style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--accent)" }}>
              {t("sidebar_view_all", { gender: "" }).replace("()", "")} →
            </Link>
          </h2>
          <div>
            {homeBoyNames.slice(0, 7).map((item) => (
              <div
                key={item.id}
                className="name-list-item"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => toggleFavorite(item)}
                    style={{
                      color: isFavorite(item.id) ? "var(--female)" : "var(--text-faint)",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 150ms",
                    }}
                    className="hover:scale-120 active:scale-90"
                    title={isFavorite(item.id) ? t("favorites_remove") : t("favorites_add")}
                  >
                    <Heart size={13} fill={isFavorite(item.id) ? "var(--female)" : "none"} />
                  </button>
                  <Link to={generatePath(lng, "name", item.id)} className="name-link-male">
                    {item.name}
                  </Link>
                </div>
                <span className="name-list-meaning">
                  {getLocalizedMeaning(item, lng)?.slice(0, 26)}
                </span>
              </div>
            ))}
            
            <Link 
              to={generatePath(lng, "category", "erkek")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1.5rem",
                padding: "0.75rem 1rem",
                background: "var(--surface-alt)",
                color: "var(--male)",
                fontWeight: 700,
                fontSize: "0.875rem",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--border-dim)",
                transition: "all 200ms"
              }}
              className="hover:bg-[var(--male-dim)] hover:border-[var(--male)]"
            >
              {t("view_all_boys", "Tüm Erkek İsimlerini Keşfet")} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      {/* 📰 Blog Kesiti - İç Linkleme Motoru */}
      <div className="mt-24 border-t border-[var(--border)] pt-16 pb-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text)] mb-2 tracking-tight font-serif">
              {t('home.latest_blog')}
            </h2>
            <p className="text-[var(--text-muted)] text-sm">
              {t('home.latest_blog_desc')}
            </p>
          </div>
          <Link to={generatePath(lng, "blog")} className="hidden md:flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-bold text-sm transition-colors">
            {t('home.view_all_blog')} <ArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="premium-blog-grid">
          {blogPostsRegistry.slice(0, 3).map((post, index) => {
            const localizedTag = (post.tags[lng] || post.tags["tr"] || [])[0];
            const localizedTitle = post.titles[lng] || post.titles["tr"];
            const localizedDesc = post.descriptions[lng] || post.descriptions["tr"];
            const detailPath = generatePath(lng, "blog", post.slugs[lng]);

            return (
              <Link 
                key={post.id}
                to={detailPath}
                className="premium-blog-card"
              >
                <div className={`premium-blog-card-cover cover-gradient-${index % 3}`}>
                  {localizedTag && (
                    <span className="premium-blog-card-tag">
                      {localizedTag}
                    </span>
                  )}
                </div>
                <div className="premium-blog-card-body">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-faint)" }}>{post.date}</span>
                  </div>
                  <h3 className="premium-blog-card-title">
                    {localizedTitle}
                  </h3>
                  <p className="premium-blog-card-desc">
                    {localizedDesc}
                  </p>
                  <div className="premium-blog-card-action">
                    {t('home.read_more')} <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile-only view all button for perfect responsive flow */}
        <div className="flex md:hidden justify-center mt-8">
          <Link to={generatePath(lng, "blog")} style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--accent)",
            fontWeight: 700,
            fontSize: "0.875rem"
          }}>
            {t('home.view_all_blog')} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </>
  );
}