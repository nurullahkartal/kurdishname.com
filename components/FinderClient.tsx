"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, RotateCcw, User, Sparkles, X, Wind, Heart, Sun, Activity, Gem } from "lucide-react";
import { generatePath, Locale } from "@/lib/routes-config";
import { normalizeText } from "@/lib/name-helpers";
import { generateContextualHook } from "@/lib/seo-metadata";

type GenderPref = "female" | "male";
type ThemePref =
  | "Cesaret / Güç"
  | "Doğa / Yaşam"
  | "Sevgi / Güzellik"
  | "Işık / Aydınlık"
  | "Bilgelik / Akıl"
  | "any";

interface SlimName {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  letter: string;
  tags?: string[];
}

export interface FinderLabels {
  finder_title: string;
  finder_intro_desc: string;
  finder_step_gender: string;
  finder_step_theme: string;
  finder_step_letter: string;
  finder_step_results: string;
  girl_names: string;
  boy_names: string;
  theme_mixed: string;
  cat_theme_nature: string;
  cat_theme_power: string;
  cat_theme_beauty: string;
  cat_theme_light: string;
  cat_theme_wisdom: string;
  home_btn_finder: string;
  loading: string;
  gender_female: string;
  gender_male: string;
  no_results_found: string;
  try_again_flexible: string;
}

export default function FinderClient({
  locale,
  labels,
}: {
  locale: Locale;
  labels: FinderLabels;
}) {
  const [gender, setGender] = useState<GenderPref>("female");
  const [theme, setTheme] = useState<ThemePref>("any");
  const [startLetter, setStartLetter] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SlimName[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const seoHookText = useMemo(() => {
    if (!hasSearched) return "";
    const seed = `finder_${gender}_${theme}_${startLetter}`;
    const extra =
      startLetter || (theme !== "any" ? theme : gender === "female" ? "Kız İsimleri" : "Erkek İsimleri");
    return generateContextualHook(seed, "search", locale, extra);
  }, [hasSearched, gender, theme, startLetter, locale]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch("/search_index.json");
      const loaded: SlimName[] = res.ok ? await res.json() : [];

      let filtered = loaded.filter((n) => n.gender === gender || n.gender === "unisex");

      if (startLetter) {
        const nl = normalizeText(startLetter);
        filtered = filtered.filter((n) => normalizeText(n.name).startsWith(nl));
      }
      if (theme !== "any") {
        const matched = filtered.filter((n) => n.tags?.some((t) => t.includes(theme.split(" ")[0])));
        filtered = matched.length >= 3 ? matched : filtered.slice(0, 24);
      }
      filtered.sort((a, b) => a.name.localeCompare(b.name, "tr"));
      setResults(filtered.slice(0, 120));
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setGender("female");
    setTheme("any");
    setStartLetter("");
    setHasSearched(false);
    setResults([]);
  };

  const genderBtns = [
    {
      value: "female",
      label: labels.girl_names,
      icon: User,
      activeColor: "var(--female)",
      activeBg: "rgba(225,29,72,0.07)",
    },
    {
      value: "male",
      label: labels.boy_names,
      icon: User,
      activeColor: "var(--male)",
      activeBg: "rgba(37,99,235,0.07)",
    },
  ] as const;

  const themes = [
    { id: "any", label: labels.theme_mixed, icon: Sparkles },
    { id: "Doğa / Yaşam", label: labels.cat_theme_nature, icon: Wind },
    { id: "Cesaret / Güç", label: labels.cat_theme_power, icon: Activity },
    { id: "Sevgi / Güzellik", label: labels.cat_theme_beauty, icon: Heart },
    { id: "Işık / Aydınlık", label: labels.cat_theme_light, icon: Sun },
    { id: "Bilgelik / Akıl", label: labels.cat_theme_wisdom, icon: Gem },
  ];

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 className="page-title" style={{ borderBottom: "none", paddingBottom: 0, marginBottom: "0.375rem" }}>
          {labels.finder_title}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{labels.finder_intro_desc}</p>
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)",
          background: "var(--surface)",
          padding: "1.25rem",
        }}
      >
        <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
              }}
            >
              {labels.finder_step_gender}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {genderBtns.map(({ value, label, icon: Icon, activeColor, activeBg }) => {
                const isActive = gender === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGender(value as GenderPref)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.375rem",
                      padding: "0.75rem 0.5rem",
                      border: `1.5px solid ${isActive ? activeColor : "var(--border)"}`,
                      borderRadius: "var(--r-lg)",
                      background: isActive ? activeBg : "var(--surface)",
                      color: isActive ? activeColor : "var(--text-muted)",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
              }}
            >
              {labels.finder_step_theme}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
              {themes.map((th) => {
                const isActive = theme === th.id;
                const cleanLabel = th.label.includes(" / ")
                  ? th.label.split(" / ")[0]
                  : th.label.split(" (")[0];
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id as ThemePref)}
                    style={{
                      padding: "0.55rem 0.5rem",
                      border: `1px solid ${isActive ? "var(--text)" : "var(--border)"}`,
                      borderRadius: "var(--r-md)",
                      background: isActive ? "var(--text)" : "var(--surface)",
                      color: isActive ? "var(--surface)" : "var(--text-muted)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <th.icon size={14} />
                    <span>{cleanLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
              }}
            >
              {labels.finder_step_letter}
            </p>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                maxLength={1}
                placeholder="A, B, Ç, Ş, Z..."
                value={startLetter}
                onChange={(e) => setStartLetter(e.target.value.toUpperCase())}
                style={{
                  width: "100%",
                  padding: "0.625rem 0.875rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-lg)",
                  background: "var(--surface)",
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              {startLetter && (
                <button
                  type="button"
                  onClick={() => setStartLetter("")}
                  style={{
                    position: "absolute",
                    right: "0.625rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              disabled={isSearching}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem",
                background: "var(--text)",
                color: "var(--surface)",
                border: "none",
                borderRadius: "var(--r-md)",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Search size={16} />
              {isSearching ? labels.loading : labels.home_btn_finder}
            </button>
            {hasSearched && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: "0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-md)",
                  background: "var(--surface)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </form>
      </div>

      {hasSearched && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.875rem",
            }}
          >
            <h2 className="section-heading" style={{ margin: 0, border: "none", fontSize: "1.1rem" }}>
              {labels.finder_step_results}
            </h2>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "99px",
                padding: "0.2rem 0.625rem",
                fontWeight: 600,
              }}
            >
              {results.length}
            </span>
          </div>

          {results.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "0.5rem",
              }}
            >
              {results.map((item) => {
                const isFemale = item.gender === "female" || (item.gender === "unisex" && gender === "female");
                return (
                  <Link
                    key={item.id}
                    href={generatePath(locale, "name", item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1rem",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--r-lg)",
                      background: "var(--surface)",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: isFemale ? "var(--female)" : "var(--male)",
                      }}
                    >
                      {item.name}
                    </span>
                    <span className={isFemale ? "badge-female" : "badge-male"}>
                      {isFemale ? labels.gender_female : labels.gender_male}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="notice-box" style={{ textAlign: "center", padding: "2rem" }}>
              <strong>{labels.no_results_found}</strong>
              <br />
              <span style={{ fontSize: "0.875rem" }}>{labels.try_again_flexible}</span>
            </div>
          )}

          {seoHookText && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.25rem",
                background: "var(--surface)",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--border)",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <Sparkles size={18} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.2rem" }} />
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                {seoHookText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
