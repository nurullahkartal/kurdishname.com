"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { generatePath, Locale } from "@/lib/routes-config";
import { useFavorites } from "./FavoritesContext";

export interface HeaderLabels {
  nav_home: string;
  nav_girls: string;
  nav_boys: string;
  nav_finder: string;
  nav_compare: string;
  nav_favorites: string;
  nav_blog: string;
}

export default function Header({
  locale,
  labels,
}: {
  locale: Locale;
  labels: HeaderLabels;
}) {
  const pathname = usePathname() || `/${locale}`;
  const { favorites } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { to: generatePath(locale, null), label: labels.nav_home, exact: true },
    { to: generatePath(locale, "category", "kiz"), label: labels.nav_girls, exact: false },
    { to: generatePath(locale, "category", "erkek"), label: labels.nav_boys, exact: false },
    { to: generatePath(locale, "finder"), label: labels.nav_finder, exact: false },
    { to: generatePath(locale, "compare"), label: labels.nav_compare, exact: false },
    { to: generatePath(locale, "blog"), label: labels.nav_blog, exact: false },
    { to: generatePath(locale, "favorites"), label: labels.nav_favorites, exact: false, isFav: true },
  ];

  const isActive = (to: string, exact: boolean) => {
    if (exact) return pathname === to;
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        position: "sticky",
        top: 0,
        zIndex: 110,
      }}
    >
      <div className="enc-container-wide">
        <div className="enc-header-wrapper">
          <div className="enc-header-logo">
            <Link href={generatePath(locale, null)} style={{ textDecoration: "none" }} aria-label="KurdishName">
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <img
                  src="/logo.webp"
                  width="32"
                  height="32"
                  alt="KurdishName Logo"
                  style={{
                    height: "32px",
                    width: "32px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                />
                <span className="enc-brand-text">KurdishName</span>
              </div>
            </Link>
          </div>

          <div className="enc-header-controls">
            <div className="hidden md:flex items-center">
              <ThemeToggle />
              <span
                style={{
                  width: "1px",
                  height: "14px",
                  backgroundColor: "var(--border)",
                  margin: "0 0.4rem",
                }}
              />
              <LanguageSwitcher currentLocale={locale} />
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 text-[var(--text)] rounded-xl hover:bg-[var(--surface-alt)] transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <nav
          className="hidden md:flex"
          style={{ gap: 0, borderTop: "1px solid var(--border-dim)", overflowX: "auto" }}
          aria-label="Primary Navigation"
        >
          {navItems.map(({ to, label, exact, isFav }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                href={to}
                style={{
                  padding: "0.55rem 0.875rem",
                  fontSize: "0.8125rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--text)" : "var(--text-muted)",
                  textDecoration: "none",
                  borderBottom: active ? "2px solid var(--text)" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  transition: "color 150ms, border-color 150ms",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                {isFav && (
                  <Heart
                    size={13}
                    style={{
                      fill: favorites.length > 0 ? "var(--female)" : "none",
                      color: favorites.length > 0 ? "var(--female)" : "currentColor",
                    }}
                  />
                )}
                {label}
                {isFav && favorites.length > 0 && (
                  <span
                    style={{
                      background: "var(--female)",
                      color: "white",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "0.05rem 0.35rem",
                      borderRadius: "10px",
                      lineHeight: "1.2",
                    }}
                  >
                    {favorites.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {isMenuOpen && (
          <div
            className="md:hidden"
            style={{
              borderTop: "1px solid var(--border)",
              padding: "1rem 0",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {navItems.map(({ to, label, exact }) => {
              const active = isActive(to, exact);
              return (
                <Link
                  key={to}
                  href={to}
                  style={{
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontWeight: active ? 700 : 500,
                    background: active ? "var(--surface-alt)" : "transparent",
                    color: "var(--text)",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              );
            })}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem",
                borderTop: "1px solid var(--border-dim)",
                marginTop: "0.5rem",
              }}
            >
              <ThemeToggle />
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
