import Link from "next/link";
import { generatePath, Locale, themeSlugs, ThemeKey } from "@/lib/routes-config";
import { STANDARD_LETTERS } from "@/lib/names-data";

export interface FooterLabels {
  nav_girls: string;
  nav_boys: string;
  footer_about: string;
  footer_editorial: string;
  footer_privacy: string;
  footer_terms: string;
  footer_cookies: string;
  footer_contact: string;
  footer_suggest: string;
}

const ACTIVE_FOOTER_LETTERS = STANDARD_LETTERS.filter((l) => l !== "I" && l !== "Û");

const SECTION_TRANSLATIONS: Record<
  Locale,
  {
    lettersHeading: string;
    encyclopediaHeading: string;
    themesHeading: string;
    corporateHeading: string;
    alphabet: string;
    mythology: string;
    tribes: string;
    surnames: string;
    finder: string;
    compare: string;
    blog: string;
    themes: Record<ThemeKey, string>;
  }
> = {
  tr: {
    lettersHeading: "Harfe Göre Kürtçe İsimler (A–Z)",
    encyclopediaHeading: "Ansiklopedi & Keşif Araçları",
    themesHeading: "Tematik İsim Koleksiyonları",
    corporateHeading: "Kurumsal & Yasal",
    alphabet: "Kürtçe Alfabe Rehberi",
    mythology: "Kürt Mitolojisi İsimleri",
    tribes: "Tarihi Kürt Boyları & Aşiretleri",
    surnames: "Kürtçe Soyadları Arşivi",
    finder: "Akıllı İsim Bulucu",
    compare: "İsim Karşılaştırma Aracı",
    blog: "İsim Rehberi & Makaleler",
    themes: {
      nature: "Doğa & Yaşam İsimleri",
      power: "Cesaret & Güç İsimleri",
      beauty: "Sevgi & Güzellik İsimleri",
      light: "Işık & Aydınlık İsimleri",
      wisdom: "Bilgelik & Akıl İsimleri",
    },
  },
  en: {
    lettersHeading: "Kurdish Names by Letter (A–Z)",
    encyclopediaHeading: "Encyclopedia & Tools",
    themesHeading: "Thematic Name Collections",
    corporateHeading: "Editorial & Legal",
    alphabet: "Kurdish Alphabet Guide",
    mythology: "Kurdish Mythology Names",
    tribes: "Historical Kurdish Tribes",
    surnames: "Kurdish Surnames Archive",
    finder: "Smart Name Finder",
    compare: "Name Comparison Tool",
    blog: "Naming Guides & Articles",
    themes: {
      nature: "Nature & Life Names",
      power: "Courage & Strength Names",
      beauty: "Love & Beauty Names",
      light: "Light & Radiance Names",
      wisdom: "Wisdom & Intellect Names",
    },
  },
  de: {
    lettersHeading: "Kurdische Namen nach Buchstaben (A–Z)",
    encyclopediaHeading: "Enzyklopädie & Werkzeuge",
    themesHeading: "Thematische Namenssammlungen",
    corporateHeading: "Redaktion & Rechtliches",
    alphabet: "Kurdisches Alphabet",
    mythology: "Kurdische Mythologie-Namen",
    tribes: "Historische kurdische Stämme",
    surnames: "Kurdische Nachnamen",
    finder: "Namen-Finder",
    compare: "Namen vergleichen",
    blog: "Namensratgeber & Blog",
    themes: {
      nature: "Natur- & Lebensnamen",
      power: "Mut- & Stärkenamen",
      beauty: "Liebes- & Schönheitsnamen",
      light: "Licht- & Glanznamen",
      wisdom: "Weisheits- & Verstandsnamen",
    },
  },
  ar: {
    lettersHeading: "الأسماء الكردية حسب الحرف (A–Z)",
    encyclopediaHeading: "الموسوعة وأدوات البحث",
    themesHeading: "مجموعات الأسماء الموضوعية",
    corporateHeading: "هيئة التحرير والشؤون القانونية",
    alphabet: "دليل الأبجدية الكردية",
    mythology: "أسماء الميثولوجيا الكردية",
    tribes: "العشائر والقبائل الكردية",
    surnames: "أرشيف الألقاب الكردية",
    finder: "باحث الأسماء الذكي",
    compare: "مقارنة الأسماء",
    blog: "مدونة ومقالات الأسماء",
    themes: {
      nature: "أسماء الطبيعة والحياة",
      power: "أسماء الشجاعة والقوة",
      beauty: "أسماء المحبة والجمال",
      light: "أسماء النور والضياء",
      wisdom: "أسماء الحكمة والبصيرة",
    },
  },
};

export default function Footer({
  locale,
  labels,
}: {
  locale: Locale;
  labels: FooterLabels;
}) {
  const sec = SECTION_TRANSLATIONS[locale] || SECTION_TRANSLATIONS.tr;

  const corporateLinks = [
    { to: generatePath(locale, "suggest"), label: labels.footer_suggest },
    { to: generatePath(locale, "editorial"), label: labels.footer_editorial },
    { to: generatePath(locale, "about"), label: labels.footer_about },
    { to: generatePath(locale, "privacy"), label: labels.footer_privacy },
    { to: generatePath(locale, "terms"), label: labels.footer_terms },
    { to: generatePath(locale, "cookies"), label: labels.footer_cookies },
    { to: generatePath(locale, "contact"), label: labels.footer_contact },
  ];

  const encyclopediaLinks = [
    { to: generatePath(locale, "category", "kiz"), label: labels.nav_girls },
    { to: generatePath(locale, "category", "erkek"), label: labels.nav_boys },
    { to: generatePath(locale, "alphabet"), label: sec.alphabet },
    { to: generatePath(locale, "mythology"), label: sec.mythology },
    { to: generatePath(locale, "tribes"), label: sec.tribes },
    { to: generatePath(locale, "surnames"), label: sec.surnames },
    { to: generatePath(locale, "finder"), label: sec.finder },
    { to: generatePath(locale, "compare"), label: sec.compare },
    { to: generatePath(locale, "blog"), label: sec.blog },
  ];

  const themeKeys = Object.keys(themeSlugs.tr) as ThemeKey[];

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "2.5rem 0 2rem 0",
        marginTop: "3rem",
      }}
    >
      <div className="enc-container-wide" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* 1. A-Z Alphabetical Directory Links (Sitewide Crawl Hub) */}
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
              marginBottom: "0.65rem",
            }}
          >
            {sec.lettersHeading}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {ACTIVE_FOOTER_LETTERS.map((letter) => (
              <Link
                key={letter}
                href={generatePath(locale, "category", letter)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "1.95rem",
                  height: "1.95rem",
                  padding: "0 0.45rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  color: "var(--text)",
                  textDecoration: "none",
                }}
              >
                {letter}
              </Link>
            ))}
          </div>
        </div>

        {/* 2. Three-Column Navigation Grid (Encyclopedia, Themes, Corporate) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-dim)",
          }}
        >
          {/* Column 1: Encyclopedia & Discovery */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                marginBottom: "0.65rem",
              }}
            >
              {sec.encyclopediaHeading}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {encyclopediaLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  href={to}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Thematic Collections */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                marginBottom: "0.65rem",
              }}
            >
              {sec.themesHeading}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {themeKeys.map((tKey) => (
                <Link
                  key={tKey}
                  href={generatePath(locale, "category", tKey)}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  {sec.themes[tKey]}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Corporate & Legal */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                marginBottom: "0.65rem",
              }}
            >
              {sec.corporateHeading}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {corporateLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  href={to}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Copyright Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-dim)",
            fontSize: "0.75rem",
            color: "var(--text-faint)",
          }}
        >
          <span>© {new Date().getFullYear()} KurdishName — Kürtçe İsimler Sözlüğü &amp; Etimoloji Arşivi</span>
          <div style={{ display: "flex", gap: "0.85rem" }}>
            <Link href="/tr" style={{ color: "var(--text-faint)", textDecoration: "none" }}>TR</Link>
            <Link href="/en" style={{ color: "var(--text-faint)", textDecoration: "none" }}>EN</Link>
            <Link href="/de" style={{ color: "var(--text-faint)", textDecoration: "none" }}>DE</Link>
            <Link href="/ar" style={{ color: "var(--text-faint)", textDecoration: "none" }}>AR</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
