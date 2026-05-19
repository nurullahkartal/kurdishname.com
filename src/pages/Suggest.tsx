import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Sparkles, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { generatePath } from "../utils/routes";

export default function Suggest() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || "tr";

  const [nameVal, setNameVal] = useState("");
  const [genderVal, setGenderVal] = useState("female");
  const [meaningVal, setMeaningVal] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [optIn, setOptIn] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal.trim()) return;

    setIsSubmitting(true);

    // Simulate server side submission
    setTimeout(() => {
      // Persist in localstorage for demo verification
      const existingStr = localStorage.getItem("suggestedNames");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const newSuggestion = {
        id: "suggest_" + Date.now(),
        name: nameVal.trim(),
        gender: genderVal,
        meaning: meaningVal.trim(),
        email: userEmail.trim(),
        optIn,
        date: new Date().toISOString()
      };
      existing.push(newSuggestion);
      localStorage.setItem("suggestedNames", JSON.stringify(existing));

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <>
      <Helmet>
        <title>{t("suggest_seo_title")} | KurdishName</title>
        <meta name="description" content={t("suggest_seo_desc")} />
        <link rel="canonical" href={`https://kurdishname.com${generatePath(lng, 'suggest')}`} />
        {["tr", "en", "de", "ar"].map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`https://kurdishname.com${generatePath(lang, 'suggest')}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://kurdishname.com${generatePath('en', 'suggest')}`}
        />
      </Helmet>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem 0" }}>
        {/* Back Link */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to={generatePath(lng, null)} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            textDecoration: "none"
          }} className="hover:text-[var(--accent)] transition-colors">
            <ArrowLeft size={14} />
            {t("back_to_home", "Ana Sayfaya Dön")}
          </Link>
        </div>

        {/* Card Container */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "1.5rem",
          padding: "2rem",
          boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)"
        }} className="animate-fade-in">
          
          {!isSuccess ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.25rem" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(var(--accent-rgb), 0.1)",
                  color: "var(--accent)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.725rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem"
                }}>
                  <Sparkles size={11} fill="currentColor" />
                  {t("suggest_badge", "ARŞİV GENİŞLETİCİ")}
                </div>
                <h1 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.025em"
                }}>
                  {t("suggest_title", "Yeni İsim Öner")}
                </h1>
                <p style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                  marginTop: "0.5rem"
                }}>
                  {t("suggest_desc", "Sitede bulamadığınız Kürtçe isimleri bizimle paylaşın. Akademik incelemeden sonra en kısa sürede veritabanına ekleyelim.")}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Suggested Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="suggest-name" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text)" }}>
                    {t("suggest_label_name", "Önerilen İsim")} <span style={{ color: "var(--female)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="suggest-name"
                    value={nameVal}
                    onChange={e => setNameVal(e.target.value)}
                    required
                    placeholder={t("suggest_placeholder_name", "Örn: Arîn, Alend...")}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                      background: "var(--surface-alt)",
                      color: "var(--text)",
                      fontSize: "0.875rem",
                      fontFamily: "var(--font-display)",
                      outline: "none",
                      transition: "border-color 150ms"
                    }}
                    className="focus:border-[var(--accent)]"
                  />
                </div>

                {/* Gender Select */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text)" }}>
                    {t("suggest_label_gender", "Cinsiyet")}
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {[
                      { key: "female", label: t("gender_female", "Kız"), dot: "var(--female)" },
                      { key: "male", label: t("gender_male", "Erkek"), dot: "var(--male)" }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setGenderVal(opt.key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          padding: "0.75rem",
                          borderRadius: "0.75rem",
                          border: genderVal === opt.key ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                          background: genderVal === opt.key ? "rgba(var(--accent-rgb), 0.04)" : "var(--surface-alt)",
                          color: "var(--text)",
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 150ms"
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: opt.dot }} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meaning / Notes */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="suggest-meaning" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text)" }}>
                    {t("suggest_label_meaning", "Anlamı ve Notlar")}
                  </label>
                  <textarea
                    id="suggest-meaning"
                    value={meaningVal}
                    onChange={e => setMeaningVal(e.target.value)}
                    rows={3}
                    placeholder={t("suggest_placeholder_meaning", "İsmin bildiğiniz anlamı, kaynak kitabı veya tarihi referansı...")}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                      background: "var(--surface-alt)",
                      color: "var(--text)",
                      fontSize: "0.875rem",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color 150ms"
                    }}
                    className="focus:border-[var(--accent)]"
                  />
                </div>

                {/* Divider */}
                <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "0.5rem 0" }} />

                {/* User Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label htmlFor="suggest-email" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text)" }}>
                    {t("suggest_label_email", "E-Posta Adresiniz (İsteğe Bağlı)")}
                  </label>
                  <input
                    type="email"
                    id="suggest-email"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    placeholder="email@adresiniz.com"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.75rem",
                      border: "1px solid var(--border)",
                      background: "var(--surface-alt)",
                      color: "var(--text)",
                      fontSize: "0.875rem",
                      outline: "none",
                      transition: "border-color 150ms"
                    }}
                    className="focus:border-[var(--accent)]"
                  />
                </div>

                {/* Opt In Checkbox */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <input
                    type="checkbox"
                    id="suggest-opt-in"
                    checked={optIn}
                    onChange={e => setOptIn(e.target.checked)}
                    style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: "var(--accent)", cursor: "pointer", marginTop: "2px" }}
                  />
                  <label htmlFor="suggest-opt-in" style={{ fontSize: "0.75rem", color: "var(--text-muted)", cursor: "pointer", lineHeight: 1.4 }}>
                    {t("suggest_opt_in", "Bu isim arşive eklendiğinde bana e-posta ile haber ver ve gelişmeleri paylaş.")}
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !nameVal.trim()}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    borderRadius: "0.75rem",
                    background: isSubmitting ? "var(--border)" : "var(--accent)",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    border: "none",
                    cursor: nameVal.trim() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 150ms"
                  }}
                  className="hover:opacity-90 active:scale-95"
                >
                  {isSubmitting ? (
                    t("sending", "Gönderiliyor...")
                  ) : (
                    <>
                      <Send size={15} />
                      {t("suggest_btn_submit", "Öneriyi Gönder")}
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div style={{ textAlign: "center", padding: "1.5rem 0" }} className="animate-fade-in">
              <div style={{ display: "inline-flex", color: "var(--accent)", marginBottom: "1.25rem" }}>
                <CheckCircle size={56} className="animate-bounce" />
              </div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.025em"
              }}>
                {t("suggest_success_title", "Öneriniz Alındı! 🎉")}
              </h2>
              <p style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                maxWidth: "400px",
                margin: "0.75rem auto 1.5rem auto"
              }}>
                {t("suggest_success_desc", "Önerdiğiniz ismi akademik olarak inceleyip doğruluğunu onayladıktan sonra arşive dahil edeceğiz. Kürtçe isim kültürünü birlikte yaşattığımız için teşekkürler!")}
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setNameVal("");
                    setMeaningVal("");
                  }}
                  style={{
                    padding: "0.65rem 1.25rem",
                    borderRadius: "0.75rem",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 150ms"
                  }}
                  className="hover:bg-[var(--surface-alt)]"
                >
                  {t("suggest_another", "Başka Bir İsim Öner")}
                </button>
                <Link
                  to={generatePath(lng, null)}
                  style={{
                    padding: "0.65rem 1.25rem",
                    borderRadius: "0.75rem",
                    background: "var(--accent)",
                    color: "white",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 150ms"
                  }}
                  className="hover:opacity-90"
                >
                  {t("back_to_home", "Ana Sayfa")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
