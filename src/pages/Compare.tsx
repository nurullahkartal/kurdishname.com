import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Scale, RefreshCw, ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { NameData } from "../data/names";
import { generatePath } from "../utils/routes";
import { getLocalizedMeaning, getLocalizedOrigin } from "../utils/localization";
import { fetchSearchIndex, loadNamesForLetter, getLettersForId } from "../utils/nameLoader";
import { useFavorites } from "../context/FavoritesContext";
import { performFastSearch, SearchIndexBucket, flattenSearchIndex } from "../utils/search";
import { compareNames } from "../core/compare/compareEngine";
import { trackCompareEvent } from "../core/compare/logger";
// Helper to determine deterministic stars for popularity
const getPopularityStars = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 3) + 3; // Returns 3, 4, or 5 stars deterministically
};

export default function Compare() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || "tr";
  const { favorites } = useFavorites();

  const [searchIndex, setSearchIndex] = useState<SearchIndexBucket | null>(null);
  const [selectedId1, setSelectedId1] = useState<string>("");
  const [selectedId2, setSelectedId2] = useState<string>("");

  const [fullName1, setFullName1] = useState<NameData | null>(null);
  const [fullName2, setFullName2] = useState<NameData | null>(null);

  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");

  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);



  // Load Search Index for Autocompletes
  useEffect(() => {
    fetchSearchIndex().then(data => {
      setSearchIndex(data);
    });
  }, []);

  // Fetch Full Details for Name 1 when ID changes
  useEffect(() => {
    if (!selectedId1) {
      setFullName1(null);
      return;
    }
    const letters = getLettersForId(selectedId1);
    Promise.all(letters.map(l => loadNamesForLetter(l)))
      .then(chunks => {
        const found = chunks.flat().find(n => n.id.toLowerCase() === selectedId1.toLowerCase());
        setFullName1(found || null);
      });
  }, [selectedId1]);

  // Fetch Full Details for Name 2 when ID changes
  useEffect(() => {
    if (!selectedId2) {
      setFullName2(null);
      return;
    }
    const letters = getLettersForId(selectedId2);
    Promise.all(letters.map(l => loadNamesForLetter(l)))
      .then(chunks => {
        const found = chunks.flat().find(n => n.id.toLowerCase() === selectedId2.toLowerCase());
        setFullName2(found || null);
      });
  }, [selectedId2]);

  // Debounce query inputs to prevent main-thread stuttering on keystrokes
  const [debouncedQuery1, setDebouncedQuery1] = useState("");
  const [debouncedQuery2, setDebouncedQuery2] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery1(query1);
    }, 150);
    return () => clearTimeout(handler);
  }, [query1]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery2(query2);
    }, 150);
    return () => clearTimeout(handler);
  }, [query2]);

  // Dropdown Filtering
  const filteredOptions1 = useMemo(() => {
    if (!searchIndex) return [];
    if (!debouncedQuery1.trim()) return [];
    return performFastSearch(searchIndex, debouncedQuery1).slice(0, 8);
  }, [debouncedQuery1, searchIndex]);

  const filteredOptions2 = useMemo(() => {
    if (!searchIndex) return [];
    if (!debouncedQuery2.trim()) return [];
    return performFastSearch(searchIndex, debouncedQuery2).slice(0, 8);
  }, [debouncedQuery2, searchIndex]);

  // Compute Fun Name Harmony Score
  const harmonyResult = useMemo(() => {
    if (!fullName1 || !fullName2) return null;
    
    const result = compareNames(fullName1, fullName2, t);
    return result;
  }, [fullName1, fullName2, t]);

  // Track event whenever harmonyResult changes to a valid score
  useEffect(() => {
    if (harmonyResult && fullName1 && fullName2) {
      trackCompareEvent(fullName1.id, fullName2.id, harmonyResult.score);
    }
  }, [harmonyResult, fullName1, fullName2]);

  // Quick select from favorites
  const handleSelectFromFavorites = (id: string) => {
    const flatIndex = flattenSearchIndex(searchIndex);
    if (!selectedId1) {
      setSelectedId1(id);
      const nameObj = flatIndex.find(n => n.id === id);
      if (nameObj) setQuery1(nameObj.n);
    } else if (!selectedId2 && selectedId1 !== id) {
      setSelectedId2(id);
      const nameObj = flatIndex.find(n => n.id === id);
      if (nameObj) setQuery2(nameObj.n);
    } else {
      // Overwrite first slot if both filled
      setSelectedId1(id);
      const nameObj = flatIndex.find(n => n.id === id);
      if (nameObj) setQuery1(nameObj.n);
    }
  };

  const handleSwap = () => {
    const tempId = selectedId1;
    const tempQuery = query1;
    
    setSelectedId1(selectedId2);
    setQuery1(query2);

    setSelectedId2(tempId);
    setQuery2(tempQuery);
  };

  const handleClear = () => {
    setSelectedId1("");
    setSelectedId2("");
    setQuery1("");
    setQuery2("");
  };

  return (
    <>
      <Helmet>
        <title>{t("compare_seo_title")} | KurdishName</title>
        <meta name="description" content={t("compare_seo_desc")} />
      </Helmet>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem 0" }}>
        
        {/* Intro Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(249, 115, 22, 0.1)",
            color: "#f97316",
            padding: "0.35rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.725rem",
            fontWeight: 700,
            marginBottom: "0.75rem"
          }}>
            <Scale size={12} />
            {t("compare_badge", "KARAR DESTEK MEKANİZMASI")}
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.025em"
          }}>
            {t("compare_title", "İsim Karşılaştırma Modülü")}
          </h1>
          <p style={{
            fontSize: "0.875rem",
            color: "var(--text-muted)",
            maxWidth: "500px",
            margin: "0.5rem auto 0 auto",
            lineHeight: 1.5
          }}>
            {t("compare_desc", "İki isim arasında mı kaldınız? Onları yan yana getirin, anlamlarından trend durumlarına kadar her yönüyle kıyaslayın.")}
          </p>
        </div>

        {/* Favorites Quick Picker Block */}
        {favorites.length > 0 && (
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            padding: "1rem",
            marginBottom: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              {t("compare_quick_fav", "Defterimdeki İsimlerden Hızlıca Seç:")}
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {favorites.map(item => {
                const isActive = selectedId1 === item.id || selectedId2 === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectFromFavorites(item.id)}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "0.5rem",
                      border: isActive ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
                      background: isActive ? "rgba(var(--accent-rgb), 0.05)" : "var(--surface-alt)",
                      color: isActive ? "var(--accent)" : "var(--text)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      transition: "all 150ms"
                    }}
                    disabled={isActive && selectedId1 === item.id && selectedId2 === item.id}
                  >
                    {isActive && <Check size={10} />}
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Input Autocompletes Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          position: "relative"
        }}>
          {/* Dropdown 1 */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text)", display: "block", marginBottom: "0.35rem" }}>
              {t("compare_label_1", "1. İsim")}
            </label>
            <input
              type="text"
              placeholder={t("compare_placeholder", "İsim arayın...")}
              value={query1}
              onChange={e => {
                setQuery1(e.target.value);
                setIsDropdown1Open(true);
              }}
              onFocus={() => setIsDropdown1Open(true)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: "0.875rem",
                outline: "none",
                fontWeight: 600
              }}
            />
            {isDropdown1Open && filteredOptions1.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                marginTop: "0.25rem",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                zIndex: 10,
                maxHeight: "220px",
                overflowY: "auto"
              }}>
                {filteredOptions1.map(option => (
                  <li
                    key={option.id}
                    className="autocomplete-item"
                    onClick={() => {
                      setSelectedId1(option.id);
                      setQuery1(option.n);
                      setIsDropdown1Open(false);
                    }}
                  >
                    <span className="font-semibold">{option.n}</span>
                    <span className="text-sm opacity-75 ml-2">
                      {option.g === "female" || option.g === "f" ? "👧" : "👦"}
                    </span>
                  </li>
                ))}
              </div>
            )}
          </div>

          {/* Swap / Reset Trigger Button */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              onClick={handleSwap}
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              className="hover:text-[var(--accent)] hover:border-[var(--accent)] active:scale-90 transition-all"
              title="Yerlerini Değiştir"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Dropdown 2 */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text)", display: "block", marginBottom: "0.35rem" }}>
              {t("compare_label_2", "2. İsim")}
            </label>
            <input
              type="text"
              placeholder={t("compare_placeholder", "İsim arayın...")}
              value={query2}
              onChange={e => {
                setQuery2(e.target.value);
                setIsDropdown2Open(true);
              }}
              onFocus={() => setIsDropdown2Open(true)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                fontSize: "0.875rem",
                outline: "none",
                fontWeight: 600
              }}
            />
            {isDropdown2Open && filteredOptions2.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                marginTop: "0.25rem",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                zIndex: 10,
                maxHeight: "220px",
                overflowY: "auto"
              }}>
                {filteredOptions2.map(option => (
                  <li
                    key={option.id}
                    className="autocomplete-item"
                    onClick={() => {
                      setSelectedId2(option.id);
                      setQuery2(option.n);
                      setIsDropdown2Open(false);
                    }}
                  >
                    <span className="font-semibold">{option.n}</span>
                    <span className="text-sm opacity-75 ml-2">
                      {option.g === "female" || option.g === "f" ? "👧" : "👦"}
                    </span>
                  </li>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hide dropdowns when clicking outside */}
        {(isDropdown1Open || isDropdown2Open) && (
          <div
            onClick={() => { setIsDropdown1Open(false); setIsDropdown2Open(false); }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}
          />
        )}

        {/* Comparative Side-by-Side Cards */}
        {fullName1 || fullName2 ? (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Playful Harmony Gauge Widget */}
            {harmonyResult && (
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1.25rem",
                padding: "1.25rem",
                textAlign: "center"
              }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  {t("compare_harmony_score", "İsimlerin Akustik Uyum Oranı")}
                </span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "0.5rem" }}>
                  <div style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: harmonyResult.color,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.05em"
                  }}>
                    %{harmonyResult.score}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--text)" }}>
                      {harmonyResult.label}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {t("compare_harmony_desc", "İsimlerin harf uzunlukları ve ses benzerlikleri uyum katsayısı.")}
                    </div>
                  </div>
                </div>

                {/* Progress bar container */}
                <div style={{ width: "100%", background: "var(--surface-alt)", height: "8px", borderRadius: "999px", marginTop: "1rem", overflow: "hidden" }}>
                  <div style={{
                    width: `${harmonyResult.score}%`,
                    background: `linear-gradient(90deg, var(--accent), ${harmonyResult.color})`,
                    height: "100%",
                    borderRadius: "999px",
                    transition: "width 500ms ease-out"
                  }} />
                </div>

              </div>
            )}

            {/* Comparison Columns Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              
              {/* Column 1 - Name 1 */}
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1.5rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem"
              }}>
                {fullName1 ? (
                  <>
                    {/* Header */}
                    <div style={{ textAlign: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
                      <span className={fullName1.gender === "female" ? "badge-female" : "badge-male"} style={{ fontSize: "0.6875rem" }}>
                        {fullName1.gender === "female" ? t("gender_female", "Kız") : t("gender_male", "Erkek")}
                      </span>
                      <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: fullName1.gender === "female" ? "var(--female)" : "var(--male)",
                        marginTop: "0.35rem"
                      }}>
                        {fullName1.name}
                      </h2>
                    </div>

                    {/* Stats List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_meaning", "Anlamı")}
                        </span>
                        <p style={{ fontSize: "0.8125rem", color: "var(--text)", lineHeight: 1.4, marginTop: "0.15rem" }}>
                          {getLocalizedMeaning(fullName1, lng)}
                        </p>
                      </div>

                      <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_origin", "Köken")}
                        </span>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "#10b981",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.5rem",
                          marginTop: "0.2rem"
                        }}>
                          {getLocalizedOrigin(fullName1.origin, t)}
                        </span>
                      </div>

                      <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_length", "Harf Sayısı")}
                        </span>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text)" }}>
                          {fullName1.name.length} {t("letters", "Harf")}
                        </span>
                      </div>

                      <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_popularity", "Trend Seviyesi")}
                        </span>
                        <div style={{ display: "flex", gap: "0.15rem", marginTop: "0.25rem" }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              style={{
                                color: star <= getPopularityStars(fullName1.name) ? "#f59e0b" : "var(--border)",
                                fontSize: "0.875rem"
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Detail Link */}
                    <Link
                      to={generatePath(lng, "name", fullName1.id)}
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                        padding: "0.65rem",
                        borderRadius: "0.75rem",
                        background: "var(--surface-alt)",
                        color: "var(--text)",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        border: "1px solid var(--border)"
                      }}
                      className="hover:bg-[var(--border)] transition-colors"
                    >
                      {t("view_details", "Detayları Gör")}
                      <ChevronRight size={12} />
                    </Link>
                  </>
                ) : (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "300px",
                    color: "var(--text-faint)",
                    fontSize: "0.8125rem"
                  }}>
                    <span>👈 {t("select_first_name", "Lütfen bir isim seçin")}</span>
                  </div>
                )}
              </div>

              {/* Column 2 - Name 2 */}
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1.5rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem"
              }}>
                {fullName2 ? (
                  <>
                    {/* Header */}
                    <div style={{ textAlign: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
                      <span className={fullName2.gender === "female" ? "badge-female" : "badge-male"} style={{ fontSize: "0.6875rem" }}>
                        {fullName2.gender === "female" ? t("gender_female", "Kız") : t("gender_male", "Erkek")}
                      </span>
                      <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: fullName2.gender === "female" ? "var(--female)" : "var(--male)",
                        marginTop: "0.35rem"
                      }}>
                        {fullName2.name}
                      </h2>
                    </div>

                    {/* Stats List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_meaning", "Anlamı")}
                        </span>
                        <p style={{ fontSize: "0.8125rem", color: "var(--text)", lineHeight: 1.4, marginTop: "0.15rem" }}>
                          {getLocalizedMeaning(fullName2, lng)}
                        </p>
                      </div>

                      <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_origin", "Köken")}
                        </span>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          background: "rgba(16, 185, 129, 0.1)",
                          color: "#10b981",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.5rem",
                          marginTop: "0.2rem"
                        }}>
                          {getLocalizedOrigin(fullName2.origin, t)}
                        </span>
                      </div>

                      <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_length", "Harf Sayısı")}
                        </span>
                        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text)" }}>
                          {fullName2.name.length} {t("letters", "Harf")}
                        </span>
                      </div>

                      <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", display: "block" }}>
                          {t("compare_stat_popularity", "Trend Seviyesi")}
                        </span>
                        <div style={{ display: "flex", gap: "0.15rem", marginTop: "0.25rem" }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              style={{
                                color: star <= getPopularityStars(fullName2.name) ? "#f59e0b" : "var(--border)",
                                fontSize: "0.875rem"
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Detail Link */}
                    <Link
                      to={generatePath(lng, "name", fullName2.id)}
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                        padding: "0.65rem",
                        borderRadius: "0.75rem",
                        background: "var(--surface-alt)",
                        color: "var(--text)",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        border: "1px solid var(--border)"
                      }}
                      className="hover:bg-[var(--border)] transition-colors"
                    >
                      {t("view_details", "Detayları Gör")}
                      <ChevronRight size={12} />
                    </Link>
                  </>
                ) : (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "300px",
                    color: "var(--text-faint)",
                    fontSize: "0.8125rem"
                  }}>
                    <span>👉 {t("select_second_name", "Lütfen ikinci ismi seçin")}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Clear Button */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={handleClear}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
                className="hover:text-[var(--accent)]"
              >
                {t("clear_comparison", "Karşılaştırmayı Temizle")}
              </button>
            </div>

          </div>
        ) : (
          /* Empty Search Comparison Slate */
          <div style={{
            background: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "1rem",
            padding: "4rem 2rem",
            textAlign: "center"
          }}>
            <Scale size={40} style={{ color: "var(--text-faint)", marginBottom: "1rem", marginLeft: "auto", marginRight: "auto", display: "block" }} />
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)" }}>
              {t("compare_empty_title", "Seçim Yapılmadı")}
            </h3>
            <p style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              maxWidth: "360px",
              margin: "0.5rem auto 0 auto",
              lineHeight: 1.5
            }}>
              {t("compare_empty_desc", "Yukarıdaki kutulardan kıyaslamak istediğiniz iki ismi aratın veya defterinizdeki isimlerden hızlıca seçip kıyaslayın!")}
            </p>
          </div>
        )}

      </div>
    </>
  );
}
