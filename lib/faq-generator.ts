import {
  NameData,
  analyzeNameLinguistics,
  getAdjacentAndLetterNames,
} from "./names-data";

export interface FaqItem {
  question: string;
  answer: string;
}

const TAG_CHARACTER: Record<string, Record<string, string>> = {
  "Doğa / Yaşam": {
    tr: "doğa, tabiat ve yaşam",
    en: "nature, vitality, and life",
    de: "Natur, Vitalität und Leben",
    ar: "الطبيعة والحياة والحيوية",
  },
  "Çiçek / Doğa": {
    tr: "çiçek, bahar ve tabiat",
    en: "blossoms, spring, and nature",
    de: "Blüten, Frühling und Natur",
    ar: "الأزهار والربيع والطبيعة",
  },
  "Cesaret / Güç": {
    tr: "cesaret, kararlılık ve güç",
    en: "courage, resilience, and strength",
    de: "Mut, Entschlossenheit und Stärke",
    ar: "الشجاعة والعزيمة والقوة",
  },
  "Sevgi / Güzellik": {
    tr: "sevgi, zarafet ve estetik",
    en: "love, elegance, and grace",
    de: "Liebe, Anmut und Ästhetik",
    ar: "المحبة والجمال والأناقة",
  },
  "Işık / Aydınlık": {
    tr: "ışık, güneş ve aydınlık",
    en: "light, radiance, and clarity",
    de: "Licht, Glanz und Helligkeit",
    ar: "النور والإشراق والضياء",
  },
  "Işık": {
    tr: "ışık ve parlaklık",
    en: "light and brightness",
    de: "Licht und Leuchtkraft",
    ar: "النور والسطوع",
  },
  "Bilgelik / Akıl": {
    tr: "bilgelik, feraset ve derinlik",
    en: "wisdom, insight, and intellect",
    de: "Weisheit, Einsicht und Verstand",
    ar: "الحكمة والبصيرة والمعرفة",
  },
  "Destansı": {
    tr: "destansı miras ve tarihsel hafıza",
    en: "epic heritage and historical memory",
    de: "episches Erbe und historische Überlieferung",
    ar: "التراث الملحمي والذاكرة التاريخية",
  },
};

const SIBLING_FEMALE = [
  "Berfîn", "Evîn", "Ronahî", "Jiyan", "Lorin", "Dilşa",
  "Viyan", "Arya", "Şîlan", "Helîn", "Rojda", "Roza",
  "Hêvî", "Dîlan", "Pelîn", "Nûdem", "Narîn", "Zelal",
];
const SIBLING_MALE = [
  "Baran", "Mîr", "Diyar", "Argeş", "Aso", "Zinar",
  "Cîvan", "Bager", "Şêrko", "Rênas", "Serhad", "Rojhat",
  "Botan", "Ciwan", "Şervan", "Mirza", "Agir", "Berzan",
];

function siblingNames(gender: string, seed: number): string[] {
  const pool = gender === "female" ? SIBLING_FEMALE : SIBLING_MALE;
  const start = Math.abs(seed) % pool.length;
  const result: string[] = [];
  for (let i = 0; i < 3; i++) {
    result.push(pool[(start + i) % pool.length]);
  }
  return result;
}

export function generateDynamicFaqs(
  nameItem: NameData,
  lang: string,
  meaning: string,
  origin: string,
  genderText: string
): FaqItem[] {
  const name = nameItem.name;
  const len = name.length;
  const seed = name.charCodeAt(0) + len;
  const lng = (["tr", "en", "de", "ar"].includes(lang) ? lang : "tr") as
    | "tr"
    | "en"
    | "de"
    | "ar";

  const dominantTag = nameItem.tags?.find((t) => TAG_CHARACTER[t]) ?? "";
  const tagDesc = dominantTag ? TAG_CHARACTER[dominantTag]?.[lng] || "" : "";
  const siblings = siblingNames(nameItem.gender, seed);
  const isFemale = nameItem.gender === "female";

  const ling = analyzeNameLinguistics(nameItem);
  const nav = getAdjacentAndLetterNames(nameItem, 4);
  const peerList = nav.letterPeers.slice(0, 3).map((p) => p.name);
  const cleanDesc =
    nameItem.description && nameItem.description !== nameItem.meaning
      ? nameItem.description.replace(/^[^;]+;\s*/, "")
      : "";

  if (lng === "tr") {
    const genderAdj = isFemale ? "kız" : "erkek";
    const suffixNote = ling.detectedSuffix
      ? ` Kelime sonunda yer alan ${ling.detectedSuffix.meaning.tr} sayesinde isim hem yapısal hem de anlamsal bir bütünlük kazanır.`
      : ` ${ling.firstLetter} sesiyle başlayıp "${ling.lastLetter}" sesiyle tamamlanan ${ling.syllableCount} heceli yapısı, Kürtçe fonetik kurallarıyla tam uyum içindedir.`;

    return [
      {
        question: `${name} isminin anlamı nedir?`,
        answer: `${name} ismi ${origin} kökenli olup "${meaning.replace(/^[^;]+;\s*/, "")}" anlamına gelmektedir.${cleanDesc ? ` Geniş anlam çerçevesinde ise ${cleanDesc}` : ""} KurdishName sözlük arşivinde ${ling.firstLetter} harfi grubundaki ${nav.letterTotal} isim arasında #${nav.letterRank}. sırada yer alır.`,
      },
      {
        question: `${name} isminin kökeni, harf ve hece yapısı nasıldır?`,
        answer: `${name} ismi ${origin} dil mirasına dayanır; toplam ${ling.charCount} harf (${ling.vowelCount} ünlü, ${ling.consonantCount} ünsüz) ve ${ling.syllableCount} heceden oluşur.${suffixNote}${tagDesc ? ` Tematik olarak "${tagDesc}" kavramlarıyla özdeşleşmiştir.` : ""}`,
      },
      {
        question: `${name} ismi kız mı erkek mi?`,
        answer: `${name} ismi geleneksel ve modern Kürtçe adlandırma kültüründe ${genderAdj} bebek ismi olarak kullanılmaktadır. ${ling.charCount} harfli dengeli tınısı sayesinde hem tek başına hem de ikinci isim olarak sıkça tercih edilir.`,
      },
      {
        question: `${name} isminin Kürt kültüründeki yeri ve fonetik özellikleri nelerdir?`,
        answer: `${name} (${ling.uniqueVowels.join(", ")} ünlü dizilimiyle), Kürt sözlü edebiyatında ve aile geleneğinde ${tagDesc || "özgün anlam derinliği"} ile öne çıkan bir ${genderAdj} adıdır. Aynı harf grubunda ${peerList.join(", ")} gibi isimlerle komşu sözlük dizininde yer alır.`,
      },
      {
        question: `${name} ismiyle uyumlu kardeş ve benzer isimler hangileridir?`,
        answer: `${name} ismiyle fonetik akış, hece dengesi ve kültürel anlam bakımından en çok yakışan ${genderAdj} kardeş isimleri arasında ${siblings.join(", ")}${peerList.length ? ` ve aynı harfle başlayan ${peerList.join(", ")}` : ""} öne çıkmaktadır.`,
      },
    ];
  }

  if (lng === "en") {
    const suffixNote = ling.detectedSuffix
      ? ` Morphologically, it incorporates the element ${ling.detectedSuffix.meaning.en}.`
      : ` Starting with "${ling.firstLetter}" and ending with "${ling.lastLetter}", its ${ling.syllableCount}-syllable phonetic structure reflects authentic Kurdish prosody.`;

    return [
      {
        question: `What is the meaning of the name ${name}?`,
        answer: `The name ${name} is of ${origin} origin and means: ${meaning}. In the KurdishName encyclopedia, it is cataloged at position #${nav.letterRank} out of ${nav.letterTotal} authentic names under the letter ${ling.firstLetter}.`,
      },
      {
        question: `What is the linguistic and syllable structure of ${name}?`,
        answer: `${name} is rooted in the ${origin} language and consists of ${ling.charCount} letters (${ling.vowelCount} vowels and ${ling.consonantCount} consonants) across ${ling.syllableCount} syllable(s).${suffixNote}${tagDesc ? ` It is thematically linked with "${tagDesc}".` : ""}`,
      },
      {
        question: `Is ${name} a boy's or girl's name?`,
        answer: `${name} is traditionally given as a ${genderText} name in Kurdish naming conventions, appreciated for its ${ling.charCount}-letter balanced cadence.`,
      },
      {
        question: `How does ${name} fit within the ${ling.firstLetter}-letter Kurdish name group?`,
        answer: `Within the ${ling.firstLetter}-letter lexicon (${nav.letterTotal} names total), ${name} appears alongside neighboring entries such as ${peerList.join(", ")}, sharing harmonic vowel patterns (${ling.uniqueVowels.join(", ")}).`,
      },
      {
        question: `What sibling names pair well with ${name}?`,
        answer: `Names that harmonize gracefully with ${name} in cultural resonance and phonetic flow include ${siblings.join(", ")}${peerList.length ? `, as well as ${ling.firstLetter}-initial peers like ${peerList.join(", ")}` : ""}.`,
      },
    ];
  }

  if (lng === "de") {
    const suffixNote = ling.detectedSuffix
      ? ` Morphologisch enthält der Name das Element ${ling.detectedSuffix.meaning.de}.`
      : ` Mit dem Anfangsbuchstaben „${ling.firstLetter}“ und der Endung „${ling.lastLetter}“ folgt die ${ling.syllableCount}-silbige Struktur der klassischen kurdischen Phonetik.`;

    return [
      {
        question: `Was bedeutet der Name ${name}?`,
        answer: `Der Name ${name} ist ${origin}er Herkunft und bedeutet: ${meaning}. Im KurdishName-Lexikon steht er auf Platz #${nav.letterRank} von ${nav.letterTotal} Namen mit dem Anfangsbuchstaben ${ling.firstLetter}.`,
      },
      {
        question: `Wie ist die sprachliche und silbische Struktur von ${name}?`,
        answer: `${name} besteht aus ${ling.charCount} Buchstaben (${ling.vowelCount} Vokale, ${ling.consonantCount} Konsonanten) und ${ling.syllableCount} Silbe(n).${suffixNote}${tagDesc ? ` Thematisch wird er mit „${tagDesc}“ verbunden.` : ""}`,
      },
      {
        question: `Ist ${name} ein Mädchen- oder Jungenname?`,
        answer: `${name} wird in der kurdischen Namensgebungstradition als ${genderText}-Name verwendet.`,
      },
      {
        question: `Welche Stellung hat ${name} innerhalb der ${ling.firstLetter}-Namensgruppe?`,
        answer: `Innerhalb der ${nav.letterTotal} Namen umfassenden ${ling.firstLetter}-Gruppe steht ${name} im alphabetischen Register direkt neben Namen wie ${peerList.join(", ")}.`,
      },
      {
        question: `Welche Geschwisternamen passen klanglich zu ${name}?`,
        answer: `Zu ${name} passen sowohl klanglich als auch kulturell harmonierende Namen wie ${siblings.join(", ")}${peerList.length ? ` sowie verwandte ${ling.firstLetter}-Namen wie ${peerList.join(", ")}` : ""}.`,
      },
    ];
  }

  // Arabic (ar)
  const suffixNoteAr = ling.detectedSuffix
    ? ` ويتضمن الاسم في بنيته الصرفية المقطع ${ling.detectedSuffix.meaning.ar}.`
    : ` يبدأ الاسم بحرف "${ling.firstLetter}" وينتهي بحرف "${ling.lastLetter}" عبر ${ling.syllableCount} مقاطع صوتية متناغمة.`;

  return [
    {
      question: `ما معنى اسم ${name}؟`,
      answer: `اسم ${name} ذو أصل ${origin} ويعني: ${meaning}. ويصنف في معجم KurdishName في المرتبة #${nav.letterRank} من أصل ${nav.letterTotal} اسماً يبدأ بحرف ${ling.firstLetter}.`,
    },
    {
      question: `ما البنية اللغوية والصوتية لاسم ${name}؟`,
      answer: `يتكون اسم ${name} من ${ling.charCount} أحرف (${ling.vowelCount} حروف علة و${ling.consonantCount} حروف ساكنة) موزعة على ${ling.syllableCount} مقاطع صوتية.${suffixNoteAr}${tagDesc ? ` ويرتبط موضوعياً بدلالات "${tagDesc}".` : ""}`,
    },
    {
      question: `هل ${name} اسم فتاة أم فتى؟`,
      answer: `يُستخدم اسم ${name} تقليدياً اسماً ${genderText} في ثقافة التسمية الكردية.`,
    },
    {
      question: `ما الأسماء المجاورة لاسم ${name} في فهرس حرف ${ling.firstLetter}؟`,
      answer: `ضمن مجموعة حرف ${ling.firstLetter} التي تضم ${nav.letterTotal} اسماً، يجاور اسم ${name} في الفهرس الأبجدي أسماء مثل: ${peerList.join("، ")}.`,
    },
    {
      question: `ما أسماء الأشقاء المتناسقة مع ${name}؟`,
      answer: `من الأسماء المتناسقة مع ${name} جرساً ومعنى في الثقافة الكردية: ${siblings.join("، ")}${peerList.length ? ` بالإضافة إلى ${peerList.join("، ")}` : ""}.`,
    },
  ];
}
