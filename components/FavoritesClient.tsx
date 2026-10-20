"use client";

import Link from "next/link";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { useFavorites } from "./FavoritesContext";
import { generatePath, Locale } from "@/lib/routes-config";
import { getLocalizedMeaning } from "@/lib/name-helpers";

export interface FavoritesLabels {
  back_to_home: string;
  favorites_title: string;
  favorites_subtitle: string;
  favorites_clear_all: string;
  favorites_empty_title: string;
  favorites_empty: string;
  discover_names_btn: string;
  gender_female: string;
  gender_male: string;
}

export default function FavoritesClient({
  locale,
  labels,
}: {
  locale: Locale;
  labels: FavoritesLabels;
}) {
  const { favorites, removeFavorite, toggleFavorite } = useFavorites();

  const handleClearAll = () => {
    favorites.forEach((f) => removeFavorite(f.id));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <Link
          href={generatePath(locale, null)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={14} />
          {labels.back_to_home}
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0.8rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 className="page-title" style={{ borderBottom: "none", margin: 0, paddingBottom: 0 }}>
            {labels.favorites_title}
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0.25rem 0 0 0" }}>
            {labels.favorites_subtitle}
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--female)",
              background: "var(--female-dim)",
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--r-sm)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Trash2 size={13} />
            {labels.favorites_clear_all}
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "3rem 2rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <Heart size={44} style={{ color: "var(--female)", opacity: 0.4, margin: "0 auto 1rem auto" }} />
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>
            {labels.favorites_empty_title}
          </h2>
          <p style={{ maxWidth: "460px", margin: "0 auto", fontSize: "0.875rem" }}>{labels.favorites_empty}</p>
          <div style={{ marginTop: "1.5rem" }}>
            <Link
              href={generatePath(locale, null)}
              style={{
                display: "inline-flex",
                padding: "0.625rem 1.25rem",
                background: "var(--accent)",
                color: "#fff",
                borderRadius: "var(--r-md)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              {labels.discover_names_btn}
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {favorites.map((item) => {
            const isFemale = item.gender === "female";
            return (
              <div
                key={item.id}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-lg)",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <Link
                      href={generatePath(locale, "name", item.id)}
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: isFemale ? "var(--female)" : "var(--male)",
                        textDecoration: "none",
                      }}
                    >
                      {item.name}
                    </Link>
                    <span className={isFemale ? "badge-female" : "badge-male"}>
                      {isFemale ? labels.gender_female : labels.gender_male}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    {getLocalizedMeaning(item, locale)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFavorite(item)}
                  style={{
                    padding: "0.5rem",
                    color: "var(--female)",
                    background: "var(--female-dim)",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Heart size={18} fill="var(--female)" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
