import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Home } from "lucide-react";
import { generatePath } from "../utils/routes";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || "tr";

  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <Helmet>
        <title>{t("not_found_title", "404 - Sayfa Bulunamadı")} | KurdishName</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 
          className="page-title" 
          style={{ 
            fontSize: "4rem", 
            borderBottom: "none", 
            marginBottom: "0.5rem",
            color: "var(--text-faint)"
          }}
        >
          404
        </h1>
        <h2 
          style={{ 
            fontSize: "1.25rem", 
            fontWeight: 600, 
            marginBottom: "1.5rem",
            color: "var(--text)"
          }}
        >
          {t("not_found_heading", "Aradığınız sayfa tozlu raflarda kaybolmuş olabilir.")}
        </h2>
        <p 
          style={{ 
            color: "var(--text-muted)", 
            maxWidth: "400px", 
            margin: "0 auto 2rem",
            lineHeight: 1.6
          }}
        >
          {t("not_found_text", "Sayfa taşınmış, silinmiş veya hiç var olmamış olabilir. Ana sayfaya dönerek yeni isimler keşfetmeye devam edebilirsiniz.")}
        </p>

        <Link 
          to={generatePath(lng, null)} 
          className="cmd-search-btn"
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem",
            textDecoration: "none"
          }}
        >
          <Home size={16} />
          {t("back_to_home", "Ana Sayfaya Dön")}
        </Link>
      </motion.div>
    </div>
  );
}
