"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Dices } from "lucide-react";
import { generatePath, Locale } from "@/lib/routes-config";
import { searchWithMiniSearch } from "@/lib/name-helpers";
import { featuredNames } from "@/lib/home-static-data";

interface SlimNameEntry {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  letter: string;
  tags?: string[];
}

let cachedSearchIndex: SlimNameEntry[] | null = null;
let indexFetchPromise: Promise<SlimNameEntry[]> | null = null;

async function ensureSearchIndexLoaded(): Promise<SlimNameEntry[]> {
  if (cachedSearchIndex) return cachedSearchIndex;
  if (!indexFetchPromise) {
    indexFetchPromise = fetch("/search_index.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SlimNameEntry[]) => {
        cachedSearchIndex = data;
        return data;
      })
      .catch(() => []);
  }
  return indexFetchPromise;
}

export default function LazySearchClient({
  locale,
  placeholder,
  searchBtnLabel,
  randomBtnLabel,
  girlLabel,
  boyLabel,
}: {
  locale: Locale;
  placeholder: string;
  searchBtnLabel: string;
  randomBtnLabel: string;
  girlLabel: string;
  boyLabel: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [indexData, setIndexData] = useState<SlimNameEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const loadedRef = useRef(false);

  // Lazy load /search_index.json ONLY on input focus (zero network cost on initial page load)
  const handleFocus = async () => {
    setIsOpen(true);
    if (!loadedRef.current) {
      loadedRef.current = true;
      const list = await ensureSearchIndexLoaded();
      setIndexData(list);
    }
  };

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 1 || indexData.length === 0) return [];
    return searchWithMiniSearch(indexData, q, locale).slice(0, 12);
  }, [query, indexData, locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(generatePath(locale, "name", results[0].id));
      setIsOpen(false);
    }
  };

  const handleRandom = async () => {
    const list = indexData.length > 0 ? indexData : await ensureSearchIndexLoaded();
    const pool = list.length > 0 ? list : featuredNames;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    if (picked) {
      router.push(generatePath(locale, "name", picked.id));
    }
  };

  return (
    <div style={{ position: "relative", maxWidth: "640px", margin: "0.75rem auto 0 auto" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "220px",
            display: "flex",
            alignItems: "center",
            border: "1.5px solid var(--border)",
            borderRadius: "0.75rem",
            background: "var(--surface)",
            padding: "0.2rem 0.4rem 0.2rem 0.75rem",
            minHeight: "48px",
          }}
        >
          <Search size={18} style={{ color: "var(--text-muted)", marginRight: "0.5rem", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onFocus={handleFocus}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: "var(--text)",
              fontSize: "16px", // iOS Safari 16px prevents auto-zoom
              padding: "0.5rem 0",
              outline: "none",
            }}
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "0.4rem 0.6rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: 700,
                lineHeight: 1,
              }}
              aria-label="Aramayı temizle"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.6rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
              minHeight: "40px",
              flexShrink: 0,
            }}
          >
            {searchBtnLabel}
          </button>
        </div>

        <button
          type="button"
          onClick={handleRandom}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.6rem 0.9rem",
            borderRadius: "0.75rem",
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            fontSize: "0.85rem",
            fontWeight: 700,
            cursor: "pointer",
            minHeight: "48px",
          }}
        >
          <Dices size={16} />
          <span>{randomBtnLabel}</span>
        </button>
      </form>

      {isOpen && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "0.4rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            boxShadow: "0 12px 24px -4px rgba(0,0,0,0.12)",
            zIndex: 50,
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {results.map((item) => (
            <Link
              key={item.id}
              href={generatePath(locale, "name", item.id)}
              onClick={() => setIsOpen(false)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.55rem 0.85rem",
                minHeight: "44px",
                borderBottom: "1px solid var(--border-dim)",
                textDecoration: "none",
                color: "var(--text)",
                fontWeight: 600,
                fontSize: "0.925rem",
              }}
              className="hover:bg-[var(--surface-alt)] active:bg-[var(--surface-2)]"
            >
              <span>{item.name}</span>
              <span
                className={item.gender === "female" ? "badge-female" : "badge-male"}
                style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
              >
                {item.gender === "female" ? girlLabel : boyLabel}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
