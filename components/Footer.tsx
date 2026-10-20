import Link from "next/link";
import { generatePath, Locale } from "@/lib/routes-config";

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

export default function Footer({
  locale,
  labels,
}: {
  locale: Locale;
  labels: FooterLabels;
}) {
  const links = [
    { to: generatePath(locale, "category", "kiz"), label: labels.nav_girls },
    { to: generatePath(locale, "category", "erkek"), label: labels.nav_boys },
    { to: generatePath(locale, "suggest"), label: labels.footer_suggest },
    { to: generatePath(locale, "editorial"), label: labels.footer_editorial },
    { to: generatePath(locale, "about"), label: labels.footer_about },
    { to: generatePath(locale, "privacy"), label: labels.footer_privacy },
    { to: generatePath(locale, "terms"), label: labels.footer_terms },
    { to: generatePath(locale, "cookies"), label: labels.footer_cookies },
    { to: generatePath(locale, "contact"), label: labels.footer_contact },
  ];

  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem 0", marginTop: "3rem" }}>
      <div
        className="enc-container-wide"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          fontSize: "0.75rem",
          color: "var(--text-faint)",
        }}
      >
        <span>© {new Date().getFullYear()} KurdishName</span>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              style={{
                color: "var(--text-faint)",
                fontSize: "0.75rem",
                textDecoration: "none",
              }}
              className="hover:text-[var(--text)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
