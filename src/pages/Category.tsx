import { useState, useMemo, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Heart, Sparkles, Shuffle } from "lucide-react";
// Optimized: native hardware-accelerated CSS animations utilized
import { useRef, useCallback } from "react";
import { NameData } from "../data/names";
import { generatePath, getGenderFromSlug, getThemeFromSlug } from "../utils/routes";
import { searchWithMiniSearch } from "../utils/search";
import { getLocalizedMeaning, getLocalizedOrigin } from "../utils/localization";
import { loadNamesForLetter, loadAllNames } from "../utils/nameLoader";
import { generateContextualHook, SeoHookCategory } from "../utils/seoHook";
import { isLetterActive } from "../data/config";
import { useFavorites } from "../context/FavoritesContext";


// ── Valid Category and Theme Slugs List ─────────────────────────────────────
const VALID_SLUGS = new Set([
  // Gender - Female
  "kiz", "kız", "kız-isimleri", "kız-bebek-isimleri",
  "girls", "girl", "female", "woman", "women",
  "girl-names", "girls-names", "female-names",
  "baby-girl-names", "feminine",
  "maedchen", "mädchen", "madchen",
  "mädchennamen", "maedchennamen",
  "بنات", "اناث", "مؤnث", "مؤنث",

  // Gender - Male
  "erkek", "erkek-isimleri", "erkek-bebek-isimleri",
  "boys", "boy", "male", "man", "men",
  "boy-names", "boys-names", "male-names",
  "baby-boy-names", "masculine",
  "jungen", "junge", "männer", "manner",
  "jungennamen", "männernamen",
  "ذكور", "ذكر", "مذكر",

  // Themes
  "doga", "nature", "natur", "طبيعة",
  "guc", "power", "macht", "قوة",
  "guzellik", "beauty", "schoenheit", "جمال",
  "isik", "light", "licht", "نور",
  "bilgelik", "wisdom", "weisheit", "حكمة"
]);

const ALPHABET = new Set(["A","B","C","Ç","D","E","Ê","F","G","H","I","Î","J","K","L","M","N","O","P","Q","R","S","Ş","T","U","Û","V","W","X","Y","Z"]);

function isValidSlug(slug: string | undefined): boolean {
  if (!slug) return false;
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  if (VALID_SLUGS.has(decoded)) return true;
  if (slug.length === 1 && ALPHABET.has(slug.toUpperCase())) return true;
  return false;
}

export default function Category() {
  const { type } = useParams<{ type: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [names, setNames] = useState<NameData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const lng = i18n.language || "tr";

  // URL'den gelen categorySlug parametresinin geçerliliğini kontrol et
  const isValid = useMemo(() => {
    return isValidSlug(type);
  }, [type]);

  if (!isValid) {
    return <Navigate to="/404" replace />;
  }

  const genderCategory = useMemo(() => {
    return getGenderFromSlug(lng, type);
  }, [lng, type]);

  const themeCategory = useMemo(() => {
    return getThemeFromSlug(lng, type);
  }, [lng, type]);

  const [selectedLetter, setSelectedLetter] = useState<string>("RANDOM");
  const [shuffledNames, setShuffledNames] = useState<NameData[]>([]);
  const [visibleCount, setVisibleCount] = useState(30);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const shuffleArray = (array: NameData[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };



  useEffect(() => {
    let active = true;
    async function fetchNames() {
      setIsLoading(true);
      try {
        let loaded: NameData[] = [];
        if (genderCategory === "female" || genderCategory === "male" || themeCategory) {
          loaded = await loadAllNames();
        } else if (type && type.length === 1) {
          loaded = await loadNamesForLetter(type);
        } else {
          loaded = await loadAllNames();
        }

        if (active) {
          const localNamesStr = localStorage.getItem("addedNames");
          const localNames: NameData[] = localNamesStr ? JSON.parse(localNamesStr) : [];
          const combined = [...loaded, ...localNames];

          const uniqueMap = new Map();
          combined.forEach((item) => uniqueMap.set(item.id, item));
          const uniqueList = Array.from(uniqueMap.values());
          setNames(uniqueList);
          
          // Initial Shuffle
          setShuffledNames(shuffleArray(uniqueList));
          setVisibleCount(30);
          setSelectedLetter("RANDOM");
        }
      } catch (err) {
        console.error("Failed to load names", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchNames();
    return () => {
      active = false;
    };
  }, [type, genderCategory, themeCategory]);


  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val && val.length >= 1) {
      const firstLetter = val.charAt(0).toUpperCase();
      loadNamesForLetter(firstLetter); // Prefetch
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { title, filteredNames, description } = useMemo(() => {
    let t_title = t("nav_home");
    let filtered = [...names];
    let desc = "";

    if (genderCategory === "female") {
      t_title = t("cat_title_kiz", "Kürtçe Kız İsimleri");
      filtered = filtered.filter((n) => n.gender === "female");
      desc = t("cat_desc_kiz");
    } else if (genderCategory === "male") {
      t_title = t("cat_title_erkek", "Kürtçe Erkek İsimleri");
      filtered = filtered.filter((n) => n.gender === "male");
      desc = t("cat_desc_erkek");
    } else if (themeCategory === "nature") {
      t_title = t("theme_nature_title", "Kürtçe Doğa İsimleri");
      filtered = filtered.filter((n) => n.tags?.includes("Doğa ve Tabiat"));
      desc = t("theme_nature_desc", "Doğadan, ağaçlardan ve çiçeklerden ilham alan en güzel Kürtçe isimler ve anlamları.");
    } else if (themeCategory === "power") {
      t_title = t("theme_power_title", "Kürtçe Savaşçı ve Güç İsimleri");
      filtered = filtered.filter((n) => n.tags?.includes("Güç ve Cesaret"));
      desc = t("theme_power_desc", "Güç, cesaret, yiğitlik ve kahramanlık bildiren en asil Kürtçe isimler ve anlamları.");
    } else if (themeCategory === "beauty") {
      t_title = t("theme_beauty_title", "Kürtçe Sevgi ve Güzellik İsimleri");
      filtered = filtered.filter((n) => n.tags?.includes("Sevgi ve Güzellik"));
      desc = t("theme_beauty_desc", "Aşk, sevgi, zarafet ve güzellik anlamına gelen en popüler Kürtçe isimler.");
    } else if (themeCategory === "light") {
      t_title = t("theme_light_title", "Kürtçe Işık ve Aydınlık İsimleri");
      filtered = filtered.filter((n) => n.tags?.includes("Işık ve Aydınlık"));
      desc = t("theme_light_desc", "Güneş, ışık, aydınlık ve parıltı saçan anlamlı Kürtçe bebek isimleri.");
    } else if (themeCategory === "wisdom") {
      t_title = t("theme_wisdom_title", "Kürtçe Bilgelik ve Akıl İsimleri");
      filtered = filtered.filter((n) => n.tags?.includes("Bilgelik ve Akıl"));
      desc = t("theme_wisdom_desc", "Bilgelik, akıl, zeka, asalet ve başarıyı temsil eden Kürtçe isimler listesi.");
    } else if (type && type.length === 1) {
      t_title = t("cat_title_letter", { letter: type.toUpperCase() });
      filtered = filtered.filter((n) => n.letter === type.toUpperCase());
      desc = t("cat_desc_letter", { letter: type.toUpperCase() });
    }

    if (debouncedSearchTerm) {
      filtered = searchWithMiniSearch(filtered, debouncedSearchTerm, lng);
    } else {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    }
    return { title: t_title, filteredNames: filtered, description: desc };
  }, [type, debouncedSearchTerm, t, names, genderCategory, themeCategory]);

  const grouped = useMemo(() => {
    const groups: Record<string, NameData[]> = {};
    filteredNames.forEach((item) => {
      const char = item.name.charAt(0).toUpperCase();
      if (!groups[char]) groups[char] = [];
      groups[char].push(item);
    });
    return groups;
} , [filteredNames]);

  const isGenderCategory = genderCategory === "female" || genderCategory === "male";
  const genderColor = genderCategory === "female" ? "var(--female)" : genderCategory === "male" ? "var(--male)" : "var(--text)";

  // Content-length based adaptive ad system
  const count = filteredNames.length;
  const isLong = count >= 300;

  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const availableLettersSet = useMemo(() => {
    const set = new Set<string>();
    filteredNames.forEach(n => {
      const char = n.name.charAt(0).toUpperCase();
      set.add(char);
    });
    return set;
  }, [filteredNames]);

  const seoHookText = useMemo(() => {
    const hookSeed = `${type}_${selectedLetter}_${searchTerm}`;
    let cat: SeoHookCategory = "unisex";
    if (genderCategory === "female") cat = "female";
    if (genderCategory === "male") cat = "male";
    
    if (searchTerm.trim().length > 0) cat = "search";
    
    const extra = searchTerm || (selectedLetter !== "RANDOM" ? selectedLetter : (type || "isim"));
    return generateContextualHook(hookSeed, cat, lng, extra);
  }, [type, selectedLetter, searchTerm, lng, genderCategory]);

  const sortedAvailableLetters = useMemo(() => {
    return Array.from(availableLettersSet).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [availableLettersSet]);

  const isCategoryActive = useMemo(() => {
    if (!type) return true;
    if (genderCategory === "female" || genderCategory === "male" || themeCategory) return true;
    return isLetterActive(type);
  }, [type, genderCategory, themeCategory]);

  const strictlyFilteredNames = useMemo(() => {
    let base = [...filteredNames];
    if (selectedLetter === "RANDOM") {
      base = [...shuffledNames].filter(n => filteredNames.some(fn => fn.id === n.id));
    } else if (selectedLetter) {
      base = filteredNames.filter(n => {
        const firstChar = n.name.charAt(0).toUpperCase();
        return firstChar === selectedLetter || 
               firstChar.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === selectedLetter;
      });
    }
    return base;
  }, [filteredNames, selectedLetter, shuffledNames]);

  const displayNames = useMemo(() => {
    return strictlyFilteredNames.slice(0, visibleCount);
  }, [strictlyFilteredNames, visibleCount]);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < strictlyFilteredNames.length) {
        setVisibleCount(prev => prev + 30);
      }
    }, { threshold: 0.1 });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, visibleCount, strictlyFilteredNames.length]);

  const categoryKeys = useMemo(() => {
    if (!type) return null;
    const s = type.toLowerCase();
    const gender = getGenderFromSlug(lng, type);
    if (gender === "female" || s === "kiz" || s === "girls" || s === "maedchen" || s === "بنات") {
      return {
        title: "category_girls_title",
        desc: "category_girls_description"
      };
    }
    if (gender === "male" || s === "erkek" || s === "boys" || s === "jungen" || s === "ذكور") {
      return {
        title: "category_boys_title",
        desc: "category_boys_description"
      };
    }
    return null;
  }, [type, lng]);

  const helmetTitle = useMemo(() => {
    if (categoryKeys) {
      return `${t(categoryKeys.title)} | KurdishName`;
    }
    return `${title} | KurdishName`;
  }, [categoryKeys, title, t]);

  const helmetDescription = useMemo(() => {
    if (categoryKeys) {
      return t(categoryKeys.desc);
    }
    return description;
  }, [categoryKeys, description, t]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
          {t("loading", "Yükleniyor...")}
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
        {isCategoryActive ? (
          <meta name="robots" content="index, follow" />
        ) : (
          <meta name="robots" content="noindex, follow" />
        )}
      </Helmet>

      <div style={{ marginBottom: "3rem" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-faint)", marginBottom: "1rem", fontWeight: 600 }}>
          <Link to={generatePath(lng, null)} style={{ color: "inherit", textDecoration: "none" }} className="hover:text-var(--accent)">KurdishName</Link>
          <span>›</span>
          <span style={{ color: "var(--text-muted)" }}>{title}</span>
        </nav>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
          <h1
            style={{ 
              fontSize: "clamp(1.5rem, 6vw, 2.75rem)", 
              fontWeight: 900, 
              letterSpacing: "-0.03em",
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem",
              margin: 0,
              color: "var(--text)"
            }}
          >
            {isGenderCategory && (
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: genderColor, display: "inline-block", flexShrink: 0 }} />
            )}
            {title}
          </h1>

          <div className="cmd-search" style={{ maxWidth: "320px", padding: "0.5rem 0.875rem" }}>
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label={t("search_placeholder")}
              style={{ fontSize: "0.875rem" }}
            />
          </div>
        </div>
        
        <p style={{ marginTop: "1rem", fontSize: "1rem", color: "var(--text-muted)", fontWeight: 500 }}>
          <strong>{filteredNames.length}</strong> {t("names_found_count", "isim listeleniyor.")}
        </p>
      </div>
 
      {/* Semantic LSI Content Hub Introduction Block */}
      {isGenderCategory && (
        <div style={{
          background: "var(--surface)",
          borderLeft: `4px solid ${genderColor}`,
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid var(--border)",
          borderLeftWidth: "4px"
        }}>
          {((genderCategory === "female" ? t("cat_intro_kiz") : t("cat_intro_erkek")) || "").split("\n\n").map((para, idx) => (
            <p 
              key={idx} 
              style={{ 
                fontSize: "0.935rem", 
                lineHeight: 1.8, 
                color: "var(--text-muted)", 
                marginBottom: idx === 1 ? 0 : "1rem",
                textAlign: "justify"
              }}
            >
              {para}
            </p>
          ))}
        </div>
      )}

      {/* SEO Intro Block for Theme Categories */}
      {themeCategory && ["nature", "power", "beauty", "light"].includes(themeCategory) && (() => {
        const themeIntroKey = `theme_${themeCategory}_intro`;
        const introText = t(themeIntroKey, "");
        if (!introText) return null;

        const themeAccents: Record<string, { border: string; icon: string }> = {
          nature:  { border: "#4ade80", icon: "🌿" },
          power:   { border: "#f97316", icon: "⚡" },
          beauty:  { border: "#f472b6", icon: "✦" },
          light:   { border: "#facc15", icon: "☀" },
        };
        const accent = themeAccents[themeCategory] || { border: "var(--accent)", icon: "✦" };

        return (
          <div style={{
            background: "var(--surface)",
            borderLeft: `4px solid ${accent.border}`,
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid var(--border)",
            borderLeftWidth: "4px",
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
          }}>
            <span style={{
              fontSize: "1.35rem",
              lineHeight: 1,
              flexShrink: 0,
              marginTop: "0.15rem",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))"
            }} aria-hidden="true">
              {accent.icon}
            </span>
            <p style={{
              fontSize: "0.935rem",
              lineHeight: 1.85,
              color: "var(--text-muted)",
              margin: 0,
              textAlign: "justify",
              fontStyle: "italic",
            }}>
              {introText}
            </p>
          </div>
        );
      })()}



      {/* Adaptive Layout Container */}
      <div style={{
        display: "flex",
        flexDirection: isLong && isDesktop ? "row" : "column",
        alignItems: "flex-start",
        gap: "1.5rem",
        width: "100%"
      }}>
        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
          {filteredNames.length === 0 ? (
            <div className="notice-box">
              <strong>{t("search_no_results", "Sonuç bulunamadı.")}</strong> {t("search_try_again_hint", "Farklı bir arama terimi deneyin.")}
            </div>
          ) : isGenderCategory ? (
            /* ── STRICTLY FILTERED TABLE for gender categories ────────── */
            <div style={{ minHeight: '600px' }}>
              {/* Internal Alphabet Index (Tab Navigation) */}
              <div className="quick-jump-bar -mx-4 px-4 shadow-sm">
                {/* Random Button */}
                <button 
                  onClick={() => {
                    setSelectedLetter("RANDOM");
                    setVisibleCount(30);
                  }}
                  className={selectedLetter === "RANDOM" ? "active" : ""}
                >
                  <Shuffle size={13} style={{ marginRight: "6px" }} /> {t("random", "Karışık")}
                </button>

                {sortedAvailableLetters.map(letter => {
                  const isActive = selectedLetter === letter;
                  return (
                    <button 
                      key={letter} 
                      onClick={() => {
                        setSelectedLetter(letter);
                        setVisibleCount(30);
                      }}
                      className={isActive ? "active" : ""}
                      title={`${letter} harfli isimleri göster`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              <div className="overflow-x-auto w-full border border-[var(--border)] rounded-xl shadow-sm" style={{ background: "var(--surface)" }}>
                <table 
                  className="wiki-table" 
                  style={{ margin: 0, minWidth: "500px" }}
                >
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1.5px solid var(--border)' }}>
                       <th style={{ width: '25%' }}>{t("admin_names_col_name")}</th>
                       <th className="hidden sm:table-cell" style={{ width: '10%' }}>{t("detail_letter")}</th>
                       <th style={{ width: '40%' }}>{t("detail_meaning")}</th>
                       <th className="hidden md:table-cell" style={{ width: '20%' }}>{t("detail_origin")}</th>
                       <th style={{ width: '50px', textAlign: 'center' }}><Heart size={12} style={{ display: "inline-block" }} /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayNames.map((item) => {

                      return (
                        <tr key={item.id}>
                            <td>
                              <Link
                                to={generatePath(lng, "name", item.id)}
                                className={item.gender === "female" ? "name-link-female" : "name-link-male"}
                              >
                                {item.name}
                              </Link>
                            </td>
                            <td className="hidden sm:table-cell" style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{item.letter}</td>
                            <td style={{ color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                              {getLocalizedMeaning(item, lng)}
                            </td>
                            <td className="hidden md:table-cell" style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{getLocalizedOrigin(item.origin, t)}</td>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Infinite Scroll Trigger */}
              <div ref={lastElementRef} style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {visibleCount < strictlyFilteredNames.length && (
                  <span className="text-xs text-[var(--text-muted)] animate-pulse">{t("loading_new_names", "Yeni isimler yükleniyor...")}</span>
                )}
              </div>

              {strictlyFilteredNames.length === 0 && (
                <div className="notice-box">{t("letter_no_results", "Bu harf için kriterlere uygun isim bulunamadı.")}</div>
              )}
            </div>
          ) : (
            /* ── ALPHABETICAL LIST for letter categories ─── */
            <div>
              {Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'tr')).map((letter) => (
                <section
                  key={letter}
                  style={{ marginBottom: "1.5rem" }}
                >
                  <h2 className="section-heading">
                    {letter}{" "}
                    <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-faint)" }}>
                      ({grouped[letter].length} isim)
                    </span>
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 0 }}>
                    {grouped[letter].map((item) => (
                      <div key={item.id} className="name-list-item" style={{ display: "flex", alignItems: "center" }}>
                        <button
                          onClick={() => toggleFavorite(item)}
                          style={{
                            color: isFavorite(item.id) ? "var(--female)" : "var(--text-faint)",
                            padding: 0,
                            marginRight: "0.25rem",
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
                        <Link
                          to={generatePath(lng, "name", item.id)}
                          className={item.gender === "female" ? "name-link-female" : "name-link-male"}
                        >
                          {item.name}
                        </Link>
                        <span className="name-list-meaning">
                          {item.meaning?.slice(0, 25)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>


      </div>

      {/* SEO Contextual Hook */}
      <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--surface)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <Sparkles size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.2rem" }} />
        <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
          {seoHookText}
        </p>
      </div>

      {/* Diğer Keşif Kanalları (Content Anchor) */}
      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-4">
          Daha Fazla İsim Keşfedin
        </h3>
        <div className="flex flex-wrap gap-3">
          {type !== "kiz" && (
            <Link
              to={generatePath(lng, "category", "kiz")}
              className="text-sm bg-[var(--surface-alt)]/50 hover:bg-[var(--accent)] hover:text-white px-4 py-2.5 rounded-xl border border-[var(--border)] transition-all font-medium"
            >
              Kız Bebek İsimlerine Göz Atın
            </Link>
          )}
          {type !== "erkek" && (
            <Link
              to={generatePath(lng, "category", "erkek")}
              className="text-sm bg-[var(--surface-alt)]/50 hover:bg-[var(--accent)] hover:text-white px-4 py-2.5 rounded-xl border border-[var(--border)] transition-all font-medium"
            >
              Erkek Bebek İsimlerine Göz Atın
            </Link>
          )}
          <Link
            to={generatePath(lng, "finder")}
            className="text-sm bg-[var(--surface-alt)]/50 hover:bg-[var(--accent)] hover:text-white px-4 py-2.5 rounded-xl border border-[var(--border)] transition-all font-medium"
          >
            Aradığınız İsmi Beraber Bulalım
          </Link>
          <Link
            to={generatePath(lng, "blog")}
            className="text-sm bg-[var(--surface-alt)]/50 hover:bg-[var(--accent)] hover:text-white px-4 py-2.5 rounded-xl border border-[var(--border)] transition-all font-medium"
          >
            İsimlerin Hikayelerini ve Kültürümüzü Tanıyın
          </Link>
        </div>
      </div>


    </>
  );
}
