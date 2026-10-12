import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { generatePath } from "../utils/routes";

const BOARD_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kurdishname.com/#editorial-board",
      "name": "KurdishName Editorial Board",
      "alternateName": "KurdishName Dil ve Tarih Araştırmaları Kurulu",
      "url": "https://kurdishname.com",
      "logo": "https://kurdishname.com/logo.webp",
      "description": "An independent academic editorial board specializing in Kurdish linguistics, onomastics, and the documentation of Kurdish personal names across Kurmanji, Sorani, and Zazaki dialects.",
      "knowsAbout": [
        "Kurdish linguistics",
        "Kurdish onomastics",
        "Kurmanji dialect",
        "Sorani dialect",
        "Zazaki dialect",
        "Mesopotamian etymology",
        "Kurdish personal names",
        "Kurdish cultural heritage"
      ],
      "sameAs": [
        "https://kurdishname.com",
        "https://kurdishname.com/en/editorial-board"
      ]
    },
    {
      "@type": "AboutPage",
      "name": "KurdishName Editorial Board",
      "description": "Academic editorial board responsible for the curation, verification, and publication of Kurdish name data on KurdishName.com.",
      "url": "https://kurdishname.com/en/editorial-board",
      "author": {
        "@type": "Organization",
        "@id": "https://kurdishname.com/#editorial-board"
      },
      "publisher": {
        "@type": "Organization",
        "name": "KurdishName",
        "url": "https://kurdishname.com"
      }
    }
  ]
};

const content = {
  tr: {
    title: "KurdishName Editoryal Kurulu",
    subtitle: "Dil ve Tarih Araştırmaları Kurulu",
    metaDesc: "KurdishName Editoryal Kurulu, Kürtçe isimler üzerine bağımsız akademik araştırma yürüten ve dünyanın en kapsamlı dijital Kürtçe isim sözlüğünü derleyen bir dilbilim araştırma kuruludur.",
    mission: {
      heading: "Misyon ve Kapsam",
      body: "KurdishName Editoryal Kurulu; Kurmancî, Soranî ve Zazaki lehçelerini kapsayan kapsamlı Kürtçe isim belgelerini derlemek, doğrulamak ve yayımlamak amacıyla kurulmuş bağımsız bir akademik araştırma kuruludur. Kurulun temel misyonu, Kürt onomastiğini (isim bilimini) dijital çağda erişilebilir kılmak ve her ismin dilbilimsel, tarihsel ve kültürel bağlamını titizlikle belgelemektir."
    },
    methodology: {
      heading: "Araştırma Metodolojisi",
      steps: [
        {
          title: "Birincil Kaynak Tarama",
          desc: "Her isim girişi; Ferhenga Kurmancî (Kurmancî sözlüğü), Kurdipedia dijital arşivleri, Kürt Dil Enstitüsü yayınları ve akademik dilbilim çalışmalarından birincil verilerle desteklenir."
        },
        {
          title: "Çapraz Doğrulama",
          desc: "Anlam ve köken bilgileri, birden fazla bağımsız kaynak arasında çapraz doğrulamaya tabi tutulur. Yalnızca tutarlı veriler yayımlanır; belirsiz durumlar için şüphe notu eklenir."
        },
        {
          title: "Lehçe Sınıflandırması",
          desc: "İsimlerin lehçe atamaları (Kurmancî, Soranî, Zazaki, Goranî) doğrulanmış dilbilim verilerine dayalı olarak yapılır. Belirsiz vakalarda lehçe etiketi atlanır."
        },
        {
          title: "Periyodik Güncelleme",
          desc: "Veri tabanı, yeni akademik bulgular ve kaynak güncellemeleri doğrultusunda düzenli aralıklarla revize edilir. Her sayfa, son güncelleme tarihi ile birlikte yayımlanır."
        }
      ]
    },
    sources: {
      heading: "Referans Havuzu",
      intro: "KurdishName veri tabanının temel kaynakları şunlardır:",
      list: [
        "Ferhenga Kurmancî — Kurmancî lehçesinin kapsamlı sözlükleri",
        "Kurdipedia — Kürtçe bilgi arşivi ve isim veri tabanı",
        "Kürt Dil Enstitüsü (KDI) — Dilbilim araştırmaları ve yayınları",
        "Mezopotamya Dil Arşivleri — Tarihsel isim kayıtları",
        "Sorani ve Zazaki akademik sözlükleri",
        "Karşılaştırmalı Hint-Avrupa dilbilim çalışmaları"
      ]
    },
    standards: {
      heading: "Yayın Standartları",
      body: "Kurul, yalnızca doğrulanabilir kaynaklardan elde edilen bilgileri yayımlar. Spekülatif, kanıtlanmamış veya yanlış doğrulanmış veriler veri tabanına dahil edilmez. Her isim sayfası; anlam, köken, lehçe ve telaffuz bilgilerini kaynağa dayalı şekilde sunar."
    },
    backLink: "← Kürtçe İsimler Sözlüğüne Dön"
  },
  en: {
    title: "KurdishName Editorial Board",
    subtitle: "Linguistics & Historical Research Board",
    metaDesc: "The KurdishName Editorial Board is an independent academic research body that curates the world's most comprehensive digital Kurdish name dictionary, specializing in Kurdish onomastics across Kurmanji, Sorani, and Zazaki dialects.",
    mission: {
      heading: "Mission & Scope",
      body: "The KurdishName Editorial Board is an independent academic research body established to compile, verify, and publish comprehensive Kurdish name documentation spanning Kurmanji, Sorani, and Zazaki dialects. The board's core mission is to make Kurdish onomastics accessible in the digital age, carefully documenting the linguistic, historical, and cultural context of each name."
    },
    methodology: {
      heading: "Research Methodology",
      steps: [
        {
          title: "Primary Source Review",
          desc: "Each name entry is supported by primary data from Ferhenga Kurmancî, Kurdipedia digital archives, Kurdish Language Institute publications, and academic linguistic studies."
        },
        {
          title: "Cross-Verification",
          desc: "Meaning and origin information is cross-verified across multiple independent sources. Only consistent data is published; ambiguous cases are flagged with uncertainty notes."
        },
        {
          title: "Dialect Classification",
          desc: "Dialect assignments for names (Kurmanji, Sorani, Zazaki, Gorani) are made based on verified linguistic data. In ambiguous cases, dialect labels are omitted."
        },
        {
          title: "Periodic Updates",
          desc: "The database is regularly revised in line with new academic findings and source updates. Each page is published with a last-updated date."
        }
      ]
    },
    sources: {
      heading: "Reference Repository",
      intro: "The primary sources underpinning the KurdishName database include:",
      list: [
        "Ferhenga Kurmancî — Comprehensive dictionaries of the Kurmanji dialect",
        "Kurdipedia — Kurdish knowledge archive and name database",
        "Kurdish Language Institute (KDI) — Linguistic research and publications",
        "Mesopotamian Language Archives — Historical name records",
        "Sorani and Zazaki academic dictionaries",
        "Comparative Indo-European linguistics studies"
      ]
    },
    standards: {
      heading: "Publication Standards",
      body: "The board publishes only information obtained from verifiable sources. Speculative, unverified, or incorrectly verified data is not included in the database. Each name page presents meaning, origin, dialect, and pronunciation information in a source-based manner."
    },
    backLink: "← Back to Kurdish Names Dictionary"
  },
  de: {
    title: "KurdishName Redaktionsrat",
    subtitle: "Forschungsrat für Linguistik und Geschichte",
    metaDesc: "Der KurdishName Redaktionsrat ist ein unabhängiges akademisches Forschungsgremium, das das weltweit umfassendste digitale Wörterbuch kurdischer Namen kuratiert und sich auf die kurdische Onomastik in den Dialekten Kurmandschi, Sorani und Zazaisch spezialisiert hat.",
    mission: {
      heading: "Mission & Umfang",
      body: "Der KurdishName Redaktionsrat ist ein unabhängiges akademisches Forschungsgremium, das gegründet wurde, um umfassende kurdische Namendokumentationen zu sammeln, zu überprüfen und zu veröffentlichen. Die Kernmission des Rates ist es, die kurdische Onomastik im digitalen Zeitalter zugänglich zu machen und den linguistischen, historischen und kulturellen Kontext jedes Namens sorgfältig zu dokumentieren."
    },
    methodology: {
      heading: "Forschungsmethodik",
      steps: [
        {
          title: "Primärquellenrecherche",
          desc: "Jeder Namenseintrag wird durch Primärdaten aus Ferhenga Kurmancî, Kurdipedia-Digitalarchiven, Veröffentlichungen des Kurdischen Sprachinstituts und akademischen Linguistikstudien gestützt."
        },
        {
          title: "Kreuzverifizierung",
          desc: "Bedeutungs- und Herkunftsinformationen werden über mehrere unabhängige Quellen kreuzverifiziert. Nur konsistente Daten werden veröffentlicht; mehrdeutige Fälle werden mit Unsicherheitshinweisen versehen."
        },
        {
          title: "Dialektklassifikation",
          desc: "Dialektzuweisungen für Namen werden auf der Grundlage verifizierter linguistischer Daten vorgenommen. Bei mehrdeutigen Fällen werden Dialektbezeichnungen weggelassen."
        },
        {
          title: "Regelmäßige Updates",
          desc: "Die Datenbank wird regelmäßig entsprechend neuer akademischer Erkenntnisse überarbeitet. Jede Seite wird mit einem Datum der letzten Aktualisierung veröffentlicht."
        }
      ]
    },
    sources: {
      heading: "Referenzrepository",
      intro: "Die primären Quellen, die der KurdishName-Datenbank zugrunde liegen:",
      list: [
        "Ferhenga Kurmancî — Umfassende Wörterbücher des Kurmandschi-Dialekts",
        "Kurdipedia — Kurdisches Wissensarchiv und Namensdatenbank",
        "Kurdisches Sprachinstitut (KDI) — Linguistische Forschung und Veröffentlichungen",
        "Mesopotamische Spracharchive — Historische Namensaufzeichnungen",
        "Akademische Wörterbücher des Sorani und Zazaisch",
        "Vergleichende indoeuropäische Linguistikstudien"
      ]
    },
    standards: {
      heading: "Veröffentlichungsstandards",
      body: "Der Rat veröffentlicht nur Informationen, die aus verifizierbaren Quellen stammen. Spekulative, nicht verifizierte oder falsch verifizierte Daten werden nicht in die Datenbank aufgenommen."
    },
    backLink: "← Zurück zum Kurdischen Namenswörterbuch"
  },
  ar: {
    title: "مجلس التحرير في KurdishName",
    subtitle: "مجلس البحث اللغوي والتاريخي",
    metaDesc: "مجلس تحرير KurdishName هو هيئة بحثية أكاديمية مستقلة تُشرف على أشمل قاموس رقمي للأسماء الكردية في العالم، متخصصة في علم الأسماء الكردية عبر لهجات الكرمانجية والسورانية والزازائية.",
    mission: {
      heading: "الرسالة والنطاق",
      body: "مجلس تحرير KurdishName هيئة بحثية أكاديمية مستقلة أُسِّست لجمع وتحقق ونشر التوثيق الشامل للأسماء الكردية عبر لهجات الكرمانجية والسورانية والزازائية. تتمحور مهمة المجلس حول إتاحة علم الأسماء الكردي في العصر الرقمي، مع توثيق دقيق للسياق اللغوي والتاريخي والثقافي لكل اسم."
    },
    methodology: {
      heading: "المنهجية البحثية",
      steps: [
        {
          title: "مراجعة المصادر الأولية",
          desc: "يُستند كل إدخال اسمي إلى بيانات أولية من Ferhenga Kurmancî والأرشيفات الرقمية لـ Kurdipedia ومنشورات معهد اللغة الكردية والدراسات الأكاديمية اللغوية."
        },
        {
          title: "التحقق المتقاطع",
          desc: "تخضع معلومات المعنى والأصل للتحقق المتقاطع عبر مصادر مستقلة متعددة. تُنشر البيانات المتسقة فقط، وتُوسَم الحالات الغامضة بملاحظات عدم اليقين."
        },
        {
          title: "تصنيف اللهجات",
          desc: "تُحدَّد تصنيفات اللهجات للأسماء بناءً على بيانات لغوية موثَّقة. في الحالات الغامضة، يُحذف تسمية اللهجة."
        },
        {
          title: "التحديثات الدورية",
          desc: "تُراجَع قاعدة البيانات بانتظام وفق المستجدات الأكاديمية. تُنشر كل صفحة مع تاريخ آخر تحديث."
        }
      ]
    },
    sources: {
      heading: "مستودع المراجع",
      intro: "المصادر الأساسية التي تستند إليها قاعدة بيانات KurdishName:",
      list: [
        "Ferhenga Kurmancî — قواميس شاملة للهجة الكرمانجية",
        "Kurdipedia — أرشيف المعرفة الكردية وقاعدة بيانات الأسماء",
        "معهد اللغة الكردية (KDI) — أبحاث ومنشورات لغوية",
        "أرشيفات اللغة الميزوبوتامية — سجلات الأسماء التاريخية",
        "قواميس أكاديمية للسورانية والزازائية",
        "دراسات اللغويات الهندية الأوروبية المقارنة"
      ]
    },
    standards: {
      heading: "معايير النشر",
      body: "يتبنى المجلس نشر المعلومات المستقاة من مصادر موثوقة حصراً. لا تُدرج البيانات التخمينية أو غير الموثقة في قاعدة البيانات. تعرض كل صفحة اسمية المعنى والأصل واللهجة ومعلومات النطق بصورة مستندة إلى مصادر."
    },
    backLink: "← العودة إلى قاموس الأسماء الكردية"
  }
};

export default function EditorialBoard() {
  const { i18n } = useTranslation();
  const lng = (i18n.language || "en").split("-")[0] as keyof typeof content;
  const C = content[lng] || content.en;
  const isRTL = lng === "ar";

  const boardSchemaWithLang = {
    ...BOARD_SCHEMA,
    "@graph": BOARD_SCHEMA["@graph"].map(node => {
      if (node["@type"] === "AboutPage") {
        return { ...node, "url": `https://kurdishname.com/${lng}/${(content[lng] ? lng : "en") === lng ? (() => { const r: Record<string,string> = {tr:"editoryal-kurul",en:"editorial-board",de:"redaktionsrat",ar:"مجلس-التحرير"}; return r[lng]||"editorial-board"; })() : "editorial-board"}`, "inLanguage": lng };
      }
      return node;
    })
  };

  return (
    <>
      <Helmet>
        <title>{C.title} | KurdishName</title>
        <meta name="description" content={C.metaDesc} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${C.title} | KurdishName`} />
        <meta property="og:description" content={C.metaDesc} />
        <link rel="canonical" href={`https://kurdishname.com/${lng}/${({tr:"editoryal-kurul",en:"editorial-board",de:"redaktionsrat",ar:"مجلس-التحرير"} as Record<string,string>)[lng]||"editorial-board"}`} />
        <script type="application/ld+json">{JSON.stringify(boardSchemaWithLang)}</script>
      </Helmet>

      <article dir={isRTL ? "rtl" : "ltr"} style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Back link */}
        <Link
          to={generatePath(lng, null)}
          style={{ display: "inline-block", marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--accent)", textDecoration: "none" }}
        >
          {C.backLink}
        </Link>

        {/* Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--accent)",
            color: "#fff",
            padding: "0.3rem 0.9rem",
            borderRadius: "100px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1rem"
          }}>
            📚 {lng === "ar" ? "مجلس التحرير" : lng === "de" ? "Redaktionsrat" : lng === "tr" ? "Editoryal Kurul" : "Editorial Board"}
          </div>
          <h1 style={{
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            fontWeight: 900,
            color: "var(--text)",
            lineHeight: 1.15,
            marginBottom: "0.5rem",
            fontFamily: "var(--font-display)"
          }}>
            {C.title}
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
            {C.subtitle}
          </p>
        </header>

        {/* Mission */}
        <section style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: "2rem",
          marginBottom: "2rem"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem", color: "var(--accent)" }}>
            {C.mission.heading}
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>
            {C.mission.body}
          </p>
        </section>

        {/* Methodology */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", color: "var(--text)" }}>
            {C.methodology.heading}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {C.methodology.steps.map((step, i) => (
              <div key={i} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "1.25rem"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span style={{
                    flexShrink: 0,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 800
                  }}>{i + 1}</span>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", margin: 0, lineHeight: 1.4 }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--text-muted)", margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "4px solid var(--accent)",
          borderRadius: "var(--r-lg)",
          padding: "2rem",
          marginBottom: "2rem"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text)" }}>
            {C.sources.heading}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {C.sources.intro}
          </p>
          <ul style={{ margin: 0, paddingLeft: isRTL ? 0 : "1.5rem", paddingRight: isRTL ? "1.5rem" : 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {C.sources.list.map((src, i) => (
              <li key={i} style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.6 }}>
                {src}
              </li>
            ))}
          </ul>
        </section>

        {/* Standards */}
        <section style={{
          background: "linear-gradient(135deg, var(--surface-alt), var(--surface))",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: "2rem",
          marginBottom: "3rem"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text)" }}>
            {C.standards.heading}
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>
            {C.standards.body}
          </p>
        </section>

        {/* Organization Identity Card */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1.25rem 1.5rem",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-md)",
          marginBottom: "2rem"
        }}>
          <img src="/logo.webp" alt="KurdishName" width={48} height={48} style={{ borderRadius: "8px", flexShrink: 0 }} />
          <div>
            <strong style={{ display: "block", fontSize: "0.95rem", color: "var(--text)" }}>KurdishName Editorial Board</strong>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kurdishname.com · 2026</span>
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          <Link to={generatePath(lng, "category", "kiz")} style={{ fontSize: "0.875rem", color: "var(--female)", fontWeight: 600 }}>
            {lng === "ar" ? "أسماء البنات" : lng === "de" ? "Mädchennamen" : lng === "tr" ? "Kız İsimleri" : "Girl Names"}
          </Link>
          <Link to={generatePath(lng, "category", "erkek")} style={{ fontSize: "0.875rem", color: "var(--male)", fontWeight: 600 }}>
            {lng === "ar" ? "أسماء الأولاد" : lng === "de" ? "Jungennamen" : lng === "tr" ? "Erkek İsimleri" : "Boy Names"}
          </Link>
          <Link to={generatePath(lng, "blog")} style={{ fontSize: "0.875rem", color: "var(--accent)", fontWeight: 600 }}>
            {lng === "ar" ? "المدونة" : lng === "de" ? "Blog" : "Blog"}
          </Link>
        </div>
      </article>
    </>
  );
}
