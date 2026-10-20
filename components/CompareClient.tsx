"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Scale, RefreshCw, ChevronRight } from "lucide-react";
import { NameData } from "@/lib/names-data";
import { generatePath, Locale } from "@/lib/routes-config";
import { getLocalizedMeaning, searchWithMiniSearch } from "@/lib/name-helpers";
import { compareNames } from "@/lib/compare-engine";

interface SlimEntry {
  id: string;
  name: string;
  gender: "male" | "female" | "unisex";
  letter: string;
}

export interface CompareLabels {
  compare_title: string;
  compare_desc: string;
  compare_label_1: string;
  compare_label_2: string;
  compare_placeholder: string;
  compare_harmony_score: string;
  compare_stat_meaning: string;
  compare_stat_origin: string;
  compare_stat_length: string;
  view_details: string;
  gender_female: string;
  gender_male: string;
  harmony_poor: string;
  harmony_neutral: string;
  harmony_good: string;
  harmony_perfect: string;
}

async function fetchFullNameFromChunk(entry: SlimEntry): Promise<NameData | null> {
  try {
    const res = await fetch(`/data/names/${encodeURIComponent(entry.letter)}.json`);
    if (!res.ok) return null;
    const payload = await res.json();
    const list: NameData[] = payload.names || [];
    return list.find((n) => n.id.toLowerCase() === entry.id.toLowerCase()) || null;
  } catch {
    return null;
  }
}

export default function CompareClient({
  locale,
  labels,
}: {
  locale: Locale;
  labels: CompareLabels;
}) {
  const [searchIndex, setSearchIndex] = useState<SlimEntry[]>([]);
  const [selected1, setSelected1] = useState<SlimEntry | null>(null);
  const [selected2, setSelected2] = useState<SlimEntry | null>(null);
  const [fullName1, setFullName1] = useState<NameData | null>(null);
  const [fullName2, setFullName2] = useState<NameData | null>(null);
  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const ensureIndex = async () => {
    if (searchIndex.length > 0) return;
    try {
      const res = await fetch("/search_index.json");
      if (res.ok) {
        const data = await res.json();
        setSearchIndex(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!selected1) {
      setFullName1(null);
      return;
    }
    fetchFullNameFromChunk(selected1).then(setFullName1);
  }, [selected1]);

  useEffect(() => {
    if (!selected2) {
      setFullName2(null);
      return;
    }
    fetchFullNameFromChunk(selected2).then(setFullName2);
  }, [selected2]);

  const options1 = useMemo(() => {
    if (!query1.trim()) return searchIndex.slice(0, 8);
    return searchWithMiniSearch(searchIndex, query1, locale).slice(0, 8);
  }, [query1, searchIndex, locale]);

  const options2 = useMemo(() => {
    if (!query2.trim()) return searchIndex.slice(0, 8);
    return searchWithMiniSearch(searchIndex, query2, locale).slice(0, 8);
  }, [query2, searchIndex, locale]);

  const harmony = useMemo(() => {
    if (!fullName1 || !fullName2) return null;
    const tMap: Record<string, string> = {
      harmony_poor: labels.harmony_poor,
      harmony_neutral: labels.harmony_neutral,
      harmony_good: labels.harmony_good,
      harmony_perfect: labels.harmony_perfect,
    };
    return compareNames(fullName1, fullName2, (k) => tMap[k] || k);
  }, [fullName1, fullName2, labels]);

  const handleSwap = () => {
    const s1 = selected1;
    const q1 = query1;
    setSelected1(selected2);
    setQuery1(query2);
    setSelected2(s1);
    setQuery2(q1);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem 0" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(249, 115, 22, 0.1)",
            color: "#f97316",
            padding: "0.35rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}
        >
          <Scale size={14} />
          <span>KurdishName</span>
        </div>
        <h1 className="page-title" style={{ borderBottom: "none", marginBottom: "0.25rem" }}>
          {labels.compare_title}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "520px", margin: "0 auto" }}>
          {labels.compare_desc}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ position: "relative" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 800, display: "block", marginBottom: "0.35rem" }}>
            {labels.compare_label_1}
          </label>
          <input
            type="text"
            placeholder={labels.compare_placeholder}
            value={query1}
            onFocus={() => {
              ensureIndex();
              setOpen1(true);
            }}
            onChange={(e) => {
              setQuery1(e.target.value);
              setOpen1(true);
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: "0.875rem",
            }}
          />
          {open1 && options1.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                marginTop: "0.25rem",
                zIndex: 20,
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {options1.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelected1(item);
                    setQuery1(item.name);
                    setOpen1(false);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.6rem 1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--text)",
                    fontWeight: 600,
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ color: item.gender === "female" ? "var(--female)" : "var(--male)" }}>
                    {item.gender === "female" ? labels.gender_female : labels.gender_male}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSwap}
          style={{
            marginTop: "1.25rem",
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Swap names"
        >
          <RefreshCw size={14} />
        </button>

        <div style={{ position: "relative" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 800, display: "block", marginBottom: "0.35rem" }}>
            {labels.compare_label_2}
          </label>
          <input
            type="text"
            placeholder={labels.compare_placeholder}
            value={query2}
            onFocus={() => {
              ensureIndex();
              setOpen2(true);
            }}
            onChange={(e) => {
              setQuery2(e.target.value);
              setOpen2(true);
            }}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: "0.875rem",
            }}
          />
          {open2 && options2.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                marginTop: "0.25rem",
                zIndex: 20,
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {options2.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelected2(item);
                    setQuery2(item.name);
                    setOpen2(false);
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.6rem 1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--text)",
                    fontWeight: 600,
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ color: item.gender === "female" ? "var(--female)" : "var(--male)" }}>
                    {item.gender === "female" ? labels.gender_female : labels.gender_male}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {harmony && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1.25rem",
            padding: "1.25rem",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-muted)" }}>
            {labels.compare_harmony_score}
          </span>
          <div style={{ fontSize: "2.25rem", fontWeight: 900, color: harmony.color, marginTop: "0.25rem" }}>
            %{harmony.score} — {harmony.label}
          </div>
        </div>
      )}

      {(fullName1 || fullName2) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {[fullName1, fullName2].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1.25rem",
                padding: "1.5rem",
              }}
            >
              {item ? (
                <>
                  <h2
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: item.gender === "female" ? "var(--female)" : "var(--male)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.name}
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text)", marginBottom: "0.75rem" }}>
                    <strong>{labels.compare_stat_meaning}:</strong> {getLocalizedMeaning(item, locale)}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    <strong>{labels.compare_stat_length}:</strong> {item.name.length}
                  </p>
                  <Link
                    href={generatePath(locale, "name", item.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    {labels.view_details}
                    <ChevronRight size={14} />
                  </Link>
                </>
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>—</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
