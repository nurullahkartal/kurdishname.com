import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { featuredNames } from "../data/homeStaticData";
import { getLocalizedMeaning } from "../utils/localization";
import { generatePath } from "../utils/routes";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Volume2, Search, Settings, Eye, FileText, Check } from "lucide-react";

export default function Widget() {
  const { t, i18n } = useTranslation();
  const lng = i18n.language || "tr";

  // Detect iframe environment
  const isEmbed = useMemo(() => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }, []);

  // Parse Query Parameters for configuration (making the widget 100% stateless via iframe URLs)
  const queryParams = useMemo(() => new URLSearchParams(window.location.search), []);

  // 10 Premium Customizable Feature States
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "glass" | "gradient">(
    (queryParams.get("theme") as any) || "glass"
  );
  const [genderFilter, setGenderFilter] = useState<"all" | "female" | "male">(
    (queryParams.get("gender") as any) || "all"
  );
  const [accentColor, setAccentColor] = useState(
    queryParams.get("accent") || "#c5a880"
  );
  const [borderRadius, setBorderRadius] = useState(
    queryParams.has("radius") ? Number(queryParams.get("radius")) : 16
  );
  const [backdropBlur, setBackdropBlur] = useState(
    queryParams.has("blur") ? Number(queryParams.get("blur")) : 12
  );
  const [fontFamily, setFontFamily] = useState<"sans" | "display" | "serif" | "mono">(
    (queryParams.get("font") as any) || "display"
  );
  const [autoRotate, setAutoRotate] = useState(
    queryParams.has("rotate") ? queryParams.get("rotate") === "1" : false
  );
  const [rotateInterval, setRotateInterval] = useState(
    queryParams.has("interval") ? Number(queryParams.get("interval")) : 6
  );
  const [showTTS, setShowTTS] = useState(
    queryParams.has("tts") ? queryParams.get("tts") === "1" : true
  );
  const [customCtaText, setCustomCtaText] = useState(
    queryParams.get("cta") ? decodeURIComponent(queryParams.get("cta") || "") : ""
  );

  // Filter static premium names list dynamically based on gender filter
  const filteredList = useMemo(() => {
    let list = featuredNames;
    if (genderFilter === "female") {
      list = featuredNames.filter((n) => n.gender === "female");
    } else if (genderFilter === "male") {
      list = featuredNames.filter((n) => n.gender === "male");
    }
    return list.length > 0 ? list : featuredNames;
  }, [genderFilter]);

  // Slideshow transition state
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredList.length);
    }, rotateInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, filteredList]);

  // Get current name item based on selected rotate mode
  const today = new Date();
  const dayOfMonth = today.getDate();
  const nameItem = useMemo(() => {
    if (autoRotate) {
      return filteredList[activeIndex % filteredList.length] || featuredNames[0];
    }
    const idx = (dayOfMonth - 1) % filteredList.length;
    return filteredList[idx] || featuredNames[0];
  }, [autoRotate, activeIndex, filteredList, dayOfMonth]);

  const meaning = useMemo(() => {
    return getLocalizedMeaning(nameItem, lng);
  }, [nameItem, lng]);

  const isFemale = nameItem.gender === "female";
  const genderColor = isFemale ? "var(--female)" : "var(--male)";
  const genderText = isFemale ? t("gender_female", "Kız") : t("gender_male", "Erkek");

  // Inside-widget detail drawer state
  const [showDetails, setShowDetails] = useState(false);

  // Localized dictionary for the customizable widget controls
  const dict: Record<string, any> = {
    tr: {
      widgetTitle: "Günün Kürtçe İsmi",
      poweredBy: "KurdishName Güvencesiyle",
      builderTitle: "KurdishName Premium Widget Özelleştirici",
      builderDesc: "Web sitenize her gün otomatik değişen veya slayt halinde akan 'Günün Kürtçe Bebek İsmi' aracını ekleyin. 10 yeni üst düzey premium özellik sayesinde sitenizin tasarımına milimetrik olarak uydurun.",
      copyCode: "Sihirli Embed Kodunu Kopyala",
      copied: "Pano'ya Kopyalandı!",
      preview: "Widget Canlı Önizleme",
      width: "Genişlik (px)",
      height: "Yükseklik (px)",
      themeLabel: "1. Görsel Tema",
      genderLabel: "2. Cinsiyet Filtresi",
      accentLabel: "3. Marka / Vurgu Rengi",
      radiusLabel: "4. Kenar Yuvarlaklığı",
      blurLabel: "5. Arka Plan Cam Efekti",
      fontLabel: "6. Yazı Tipi (Typography)",
      rotateLabel: "7. Otomatik Geçiş (Slayt)",
      rotateIntervalLabel: "Geçiş Süresi (Saniye)",
      ttsLabel: "8. Sesli Telaffuz",
      ctaLabel: "9. Özel Bağlantı Metni",
      ctaPlaceholder: "Örn: Anlamını Keşfet",
      embedCodeLabel: "10. Embed Kodu ve Entegrasyon",
      detailsLabel: "Detayları Gör",
      closeLabel: "Kapat",
      playAudio: "Sesli Telaffuz",
      originLabel: "Köken",
      genderTitle: "Cinsiyet",
      themeLight: "Açık Tema (Sade)",
      themeDark: "Koyu Tema (Modern)",
      themeGlass: "Premium Cam Efekti (Glassmorphism)",
      themeGradient: "Sunset Gradient (Vibrant)",
      genderAll: "Tüm İsimler",
      genderFemale: "Sadece Kız",
      genderMale: "Sadece Erkek",
      fontSans: "Sistem Sans",
      fontDisplay: "Şık Display (Outfit)",
      fontSerif: "Zarif Serif (Georgia)",
      fontMono: "Kod Mono (Consolas)"
    },
    en: {
      widgetTitle: "Kurdish Name of the Day",
      poweredBy: "Powered by KurdishName",
      builderTitle: "KurdishName Premium Widget Builder",
      builderDesc: "Add an auto-updating or sliding 'Kurdish Baby Name of the Day' widget to your blog or website. Fine-tune your design using 10 elite premium features.",
      copyCode: "Copy Embed Code",
      copied: "Copied!",
      preview: "Widget Live Preview",
      width: "Width (px)",
      height: "Height (px)",
      themeLabel: "1. Visual Theme",
      genderLabel: "2. Gender Filter",
      accentLabel: "3. Brand / Accent Color",
      radiusLabel: "4. Border Radius",
      blurLabel: "5. Glassmorphism Blur",
      fontLabel: "6. Typography / Font",
      rotateLabel: "7. Auto-Rotate Slideshow",
      rotateIntervalLabel: "Transition Interval (Seconds)",
      ttsLabel: "8. Audio Pronunciation",
      ctaLabel: "9. Custom CTA Link Text",
      ctaPlaceholder: "e.g., Explore Meaning",
      embedCodeLabel: "10. Embed Code & Integration",
      detailsLabel: "View Details",
      closeLabel: "Close",
      playAudio: "Pronounce",
      originLabel: "Origin",
      genderTitle: "Gender",
      themeLight: "Light Theme",
      themeDark: "Dark Theme",
      themeGlass: "Premium Glassmorphism",
      themeGradient: "Sunset Gradient",
      genderAll: "All Names",
      genderFemale: "Only Girls",
      genderMale: "Only Boys",
      fontSans: "System Sans",
      fontDisplay: "Outfit Display",
      fontSerif: "Classic Serif",
      fontMono: "Code Mono"
    },
    de: {
      widgetTitle: "Kurdischer Name des Tages",
      poweredBy: "Unterstützt von KurdishName",
      builderTitle: "KurdishName Premium Widget-Generator",
      builderDesc: "Fügen Sie ein automatisch aktualisiertes 'Kurdischer Babyname des Tages'-Widget zu Ihrem Blog hinzu. Passen Sie es mit 10 Premium-Optionen perfekt an.",
      copyCode: "Einbettungscode kopieren",
      copied: "Kopiert!",
      preview: "Widget Live-Vorschau",
      width: "Breite (px)",
      height: "Höhe (px)",
      themeLabel: "1. Visuelles Thema",
      genderLabel: "2. Geschlechtsfilter",
      accentLabel: "3. Akzentfarbe",
      radiusLabel: "4. Eckenabrundung",
      blurLabel: "5. Glassmorphismus-Unschärfe",
      fontLabel: "6. Schriftart",
      rotateLabel: "7. Diashow automatisch drehen",
      rotateIntervalLabel: "Wechselintervall (Sekunden)",
      ttsLabel: "8. Audio-Aussprache",
      ctaLabel: "9. Eigener CTA-Text",
      ctaPlaceholder: "z.B. Bedeutung entdecken",
      embedCodeLabel: "10. Einbettungscode",
      detailsLabel: "Details anzeigen",
      closeLabel: "Schließen",
      playAudio: "Aussprechen",
      originLabel: "Herkunft",
      genderTitle: "Geschlecht",
      themeLight: "Helles Thema",
      themeDark: "Dunkles Thema",
      themeGlass: "Premium Glassmorphismus",
      themeGradient: "Sunset Gradient",
      genderAll: "Alle Namen",
      genderFemale: "Nur Mädchen",
      genderMale: "Nur Jungen",
      fontSans: "System Sans",
      fontDisplay: "Outfit Display",
      fontSerif: "Klassisches Serif",
      fontMono: "Code Mono"
    },
    ar: {
      widgetTitle: "الاسم الكردي لليوم",
      poweredBy: "بواسطة KurdishName",
      builderTitle: "أداة KurdishName البرمجية الفاخرة",
      builderDesc: "أضف أداة 'الاسم الكردي لليوم' ذاتية التحديث أو التمرير التلقائي إلى موقعك. قم بتهيئة التصميم بدقة مذهلة عبر 10 ميزات متقدمة.",
      copyCode: "نسخ رمز التضمين السحري",
      copied: "تم النسخ!",
      preview: "معاينة حية للأداة",
      width: "العرض (بكسل)",
      height: "الارتفاع (بكسل)",
      themeLabel: "1. القالب البصري",
      genderLabel: "2. فلتر الجنس",
      accentLabel: "3. لون الهوية والتمييز",
      radiusLabel: "4. استدارة الحواف",
      blurLabel: "5. تأثير الزجاج الضبابي",
      fontLabel: "6. نمط الخط والتايبوغرافي",
      rotateLabel: "7. التمرير التلقائي للأسماء",
      rotateIntervalLabel: "مدة الانتقال (بالثواني)",
      ttsLabel: "8. النطق الصوتي للأسماء",
      ctaLabel: "9. نص زر الإجراء المخصص",
      ctaPlaceholder: "مثال: اكتشف المعنى",
      embedCodeLabel: "10. رمز التضمين السهل والدمج",
      detailsLabel: "عرض التفاصيل",
      closeLabel: "إغلاق",
      playAudio: "استمع للنطق",
      originLabel: "الأصل اللغوي",
      genderTitle: "الجنس",
      themeLight: "قالب فاتح",
      themeDark: "قالب داكن",
      themeGlass: "تأثير زجاجي فاخر",
      themeGradient: "تدرج غروب الشمس",
      genderAll: "كل الأسماء",
      genderFemale: "إناث فقط",
      genderMale: "ذكور فقط",
      fontSans: "خط النظام",
      fontDisplay: "Outfit المميز",
      fontSerif: "كلاسيك شريف",
      fontMono: "كود مونو"
    }
  };

  const activeDict = dict[lng] || dict.tr;

  // Builder configurations
  const [width, setWidth] = useState(330);
  const [height, setHeight] = useState(260);
  const [copied, setCopied] = useState(false);

  // Computed iframe dynamic URL based on state
  const embedUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("theme", themeMode);
    params.set("gender", genderFilter);
    params.set("accent", accentColor);
    params.set("radius", borderRadius.toString());
    params.set("blur", backdropBlur.toString());
    params.set("font", fontFamily);
    params.set("rotate", autoRotate ? "1" : "0");
    params.set("interval", rotateInterval.toString());
    params.set("tts", showTTS ? "1" : "0");
    if (customCtaText.trim()) {
      params.set("cta", encodeURIComponent(customCtaText.trim()));
    }
    return `https://kurdishname.com/${lng}/widget?${params.toString()}`;
  }, [themeMode, genderFilter, accentColor, borderRadius, backdropBlur, fontFamily, autoRotate, rotateInterval, showTTS, customCtaText, lng]);

  const iframeCode = useMemo(() => {
    return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border: none; border-radius: ${borderRadius}px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);" scrolling="no"></iframe>`;
  }, [embedUrl, width, height, borderRadius]);

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // TTS Voice Synthesis
  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Try to find a Turkish, Kurdish or Kurdish-adjacent voice for authentic phonetics
    const voice = voices.find((v) => v.lang.startsWith("tr") || v.lang.startsWith("fa") || v.lang.startsWith("ku")) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Resolve Fonts dynamically
  const fontStyle = useMemo(() => {
    switch (fontFamily) {
      case "sans":
        return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      case "serif":
        return '"Playfair Display", "Georgia", "Times New Roman", serif';
      case "mono":
        return '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';
      default:
        return 'var(--font-display), "Outfit", "Inter", sans-serif';
    }
  }, [fontFamily]);

  // Resolve Themes CSS
  const themeStyle = useMemo(() => {
    switch (themeMode) {
      case "light":
        return {
          background: "#ffffff",
          color: "#1e293b",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
          textMuted: "#64748b",
        };
      case "dark":
        return {
          background: "#0f172a",
          color: "#f8fafc",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
          textMuted: "#94a3b8",
        };
      case "gradient":
        return {
          background: "linear-gradient(135deg, #110c26 0%, #291242 50%, #4a0f35 100%)",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 12px 35px rgba(41, 18, 66, 0.4)",
          textMuted: "rgba(255,255,255,0.7)",
        };
      default: // Glassmorphism
        return {
          background: "rgba(255, 255, 255, 0.62)",
          color: "var(--text)",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
          textMuted: "var(--text-muted)",
          backdropFilter: `blur(${backdropBlur}px)`,
          WebkitBackdropFilter: `blur(${backdropBlur}px)`,
        };
    }
  }, [themeMode, backdropBlur]);

  // ──── WIDGET CORE COMPONENT (Unified for preview & embed) ────
  const renderWidgetBody = () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.25rem",
        boxSizing: "border-box",
        borderRadius: `${borderRadius}px`,
        fontFamily: fontStyle,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        ...themeStyle,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: themeStyle.textMuted,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
          <Sparkles size={12} style={{ color: accentColor }} />
          {activeDict.widgetTitle}
        </span>
        {showTTS && (
          <button
            onClick={() => handleSpeak(nameItem.name)}
            title={activeDict.playAudio}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              padding: "0.2rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
              transition: "transform 0.15s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Volume2 size={14} />
          </button>
        )}
      </div>

      <div style={{ margin: "0.75rem 0", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={nameItem.name}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
          >
            <a
              href={`https://kurdishname.com${generatePath(lng, "name", nameItem.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "1.95rem",
                fontWeight: 900,
                color: accentColor || genderColor,
                textDecoration: "none",
                display: "block",
                letterSpacing: "-0.01em",
                transition: "filter 0.15s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseOut={(e) => (e.currentTarget.style.filter = "none")}
            >
              {nameItem.name}
            </a>
            <span
              style={{
                fontSize: "0.72rem",
                background: isFemale ? "var(--female-dim)" : "var(--male-dim)",
                color: genderColor,
                padding: "0.15rem 0.5rem",
                borderRadius: "99px",
                fontWeight: 800,
                marginTop: "0.35rem",
                display: "inline-block",
                letterSpacing: "0.02em",
              }}
            >
              {genderText}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <p
        style={{
          fontSize: "0.85rem",
          color: themeStyle.color,
          margin: "0 0 0.85rem 0",
          lineHeight: 1.5,
          opacity: 0.9,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {meaning}
      </p>

      <div
        style={{
          borderTop: `1px solid ${themeMode === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
          paddingTop: "0.625rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setShowDetails(true)}
          style={{
            fontSize: "0.75rem",
            color: accentColor,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            padding: 0,
            transition: "opacity 0.15s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem"
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Search size={12} /> {activeDict.detailsLabel}
        </button>

        <a
          href={`https://kurdishname.com/${lng}`}
          target="_blank"
          rel="noopener follow"
          style={{
            fontSize: "0.72rem",
            color: themeStyle.textMuted,
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
        >
          {customCtaText.trim() ? customCtaText.trim() : activeDict.poweredBy}
        </a>
      </div>

      {/* Slide-Up Drawer for premium Inside-Widget Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              background: themeMode === "light" ? "#ffffff" : "#0f172a",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: 20,
              borderRadius: `${borderRadius}px`,
              border: themeStyle.border,
              boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.35rem", fontWeight: 900, color: accentColor }}>{nameItem.name}</span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    background: "var(--border)",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "4px",
                    fontWeight: 700,
                  }}
                >
                  {nameItem.origin || "Kürtçe"}
                </span>
              </div>
              <div style={{ fontSize: "0.8rem", color: themeStyle.textMuted, marginBottom: "0.5rem" }}>
                <strong>{activeDict.genderTitle}:</strong> {genderText}
              </div>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.5, margin: 0, color: themeStyle.color, opacity: 0.95 }}>
                {meaning}
              </p>
            </div>

            <button
              onClick={() => setShowDetails(false)}
              style={{
                width: "100%",
                padding: "0.5rem",
                background: accentColor,
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                transition: "opacity 0.15s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {activeDict.closeLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ──── 1. EMBED ONLY VIEW (Rendered inside the Blog's iframe) ────
  if (isEmbed) {
    return (
      <div style={{ width: "100vw", height: "100vh", padding: 0, margin: 0, overflow: "hidden" }}>
        <Helmet>
          <title>{activeDict.widgetTitle}</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        {renderWidgetBody()}
      </div>
    );
  }

  // ──── 2. WIDGET CUSTOMIZER / BUILDER VIEW (Main interactive panel) ────
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 0" }}>
      <Helmet>
        <title>{activeDict.builderTitle} | KurdishName</title>
        <meta name="description" content={activeDict.builderDesc} />
        <link rel="canonical" href={`https://kurdishname.com${generatePath(lng, 'widget')}`} />
        {["tr", "en", "de", "ar"].map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`https://kurdishname.com${generatePath(lang, 'widget')}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://kurdishname.com${generatePath('en', 'widget')}`}
        />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {activeDict.builderTitle}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          {activeDict.builderDesc}
        </p>
      </motion.div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Left Column: Interactive 10 Features Controller */}
        <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Card: 10 Features Panel */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-md)",
              padding: "1.75rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: 0, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings size={18} /> 10 Premium Ayar Paneli
            </h2>

            {/* Feature 1: Theme selection */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>{activeDict.themeLabel}</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {[
                  { id: "glass", label: activeDict.themeGlass },
                  { id: "light", label: activeDict.themeLight },
                  { id: "dark", label: activeDict.themeDark },
                  { id: "gradient", label: activeDict.themeGradient },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setThemeMode(item.id as any)}
                    style={{
                      padding: "0.55rem",
                      borderRadius: "var(--r-sm)",
                      border: themeMode === item.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                      background: themeMode === item.id ? "var(--bg-card-dim)" : "var(--bg)",
                      color: themeMode === item.id ? "var(--accent)" : "var(--text)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature 2: Gender filter selection */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>{activeDict.genderLabel}</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[
                  { id: "all", label: activeDict.genderAll },
                  { id: "female", label: activeDict.genderFemale },
                  { id: "male", label: activeDict.genderMale },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setGenderFilter(item.id as any);
                      setActiveIndex(0);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "var(--r-sm)",
                      border: genderFilter === item.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                      background: genderFilter === item.id ? "var(--bg-card-dim)" : "var(--bg)",
                      color: genderFilter === item.id ? "var(--accent)" : "var(--text)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature 3: Custom Accent color with pickers */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>{activeDict.accentLabel}</label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{
                    width: "48px",
                    height: "36px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                  }}
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontSize: "0.82rem",
                    fontFamily: "monospace",
                  }}
                />
                {/* Predefined curated colors */}
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {["#c5a880", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccentColor(c)}
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: c,
                        border: "none",
                        cursor: "pointer",
                        outline: accentColor === c ? "2px solid var(--text)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 4: Border Radius slider */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                <span>{activeDict.radiusLabel}</span>
                <span style={{ fontFamily: "monospace" }}>{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>

            {/* Feature 5: Glassmorphism Blur slider */}
            {themeMode === "glass" && (
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                  <span>{activeDict.blurLabel}</span>
                  <span style={{ fontFamily: "monospace" }}>{backdropBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={backdropBlur}
                  onChange={(e) => setBackdropBlur(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent)" }}
                />
              </div>
            )}

            {/* Feature 6: Typography Font family */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>{activeDict.fontLabel}</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  outline: "none",
                }}
              >
                <option value="display">{activeDict.fontDisplay}</option>
                <option value="sans">{activeDict.fontSans}</option>
                <option value="serif">{activeDict.fontSerif}</option>
                <option value="mono">{activeDict.fontMono}</option>
              </select>
            </div>

            {/* Feature 7: Auto-Rotate Slideshow toggler & slider */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 700 }}>{activeDict.rotateLabel}</label>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  style={{
                    width: "38px",
                    height: "20px",
                    accentColor: "var(--accent)",
                    cursor: "pointer",
                  }}
                />
              </div>
              {autoRotate && (
                <div style={{ marginTop: "0.5rem", padding: "0.75rem", background: "var(--bg)", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    <span>{activeDict.rotateIntervalLabel}</span>
                    <span style={{ fontFamily: "monospace" }}>{rotateInterval}s</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    value={rotateInterval}
                    onChange={(e) => setRotateInterval(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent)" }}
                  />
                </div>
              )}
            </div>

            {/* Feature 8: TTS Audio toggler */}
            <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700 }}>{activeDict.ttsLabel}</label>
              <input
                type="checkbox"
                checked={showTTS}
                onChange={(e) => setShowTTS(e.target.checked)}
                style={{
                  width: "38px",
                  height: "20px",
                  accentColor: "var(--accent)",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Feature 9: Custom CTA Button Text */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.35rem" }}>{activeDict.ctaLabel}</label>
              <input
                type="text"
                placeholder={activeDict.ctaPlaceholder}
                value={customCtaText}
                onChange={(e) => setCustomCtaText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "0.82rem",
                }}
              />
            </div>

            {/* Feature 10: Width & Height adjustment */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>{activeDict.width}</label>
                <input
                  type="number"
                  min="260"
                  max="600"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.45rem",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontSize: "0.82rem",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>{activeDict.height}</label>
                <input
                  type="number"
                  min="200"
                  max="500"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "0.45rem",
                    borderRadius: "var(--r-sm)",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontSize: "0.82rem",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview & Code copy section */}
        <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "1.5rem" }}>
          {/* Live Preview Container */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, alignSelf: "flex-start", marginTop: 0, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Eye size={18} /> {activeDict.preview}
            </h2>

            {/* Simulated Desktop / Blog container wrapper */}
            <div
              style={{
                width: "100%",
                padding: "2rem",
                background: "var(--bg-grid-pattern, rgba(0,0,0,0.03))",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "inset 0 4px 20px rgba(0,0,0,0.02)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Dynamic live rendered preview box representing iframe bounding box */}
              <div style={{ width: `${width}px`, height: `${height}px`, transition: "all 0.2s ease" }}>
                {renderWidgetBody()}
              </div>
            </div>
          </div>

          {/* Embed code segment */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-md)",
              padding: "1.5rem",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginTop: 0, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FileText size={16} /> {activeDict.embedCodeLabel}
            </h3>
            <textarea
              readOnly
              value={iframeCode}
              onClick={(e) => e.currentTarget.select()}
              style={{
                width: "100%",
                height: "105px",
                fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
                fontSize: "0.75rem",
                padding: "0.625rem",
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--border)",
                background: "var(--bg-card-dim)",
                color: "var(--text-muted)",
                resize: "none",
                marginBottom: "1rem",
                lineHeight: 1.4,
                outline: "none",
              }}
            />

            <button
              onClick={handleCopy}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.88rem",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              {copied ? <Check size={16} /> : <FileText size={16} />}
              <span>{copied ? activeDict.copied : activeDict.copyCode}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
