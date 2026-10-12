import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { generatePath } from "../utils/routes";
import { NameData } from "../data/names";
import { getLocalizedMeaning } from "../utils/localization";
import { truncateMeaning } from "../utils/nameHelpers";

interface PopularTrendsWidgetProps {
  dbNamesMap?: Map<string, NameData>;
  trendsList?: NameData[];
}

export default function PopularTrendsWidget({ dbNamesMap, trendsList = [] }: PopularTrendsWidgetProps) {
  const { t, i18n } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lng = i18n.language || "tr";

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

      {trendsList.length === 0 ? (
        <div className="trends-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "0.875rem"
        }}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="trend-card animate-pulse"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                padding: "0.875rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                height: "60px"
              }}
            >
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--border)" }} />
              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <div style={{ width: "40%", height: "12px", background: "var(--border)", borderRadius: "4px" }} />
                <div style={{ width: "70%", height: "10px", background: "var(--border)", borderRadius: "4px" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="trends-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "0.875rem"
        }}>
          {trendsList.map((item, idx) => {
            const rank = idx + 1;
            const isFemale = item.gender === "female";
            const dbItem = dbNamesMap?.get(item.id.toLowerCase());
            
            // Dynamically fetch localized meaning from master DB first
            const rawMeaning = dbItem 
              ? getLocalizedMeaning(dbItem, lng) 
              : item.meaning;
              
            // Elegant smart cropping
            const localizedMeaning = truncateMeaning(rawMeaning, 60);
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
                  }} title={rawMeaning}>
                    {localizedMeaning}
                  </p>
                </div>

                {/* Action Heart button */}
                <button
                  onClick={() => {
                    const meaningForFav = dbItem 
                      ? dbItem.meaning 
                      : item.meaning;
                    const originForFav = dbItem?.origin || item.origin;
                    toggleFavorite({ 
                      id: item.id, 
                      name: item.name, 
                      gender: item.gender, 
                      letter: item.name.charAt(0), 
                      meaning: meaningForFav, 
                      origin: originForFav 
                    });
                  }}
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
                  className="hover:scale-125 active:scale-90"
                  title={isFav ? t("favorites_remove") : t("favorites_add")}
                >
                  <Heart size={15} fill={isFav ? "var(--female)" : "none"} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
