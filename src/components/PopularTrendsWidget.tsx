import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Flame, Sparkles } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { generatePath } from "../utils/routes";

interface TrendName {
  id: string;
  name: string;
  gender: "female" | "male";
  meanings: {
    tr: string;
    en: string;
    de: string;
    ar: string;
  };
}

export default function PopularTrendsWidget() {
  const { t, i18n } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lng = i18n.language || "tr";

  const trends: TrendName[] = useMemo(() => [
    {
      id: "arin",
      name: "Arîn",
      gender: "female",
      meanings: {
        tr: "Ateş gibi sıcak, coşkulu ve pırıl pırıl olan.",
        en: "Bright, enthusiastic, and warm like fire.",
        de: "Heiß, enthusiastisch und glänzend wie Feuer.",
        ar: "مشرق، متحمس، ودافئ مثل النار."
      }
    },
    {
      id: "alend",
      name: "Alend",
      gender: "male",
      meanings: {
        tr: "Sabahın ilk ışıkları, şafak vakti ve aydınlık.",
        en: "The first light of morning, dawn, and brightness.",
        de: "Das erste Morgenlicht, die Dämmerung und Helligkeit.",
        ar: "أول ضوء في الصباح، الفجر والسطوع."
      }
    },
    {
      id: "asmin",
      name: "Asmîn",
      gender: "female",
      meanings: {
        tr: "Görkemli dağların zirvesinde yetişen nadide çiçek.",
        en: "A rare flower growing on the peaks of majestic mountains.",
        de: "Eine seltene Blume, die auf den Gipfeln majestätischer Berge wächst.",
        ar: "زهرة نادرة تنمو على قمم الجبال الشاهقة."
      }
    },
    {
      id: "aram",
      name: "Aram",
      gender: "male",
      meanings: {
        tr: "Huzurlu, sakin, dingin ve sabırlı olan.",
        en: "Peaceful, calm, serene, and patient.",
        de: "Friedlich, ruhig, gelassen und geduldig.",
        ar: "هادئ، مسالم، مطمئن وصبور."
      }
    },
    {
      id: "arjin",
      name: "Arjîn",
      gender: "female",
      meanings: {
        tr: "Yaşam ateşi, hayat enerjisi ve canlılık.",
        en: "Fire of life, life energy, and vitality.",
        de: "Feuer des Lebens, Lebensenergie und Vitalität.",
        ar: "نار الحياة، طاقة الحياة والحيوية."
      }
    },
    {
      id: "sipan",
      name: "Sîpan",
      gender: "male",
      meanings: {
        tr: "Ulu Süphan Dağı; yüksek zirve ve asalet.",
        en: "The grand Mount Sipan; high peak and nobility.",
        de: "Der große Berg Sipan; hoher Gipfel und Adel.",
        ar: "جبل سيبان الشامخ؛ القمة العالية والنبل."
      }
    },
    {
      id: "silan",
      name: "Şîlan",
      gender: "female",
      meanings: {
        tr: "Yaban gülü, dağ çiçeği ve doğallık.",
        en: "Wild rose, mountain flower, and naturalness.",
        de: "Heckenrose, Bergblume und Natürlichkeit.",
        ar: "وردة برية، زهرة الجبل والعفوية."
      }
    },
    {
      id: "civan",
      name: "Cîvan",
      gender: "male",
      meanings: {
        tr: "Genç, taze, enerjik ve yakışıklı yiğit.",
        en: "Young, fresh, energetic, and handsome young man.",
        de: "Junger, frischer, energischer und gutaussehender junger Mann.",
        ar: "شاب، فتي، نشيط وبطل وسيم."
      }
    },
    {
      id: "rojda",
      name: "Rojda",
      gender: "female",
      meanings: {
        tr: "Günün doğuşu, şafak ve aydınlık gelecek.",
        en: "The birth of the day, dawn, and bright future.",
        de: "Die Geburt des Tages, die Dämmerung und eine glänzende Zukunft.",
        ar: "ولادة اليوم، الفجر والمستقبل المشرق."
      }
    },
    {
      id: "mirza",
      name: "Mirza",
      gender: "male",
      meanings: {
        tr: "Beyzade, soylu kişi, prens ve komutan.",
        en: "Nobleman, prince, commander, and intellectual.",
        de: "Edelmann, Prinz, Kommandant und Intellektueller.",
        ar: "نبيل، أمير، قائد ومثقف."
      }
    }
  ], []);

  return (
    <section className="trends-widget-container" style={{ marginBottom: "2.5rem" }}>
      <div className="trends-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h2 className="trends-title" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "var(--text)"
          }}>
            {t("trends_title", "Haftalık Trendler & Popüler İsimler")}
          </h2>
          <p className="trends-subtitle" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {t("trends_desc", "Bu hafta en çok favoriye eklenen ve incelenen gözde Kürtçe bebek isimleri.")}
          </p>
        </div>
      </div>

      <div className="trends-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "0.875rem"
      }}>
        {trends.map((item, idx) => {
          const rank = idx + 1;
          const isFemale = item.gender === "female";
          const localizedMeaning = item.meanings[lng as keyof typeof item.meanings] || item.meanings.tr;
          const isFav = isFavorite(item.id);

          return (
            <div
              key={item.id}
              className="trend-card"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                padding: "0.875rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                position: "relative",
                transition: "all 200ms ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
              }}
            >
              {/* Rank indicator with badge */}
              <div className="trend-rank" style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--surface-alt)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 800,
                flexShrink: 0
              }}>
                {rank}
              </div>

              {/* Name Details */}
              <div className="trend-details" style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Link
                    to={generatePath(lng, "name", item.id)}
                    className={isFemale ? "name-link-female" : "name-link-male"}
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      textDecoration: "none"
                    }}
                  >
                    {item.name}
                  </Link>
                  <span className={isFemale ? "badge-female" : "badge-male"} style={{ fontSize: "0.625rem", padding: "0.1rem 0.35rem" }}>
                    {isFemale ? t("gender_female", "Kız") : t("gender_male", "Erkek")}
                  </span>
                </div>
                <p className="trend-meaning" style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  margin: "0.2rem 0 0 0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }} title={localizedMeaning}>
                  {localizedMeaning}
                </p>
              </div>

              {/* Action Heart button */}
              <button
                onClick={() => toggleFavorite({ id: item.id, name: item.name, gender: item.gender, letter: item.name.charAt(0), meaning: item.meanings.tr, origin: "Kurdish" })}
                style={{
                  color: isFav ? "var(--female)" : "var(--text-faint)",
                  padding: "0.35rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 150ms",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: "auto",
                  flexShrink: 0
                }}
                className="hover:scale-120 active:scale-90"
                title={isFav ? t("favorites_remove") : t("favorites_add")}
              >
                <Heart size={15} fill={isFav ? "var(--female)" : "none"} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
