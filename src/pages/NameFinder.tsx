import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, RotateCcw, User, Sparkles, X, Wind, Heart, Sun, Activity, Gem } from 'lucide-react';
import { NameData } from '../data/names';
import { generatePath } from '../utils/routes';
import { normalizeText } from '../utils/search';
import { getLocalizedMeaning, getLocalizedOrigin } from '../utils/localization';
import { loadNamesForLetter, fetchSearchIndex } from '../utils/nameLoader';
import { generateContextualHook } from '../utils/seoHook';

type GenderPref = 'female' | 'male';
type ThemePref = 'Cesaret / Güç' | 'Doğa / Yaşam' | 'Sevgi / Güzellik' | 'Işık / Aydınlık' | 'Bilgelik / Akıl' | 'any';

/* ── Reusable style objects ─── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-lg)",
  background: "var(--surface)",
  fontSize: "0.9375rem",
  fontFamily: "var(--font-display)",
  color: "var(--text)",
  outline: "none",
  transition: "border-color 150ms",
};

function getDialect(origin: string | undefined) {
  if (!origin) return null;
  const o = origin.toLowerCase();
  if (o.includes("kurmanci") || o.includes("kurmanc") || o.includes("kurmanji")) return { label: "Kurmancî", color: "#15803d" };
  if (o.includes("sorani") || o.includes("soranî") || o.includes("sorans")) return { label: "Soranî", color: "#1d4ed8" };
  if (o.includes("zazaki") || o.includes("zaza") || o.includes("dimli")) return { label: "Zazaki", color: "#7c3aed" };
  if (o.includes("gorani") || o.includes("goranî") || o.includes("hawrami")) return { label: "Goranî", color: "#c2410c" };
  return null;
}

export default function NameFinder() {
  const [gender, setGender] = useState<GenderPref>('female');
  const [theme, setTheme] = useState<ThemePref>('any');
  const [startLetter, setStartLetter] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<NameData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { t, i18n } = useTranslation();
  const lng = i18n.language || 'tr';

  const seoHookText = useMemo(() => {
    if (!hasSearched) return "";
    const seed = `finder_${gender}_${theme}_${startLetter}`;
    const extra = startLetter || (theme !== 'any' ? theme : (gender === 'female' ? 'Kız İsimleri' : 'Erkek İsimleri'));
    return generateContextualHook(seed, 'search', lng, extra);
  }, [hasSearched, gender, theme, startLetter, lng]);

  const handleLetterChange = (val: string) => {
    const sanitized = val.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜêîûêş]/i, '').toUpperCase();
    setStartLetter(sanitized);
    if (sanitized) {
      loadNamesForLetter(sanitized);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    try {
      const loaded = await fetchSearchIndex();

      const localNamesStr = localStorage.getItem('addedNames');
      const localNames: NameData[] = localNamesStr ? JSON.parse(localNamesStr) : [];
      const combined = [...loaded, ...localNames];
      const uniqueMap = new Map<string, NameData>();
      combined.forEach(item => uniqueMap.set(item.id, item));
      let filtered = Array.from(uniqueMap.values());

      filtered = filtered.filter(n => n.gender === gender || n.gender === 'unisex'); // Safely include unisex mapped to current gender context

      if (startLetter) {
        const nl = normalizeText(startLetter);
        filtered = filtered.filter(n => normalizeText(n.name).startsWith(nl));
      }
      if (theme !== 'any') {
        const matched = filtered.filter(n => n.tags?.includes(theme));
        if (matched.length < 5) {
          const rest = filtered.filter(n => !matched.find(m => m.id === n.id));
          rest.sort(() => Math.random() - 0.5);
          filtered = [...matched, ...rest.slice(0, 20 - matched.length)];
        } else {
          filtered = matched;
        }
      }
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      setResults(filtered);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setGender('female'); setTheme('any'); setStartLetter('');
    setHasSearched(false); setResults([]);
  };

  const genderBtns = [
    { value: 'female', label: t('girl_names'), icon: User, activeColor: "var(--female)", activeBg: "rgba(225,29,72,0.07)" },
    { value: 'male',   label: t('boy_names'),  icon: User, activeColor: "var(--male)",   activeBg: "rgba(37,99,235,0.07)" },
  ] as const;

  const themes = [
    { id: 'any',               label: t('theme_mixed'),       icon: Sparkles },
    { id: 'Doğa / Yaşam',     label: t('cat_theme_nature'),   icon: Wind },
    { id: 'Cesaret / Güç',    label: t('cat_theme_power'),    icon: Activity },
    { id: 'Sevgi / Güzellik', label: t('cat_theme_beauty'),   icon: Heart },
    { id: 'Işık / Aydınlık',  label: t('cat_theme_light'),    icon: Sun },
    { id: 'Bilgelik / Akıl',  label: t('cat_theme_wisdom'),   icon: Gem },
  ];

  const chipActive = (isActive: boolean, color?: string, bg?: string): React.CSSProperties => ({
    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem",
    padding: "0.75rem 0.5rem",
    border: `1.5px solid ${isActive ? (color ?? "var(--text)") : "var(--border)"}`,
    borderRadius: "var(--r-lg)",
    background: isActive ? (bg ?? "var(--surface-2)") : "var(--surface)",
    color: isActive ? (color ?? "var(--text)") : "var(--text-muted)",
    cursor: "pointer",
    transition: "all 150ms",
    fontFamily: "var(--font-display)",
    fontSize: "0.8rem",
    fontWeight: 600,
  });

  return (
    <>
      <Helmet>
        <title>{t('finder_title', 'İsim Bulucu')} | KurdishName</title>
        <meta name="description" content={t('finder_seo_desc', 'Kürtçe isim bulmak için akıllı filtreleme aracı. Cinsiyet, tema ve harf kriterlerine göre arama yapın.')} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <div>
          <h1 className="page-title" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "0.375rem" }}>
            {t("finder_title")}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {t("finder_intro_desc")}
          </p>
        </div>

        {/* Filter Panel */}
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-xl)", background: "var(--surface)", padding: "1.25rem" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* Gender */}
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                {t("finder_step_gender")}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {genderBtns.map(({ value, label, icon: Icon, activeColor, activeBg }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGender(value as GenderPref)}
                    style={chipActive(gender === value, activeColor, activeBg)}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                {t("finder_step_theme", "Tema")}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
                {themes.map(th => {
                  const isActive = theme === th.id;
                  // Kaba ve uzun isimleri temizleyip son derece şık ve kısa hale getirelim
                  const cleanLabel = th.label.includes(" / ") 
                    ? th.label.split(" / ")[0] 
                    : th.label.split(" (")[0];

                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id as ThemePref)}
                      style={{
                        padding: "0.5rem 0.25rem",
                        border: `1px solid ${isActive ? "var(--text)" : "var(--border)"}`,
                        borderRadius: "var(--r-md)",
                        background: isActive ? "var(--text)" : "var(--surface)",
                        color: isActive ? "var(--surface)" : "var(--text-muted)",
                        cursor: "pointer",
                        transition: "all 150ms",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        gap: "0.25rem",
                        width: "100%",
                        minWidth: 0,
                        whiteSpace: "nowrap"
                      }}
                    >
                      <th.icon size={13} style={{ flexShrink: 0 }} />
                      <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>{cleanLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Letter */}
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                {t("finder_step_letter")}
              </p>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  maxLength={1}
                  placeholder="A, B, Z..."
                  style={{ ...inputStyle, paddingRight: startLetter ? "2.5rem" : "0.875rem" }}
                  value={startLetter}
                  onChange={e => handleLetterChange(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
                {startLetter && (
                  <button
                    type="button"
                    onClick={() => setStartLetter('')}
                    style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex", border: "none", background: "none", cursor: "pointer" }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  padding: "0.75rem",
                  background: "var(--text)", color: "var(--surface)",
                  border: "none", borderRadius: "var(--r-md)",
                  fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700,
                  cursor: isSearching ? "wait" : "pointer", transition: "opacity 150ms",
                  opacity: isSearching ? 0.7 : 1,
                }}
              >
                <Search size={16} />
                {isSearching ? t("loading", "Yükleniyor...") : t("home_btn_finder")}
              </button>
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                    background: "var(--surface)", color: "var(--text-muted)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "border-color 150ms",
                  }}
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                <h2 className="section-heading" style={{ margin: 0, border: "none", fontSize: "1.1rem" }}>{t("finder_step_results")}</h2>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "99px", padding: "0.2rem 0.625rem", fontWeight: 600 }}>
                  {results.length} isim
                </span>
              </div>

              {results.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.5rem" }}>
                  {results.map((item, i) => {
                    const dialectInfo = getDialect(item.origin);
                    const localizedOrigin = getLocalizedOrigin(item.origin, t);
                    const isFemale = item.gender === 'female' || (item.gender === 'unisex' && gender === 'female');
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.025, 0.5), duration: 0.2 }}
                      >
                        <Link
                          to={generatePath(lng, 'name', item.id)}
                          style={{
                            display: "block",
                            padding: "1rem",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--r-lg)",
                            background: "var(--surface)",
                            textDecoration: "none",
                            transition: "border-color 150ms",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = isFemale ? 'var(--female)' : 'var(--male)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: isFemale ? 'var(--female)' : 'var(--male)' }}>
                              {item.name}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                              <span className={isFemale ? "badge-female" : "badge-male"} style={{ padding: "0.2rem 0.5rem", borderRadius: "100px", fontSize: "0.65rem", fontWeight: 700 }}>
                                {isFemale ? t('gender_female') : t('gender_male')}
                              </span>
                              <span style={{ padding: "0.2rem 0.5rem", borderRadius: "100px", fontSize: "0.65rem", fontWeight: 600, background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border-dim)" }}>
                                {localizedOrigin}
                              </span>
                              {dialectInfo && (
                                <span style={{ padding: "0.2rem 0.5rem", borderRadius: "100px", fontSize: "0.65rem", fontWeight: 700, background: dialectInfo.color, color: "#fff" }}>
                                  {dialectInfo.label}
                                </span>
                              )}
                            </div>
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {getLocalizedMeaning(item, lng)}
                          </p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="notice-box" style={{ textAlign: "center", padding: "2rem" }}>
                  <strong>{t("no_results_found", "Eşleşen isim bulunamadı.")}</strong>
                  <br />
                  <span style={{ fontSize: "0.875rem" }}>{t("try_again_flexible", "Daha esnek kriterlerle tekrar deneyin.")}</span>
                </div>
              )}

              {/* SEO Contextual Hook */}
              {hasSearched && seoHookText && (
                <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--surface)", borderRadius: "var(--r-md)", border: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <Sparkles size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.2rem" }} />
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                    {seoHookText}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
