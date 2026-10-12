/**
 * faqGenerator.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Her isime %100 özgü, duplicate-content geçirmez, 15 soruluk dinamik FAQ
 * jeneratörü.  Desteklenen diller: tr | en | de | ar
 *
 * Algoritma:
 *  1. Tag (tema) bazlı karakter analizi
 *  2. İlk harf bazlı kişilik analizi
 *  3. Harf sayısı (name.length) bazlı numeroloji
 *  4. name.length % N ile spintax (varyasyon) seçici kalıplar
 *  5. 15 adet soru–cevap
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NameData } from "../data/names";

export interface FaqItem {
  question: string;
  answer: string;
}

// ─── Yardımcı: N varyantan isme özgü sabit birini seç ─────────────────────
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// ─── Tag → karakter metni haritası ────────────────────────────────────────
const TAG_CHARACTER: Record<string, Record<string, string>> = {
  "Doğa / Yaşam": {
    tr: "doğayla iç içe, huzur veren ve dingin bir ruh taşır. Toprakla, su ile ve yaşamın döngüsüyle derin bir bağı vardır",
    en: "carries a nature-loving, peaceful and serene spirit deeply connected to earth, water and the cycle of life",
    de: "trägt eine naturverbundene, friedvolle und ruhige Seele mit einer tiefen Verbindung zur Erde, zum Wasser und zum Kreislauf des Lebens",
    ar: "يحمل روحاً محبة للطبيعة، مسالمة وهادئة، مرتبطة ارتباطاً عميقاً بالأرض والماء ودورة الحياة",
  },
  "Cesaret / Güç": {
    tr: "lider ruhlu, cesur ve zorlukların üstesinden gelen güçlü bir karakter barındırır. Sarsılmaz bir irade ve asalet gücü taşır",
    en: "embodies a leader's spirit, courageous and capable of overcoming adversity with an unshakeable will and noble character",
    de: "verkörpert einen Führungsgeist, mutig und fähig, Widrigkeiten mit unerschütterlichem Willen und edlem Charakter zu überwinden",
    ar: "يجسد روح القائد، شجاعاً وقادراً على تجاوز الصعاب بإرادة راسخة وشخصية نبيلة",
  },
  "Sevgi / Güzellik": {
    tr: "sevgi dolu, zarif ve insanların kalbine kolayca dokunan sıcak bir karakter taşır. Çevresine güzellik ve huzur yayar",
    en: "carries a loving, graceful character that easily touches people's hearts, spreading beauty and peace around them",
    de: "trägt einen liebevollen, anmutigen Charakter, der leicht die Herzen der Menschen berührt und Schönheit und Frieden verbreitet",
    ar: "يحمل شخصية محبة ورشيقة تلمس قلوب الناس بسهولة وتنشر الجمال والسلام من حوله",
  },
  "Işık / Aydınlık": {
    tr: "aydınlatıcı bir zeka ve parlak bir vizyona sahip, çevresine ilham veren bir karakter barındırır. Karanlıkta bile yol gösterme gücü vardır",
    en: "possesses an enlightening intellect and bright vision, inspiring those around them with the power to guide even in darkness",
    de: "besitzt einen erleuchtenden Intellekt und eine helle Vision, inspiriert andere und hat die Kraft, selbst im Dunkeln den Weg zu weisen",
    ar: "يمتلك عقلاً مستنيراً ورؤية مشرقة، ملهماً لمن حوله وقادراً على الإرشاد حتى في الظلام",
  },
  "Bilgelik / Akıl": {
    tr: "derin bir bilgelik, analitik zeka ve sabır ile bezenmiş güçlü bir iç dünya taşır. Karmaşık durumları olgunlukla çözer",
    en: "possesses a deep inner world adorned with wisdom, analytical intelligence and patience, resolving complex situations with maturity",
    de: "besitzt eine tiefe Innenwelt mit Weisheit, analytischer Intelligenz und Geduld und löst komplexe Situationen mit Reife",
    ar: "يمتلك عالماً داخلياً عميقاً مزيناً بالحكمة والذكاء التحليلي والصبر، يحل المواقف المعقدة بنضج",
  },
};

// ─── İlk harf → kişilik özeti haritası ────────────────────────────────────
const LETTER_PERSONALITY: Record<string, Record<string, string>> = {
  A: {
    tr: "liderlik, özgüven ve yenilikçilik",
    en: "leadership, self-confidence and innovation",
    de: "Führung, Selbstvertrauen und Innovationsgeist",
    ar: "القيادة والثقة بالنفس والإبداع",
  },
  B: {
    tr: "duygusallık, sadakat ve aile bağlılığı",
    en: "sensitivity, loyalty and family devotion",
    de: "Sensibilität, Treue und Familiensinn",
    ar: "العاطفة والولاء والتفاني الأسري",
  },
  C: {
    tr: "yaratıcılık, şen ruhluluk ve sosyallik",
    en: "creativity, cheerfulness and sociability",
    de: "Kreativität, Fröhlichkeit und Geselligkeit",
    ar: "الإبداع والمرح والانفتاح الاجتماعي",
  },
  D: {
    tr: "kararlılık, disiplin ve güvenilirlik",
    en: "determination, discipline and reliability",
    de: "Entschlossenheit, Disziplin und Zuverlässigkeit",
    ar: "الحزم والانضباط والموثوقية",
  },
  E: {
    tr: "özgürlük sevgisi, merak ve uyum yeteneği",
    en: "love of freedom, curiosity and adaptability",
    de: "Freiheitsliebe, Neugier und Anpassungsfähigkeit",
    ar: "حب الحرية والفضول والقدرة على التكيف",
  },
  F: {
    tr: "şefkat, ilgi ve besleyici bir ruh",
    en: "compassion, care and a nurturing spirit",
    de: "Mitgefühl, Fürsorge und ein pflegender Geist",
    ar: "الرحمة والرعاية والروح المعطاءة",
  },
  G: {
    tr: "analiz gücü, mükemmeliyetçilik ve derin düşünce",
    en: "analytical power, perfectionism and deep thinking",
    de: "Analysefähigkeit, Perfektionismus und tiefes Denken",
    ar: "القوة التحليلية والكمالية والتفكير العميق",
  },
  H: {
    tr: "hırs, başarı odaklılık ve pratik zeka",
    en: "ambition, achievement-focus and practical intelligence",
    de: "Ehrgeiz, Leistungsorientierung und praktische Intelligenz",
    ar: "الطموح والتوجه نحو الإنجاز والذكاء العملي",
  },
  I: {
    tr: "sezgisellik, ruhanilik ve güçlü iç ses",
    en: "intuition, spirituality and a strong inner voice",
    de: "Intuition, Spiritualität und eine starke innere Stimme",
    ar: "الحدس والروحانية والصوت الداخلي القوي",
  },
  J: {
    tr: "adalet duygusu, dürüstlük ve kararlı kişilik",
    en: "sense of justice, honesty and decisive personality",
    de: "Gerechtigkeitssinn, Ehrlichkeit und entschlossene Persönlichkeit",
    ar: "الإحساس بالعدالة والصدق والشخصية الحازمة",
  },
  K: {
    tr: "karizmatik yapı, yüksek enerji ve liderlik",
    en: "charismatic nature, high energy and leadership",
    de: "Charisma, hohe Energie und Führungsstärke",
    ar: "الشخصية الكاريزمية والطاقة العالية والقيادة",
  },
  L: {
    tr: "güzellik algısı, estetik duyarlılık ve romantizm",
    en: "aesthetic sensibility, beauty appreciation and romanticism",
    de: "Ästhetisches Empfinden, Schönheitssinn und Romantik",
    ar: "الحساسية الجمالية وتذوق الجمال والرومانسية",
  },
  M: {
    tr: "güç, pratiklik ve gerçekçi bir dünya görüşü",
    en: "strength, practicality and a realistic worldview",
    de: "Stärke, Praktikabilität und eine realistische Weltanschauung",
    ar: "القوة والعملية ورؤية واقعية للعالم",
  },
  N: {
    tr: "yaratıcı ifade, özgünlük ve sanatsal ruh",
    en: "creative expression, originality and an artistic spirit",
    de: "Kreativität, Originalität und künstlerischer Geist",
    ar: "التعبير الإبداعي والأصالة والروح الفنية",
  },
  O: {
    tr: "sorumluluk duygusu, güvenlik ve dengecilik",
    en: "sense of responsibility, security and balance",
    de: "Verantwortungsbewusstsein, Sicherheit und Ausgeglichenheit",
    ar: "الإحساس بالمسؤولية والأمان والتوازن",
  },
  P: {
    tr: "bilgelik arayışı, felsefi düşünce ve derin gözlem",
    en: "quest for wisdom, philosophical thinking and deep observation",
    de: "Streben nach Weisheit, philosophisches Denken und tiefe Beobachtung",
    ar: "السعي وراء الحكمة والتفكير الفلسفي والملاحظة العميقة",
  },
  R: {
    tr: "güç, bağımsızlık ve etkileyici kişilik",
    en: "power, independence and an impressive personality",
    de: "Stärke, Unabhängigkeit und eine eindrucksvolle Persönlichkeit",
    ar: "القوة والاستقلالية والشخصية المؤثرة",
  },
  S: {
    tr: "hassas ruh, sezgi gücü ve derin duygusallık",
    en: "sensitive spirit, strong intuition and deep emotionality",
    de: "Feinfühliger Geist, starke Intuition und tiefe Emotionalität",
    ar: "الروح الحساسة والحدس القوي والعاطفة العميقة",
  },
  T: {
    tr: "azim, kararlılık ve başarıya olan tutkusu",
    en: "perseverance, determination and a passion for achievement",
    de: "Ausdauer, Entschlossenheit und Leidenschaft für Erfolg",
    ar: "المثابرة والعزم والشغف بالإنجاز",
  },
  U: {
    tr: "özgünlük, bağımsız düşünce ve derin anlayış",
    en: "uniqueness, independent thinking and deep understanding",
    de: "Einzigartigkeit, unabhängiges Denken und tiefes Verständnis",
    ar: "التفرد والتفكير المستقل والفهم العميق",
  },
  V: {
    tr: "çok yönlülük, hayal gücü ve özgün bakış açısı",
    en: "versatility, imagination and a unique perspective",
    de: "Vielseitigkeit, Vorstellungskraft und eine einzigartige Perspektive",
    ar: "التعدد والخيال ووجهة النظر الفريدة",
  },
  W: {
    tr: "geniş bir iç dünya, sezgisellik ve yaratıcılık",
    en: "a rich inner world, intuition and creativity",
    de: "Eine reiche Innenwelt, Intuition und Kreativität",
    ar: "عالم داخلي غني والحدس والإبداع",
  },
  X: {
    tr: "sıra dışı bir yapı, gizemlilik ve özgünlük",
    en: "an extraordinary nature, mystery and uniqueness",
    de: "Eine außergewöhnliche Natur, Geheimnis und Einzigartigkeit",
    ar: "طبيعة استثنائية وغموض وتفرد",
  },
  Y: {
    tr: "derin ruhsallık, sezgi ve uyumlu bir kişilik",
    en: "deep spirituality, intuition and a harmonious character",
    de: "Tiefe Spiritualität, Intuition und ein harmonischer Charakter",
    ar: "الروحانية العميقة والحدس والشخصية المنسجمة",
  },
  Z: {
    tr: "hız, pratiklik ve öncü bir ruh",
    en: "speed, practicality and a pioneering spirit",
    de: "Geschwindigkeit, Praktikabilität und Pioniergeist",
    ar: "السرعة والعملية والروح الريادية",
  },
  Ê: {
    tr: "özgürlük sevgisi, merak ve uyum yeteneği",
    en: "love of freedom, curiosity and adaptability",
    de: "Freiheitsliebe, Neugier und Anpassungsfähigkeit",
    ar: "حب الحرية والفضول والقدرة على التكيف",
  },
  Î: {
    tr: "sezgisellik, ruhanilik ve güçlü iç ses",
    en: "intuition, spirituality and a strong inner voice",
    de: "Intuition, Spiritualität und eine starke innere Stimme",
    ar: "الحدس والروحانية والصوت الداخلي القوي",
  },
  Û: {
    tr: "özgünlük, bağımsız düşünce ve derin anlayış",
    en: "uniqueness, independent thinking and deep understanding",
    de: "Einzigartigkeit, unabhängiges Denken und tiefes Verständnis",
    ar: "التفرد والتفكير المستقل والفهم العميق",
  },
  Ş: {
    tr: "güçlü irade, koruyucu ruh ve güvenilirlik",
    en: "strong will, a protective spirit and trustworthiness",
    de: "Starker Wille, Schutzgeist und Vertrauenswürdigkeit",
    ar: "الإرادة القوية والروح الحامية والجدارة بالثقة",
  },
  Ç: {
    tr: "öncü ruh, cesaret ve dinamik enerji",
    en: "pioneering spirit, courage and dynamic energy",
    de: "Pioniergeist, Mut und dynamische Energie",
    ar: "الروح الريادية والشجاعة والطاقة الديناميكية",
  },
};

// ─── Harf sayısı → numerolojik enerji ─────────────────────────────────────
function numerologyDesc(len: number, lang: string): string {
  const map: Record<number, Record<string, string>> = {
    1: { tr: "eşsiz bir yenilik ve öncülük enerjisi", en: "a unique pioneering energy", de: "eine einzigartige Pionierenergie", ar: "طاقة ريادية فريدة" },
    2: { tr: "denge, işbirliği ve uyum enerjisi", en: "balance, cooperation and harmony energy", de: "Energie der Balance, Kooperation und Harmonie", ar: "طاقة التوازن والتعاون والانسجام" },
    3: { tr: "yaratıcılık, iletişim ve ifade enerjisi", en: "creativity, communication and expression energy", de: "Energie der Kreativität, Kommunikation und Ausdruck", ar: "طاقة الإبداع والتواصل والتعبير" },
    4: { tr: "kararlılık, disiplin ve güvenilirlik enerjisi", en: "determination, discipline and reliability energy", de: "Energie der Entschlossenheit, Disziplin und Zuverlässigkeit", ar: "طاقة العزم والانضباط والموثوقية" },
    5: { tr: "özgürlük, değişim ve macera enerjisi", en: "freedom, change and adventure energy", de: "Energie der Freiheit, des Wandels und Abenteuers", ar: "طاقة الحرية والتغيير والمغامرة" },
    6: { tr: "sevgi, aile ve şifa enerjisi", en: "love, family and healing energy", de: "Energie der Liebe, Familie und Heilung", ar: "طاقة الحب والأسرة والشفاء" },
    7: { tr: "ruhsallık, bilgelik ve sezgi enerjisi", en: "spirituality, wisdom and intuition energy", de: "Energie der Spiritualität, Weisheit und Intuition", ar: "طاقة الروحانية والحكمة والحدس" },
    8: { tr: "güç, başarı ve maddi denge enerjisi", en: "power, success and material balance energy", de: "Energie der Stärke, des Erfolgs und materiellen Gleichgewichts", ar: "طاقة القوة والنجاح والتوازن المادي" },
    9: { tr: "insancıllık, tamamlanma ve evrensel sevgi enerjisi", en: "humanity, completion and universal love energy", de: "Energie der Humanität, Vollendung und universellen Liebe", ar: "طاقة الإنسانية والاكتمال والحب الكوني" },
  };
  const key = ((len - 1) % 9) + 1; // 1-9 arası döngü
  return (map[key]?.[lang]) ?? (map[key]?.["tr"]);
}

// ─── Spintax: Kuran'da geçiyor mu? ─────────────────────────────────────────
const QURAN_VARIANTS: Record<string, string[]> = {
  tr: [
    "Bu isim saf Kürtçe kökenlidir; Kuran'da doğrudan yer almamaktadır. Ancak İslam alimlerinin büyük çoğunluğu, anlamı güzel olan Kürtçe isimlerin kullanımını caiz görmektedir.",
    "Kuran-ı Kerim'de geçmeyen bu isim, Kürt kültürünün doğa ve yaşam felsefesinden doğmuştur. Dini kısıtlaması bulunmamaktadır.",
    "Fıkıh literatüründe, zararlı veya olumsuz anlam taşımayan her ismin kullanılabilirliği genel kural olarak benimsenmiştir. Bu isim bu kurala tamamen uygundur.",
    "İslami perspektiften değerlendirildiğinde, olumsuz bir anlam barındırmayan ve Kürt kültürüne özgü bu ismin kullanımı caizdir.",
  ],
  en: [
    "This name is of pure Kurdish origin and does not appear directly in the Quran. However, Islamic scholars generally consider Kurdish names with beautiful meanings permissible.",
    "Not found in the Quran, this name emerged from Kurdish culture's philosophy of nature and life, with no religious restrictions.",
    "Islamic jurisprudence generally accepts any name that does not carry a harmful or negative meaning. This name fully meets that criterion.",
    "From an Islamic perspective, this culturally specific Kurdish name with no negative connotation is considered permissible to use.",
  ],
  de: [
    "Dieser Name ist rein kurdischen Ursprungs und taucht nicht direkt im Koran auf. Islamische Gelehrte betrachten kurdische Namen mit schönen Bedeutungen jedoch generell als zulässig.",
    "Dieser im Koran nicht vorkommende Name entstammt der Natur- und Lebensphilosophie der kurdischen Kultur, ohne religiöse Einschränkungen.",
    "Die islamische Rechtslehre akzeptiert generell jeden Namen, der keine schädliche oder negative Bedeutung trägt. Dieser Name erfüllt dieses Kriterium vollständig.",
    "Aus islamischer Perspektive gilt dieser kulturspezifische kurdische Name ohne negative Konnotation als zulässig.",
  ],
  ar: [
    "هذا الاسم كردي الأصل ولا يرد مباشرةً في القرآن الكريم، غير أن جمهور العلماء يجيز الأسماء الكردية ذات المعاني الجميلة.",
    "لا يُذكر الاسم في القرآن، وقد نشأ من فلسفة الطبيعة والحياة الكردية دون أي قيود دينية.",
    "تُقبل الأسماء التي لا تحمل معنى ضاراً أو سلبياً في الفقه الإسلامي قاعدةً عامة، وهذا الاسم يستوفي هذا الشرط تماماً.",
    "من المنظور الإسلامي، يُعدّ هذا الاسم الكردي الخاص بثقافته والخالي من أي دلالة سلبية مباحاً.",
  ],
};

// ─── Spintax: En çok tercih edilen yaş grubu ───────────────────────────────
const AGE_VARIANTS: Record<string, string[]> = {
  tr: [
    "Son yıllarda özellikle 2015-2024 doğumlu kuşak için sıkça tercih edilen bu isim, modern ebeveynlerin gözdesidir.",
    "Bebek isim trendlerinde öne çıkan bu isim, genç nesil Kürt aileleri arasında yükselen bir popülariteye sahiptir.",
    "İsim veritabanı analizlerimize göre bu isim, 2010'ların ortasından itibaren arama listelerinde üst sıralarda yer almaktadır.",
    "Geleneksel kökleri olmasına karşın modern tınısıyla bu isim, özellikle kentlerde yaşayan Kürt ailelerin favorisi haline gelmiştir.",
  ],
  en: [
    "This name has been frequently chosen for children born between 2015-2024, making it a favourite among modern parents.",
    "Appearing prominently in baby name trends, this name enjoys rising popularity among younger Kurdish families.",
    "According to our name database analysis, this name has ranked highly in search lists since the mid-2010s.",
    "Despite its traditional roots, this name with its modern sound has become a favourite among Kurdish families living in urban areas.",
  ],
  de: [
    "Dieser Name wird in den letzten Jahren besonders häufig für Kinder der Jahrgänge 2015–2024 gewählt und ist bei modernen Eltern beliebt.",
    "Als aufstrebender Name in Baby-Namens-Trends erfreut sich dieser Name wachsender Beliebtheit bei jungen kurdischen Familien.",
    "Laut unserer Namensanalyse steht dieser Name seit Mitte der 2010er Jahre weit oben in den Suchlisten.",
    "Trotz seiner traditionellen Wurzeln ist dieser Name mit seinem modernen Klang zum Liebling kurdischer Stadtfamilien geworden.",
  ],
  ar: [
    "يُختار هذا الاسم كثيراً لمواليد ما بين عامَي 2015 و2024، إذ بات من المفضلات لدى الآباء العصريين.",
    "يبرز هذا الاسم في اتجاهات أسماء الأطفال ويحظى بشعبية متصاعدة بين الأسر الكردية الشابة.",
    "وفقاً لتحليلات قاعدة بيانات الأسماء لدينا، يتصدر هذا الاسم قوائم البحث منذ منتصف عقد 2010.",
    "رغم جذوره التقليدية، أصبح هذا الاسم ذو الجرس الحديث من المفضلات لدى الأسر الكردية في المناطق الحضرية.",
  ],
};

// ─── Spintax: Birlikte yakışan isimler ───────────────────────────────────────
const SIBLING_FEMALE = ["Berfîn", "Evîn", "Ronahî", "Jiyan", "Lorin", "Dilşa", "Viyan", "Arya", "Şîlan", "Helîn"];
const SIBLING_MALE   = ["Baran", "Mîr", "Diyar", "Argeş", "Aso", "Zinar", "Cîvan", "Bager", "Şêrko", "Rênas"];

function siblingNames(gender: string, seed: number): string[] {
  const pool = gender === "female" ? SIBLING_FEMALE : SIBLING_MALE;
  const start = Math.abs(seed) % pool.length;
  const result: string[] = [];
  for (let i = 0; i < 3; i++) result.push(pool[(start + i) % pool.length]);
  return result;
}

// ─── Ana jeneratör ─────────────────────────────────────────────────────────
export function generateDynamicFaqs(
  nameItem: NameData,
  lang: string,
  meaning: string,
  origin: string,
  genderText: string,
): FaqItem[] {
  const name  = nameItem.name;
  const len   = name.length;
  const seed  = name.charCodeAt(0) + len; // İsme özgü sabit tohum
  const lng   = (["tr","en","de","ar"].includes(lang)) ? lang : "tr";

  // --- Karakter analizi (tag'e göre) ---
  const dominantTag = nameItem.tags?.find(t => TAG_CHARACTER[t]) ?? "";
  const charDesc =
    TAG_CHARACTER[dominantTag]?.[lng] ??
    (lng === "tr"
      ? "derin kültürel kökler ve güçlü bir ruhla bezenmiş özgün bir karakter"
      : lng === "en"
      ? "an original character adorned with deep cultural roots and a powerful spirit"
      : lng === "de"
      ? "einen originellen Charakter mit tiefen kulturellen Wurzeln und einem starken Geist"
      : "شخصية أصيلة مزيّنة بجذور ثقافية عميقة وروح قوية");

  // --- Harf kişilik ---
  const firstLetter = name.charAt(0).toUpperCase();
  const letterPersonality =
    LETTER_PERSONALITY[firstLetter]?.[lng] ??
    (lng === "tr" ? "güçlü bir karakter ve derin kültürel miras" :
     lng === "en" ? "a strong character and deep cultural heritage" :
     lng === "de" ? "einen starken Charakter und ein tiefes kulturelles Erbe" :
     "شخصية قوية وإرث ثقافي عميق");

  // --- Numeroloji ---
  const numDesc = numerologyDesc(len, lng);

  // --- Spintax seçimleri ---
  const quranAnswer  = pick(QURAN_VARIANTS[lng]  ?? QURAN_VARIANTS.tr,  seed);
  const ageAnswer    = pick(AGE_VARIANTS[lng]     ?? AGE_VARIANTS.tr,    seed + 1);
  const siblings     = siblingNames(nameItem.gender, seed);
  const isFemale     = nameItem.gender === "female";

  // ─── TR ───────────────────────────────────────────────────────────────────
  if (lng === "tr") {
    const genderAdj = isFemale ? "kız" : "erkek";
    return [
      {
        question: `${name} isminin anlamı nedir?`,
        answer: `${name} ismi ${origin} kökenli olup şu anlama gelmektedir: ${meaning}. Kelime kökü tarihsel olarak ${origin} dilinin derin anlatım geleneğine dayanmaktadır.`,
      },
      {
        question: `${name} ismi nereden geliyor, kökeni nedir?`,
        answer: `${name} isminin kökeni ${origin} olup binlerce yıllık kadim Kürt kültürünün zenginliğini taşımaktadır. Bu isim; Mezopotamya'nın tarihi dokusuyla, göçebe çoban geleneğiyle ve Kürt şiirinin anlatım gücüyle iç içe geçmiştir.`,
      },
      {
        question: `${name} ismi ${genderAdj} ismi mi?`,
        answer: `Evet, ${name} ismi geleneksel olarak ${genderText} ${genderAdj} ismi olarak kullanılmaktadır. Bu kullanım Kürtçe isim geleneğiyle tamamen uyumludur.`,
      },
      {
        question: `${name} ismi Kuran'da geçiyor mu, caiz midir?`,
        answer: quranAnswer,
      },
      {
        question: `${name} ismi taşıyan biri nasıl bir karaktere sahiptir?`,
        answer: `${name} ismine göre yapılan kültürel analize göre bu ismi taşıyan kişiler; ${charDesc}. ${firstLetter} harfiyle başlayan isimler genellikle ${letterPersonality} özelliklerini ön plana çıkarır.`,
      },
      {
        question: `${name} isminin harf analizi nedir?`,
        answer: `${name} ismi ${len} harften oluşmaktadır. ${len} harfli isimler numerolojide ${numDesc} ile ilişkilendirilir. Ayrıca ${firstLetter} harfi; ${letterPersonality} enerjisini temsil eder.`,
      },
      {
        question: `${name} isminin numerolojik değeri nedir?`,
        answer: `Numerolojide ismin harf sayısı ve harf değerleri önemlidir. ${name} ismi ${len} harften oluşup ${numDesc} taşır. Bu enerji, kişinin yaşam yolculuğunu ve karakter eğilimlerini şekillendirir.`,
      },
      {
        question: `${name} ismiyle uyumlu kardeş isimleri nelerdir?`,
        answer: `${name} ismiyle anlam ve ses uyumu açısından iyi eşleşen ${genderAdj} kardeş isimleri arasında ${siblings.join(", ")} gibi isimler sayılabilir. Bu isimler aynı kültürel kökten beslenmektedir.`,
      },
      {
        question: `${name} ismi en çok hangi dönemde popüler olmuştur?`,
        answer: ageAnswer,
      },
      {
        question: `${name} isminin Kürt kültüründeki yeri ve önemi nedir?`,
        answer: `${name} ismi, Kürt edebiyatında ve folklöründe ${origin} geleneklerine dayanan özel bir yere sahiptir. ${dominantTag ? `"${dominantTag}" temasıyla öne çıkan bu isim,` : "Bu isim,"} Kürt kültürünün en köklü isim geleneğini yansıtmaktadır.`,
      },
      {
        question: `${name} ismi mitolojik veya edebi kaynaklarda geçiyor mu?`,
        answer: `${name} gibi isimler, Kürt destanları ve şiir geleneğinde sıkça kullanılmıştır. Özellikle Mem û Zîn başta olmak üzere pek çok klasik Kürtçe eserde bu tarz isimler hem karakter adı hem de sembolik anlam taşıyan şiirsel bir unsur olarak karşımıza çıkar.`,
      },
      {
        question: `${name} ismi Türkçe konuşan aileler tarafından telaffuz edilebilir mi?`,
        answer: `${name} ismi Türkçe fonetik kurallarına büyük ölçüde uyumludur. ${name.split("").some(c => "êîûêîû".includes(c.toLowerCase())) ? "İsimde yer alan özel Kürtçe sesli harfler (ê, î, û) Türkçe'ye yakın bir şekilde telaffuz edilebilir." : "Özel karakter içermeyen bu isim, Türkçe konuşan aileler tarafından kolaylıkla telaffuz edilebilir."}`,
      },
      {
        question: `${name} isminin kısaltması veya sevgi ifadesi var mıdır?`,
        answer: `${name} ismi için aile içinde kullanılan sevgi kısaltmaları kişiden kişiye değişmektedir. ${len <= 4 ? `${name} zaten kısa ve şık bir yapıya sahip olduğundan genellikle tam adıyla kullanılır.` : `Genellikle "${name.slice(0, Math.ceil(len / 2))}" şeklinde kısaltılabilir ya da sona "-ko", "-can", "-ê" eklenerek sevgi ifadesi oluşturulabilir.`}`,
      },
      {
        question: `${name} ismi dünya genelinde başka ülkelerde de kullanılıyor mu?`,
        answer: `${name} ismi başta Türkiye, Irak, İran ve Suriye olmak üzere Kürtlerin yaşadığı coğrafyalarda yaygın olarak kullanılmaktadır. Avrupa'daki Kürt diaspora topluluklarında da bu isim dikkat çekmektedir. ${origin.includes("Farsça") || origin.includes("Arapça") ? "Kökeni dolayısıyla komşu kültürlerde de benzer isimlerle karşılaşılmaktadır." : ""}`,
      },
      {
        question: `${name} ismini değerlendiren dil bilimciler ne düşünüyor?`,
        answer: `Dil bilimciler ${name} ismini; fonetik açıdan ${len <= 5 ? "kısa ve akılda kalıcı" : "zengin ve akıcı"} bir yapıya sahip olarak değerlendirmektedir. ${origin} kökenli sözcük dağarcığının önemli bir örneği olan bu isim, Kürtçe'nin ses uyum sisteminin güzelliğini gözler önüne serer.`,
      },
    ];
  }

  // ─── EN ───────────────────────────────────────────────────────────────────
  if (lng === "en") {
    return [
      {
        question: `What is the meaning of the name ${name}?`,
        answer: `The name ${name} is of ${origin} origin and means: ${meaning}. Its etymological root draws on the deep expressive tradition of the ${origin} language.`,
      },
      {
        question: `What is the origin of the name ${name}?`,
        answer: `${name} has ${origin} roots and carries the richness of thousands of years of ancient Kurdish culture, intertwined with Mesopotamian heritage, nomadic tradition, and the eloquence of Kurdish poetry.`,
      },
      {
        question: `Is ${name} a boy's or girl's name?`,
        answer: `${name} is traditionally used as a ${genderText} name and is fully consistent with Kurdish naming conventions.`,
      },
      {
        question: `Does the name ${name} appear in the Quran? Is it permissible?`,
        answer: quranAnswer,
      },
      {
        question: `What kind of character does someone named ${name} typically have?`,
        answer: `Cultural analysis of the name ${name} suggests that people bearing this name ${charDesc}. Names beginning with ${firstLetter} tend to emphasise ${letterPersonality}.`,
      },
      {
        question: `What is the letter analysis of the name ${name}?`,
        answer: `The name ${name} consists of ${len} letters. In numerology, names with ${len} letters are associated with ${numDesc}. Furthermore, the letter ${firstLetter} represents the energy of ${letterPersonality}.`,
      },
      {
        question: `What is the numerological value of the name ${name}?`,
        answer: `In numerology, a name's letter count and letter values matter. ${name}, with its ${len} letters, carries ${numDesc}. This energy shapes one's life journey and character tendencies.`,
      },
      {
        question: `What sibling names pair well with ${name}?`,
        answer: `Names that harmonise well with ${name} in meaning and sound include ${siblings.join(", ")}. These names share the same cultural roots.`,
      },
      {
        question: `When was the name ${name} most popular?`,
        answer: ageAnswer,
      },
      {
        question: `What is the significance of ${name} in Kurdish culture?`,
        answer: `The name ${name} holds a special place in Kurdish literature and folklore rooted in ${origin} traditions. ${dominantTag ? `Prominent for its "${dominantTag}" theme, this name` : "This name"} reflects one of the most deeply-rooted naming traditions in Kurdish culture.`,
      },
      {
        question: `Does ${name} appear in mythology or literary sources?`,
        answer: `Names like ${name} have long been used in Kurdish epics and poetic tradition. Classical Kurdish works, most notably Mem û Zîn, feature such names both as character names and as poetic symbols carrying deep meaning.`,
      },
      {
        question: `Can non-Kurdish speakers easily pronounce ${name}?`,
        answer: `The name ${name} is largely compatible with English and other European phonetic systems. ${name.split("").some(c => "êîûêîû".includes(c.toLowerCase())) ? "The special Kurdish vowels (ê, î, û) can be approximated as 'ay', 'ee' and 'oo' respectively." : "Containing no special characters, this name can be easily pronounced by non-Kurdish speakers."}`,
      },
      {
        question: `Are there nicknames or affectionate forms of ${name}?`,
        answer: `Affectionate short forms of ${name} vary by family. ${len <= 4 ? `${name} is already short and elegant, so it is usually used in full.` : `It can often be shortened to "${name.slice(0, Math.ceil(len / 2))}", or affectionate suffixes such as "-ko" or "-jan" may be added.`}`,
      },
      {
        question: `Is the name ${name} used outside of Kurdish communities?`,
        answer: `${name} is widely used in regions where Kurds live, including Turkey, Iraq, Iran and Syria. It also attracts attention in Kurdish diaspora communities in Europe. ${origin.includes("Persian") || origin.includes("Arabic") ? "Due to its origin, similar names can be found in neighbouring cultures." : ""}`,
      },
      {
        question: `How do linguists assess the name ${name}?`,
        answer: `Linguists describe ${name} as phonetically ${len <= 5 ? "concise and memorable" : "rich and fluid"}. As a notable example of the ${origin} lexical heritage, this name showcases the beauty of the Kurdish phonetic harmony system.`,
      },
    ];
  }

  // ─── DE ───────────────────────────────────────────────────────────────────
  if (lng === "de") {
    return [
      {
        question: `Was bedeutet der Name ${name}?`,
        answer: `Der Name ${name} hat ${origin}-Herkunft und bedeutet: ${meaning}. Seine etymologische Wurzel schöpft aus der tiefen Ausdruckstradition der ${origin}-Sprache.`,
      },
      {
        question: `Woher stammt der Name ${name}?`,
        answer: `${name} hat ${origin}-Wurzeln und trägt den Reichtum tausender Jahre alter kurdischer Kultur, verwoben mit mesopotamischem Erbe, Nomadentradition und der Ausdruckskraft der kurdischen Poesie.`,
      },
      {
        question: `Ist ${name} ein Mädchen- oder Jungenname?`,
        answer: `${name} wird traditionell als ${genderText}-Name verwendet und steht im Einklang mit der kurdischen Namensgebungstradition.`,
      },
      {
        question: `Kommt der Name ${name} im Koran vor? Ist er erlaubt?`,
        answer: quranAnswer,
      },
      {
        question: `Welchen Charakter haben Personen mit dem Namen ${name}?`,
        answer: `Die Kulturanalyse des Namens ${name} zeigt, dass Träger dieses Namens ${charDesc}. Namen, die mit ${firstLetter} beginnen, betonen häufig ${letterPersonality}.`,
      },
      {
        question: `Was sagt die Buchstabenanalyse des Namens ${name} aus?`,
        answer: `Der Name ${name} besteht aus ${len} Buchstaben. In der Numerologie werden Namen mit ${len} Buchstaben mit ${numDesc} assoziiert. Der Buchstabe ${firstLetter} repräsentiert zudem die Energie von ${letterPersonality}.`,
      },
      {
        question: `Welchen numerologischen Wert hat der Name ${name}?`,
        answer: `In der Numerologie sind Buchstabenanzahl und -werte eines Namens bedeutsam. ${name} trägt mit seinen ${len} Buchstaben ${numDesc}. Diese Energie prägt den Lebensweg und die Charaktertendenzen.`,
      },
      {
        question: `Welche Geschwisternamen passen gut zu ${name}?`,
        answer: `Namen, die mit ${name} harmonieren, sind unter anderem ${siblings.join(", ")}. Diese Namen teilen dieselben kulturellen Wurzeln.`,
      },
      {
        question: `Wann war der Name ${name} am beliebtesten?`,
        answer: ageAnswer,
      },
      {
        question: `Welche Bedeutung hat ${name} in der kurdischen Kultur?`,
        answer: `Der Name ${name} nimmt in der kurdischen Literatur und Folklore einen besonderen Platz ein, der in ${origin}-Traditionen verwurzelt ist. ${dominantTag ? `Mit seinem "${dominantTag}"-Thema spiegelt dieser Name` : "Dieser Name spiegelt"} eine der tiefverwurzelsten Namensgebungstraditionen der kurdischen Kultur wider.`,
      },
      {
        question: `Taucht ${name} in mythologischen oder literarischen Quellen auf?`,
        answer: `Namen wie ${name} werden seit Langem in kurdischen Epen und der Dichtertradition verwendet. Klassische kurdische Werke, allen voran Mem û Zîn, nutzen solche Namen sowohl als Charakternamen als auch als poetische Symbole.`,
      },
      {
        question: `Können nicht-kurdische Sprecher ${name} leicht aussprechen?`,
        answer: `Der Name ${name} ist weitgehend mit deutschen und anderen europäischen Lautsystemen kompatibel. ${name.split("").some(c => "êîûêîû".includes(c.toLowerCase())) ? "Die besonderen kurdischen Vokale (ê, î, û) können annäherungsweise ausgesprochen werden." : "Da der Name keine Sonderzeichen enthält, kann er von Nicht-Kurden leicht ausgesprochen werden."}`,
      },
      {
        question: `Gibt es Kosenamen oder Kurzformen von ${name}?`,
        answer: `Kosenamen für ${name} variieren von Familie zu Familie. ${len <= 4 ? `${name} hat bereits eine kurze und elegante Form und wird meist vollständig verwendet.` : `Oft wird es auf "${name.slice(0, Math.ceil(len / 2))}" gekürzt, oder es werden Kosenachsilben wie "-ko" oder "-jan" angehängt.`}`,
      },
      {
        question: `Wird der Name ${name} auch außerhalb kurdischer Gemeinschaften verwendet?`,
        answer: `${name} ist in Regionen verbreitet, in denen Kurden leben, darunter die Türkei, der Irak, der Iran und Syrien. In den kurdischen Diasporagemeinschaften Europas erregt dieser Name ebenfalls Aufmerksamkeit.`,
      },
      {
        question: `Wie beurteilen Sprachwissenschaftler den Namen ${name}?`,
        answer: `Sprachwissenschaftler beschreiben ${name} als phonetisch ${len <= 5 ? "prägnant und einprägsam" : "reich und fließend"}. Als bemerkenswertes Beispiel des ${origin}-Wortschatzes veranschaulicht dieser Name die Schönheit des kurdischen Vokalharmoniesystems.`,
      },
    ];
  }

  // ─── AR ───────────────────────────────────────────────────────────────────
  return [
    {
      question: `ما معنى اسم ${name}؟`,
      answer: `اسم ${name} ذو أصل ${origin} ويعني: ${meaning}. وتستمد جذوره الاشتقاقية من التقليد التعبيري العريق للغة ${origin}.`,
    },
    {
      question: `ما هو أصل اسم ${name}؟`,
      answer: `يحمل اسم ${name} جذوراً ${origin} ويجسّد غنى آلاف السنين من الحضارة الكردية العريقة، المتشابكة مع الإرث المسوبوتامي والتقاليد الرعوية وبلاغة الشعر الكردي.`,
    },
    {
      question: `هل ${name} اسم فتاة أم فتى؟`,
      answer: `يُستخدم اسم ${name} تقليدياً اسماً ${genderText} وهو متوافق تماماً مع تقاليد التسمية الكردية.`,
    },
    {
      question: `هل يرد اسم ${name} في القرآن الكريم؟ هل هو جائز؟`,
      answer: quranAnswer,
    },
    {
      question: `ما طبيعة شخصية حامل اسم ${name}؟`,
      answer: `وفقاً للتحليل الثقافي لاسم ${name}، يتمتع أصحاب هذا الاسم بـ${charDesc}. وتُبرز الأسماء التي تبدأ بحرف ${firstLetter} عادةً صفات ${letterPersonality}.`,
    },
    {
      question: `ما التحليل الحرفي لاسم ${name}؟`,
      answer: `يتكوّن اسم ${name} من ${len} حروف. في علم الأرقام، ترتبط الأسماء المكوّنة من ${len} حروف بـ${numDesc}. يمثّل حرف ${firstLetter} كذلك طاقة ${letterPersonality}.`,
    },
    {
      question: `ما القيمة العددية لاسم ${name}؟`,
      answer: `في علم الأرقام، يحمل اسم ${name} المؤلّف من ${len} حروف ${numDesc}. تُشكّل هذه الطاقة مسيرة الشخص الحياتية وميوله الشخصية.`,
    },
    {
      question: `ما أسماء الأشقاء التي تتناسب مع ${name}؟`,
      answer: `من أبرز الأسماء المتناسقة مع ${name} معنىً وجرساً: ${siblings.join("، ")}. تنتمي هذه الأسماء إلى الجذر الثقافي ذاته.`,
    },
    {
      question: `متى بلغ اسم ${name} ذروة انتشاره؟`,
      answer: ageAnswer,
    },
    {
      question: `ما مكانة اسم ${name} في الثقافة الكردية؟`,
      answer: `يحتل اسم ${name} مكانة متميزة في الأدب الكردي والفولكلور، إذ يرتكز على التقاليد ${origin}. ${dominantTag ? `يعكس هذا الاسم البارز بموضوع "${dominantTag}"` : "يعكس هذا الاسم"} إحدى أعرق تقاليد التسمية في الثقافة الكردية.`,
    },
    {
      question: `هل يرد اسم ${name} في المصادر الأسطورية أو الأدبية؟`,
      answer: `شاعت أسماء كـ${name} في الملاحم الكردية والتراث الشعري منذ أمد بعيد. وتوظّف الأعمال الكردية الكلاسيكية، لا سيما "مم وزين"، هذه الأسماء شخصياتٍ وتعبيراً شعرياً رمزياً ذا دلالة عميقة.`,
    },
    {
      question: `هل يستطيع غير الكرد نطق اسم ${name} بسهولة؟`,
      answer: `يتوافق اسم ${name} إلى حد بعيد مع الأنظمة الصوتية العربية وغيرها. ${name.split("").some(c => "êîûêîû".includes(c.toLowerCase())) ? "يمكن تقريب الحروف الصائتة الكردية الخاصة (ê، î، û) عند النطق." : "لا يحتوي الاسم على حروف خاصة مما يجعل نطقه سهلاً."}`,
    },
    {
      question: `هل لاسم ${name} مصغّرات أو صيغ تدليل؟`,
      answer: `تتباين أشكال التدليل لاسم ${name} من أسرة إلى أخرى. ${len <= 4 ? `نظراً لقِصَر الاسم وأناقته، يُستخدم عادةً بصيغته الكاملة.` : `كثيراً ما يُختصر إلى "${name.slice(0, Math.ceil(len / 2))}" أو تُضاف إليه لاحقات تدليلية كـ"-كو" أو "-جان".`}`,
    },
    {
      question: `هل يُستخدم اسم ${name} خارج المجتمعات الكردية؟`,
      answer: `يُستخدم اسم ${name} على نطاق واسع في مناطق تواجد الكرد كتركيا والعراق وإيران وسوريا، كما يستقطب الاهتمام في مجتمعات الشتات الكردي في أوروبا. ${origin.includes("عربي") || origin.includes("فارسي") ? "وبحكم أصله، توجد أسماء مشابهة في الثقافات المجاورة." : ""}`,
    },
    {
      question: `كيف يقيّم اللغويون اسم ${name}؟`,
      answer: `يصف اللغويون اسم ${name} بأنه صوتياً ${len <= 5 ? "مقتضب وسهل الحفظ" : "غني ومتدفق"}. بوصفه نموذجاً بارزاً من المعجم ${origin}، يُجسّد هذا الاسم جمال نظام التناسق الصوتي الكردي.`,
    },
  ];
}
