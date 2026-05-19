import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Download, Trash2, Clipboard, Sparkles, Check, Mail, Calendar, UserCheck, Share2, FileText, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SuggestedName {
  id: string;
  name: string;
  gender: string;
  meaning: string;
  email: string;
  optIn: boolean;
  date: string;
}

export default function Admin() {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<SuggestedName[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  // Copy state for viral marketing elements
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Authentication State
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("isAdminAuthenticated") === "true";
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hash password with SHA-256 securely to avoid plain text comparison in the compiled bundle
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(passwordInput);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      
      // SHA-256 Hash of the original password
      if (hashHex === "944a9e223ca860c49f826317bc2d4e5f013d2f9746b1eb96b487e4620583b276") {
        sessionStorage.setItem("isAdminAuthenticated", "true");
        setIsAuthenticated(true);
        setErrorMsg("");
      } else {
        setErrorMsg("Hatalı Şifre! Erişim Engellendi.");
      }
    } catch (err) {
      setErrorMsg("Sistemsel şifreleme hatası oluştu.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  // Load suggestions from localStorage on mount
  useEffect(() => {
    const loadedStr = localStorage.getItem("suggestedNames");
    if (loadedStr) {
      try {
        setSuggestions(JSON.parse(loadedStr));
      } catch (err) {
        console.error("Failed to parse suggestedNames", err);
      }
    }
  }, []);

  // Save changes to localStorage
  const saveSuggestions = (updated: SuggestedName[]) => {
    setSuggestions(updated);
    localStorage.setItem("suggestedNames", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bu öneriyi silmek istediğinizden emin misiniz?")) {
      const filtered = suggestions.filter(item => item.id !== id);
      saveSuggestions(filtered);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Tüm önerileri sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
      saveSuggestions([]);
    }
  };

  const handleCopySingle = (item: SuggestedName) => {
    const text = `İsim: ${item.name}\nCinsiyet: ${item.gender === "female" ? "Kız" : "Erkek"}\nAnlamı: ${item.meaning || "Belirtilmemiş"}\nE-Posta: ${item.email || "Anonim"}\nBülten İzni: ${item.optIn ? "Evet" : "Hayır"}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyEmails = () => {
    const emails = suggestions
      .filter(item => item.email && item.optIn)
      .map(item => item.email)
      .join(", ");
    
    if (!emails) {
      alert("Bülten izni vermiş e-posta adresi bulunamadı!");
      return;
    }
    
    navigator.clipboard.writeText(emails);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2000);
    alert("Bülten izinli e-postalar panoya kopyalandı!");
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(suggestions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kurdishname_onerilen_isimler_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Yönetici Girişi (Admin) | KurdishName</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "450px",
          padding: "2rem 0"
        }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1.5rem",
            padding: "2.5rem 2rem",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.04)"
          }} className="animate-fade-in">
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(249, 115, 22, 0.1)",
              color: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem auto"
            }}>
              <span style={{ fontSize: "1.75rem" }}>🔒</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.375rem",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.025em"
            }}>
              Yönetici Girişi
            </h2>
            <p style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              marginTop: "0.4rem",
              marginBottom: "1.75rem"
            }}>
              Önerilen isimleri görüntülemek için lütfen şifreyi giriniz.
            </p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="password"
                placeholder="Yönetici Şifresi"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  color: "var(--text)",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  outline: "none",
                  transition: "border-color 150ms"
                }}
                className="focus:border-[var(--accent)]"
                autoFocus
              />

              {errorMsg && (
                <p style={{
                  color: "#ef4444",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  margin: "0",
                  padding: "0.5rem",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "0.5rem"
                }} className="animate-shake">
                  ⚠️ {errorMsg}
                </p>
              )}

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 150ms"
                }}
                className="hover:opacity-90 active:scale-95"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Yönetim Paneli (Admin) | KurdishName</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ padding: "1rem 0" }}>
        {/* Header Title Block */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "1.25rem"
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(249, 115, 22, 0.1)",
              color: "#f97316",
              padding: "0.35rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.725rem",
              fontWeight: 700,
              marginBottom: "0.5rem"
            }}>
              <Sparkles size={11} fill="currentColor" />
              GİZLİ YÖNETİCİ ALANI
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.025em"
              }}>
                Önerilen İsimler Paneli 🔒
              </h1>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  color: "#ef4444",
                  border: "none",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
                className="hover:bg-red-500 hover:text-white transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Ziyaretçileriniz tarafından önerilen yeni bebek isimlerini buradan inceleyip bülten izinlerini yönetebilirsiniz.
            </p>
          </div>

          {suggestions.length > 0 && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleCopyEmails}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--surface-alt)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
                className="hover:bg-[var(--border)] transition-colors"
                title="Bülten izni veren tüm e-postaları kopyalar"
              >
                <Mail size={14} />
                E-Postaları Kopyala
              </button>
              <button
                onClick={handleDownloadJSON}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <Download size={14} />
                JSON İndir
              </button>
              <button
                onClick={handleClearAll}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
                className="hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={14} />
                Temizle
              </button>
            </div>
          )}
        </div>

        {/* Suggestion Dashboard Content */}
        {suggestions.length > 0 ? (
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            <div style={{ overflowX: "auto" }}>
              <table className="wiki-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--surface-alt)" }}>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem" }}>Önerilen İsim</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem" }}>Cinsiyet</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem" }}>Anlamı / Notlar</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.8125rem" }}>E-Posta</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.8125rem", width: "100px" }}>Bülten İzni</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.8125rem", width: "130px" }}>Tarih</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.8125rem", width: "90px" }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((item) => {
                    const isFemale = item.gender === "female";
                    const isCopied = copiedId === item.id;

                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        {/* Name Column */}
                        <td style={{ padding: "1rem", fontWeight: 700, color: "var(--text)" }}>
                          <span className={isFemale ? "name-link-female" : "name-link-male"} style={{ fontSize: "1rem" }}>
                            {item.name}
                          </span>
                        </td>

                        {/* Gender Badge */}
                        <td style={{ padding: "1rem" }}>
                          <span className={isFemale ? "badge-female" : "badge-male"}>
                            {isFemale ? "Kız" : "Erkek"}
                          </span>
                        </td>

                        {/* Meaning Column */}
                        <td style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.8125rem", maxWidth: "250px", lineHeight: 1.4 }}>
                          {item.meaning || <em style={{ color: "var(--text-faint)" }}>Girilmemiş</em>}
                        </td>

                        {/* Email Column */}
                        <td style={{ padding: "1rem", fontSize: "0.8125rem", color: "var(--text)" }}>
                          {item.email ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                              <Mail size={12} className="text-gray-400" />
                              {item.email}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-faint)" }}>Anonim</span>
                          )}
                        </td>

                        {/* newsletter permission */}
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          {item.optIn ? (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              background: "rgba(16, 185, 129, 0.1)",
                              color: "#10b981",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.5rem",
                              fontSize: "0.6875rem",
                              fontWeight: 700
                            }}>
                              <UserCheck size={11} />
                              İZİN VERDİ
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-faint)", fontSize: "0.75rem" }}>Hayır</span>
                          )}
                        </td>

                        {/* Date Column */}
                        <td style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.75rem", textAlign: "center" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                            <Calendar size={11} />
                            {new Date(item.date).toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit"
                            })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: "0.35rem" }}>
                            <button
                              onClick={() => handleCopySingle(item)}
                              style={{
                                background: isCopied ? "rgba(16, 185, 129, 0.1)" : "var(--surface-alt)",
                                color: isCopied ? "#10b981" : "var(--text-muted)",
                                border: "1px solid var(--border)",
                                borderRadius: "0.5rem",
                                padding: "0.35rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center"
                              }}
                              className="hover:bg-[var(--border)] transition-colors"
                              title="Kopyala"
                            >
                              {isCopied ? <Check size={13} /> : <Clipboard size={13} />}
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              style={{
                                background: "rgba(239, 68, 68, 0.05)",
                                color: "#ef4444",
                                border: "1px solid rgba(239, 68, 68, 0.1)",
                                borderRadius: "0.5rem",
                                padding: "0.35rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center"
                              }}
                              className="hover:bg-red-500 hover:text-white transition-colors"
                              title="Sil"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div style={{
            background: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "1rem",
            padding: "4rem 2rem",
            textAlign: "center",
            color: "var(--text-muted)"
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒💤</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 800, color: "var(--text)" }}>
              Henüz Önerilen İsim Yok
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "340px", margin: "0.5rem auto 0 auto", lineHeight: 1.5 }}>
              Ziyaretçileriniz sitede bulamadıkları isimleri önermeye başladığında, hepsi gerçek zamanlı olarak burada listelenecektir!
            </p>
          </div>
        )}

        {/* 📢 Sosyal Medya & Reklam Rehberi (Viral Kit) */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginTop: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <Share2 style={{ color: "var(--accent)" }} size={20} />
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", margin: 0 }}>
                📢 Sosyal Medya & Reklam Materyalleri (Viral Kit)
              </h2>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Platformunuzu büyütmek, WhatsApp/Instagram üzerinde paylaşım yapmak ve AI yardımıyla içerik üretmek için en iyi kaynaklar.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {/* Left side: Card generator and AI Prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* 1. Kart Oluşturucu Taslakları */}
              <div style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent)", display: "block", marginBottom: "0.75rem" }}>
                  🖼️ KART OLUŞTURUCU METİN TASLAKLARI
                </span>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  Bu metinleri admin panelindeki isim "Anlamı" kısmına yapıştırarak sevdiklerinizle paylaşacağınız isim kartlarını jilet gibi yapabilirsiniz!
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {/* Taslak 1 */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.75rem", position: "relative" }}>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>Vurgulu & Kısa</div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text)", lineHeight: 1.4, paddingRight: "2rem" }}>
                      "Mezopotamya'nın kalbinden gelen, tarihin derinliklerinden süzülen en saf Kürtçe isimler. Kimliğini isminde taşı."
                    </p>
                    <button
                      onClick={() => copyToClipboard("t1", "Mezopotamya'nın kalbinden gelen, tarihin derinliklerinden süzülen en saf Kürtçe isimler. Kimliğini isminde taşı.")}
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", cursor: "pointer", color: copiedKey === "t1" ? "#10b981" : "var(--text-muted)" }}
                      title="Kopyala"
                    >
                      {copiedKey === "t1" ? <Check size={14} /> : <Clipboard size={14} />}
                    </button>
                  </div>

                  {/* Taslak 2 */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.75rem", position: "relative" }}>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>Duygusal</div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text)", lineHeight: 1.4, paddingRight: "2rem" }}>
                      "Bebeğinize vereceğiniz isim, onun ömür boyu taşıyacağı en güzel mirastır. 10.322 saf isim arasından en doğrusunu seçin."
                    </p>
                    <button
                      onClick={() => copyToClipboard("t2", "Bebeğinize vereceğiniz isim, onun ömür boyu taşıyacağı en güzel mirastır. 10.322 saf isim arasından en doğrusunu seçin.")}
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", cursor: "pointer", color: copiedKey === "t2" ? "#10b981" : "var(--text-muted)" }}
                      title="Kopyala"
                    >
                      {copiedKey === "t2" ? <Check size={14} /> : <Clipboard size={14} />}
                    </button>
                  </div>

                  {/* Taslak 3 */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.75rem", position: "relative" }}>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>Otoriter</div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text)", lineHeight: 1.4, paddingRight: "2rem" }}>
                      "KurdishName: Dünyanın en kapsamlı ve akademik olarak doğrulanmış saf Kürtçe isimler arşivi. Artık 4 dilde yayında!"
                    </p>
                    <button
                      onClick={() => copyToClipboard("t3", "KurdishName: Dünyanın en kapsamlı ve akademik olarak doğrulanmış saf Kürtçe isimler arşivi. Artık 4 dilde yayında!")}
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", cursor: "pointer", color: copiedKey === "t3" ? "#10b981" : "var(--text-muted)" }}
                      title="Kopyala"
                    >
                      {copiedKey === "t3" ? <Check size={14} /> : <Clipboard size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Social Share Templates */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* 2. Instagram / WhatsApp Paylaşım Metinleri */}
              <div style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#10b981", display: "block", marginBottom: "0.75rem" }}>
                  📱 VIRAL WHATSAPP & INSTAGRAM PAYLAŞIMLARI
                </span>
                <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  WhatsApp gruplarında veya Instagram'da paylaşarak kullanıcı trafiğinizi katlamak için aşağıdaki hazır metinleri tek tıkla kopyalayıp gönderin:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {/* Paylaşım A */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.75rem", position: "relative" }}>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>Seçenek A (Merak Uyandırıcı)</div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text)", lineHeight: 1.4, paddingRight: "2rem" }}>
                      "Çocuğunuza isim ararken kaybolmayın! 🔍 Kürtçe isimlerin anlamlarını, kökenlerini ve akustik uyumlarını artık tek tıkla görebilirsiniz. Kendi favori listenizi oluşturun ve eşinizle paylaşın. 💎<br />👉 kurdishname.com"
                    </p>
                    <button
                      onClick={() => copyToClipboard("v1", "Çocuğunuza isim ararken kaybolmayın! 🔍 Kürtçe isimlerin anlamlarını, kökenlerini ve akustik uyumlarını artık tek tıkla görebilirsiniz. Kendi favori listenizi oluşturun ve eşinizle paylaşın. 💎\n👉 kurdishname.com")}
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", cursor: "pointer", color: copiedKey === "v1" ? "#10b981" : "var(--text-muted)" }}
                      title="Kopyala"
                    >
                      {copiedKey === "v1" ? <Check size={14} /> : <Clipboard size={14} />}
                    </button>
                  </div>

                  {/* Paylaşım B */}
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.75rem", position: "relative" }}>
                    <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.25rem" }}>Seçenek B (Gurur & Kültür Odaklı)</div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text)", lineHeight: 1.4, paddingRight: "2rem" }}>
                      "Kültürümüzün en güzel tınılarını isimlerimizde yaşatıyoruz. 🌿 10.000'den fazla saf Kürtçe ismi bir araya getirdik. Beğendiğiniz ismin şık kartını indirip sevdiklerinize göndermeyi unutmayın! 👑<br />📍 kurdishname.com"
                    </p>
                    <button
                      onClick={() => copyToClipboard("v2", "Kültürümüzün en güzel tınılarını isimlerimizde yaşatıyoruz. 🌿 10.000'den fazla saf Kürtçe ismi bir araya getirdik. Beğendiğiniz ismin şık kartını indirip sevdiklerinize göndermeyi unutmayın! 👑\n📍 kurdishname.com")}
                      style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", cursor: "pointer", color: copiedKey === "v2" ? "#10b981" : "var(--text-muted)" }}
                      title="Kopyala"
                    >
                      {copiedKey === "v2" ? <Check size={14} /> : <Clipboard size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Prompt Box at the bottom */}
          <div style={{ background: "rgba(var(--accent-rgb), 0.04)", border: "1px dashed var(--border)", borderRadius: "0.75rem", padding: "1rem", marginTop: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                🤖 YAPAY ZEKA (GEMINI/CHATGPT) REKLAM PROMPTU
              </span>
              <button
                onClick={() => copyToClipboard("aiPrompt", "Benim kurdishname.com adında, 10.322 saf Kürtçe isim içeren, 4 dilde (TR, EN, DE, AR) hizmet veren devasa bir web sitem var. Sitemde 'İsim Defterim', 'Karşılaştırma Modülü' ve 'İsim Kartı Oluşturucu' gibi özellikler mevcut.\n\nSenden ricam: Bu özellikleri ön plana çıkaran, anne ve babaları duygulandıracak, aynı zamanda sitenin kalitesini ve profesyonelliğini vurgulayacak 5 farklı sosyal medya postu ve ilgi çekici başlıklar hazırla. Dilin samimi ama güven verici olsun.")}
                style={{
                   background: "var(--surface)",
                   border: "1px solid var(--border)",
                   borderRadius: "0.35rem",
                   fontSize: "0.6875rem",
                   fontWeight: 700,
                   color: copiedKey === "aiPrompt" ? "#10b981" : "var(--text-muted)",
                   padding: "0.25rem 0.5rem",
                   cursor: "pointer",
                   display: "inline-flex",
                   alignItems: "center",
                   gap: "0.25rem"
                }}
              >
                {copiedKey === "aiPrompt" ? <Check size={12} /> : <Clipboard size={12} />}
                {copiedKey === "aiPrompt" ? "Kopyalandı!" : "Promptu Kopyala"}
              </button>
            </div>
            <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Yapay zeka robotlarına aşağıdaki hazır komutu göndererek saniyeler içinde büyüleyici blog yazıları, reklam kampanyaları veya sosyal medya içerikleri ürettirebilirsiniz:
            </p>
            <pre style={{
              margin: 0,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              maxHeight: "120px",
              overflowY: "auto"
            }}>
              "Benim kurdishname.com adında, 10.322 saf Kürtçe isim içeren, 4 dilde (TR, EN, DE, AR) hizmet veren devasa bir web sitem var. Sitemde 'İsim Defterim', 'Karşılaştırma Modülü' ve 'İsim Kartı Oluşturucu' gibi özellikler mevcut. Senden ricam: Bu özellikleri ön plana çıkaran, anne ve babaları duygulandıracak, aynı zamanda sitenin kalitesini ve profesyonelliğini vurgulayacak 5 farklı sosyal medya postu ve ilgi çekici başlıklar hazırla. Dilin samimi ama güven verici olsun."
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
