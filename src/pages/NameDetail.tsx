import { useParams, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { Heart, Download, Sparkles } from "lucide-react";
import { NameData } from "../data/names";
import { getGenderPath } from "../utils/nameHelpers";
import { generatePath } from "../utils/routes";
import { getLocalizedMeaning, getLocalizedOrigin } from "../utils/localization";
import { generateDynamicFaqs } from "../utils/faqGenerator";
import { loadNamesForLetter, getLettersForId } from "../utils/nameLoader";
import { isLetterActive } from "../data/config";
import React, { lazy, Suspense } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { getWikidataSameAs } from "../utils/wikidata";


// ── Fonetik okunuş üreteci ────────────────────────────────────────────────────
function generatePronunciation(name: string): string {
  const rules: [RegExp, string][] = [
    [/ê/gi,  "ay"],
    [/î/gi,  "ee"],
    [/û/gi,  "oo"],
    [/ş/gi,  "sh"],
    [/ç/gi,  "ch"],
    [/x/gi,  "kh"],
    [/q/gi,  "q"],
    [/w/gi,  "w"],
    [/v/gi,  "v"],
    [/j/gi,  "zh"],
    [/z/gi,  "z"],
    [/r/gi,  "r"],
    // sesli uzatma: tek 'a' -> 'aa' (sözcük başında veya ortasında)
    [/\ba/g, "aa"],
    [/a(?=[^aeiouêîûAEIOUÊÎÛ])/g, "aa"],
    [/e/gi,  "eh"],
    [/i/gi,  "ih"],
    [/u/gi,  "u"],
    [/o/gi,  "o"],
    [/y/gi,  "y"],
  ];

  // Heceye böl ve her hece için kural uygula
  let phonetic = name;
  // Özel çift harf kuralları (sıraya dikkat!)
  phonetic = phonetic
    .replace(/[Ê]/g, "Ay").replace(/[ê]/g, "ay")
    .replace(/[Î]/g, "Ee").replace(/[î]/g, "ee")
    .replace(/[Û]/g, "Oo").replace(/[û]/g, "oo")
    .replace(/[Ş]/g, "Sh").replace(/[ş]/g, "sh")
    .replace(/[Ç]/g, "Ch").replace(/[ç]/g, "ch")
    .replace(/[X]/g, "Kh").replace(/[x]/g, "kh")
    .replace(/[Q]/g, "Q").replace(/[q]/g, "q")
    .replace(/[J]/g, "Zh").replace(/[j]/g, "zh")
    .replace(/[W]/g, "W").replace(/[w]/g, "w");

  // Büyük harf koru, heceleri tire ile böl (heuristik: sesli harf + sessiz + sesli)
  const syllables: string[] = [];
  let curr = "";
  const vowels = new Set(["a","e","i","o","u","A","E","I","O","U"]);
  for (let ci = 0; ci < phonetic.length; ci++) {
    curr += phonetic[ci];
    // Eğer bir sonraki harf varsa ve bu bir sessiz + sesli geçişi ise hecele
    const next = phonetic[ci + 1];
    const afterNext = phonetic[ci + 2];
    if (
      next &&
      afterNext &&
      !vowels.has(phonetic[ci]) &&
      vowels.has(next) &&
      curr.length > 1
    ) {
      syllables.push(curr);
      curr = "";
    }
  }
  if (curr) syllables.push(curr);

  // Basit heuristik başarısız olursa orijinal phonetic'i kullan
  const result = syllables.length > 1 ? syllables.join("-") : phonetic;
  return `[${result}]`;
}

// ── Lehçe / köken badge sistemi ───────────────────────────────────────────────
type DialectInfo = { label: Record<string,string>; color: string; bg: string; border: string };

function detectDialect(origin: string | undefined): DialectInfo | null {
  if (!origin) return null;
  const o = origin.toLowerCase();

  if (o.includes("kurmanci") || o.includes("kurmanc") || o.includes("kurmanji")) {
    return {
      label: { tr: "Kurmancî", en: "Kurmanji", de: "Kurmandschi", ar: "الكرمانجية" },
      color: "#15803d", bg: "#f0fdf4", border: "#86efac"
    };
  }
  if (o.includes("sorani") || o.includes("soranî") || o.includes("sorans")) {
    return {
      label: { tr: "Soranî", en: "Sorani", de: "Soranisch", ar: "السورانية" },
      color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd"
    };
  }
  if (o.includes("zazaki") || o.includes("zaza") || o.includes("dimli")) {
    return {
      label: { tr: "Zazaki", en: "Zazaki", de: "Zazaisch", ar: "الزازائية" },
      color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd"
    };
  }
  if (o.includes("gorani") || o.includes("goranî") || o.includes("hawrami")) {
    return {
      label: { tr: "Goranî", en: "Gorani", de: "Goranisch", ar: "الغورانية" },
      color: "#c2410c", bg: "#fff7ed", border: "#fdba74"
    };
  }
  return null;
}





export default function NameDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lng = i18n.language || "tr";

  const [nameItem, setNameItem] = useState<NameData | null>(null);
  const [alikeNames, setAlikeNames] = useState<NameData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wikidataSameAs, setWikidataSameAs] = useState<string[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      setIsLoading(true);
      try {
        const letters = getLettersForId(id);
        const chunkPromises = letters.map(l => loadNamesForLetter(l));
        const chunks = await Promise.all(chunkPromises);
        const loadedNames = chunks.flat();
        
        // Combine with localStorage names
        const localNamesStr = localStorage.getItem('addedNames');
        const localNames: NameData[] = localNamesStr ? JSON.parse(localNamesStr) : [];
        const combined = [...loadedNames, ...localNames];
        
        const uniqueMap = new Map();
        combined.forEach(item => uniqueMap.set(item.id, item));
        const allLoaded = Array.from(uniqueMap.values()) as NameData[];
        
        const safeId = id?.trim().toLowerCase();
        const found = allLoaded.find(n => n.id.toLowerCase() === safeId);
        if (active) {
          setNameItem(found || null);
          if (found) {
            // Find alike names
            const alike = allLoaded
              .filter((n) => n.gender === found.gender && n.id.toLowerCase() !== safeId)
              .map((n) => {
                let score = 0;
                if (n.letter === found.letter) score += 10;
                if (n.origin === found.origin) score += 20;
                if (n.tags && found.tags) {
                  const shared = n.tags.filter(tag => found.tags?.includes(tag));
                  score += shared.length * 5;
                }
                return { ...n, score };
              })
              .sort((a, b) => b.score - a.score || Math.random() - 0.5)
              .slice(0, 8);
            setAlikeNames(alike);
          }
        }
      } catch (err) {
        console.error("Failed to load name detail inside NameDetail.tsx", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => { active = false; };
  }, [id]);


  // Hoist meaning generation up so it can be used in the story hook
  const translatedOrigin = getLocalizedOrigin(nameItem?.origin || "", t);
  const meaning = nameItem ? getLocalizedMeaning(nameItem, lng) : "";

  useEffect(() => {
    if (!nameItem) return;
    let active = true;
    async function fetchWikidata() {
      try {
        const links = await getWikidataSameAs(nameItem.name, meaning, translatedOrigin, lng);
        if (active) {
          setWikidataSameAs(links);
        }
      } catch (err) {
        console.warn("Wikidata fetch failed", err);
      }
    }
    fetchWikidata();
    return () => { active = false; };
  }, [nameItem, meaning, translatedOrigin, lng]);

  const genderTextForFaq = useMemo(() => {
    if (!nameItem) return "";
    const isFemale = nameItem.gender === "female";
    return isFemale ? t("gender_female") : t("gender_male");
  }, [nameItem, t]);

  // ── Dinamik FAQ Jeneratörü (faqGenerator.ts) ─────────────────────────────
  const faqs = useMemo(() => {
    if (!nameItem) return [];
    return generateDynamicFaqs(
      nameItem,
      lng,
      meaning,
      translatedOrigin || "Kürtçe",
      genderTextForFaq,
    );
  }, [nameItem, lng, meaning, translatedOrigin, genderTextForFaq]);



  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
          {t("loading", "Yükleniyor...")}
        </p>
      </div>
    );
  }

  if (!nameItem) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", color: "var(--accent)", margin: "0" }}>404</h1>
        <h2 className="page-title" style={{ marginTop: "0.5rem" }}>{t("not_found", "İsim Bulunamadı")}</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "400px", marginTop: "1rem", lineHeight: 1.6 }}>
          {t("name_not_found_desc", "Aradığınız isim veritabanımızda bulunmuyor veya link hatalı yazılmış olabilir.")}
        </p>
        <div style={{ marginTop: "2rem" }}>
          <Link 
            to={generatePath(lng, null)} 
            style={{ padding: "0.75rem 1.5rem", background: "var(--accent)", color: "white", borderRadius: "var(--r-md)", textDecoration: "none", fontWeight: 600 }}
          >
            {t("back_to_home", "Ana Sayfaya Dön")}
          </Link>
        </div>
      </div>
    );
  }

  const isFemale = nameItem.gender === "female";
  const genderColor = isFemale ? "var(--female)" : "var(--male)";
  const genderText = isFemale ? t("gender_female") : t("gender_male");
  const isActive = isLetterActive(nameItem.letter || nameItem.name.charAt(0));

  const origin = translatedOrigin;

  const buildMetaDescription = (lang: string, name?: string, genderText?: string, origin?: string, meaning?: string): string => {
    const safeName = name || "";
    const safeGenderText = genderText || "";
    const safeOrigin = origin || "";
    const safeMeaning = meaning || "";
    const maxLength = 155;
    if (lang === "tr") {
      const limit = maxLength - (67 + safeName.length * 2 + safeOrigin.length);
      const cleanMeaning = safeMeaning.length > limit ? safeMeaning.slice(0, limit - 3) + "..." : safeMeaning;
      return `${safeName} Kürtçe ne demek? ${safeGenderText} ismi olan ${safeName} isminin kökeni ${safeOrigin} olup anlamı şudur: ${cleanMeaning}`;
    } else if (lang === "en") {
      const limit = maxLength - (48 + safeName.length * 2 + safeGenderText.length + safeOrigin.length);
      const cleanMeaning = safeMeaning.length > limit ? safeMeaning.slice(0, limit - 3) + "..." : safeMeaning;
      return `What does ${safeName} mean? Kurdish ${safeGenderText} name ${safeName} (origin: ${safeOrigin}) means: ${cleanMeaning}`;
    } else if (lang === "de") {
      const limit = maxLength - (55 + safeName.length * 2 + safeGenderText.length + safeOrigin.length);
      const cleanMeaning = safeMeaning.length > limit ? safeMeaning.slice(0, limit - 3) + "..." : safeMeaning;
      return `Bedeutung von ${safeName}: Der kurdische ${safeGenderText}name ${safeName} (Herkunft: ${safeOrigin}) bedeutet: ${cleanMeaning}`;
    } else if (lang === "ar") {
      const limit = maxLength - (35 + safeName.length + safeGenderText.length + safeOrigin.length);
      const cleanMeaning = safeMeaning.length > limit ? safeMeaning.slice(0, limit - 3) + "..." : safeMeaning;
      return `معنى اسم ${safeName}: اسم ${safeGenderText} كردي من أصل ${safeOrigin} يعني: ${cleanMeaning}`;
    } else {
      const limit = maxLength - (20 + safeName.length);
      const cleanMeaning = safeMeaning.length > limit ? safeMeaning.slice(0, limit - 3) + "..." : safeMeaning;
      return `${safeName} meaning: ${cleanMeaning}`;
    }
  };

  if (!nameItem) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg)' }}></div>; 
  }

  const description = buildMetaDescription(lng, nameItem?.name, genderText, origin, nameItem?.meaning);

  const dialectInfo = detectDialect(nameItem.origin);
  const pronunciationStr = generatePronunciation(nameItem.name);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["DefinedTerm", "Thing"],
        "name": nameItem.name,
        "alternateName": pronunciationStr,
        "description": description,
        "inLanguage": "ku",
        "termCode": nameItem.id.toString(),
        "url": `https://kurdishname.com${generatePath(lng, "name", nameItem.id)}`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://kurdishname.com${generatePath(lng, "name", nameItem.id)}`,
          "name": `${nameItem.name} - Kurdish Name Meaning & Origin`,
          "description": description,
          "inLanguage": lng,
          "isPartOf": { "@type": "WebSite", "name": "KurdishName", "url": "https://kurdishname.com" }
        },
        "inDefinedTermSet": {
          "@type": "DefinedTermSet",
          "name": "KurdishName Dictionary",
          "description": "Comprehensive dictionary of Kurdish personal names with etymology, gender, and dialect information.",
          "url": "https://kurdishname.com",
          "inLanguage": "ku"
        },
        "additionalProperty": [
          { "@type": "PropertyValue", "name": "gender", "value": nameItem.gender },
          { "@type": "PropertyValue", "name": "origin", "value": nameItem.origin || "Kurdish" },
          { "@type": "PropertyValue", "name": "pronunciation", "value": pronunciationStr },
          ...(dialectInfo ? [{ "@type": "PropertyValue", "name": "dialect", "value": dialectInfo.label["en"] }] : []),
          ...(nameItem.tags ? [{ "@type": "PropertyValue", "name": "themes", "value": nameItem.tags.join(", ") }] : [])
        ],
        ...(wikidataSameAs.length > 0 ? { "sameAs": wikidataSameAs } : {})
      }
    ]
  };



  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownloadCard = () => {
    if (typeof window === "undefined" || !nameItem) return;

    const runDrawing = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background Gradient based on Gender
      const isFemale = nameItem.gender === "female";
      const grad = ctx.createLinearGradient(0, 0, 0, 1080);
      
      if (isFemale) {
        grad.addColorStop(0, "#FFF3F5");
        grad.addColorStop(1, "#FFFFFF");
      } else {
        grad.addColorStop(0, "#F0F5FF");
        grad.addColorStop(1, "#FFFFFF");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Decorative soft background circles for texture
      ctx.fillStyle = isFemale ? "rgba(225, 29, 72, 0.025)" : "rgba(37, 99, 235, 0.025)";
      ctx.beginPath();
      ctx.arc(1080, 0, 420, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 1080, 320, 0, Math.PI * 2);
      ctx.fill();

      // Elegant inner border/frame with rounded corners
      ctx.strokeStyle = isFemale ? "rgba(225, 29, 72, 0.08)" : "rgba(37, 99, 235, 0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const pad = 50;
      const r = 24;
      ctx.roundRect(pad, pad, 1080 - pad * 2, 1080 - pad * 2, r);
      ctx.stroke();

      // Top Brand Tagline
      ctx.font = "italic 300 24px Georgia, serif";
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.textAlign = "center";
      ctx.fillText("KÜRTÇE İSİMLER SÖZLÜĞÜ", 1080 / 2, 135);

      // Main Large Name (Serif & Bold)
      ctx.font = "700 110px Georgia, serif";
      ctx.fillStyle = isFemale ? "#BE123C" : "#1D4ED8";
      ctx.fillText(nameItem.name, 1080 / 2, 295);

      // Proud Descriptive Subtitle
      ctx.font = "500 28px sans-serif";
      ctx.fillStyle = "#4B5563";
      
      // Get composite label ("Kız Kürtçe İsmi")
      const originLabel = origin;
      let compositeLabel = "";
      if (lng === "tr") {
        compositeLabel = `${genderText} ${originLabel} İsmi`;
      } else if (lng === "en") {
        compositeLabel = `${originLabel} ${genderText} Name`;
      } else if (lng === "de") {
        compositeLabel = `${originLabel} ${genderText}name`;
      } else {
        compositeLabel = `${genderText} · ${originLabel}`;
      }

      ctx.fillText(compositeLabel, 1080 / 2, 375);

      // Elegant line separator
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(1080 / 2 - 160, 425);
      ctx.lineTo(1080 / 2 + 160, 425);
      ctx.stroke();

      // The Name Meaning (Wrapped gracefully into multiple lines)
      ctx.font = "italic 400 40px Georgia, serif";
      ctx.fillStyle = "#1F2937";
      
      const meaningQuotes = `“ ${meaning} ”`;
      const wrapWidth = 820;
      const wrapLineHeight = 65;
      const wrapStartY = 515;
      
      const words = meaningQuotes.split(" ");
      let line = "";
      let currentY = wrapStartY;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > wrapWidth && n > 0) {
          ctx.fillText(line.trim(), 1080 / 2, currentY);
          line = words[n] + " ";
          currentY += wrapLineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 1080 / 2, currentY);

      // Load and render the real site logo.webp at the bottom!
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      
      logoImg.onload = () => {
        const logoX = 1080 / 2 - 180;
        const logoY = 880;
        const logoW = 60;
        const logoH = 60;
        const logoR = 12;

        // Draw the rounded image container
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoW, logoH, logoR);
        ctx.clip();
        ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
        ctx.restore();

        // Brand Text "KurdishName" next to the real logo
        ctx.font = "600 36px sans-serif";
        ctx.fillStyle = "#1F2937";
        ctx.textAlign = "left";
        ctx.fillText("KurdishName", logoX + logoW + 20, logoY + 34);
        
        // Domain URL
        ctx.font = "400 22px sans-serif";
        ctx.fillStyle = "#9CA3AF";
        ctx.fillText("kurdishname.com", logoX + logoW + 20, logoY + 58);

        // Trigger download
        const downloadLink = document.createElement("a");
        downloadLink.download = `kurdishname-${nameItem.name.toLowerCase()}.png`;
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.click();
      };

      logoImg.onerror = () => {
        // Fallback in case image fails to load (offline or local server path issues)
        const logoX = 1080 / 2 - 180;
        const logoY = 880;
        const logoW = 60;
        const logoH = 60;
        const logoR = 12;
        
        // Draw an exquisite brand-colored gradient block instead of a flat gray box
        const brandGrad = ctx.createLinearGradient(logoX, logoY, logoX, logoY + logoH);
        brandGrad.addColorStop(0, "#4F46E5");
        brandGrad.addColorStop(1, "#3730A3");
        ctx.fillStyle = brandGrad;
        
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoW, logoH, logoR);
        ctx.fill();
        
        // Gold/Yellow brand initials
        ctx.font = "bold 26px sans-serif";
        ctx.fillStyle = "#FBBF24";
        ctx.textAlign = "center";
        ctx.fillText("KN", logoX + logoW / 2, logoY + logoH / 2 + 9);
        
        ctx.font = "600 36px sans-serif";
        ctx.fillStyle = "#1F2937";
        ctx.textAlign = "left";
        ctx.fillText("KurdishName", logoX + logoW + 20, logoY + 34);
        
        ctx.font = "400 22px sans-serif";
        ctx.fillStyle = "#9CA3AF";
        ctx.fillText("kurdishname.com", logoX + logoW + 20, logoY + 58);

        const downloadLink = document.createElement("a");
        downloadLink.download = `kurdishname-${nameItem.name.toLowerCase()}.png`;
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.click();
      };

      logoImg.src = "/logo.webp";
    };

    if (document.fonts && typeof document.fonts.ready !== "undefined") {
      document.fonts.ready.then(runDrawing).catch((err) => {
        console.warn("Font loading promise failed, drawing with system fonts", err);
        runDrawing();
      });
    } else {
      runDrawing();
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("seo_name_title", { name: nameItem.name })} | KurdishName</title>
        <meta name="description" content={description} />
        {isActive ? (
          <meta name="robots" content="index, follow" />
        ) : (
          <meta name="robots" content="noindex, follow" />
        )}
        <meta property="og:title" content={`${t("seo_name_title", { name: nameItem.name })} | KurdishName`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:title" content={`${t("seo_name_title", { name: nameItem.name })} | KurdishName`} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "name": "KurdishName",
                "url": "https://kurdishname.com",
                "description": "Dünyanın en kapsamlı 4 dilli Kürtçe isim rehberi.",
                "inLanguage": ["tr", "en", "de", "ar"]
              },
              {
                "@type": "Organization",
                "name": "KurdishName Database",
                "url": "https://kurdishname.com",
                "logo": "https://kurdishname.com/logo.png"
              },
              (function() {
                const s = { ...schemaData };
                delete s['@context'];
                return s['@graph'][0];
              })(),
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "KurdishName",
                    "item": `https://kurdishname.com/${lng}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": genderText,
                    "item": `https://kurdishname.com${getGenderPath(nameItem.gender) ? generatePath(lng, "category", getGenderPath(nameItem.gender)) : generatePath(lng, null)}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": nameItem.name,
                    "item": `https://kurdishname.com${generatePath(lng, "name", nameItem.id)}`
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Breadcrumb */}
      <nav style={{ fontSize: "0.75rem", color: "var(--text-faint)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
        <Link to={generatePath(lng, null)} style={{ color: "var(--accent)" }}>KurdishName</Link>
        <span>›</span>
        {getGenderPath(nameItem.gender) ? (
          <Link to={generatePath(lng, "category", getGenderPath(nameItem.gender))} style={{ color: "var(--accent)" }}>
            {isFemale ? t("nav_girls") : t("nav_boys")}
          </Link>
        ) : (
          <span style={{ color: "var(--text-muted)" }}>
            {isFemale ? t("nav_girls") : t("nav_boys")}
          </span>
        )}
        <span>›</span>
        <span style={{ color: genderColor, fontWeight: 700 }}>{nameItem.name} {t("name_breadcrumb_suffix")}</span>
      </nav>

      {/* Hero Section — kompakt, balonsuz */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          background: `linear-gradient(135deg, ${genderColor}06, ${genderColor}12)`,
          borderRadius: "var(--r-xl)",
          padding: "1.5rem 1rem",
          marginBottom: "2rem",
          textAlign: "center",
          border: `1px solid ${genderColor}22`,
        }}
      >
        {/* İsim başlığı — Tek H1, SEO dostu tam başlık */}
        <h1 style={{
          fontSize: "clamp(2rem, 7vw, 3.5rem)",
          fontWeight: 900,
          color: genderColor,
          marginBottom: "0.25rem",
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          fontFamily: "var(--font-display)"
        }}>
          {lng === "tr"
            ? `${nameItem.name} İsminin Anlamı, Kökeni ve Analizi`
            : lng === "en"
            ? `${nameItem.name} – Kurdish Name Meaning, Origin & Analysis`
            : lng === "de"
            ? `${nameItem.name} – Kurdischer Name: Bedeutung, Herkunft & Analyse`
            : `${nameItem.name} – معنى الاسم الكردي وأصله وتحليله`}
        </h1>

        {/* Fonetik okunuş — serif italik */}
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontSize: "0.9rem",
          color: "var(--text-faint)",
          marginBottom: "0.875rem",
          letterSpacing: "0.01em"
        }}>
          {lng === "tr" ? "Telaffuz:" : lng === "de" ? "Aussprache:" : lng === "ar" ? "النطق:" : "Pronunciation:"}{" "}
          <span style={{ color: genderColor, fontWeight: 600 }}>{pronunciationStr}</span>
        </p>

        {/* Badge satırı: cinsiyet + köken + lehçe */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          flexWrap: "wrap"
        }}>
          {/* Cinsiyet badge */}
          <span
            className={isFemale ? "badge-female" : "badge-male"}
            style={{
              padding: "0.3rem 0.875rem",
              borderRadius: "100px",
              background: `${genderColor}18`,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.02em"
            }}
          >
            {genderText}
          </span>

          {/* Köken badge */}
          <span style={{
            padding: "0.3rem 0.875rem",
            borderRadius: "100px",
            background: "var(--surface-2)",
            color: "var(--text-muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
            border: "1px solid var(--border-dim)"
          }}>
            {origin}
          </span>

          {/* Lehçe badge — varsa */}
          {dialectInfo && (
            <span style={{
              padding: "0.3rem 0.875rem",
              borderRadius: "100px",
              background: dialectInfo.color,
              color: "#fff",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.01em",
              boxShadow: `0 1px 6px ${dialectInfo.color}50`
            }}>
              {dialectInfo.label[lng as keyof typeof dialectInfo.label] || dialectInfo.label.en}
            </span>
          )}
        </div>
      </motion.section>

      <div className="name-detail-grid">
        
        {/* Main Content Area */}
        <div className="name-detail-main">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "var(--surface)",
              padding: "1.5rem",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--border)",
              boxShadow: "0 6px 20px -8px rgba(0,0,0,0.06)"
            }}
          >
            {/* H2: Ana anlam bölümü */}
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              color: "var(--text)"
            }}>
              <Sparkles size={24} style={{ color: "var(--accent)" }} />
              {t("detail_meaning_rich", { name: nameItem.name, defaultValue: `${nameItem.name} Kürtçe İsminin Anlamı` })}
            </h2>
            
            <p style={{
              fontSize: "1.25rem",
              lineHeight: 1.7,
              color: "var(--text)",
              marginBottom: "2rem",
              fontWeight: 500
            }}>
              {meaning}
            </p>

            <div style={{
              padding: "1.5rem",
              background: "var(--bg)",
              borderRadius: "var(--r-md)",
              borderLeft: `4px solid ${genderColor}`
            }}>
              <p style={{
                fontSize: "0.9375rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                margin: 0
              }}>
                {description}
              </p>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button
                onClick={handleDownloadCard}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "var(--text)",
                  color: "var(--surface)",
                  borderRadius: "var(--r-md)",
                  fontWeight: 600,
                  fontSize: "0.875rem"
                }}
                className="hover:opacity-90 transition-opacity"
              >
                <Download size={18} />
                {t("download_card", "İsim Kartını İndir")}
              </button>
              
              <button
                onClick={handleShare}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--surface-2)",
                  color: "var(--text)",
                  borderRadius: "var(--r-md)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  border: "1px solid var(--border)"
                }}
                className="hover:bg-var(--surface-3) transition-colors"
              >
                {t("share", "Paylaş")}
              </button>
            </div>
          </motion.section>



          {/* Quick Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            <div style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: "0.5rem", fontWeight: 700 }}>{t("detail_gender")}</h4>
              <p style={{ fontWeight: 700, color: genderColor }}>{genderText}</p>
            </div>
            <div style={{ padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: "0.5rem", fontWeight: 700 }}>{t("detail_origin")}</h4>
              <p style={{ fontWeight: 700 }}>{origin}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="name-detail-sidebar"
        >
          <div style={{ 
            background: "var(--surface)", 
            padding: "1.5rem", 
            borderRadius: "var(--r-lg)", 
            border: "1px solid var(--border)",
            marginBottom: "1.5rem"
          }}>
            {/* H3: Sidebar alt bölümü — görsel boyut korundu */}
            <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem" }}>
              {t("favorites", lng === "tr" ? "Favorilerim" : lng === "de" ? "Favoriten" : lng === "ar" ? "المفضلة" : "Favorites")}
            </h3>
            <button
              onClick={() => toggleFavorite(nameItem)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "0.875rem",
                borderRadius: "var(--r-md)",
                background: isFavorite(nameItem.id) ? "var(--female)" : "var(--surface-2)",
                color: isFavorite(nameItem.id) ? "white" : "var(--text)",
                fontWeight: 700,
                border: "none",
                transition: "all 0.2s"
              }}
            >
              <Heart size={20} fill={isFavorite(nameItem.id) ? "white" : "none"} />
              {isFavorite(nameItem.id) ? t("favorites_remove") : t("favorites_add")}
            </button>
          </div>

          {alikeNames.length > 0 && (
            <div style={{ 
              background: "var(--surface)", 
              padding: "1.5rem", 
              borderRadius: "var(--r-lg)", 
              border: "1px solid var(--border)" 
            }}>
              {/* H3: Sidebar benzer isimler — görsel boyut korundu */}
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem" }}>{t("detail_similar_rich", { name: nameItem.name, genderText: genderText, defaultValue: "Benzer İsimler" })}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {alikeNames.slice(0, 5).map(an => (
                  <Link
                    key={an.id}
                    to={generatePath(lng, "name", an.id)}
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      borderRadius: "var(--r-sm)",
                      background: "var(--bg)",
                      textDecoration: "none",
                      color: "var(--text)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      border: "1px solid var(--border-dim)"
                    }}
                    className="hover:border-var(--accent) transition-colors"
                  >
                    {an.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.aside>
      </div>

      <div style={{ maxWidth: "100%" }}>


        <section style={{ marginTop: "4rem" }}>
          {/* H2: Köken bölümü */}
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1.5rem" }}>
            {t("detail_origin_rich", { name: nameItem.name, origin: origin, defaultValue: `${nameItem.name} Kürtçe İsminin Kökeni` })}
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--text-muted)", maxWidth: "800px" }}>
            {t("detail_origin_desc_rich", { 
              name: nameItem.name, 
              origin: origin, 
              defaultValue: `${nameItem.name} ismi, köken olarak ${origin} kültürüne dayanmaktadır. Bu isim, tarihsel süreç içerisinde ${origin} dilinin ve kültürünün derin izlerini taşımakta olup, günümüzde de popülerliğini korumaktadır.`
            })}
          </p>
        </section>

        <section style={{ marginTop: "3rem" }}>
          {/* H2: Cinsiyet bölümü */}
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1.5rem" }}>
            {t("detail_gender_rich", { name: nameItem.name, genderText: genderText, defaultValue: `${nameItem.name} Kürtçe İsminin Cinsiyeti` })}
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--text-muted)", maxWidth: "800px" }}>
            {t("detail_gender_desc", { name: nameItem.name, genderText: genderText, origin: origin })}
          </p>
        </section>

          {/* Silo Mimarisi ve Sert İç Linkleme (Internal Link Silo Card) */}
          {(() => {
            const isGirl = nameItem.gender === "female";
            const targetCategory = isGirl ? "kiz" : "erkek";
            const targetUrl = generatePath(lng, "category", targetCategory);
            
            // Localized anchor and surrounding text mapping
            const linkData: Record<string, { prefix: string, anchor: string, suffix: string }> = {
              tr: {
                prefix: "Bebeğiniz için anlamlı bir ad arıyorsanız, daha fazla ",
                anchor: isGirl ? "Kürtçe Kız İsimleri" : "Kürtçe Erkek İsimleri",
                suffix: " rehberimizi keşfedin, köken ve telaffuz analizlerini yan yana karşılaştırın."
              },
              en: {
                prefix: "If you are looking for a meaningful name for your baby, discover more ",
                anchor: isGirl ? "Kurdish Girl Names" : "Kurdish Boy Names",
                suffix: " in our comprehensive directory, comparing origins and definitions side-by-side."
              },
              de: {
                prefix: "Wenn Sie nach einem bedeutungsvollen Namen für Ihr Baby suchen, entdecken Sie weitere ",
                anchor: isGirl ? "Kurdische Mädchennamen" : "Kurdische Jungennamen",
                suffix: " in unserem umfassenden Ratgeber, und vergleichen Sie Herkunft und Bedeutung."
              },
              ar: {
                prefix: "إذا كنت تبحث عن اسم مميز لمولودك الجديد، فاكتشف المزيد من ",
                anchor: isGirl ? "أسماء البنات الكردية" : "أسماء الأولاد الكردية",
                suffix: " عبر دليلنا الشامل المخصص للمقارنة وتحليل الأصول اللغوية."
              }
            };

            const data = linkData[lng as keyof typeof linkData] || linkData.tr;

            return (
              <div style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                marginTop: "2rem",
                marginBottom: "1.5rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.875rem"
              }}>
                <span style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: "2px" }}>🔗</span>
                <p style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                  margin: 0
                }}>
                  {data.prefix}
                  <Link 
                    to={targetUrl}
                    style={{
                      color: isGirl ? "var(--female)" : "var(--male)",
                      fontWeight: 700,
                      textDecoration: "underline",
                      transition: "opacity 150ms"
                    }}
                    className="hover:opacity-80"
                  >
                    {data.anchor}
                  </Link>
                  {data.suffix}
                </p>
              </div>
            );
          })()}

          {/* Premium Visual FAQ Accordion Section */}
          <section style={{ marginTop: "2.5rem", marginBottom: "2.5rem" }}>
            {/* H2: FAQ bölüm başlığı */}
            <h2 className="section-heading" style={{ marginBottom: "1.25rem" }}>
              {t("faq_title", { name: nameItem.name, defaultValue: `${nameItem.name} Kürtçe İsmi Hakkında Sıkça Sorulan Sorular` })}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "box-shadow 200ms"
                    }}
                    className="hover:shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      style={{
                        width: "100%",
                        padding: "1.125rem 1.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "none",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "var(--font-display)"
                      }}
                    >
                      {/* H3: Her FAQ sorusu — Featured Snippet için kritik */}
                      <h3 style={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "var(--text)",
                        margin: 0,
                        fontFamily: "var(--font-display)",
                        textAlign: "left",
                        flex: 1
                      }}>
                        {faq.question}
                      </h3>
                      <span style={{ 
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)", 
                        transition: "transform 200ms",
                        color: "var(--accent)",
                        flexShrink: 0,
                        marginLeft: "0.75rem"
                      }}>
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ 
                        padding: "0 1.5rem 1.25rem 1.5rem", 
                        fontSize: "0.9rem", 
                        lineHeight: 1.6, 
                        color: "var(--text-muted)",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "0.875rem"
                      }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Devasa Paylaşım & İndirme Altyapısı */}
          <div className="flex flex-col md:flex-row gap-3 my-8 w-full">
            {/* WhatsApp Button */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${t("whatsapp_share_msg", { name: nameItem.name, meaning: meaning })} https://kurdishname.com${generatePath(lng, "name", nameItem.id)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "0.9375rem 1.5rem",
                background: "#25D366",
                color: "#FFFFFF",
                borderRadius: "var(--r-lg)",
                fontSize: "0.95rem",
                fontWeight: "700",
                fontFamily: "var(--font-display)",
                textAlign: "center",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 211, 102, 0.25)",
                transition: "transform 150ms var(--ease-out), background-color 150ms, box-shadow 150ms",
                boxSizing: "border-box",
                width: "100%",
                whiteSpace: "nowrap"
              }}
              className="w-full md:w-auto flex-1 hover:scale-[1.01] hover:bg-[#20ba5a] hover:shadow-[0_6px_20px_rgba(37,211,102,0.35)] active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.005L2 22l5.135-1.346a9.94 9.94 0 004.87 1.27h.005c5.507 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.18-2.92-7.061A9.925 9.925 0 0012.012 2zm5.72 14.1c-.244.688-1.201 1.25-1.654 1.336-.421.08-.949.124-2.855-.672-2.434-1.014-4-3.48-4.122-3.641-.121-.162-1.008-1.343-1.008-2.56 0-1.218.636-1.815.862-2.057.227-.243.498-.303.664-.303h.473c.152 0 .356-.057.556.425.2.486.688 1.678.749 1.8.06.121.101.263.02.425-.08.162-.121.263-.243.405-.121.141-.256.315-.365.425-.121.121-.248.253-.106.496.142.242.631 1.042 1.353 1.685.93.827 1.71 1.082 1.954 1.204.243.122.384.101.526-.06.141-.162.607-.708.769-.95.162-.243.324-.202.546-.121.222.08 1.413.667 1.655.789.243.121.404.182.464.283.06.101.06.587-.184 1.275z"/>
              </svg>
              <span>{t("whatsapp_share_btn", "WhatsApp'ta Eşine/Ailene Gönder")}</span>
            </a>
 
            {/* İsim Kartı İndirme Butonu */}
            <button
              onClick={handleDownloadCard}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                padding: "0.9375rem 1.5rem",
                background: "var(--surface-2)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                fontSize: "0.95rem",
                fontWeight: "600",
                fontFamily: "var(--font-display)",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 150ms var(--ease-out), background-color 150ms, border-color 150ms",
                boxSizing: "border-box",
                width: "100%",
                whiteSpace: "nowrap"
              }}
              className="w-full md:w-auto flex-1 hover:scale-[1.01] hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.99]"
            >
              <Download size={20} />
              <span>{t("download_card_btn", "İsim Kartını İndir")}</span>
            </button>
          </div>

          {/* Footer actions */}
          <div style={{ display: "flex", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.875rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
            <button
              onClick={handleShare}
              style={{ fontSize: "0.78rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
            >
              {t("share_btn", "Bağlantıyı kopyala")}
            </button>
            {getGenderPath(nameItem.gender) ? (
              <Link to={generatePath(lng, "category", getGenderPath(nameItem.gender))} style={{ fontSize: "0.78rem" }}>
                → {t("detail_view_all", { gender: genderText })}
              </Link>
            ) : (
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                → {t("detail_view_all", { gender: genderText })}
              </span>
            )}
          </div>
      </div>
    </>
  );
}
