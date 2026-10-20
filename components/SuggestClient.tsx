"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { generatePath, Locale } from "@/lib/routes-config";

export interface SuggestLabels {
  back_to_home: string;
  suggest_badge: string;
  suggest_title: string;
  suggest_desc: string;
  suggest_label_name: string;
  suggest_placeholder_name: string;
  suggest_label_gender: string;
  gender_female: string;
  gender_male: string;
  suggest_label_meaning: string;
  suggest_placeholder_meaning: string;
  suggest_label_email: string;
  suggest_btn_submit: string;
  suggest_success_title: string;
  suggest_success_desc: string;
}

export default function SuggestClient({
  locale,
  labels,
}: {
  locale: Locale;
  labels: SuggestLabels;
}) {
  const [nameVal, setNameVal] = useState("");
  const [genderVal, setGenderVal] = useState("female");
  const [meaningVal, setMeaningVal] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal.trim()) return;
    try {
      const existingStr = localStorage.getItem("suggestedNames");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.push({
        id: "suggest_" + Date.now(),
        name: nameVal.trim(),
        gender: genderVal,
        meaning: meaningVal.trim(),
        email: userEmail.trim(),
        date: new Date().toISOString(),
      });
      localStorage.setItem("suggestedNames", JSON.stringify(existing));
    } catch {
      // ignore
    }
    setIsSuccess(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem 0" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href={generatePath(locale, null)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
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
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "1.5rem",
          padding: "2rem",
        }}
      >
        {!isSuccess ? (
          <>
            <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.725rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                }}
              >
                <Sparkles size={12} />
                {labels.suggest_badge}
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>{labels.suggest_title}</h1>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                {labels.suggest_desc}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label
                  htmlFor="suggest-name"
                  style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "0.35rem" }}
                >
                  {labels.suggest_label_name} *
                </label>
                <input
                  id="suggest-name"
                  type="text"
                  required
                  value={nameVal}
                  onChange={(e) => setNameVal(e.target.value)}
                  placeholder={labels.suggest_placeholder_name}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--border)",
                    background: "var(--surface-alt)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "0.35rem" }}>
                  {labels.suggest_label_gender}
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    { key: "female", label: labels.gender_female },
                    { key: "male", label: labels.gender_male },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setGenderVal(opt.key)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "0.75rem",
                        border: genderVal === opt.key ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                        background: "var(--surface-alt)",
                        color: "var(--text)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="suggest-meaning"
                  style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "0.35rem" }}
                >
                  {labels.suggest_label_meaning}
                </label>
                <textarea
                  id="suggest-meaning"
                  rows={3}
                  value={meaningVal}
                  onChange={(e) => setMeaningVal(e.target.value)}
                  placeholder={labels.suggest_placeholder_meaning}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--border)",
                    background: "var(--surface-alt)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="suggest-email"
                  style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "0.35rem" }}
                >
                  {labels.suggest_label_email}
                </label>
                <input
                  id="suggest-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="info@kurdishname.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--border)",
                    background: "var(--surface-alt)",
                    color: "var(--text)",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: "0.75rem",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Send size={15} />
                {labels.suggest_btn_submit}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <CheckCircle size={48} style={{ color: "var(--accent)", margin: "0 auto 1rem auto" }} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{labels.suggest_success_title}</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {labels.suggest_success_desc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
