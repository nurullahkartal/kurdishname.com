import { NameData } from "./names-data";

export interface FaqItem {
  question: string;
  answer: string;
}

const TAG_CHARACTER: Record<string, Record<string, string>> = {
  "Doğa / Yaşam": {
    tr: "doğa ve yaşam",
    en: "nature and life",
    de: "Natur und Leben",
    ar: "الطبيعة والحياة",
  },
  "Cesaret / Güç": {
    tr: "cesaret ve güç",
    en: "courage and strength",
    de: "Mut und Stärke",
    ar: "الشجاعة والقوة",
  },
  "Sevgi / Güzellik": {
    tr: "sevgi ve zarafet",
    en: "love and elegance",
    de: "Liebe und Anmut",
    ar: "المحبة والجمال",
  },
  "Işık / Aydınlık": {
    tr: "ışık ve aydınlık",
    en: "light and radiance",
    de: "Licht und Helligkeit",
    ar: "النور والضياء",
  },
  "Bilgelik / Akıl": {
    tr: "bilgelik ve akıl",
    en: "wisdom and intellect",
    de: "Weisheit und Verstand",
    ar: "الحكمة والبصيرة",
  },
};

const SIBLING_FEMALE = ["Berfîn", "Evîn", "Ronahî", "Jiyan", "Lorin", "Dilşa", "Viyan", "Arya", "Şîlan", "Helîn", "Rojda", "Roza", "Hêvî", "Dîlan", "Pelîn", "Nûdem", "Narîn", "Zelal"];
const SIBLING_MALE   = ["Baran", "Mîr", "Diyar", "Argeş", "Aso", "Zinar", "Cîvan", "Bager", "Şêrko", "Rênas", "Serhad", "Rojhat", "Botan", "Ciwan", "Şervan", "Mirza", "Agir", "Berzan"];

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
  genderText: string,
): FaqItem[] {
  const name  = nameItem.name;
  const len   = name.length;
  const seed  = name.charCodeAt(0) + len;
  const lng   = (["tr", "en", "de", "ar"].includes(lang)) ? lang : "tr";

  const dominantTag = nameItem.tags?.find(t => TAG_CHARACTER[t]) ?? "";
  const tagDesc = dominantTag ? (TAG_CHARACTER[dominantTag]?.[lng] || "") : "";
  const siblings = siblingNames(nameItem.gender, seed);
  const isFemale = nameItem.gender === "female";

  if (lng === "tr") {
    const genderAdj = isFemale ? "kız" : "erkek";
    return [
      {
        question: `${name} isminin anlamı nedir?`,
        answer: `${name} ismi ${origin} kökenli olup şu anlama gelmektedir: ${meaning}. Kelime kökü geleneksel ${origin} isim dağarcığında saygın ve olumlu bir manayı temsil eder.`,
      },
      {
        question: `${name} isminin kökeni ve etimolojik yapısı nedir?`,
        answer: `${name} ismi ${origin} dil kökenine sahiptir. ${tagDesc ? `Kültürel anlatıda sıklıkla "${tagDesc}" temasıyla bağdaştırılan bu isim,` : "Bu isim,"} Kürt edebiyatında ve sözlü halk kültüründe köklü bir geçmişi yansıtır.`,
      },
      {
        question: `${name} ismi kız mı erkek mi?`,
        answer: `${name} ismi geleneksel olarak ${genderAdj} ismi olarak kullanılmaktadır. Kürtçe isim kültüründe bu doğrultuda kabul görmüştür.`,
      },
      {
        question: `${name} isminin Kürt edebiyatı ve folklorundaki yeri nedir?`,
        answer: `${name} ismi, Kürt edebiyatında, halk hikayelerinde ve sözlü şiir geleneğinde köklü bir geçmişe sahiptir. Kültürel hafızanın ve zengin söz dağarcığının zarif bir parçasını temsil eder.`,
      },
      {
        question: `${name} ismiyle uyumlu kardeş isimleri nelerdir?`,
        answer: `${name} ismiyle gerek anlam gerekse fonetik ve kültürel tını olarak uyum sağlayan ${genderAdj} kardeş isimleri arasında ${siblings.join(", ")} gibi adlar öne çıkmaktadır.`,
      },
    ];
  }

  if (lng === "en") {
    return [
      {
        question: `What is the meaning of the name ${name}?`,
        answer: `The name ${name} is of ${origin} origin and means: ${meaning}. It holds an authentic and positive place in the Kurdish naming tradition.`,
      },
      {
        question: `What is the origin and linguistic heritage of the name ${name}?`,
        answer: `The name ${name} is rooted in the ${origin} language. ${tagDesc ? `Frequently associated with the theme of "${tagDesc}",` : ""} it represents a deeply-rooted heritage in Kurdish cultural and literary traditions.`,
      },
      {
        question: `Is ${name} a boy's or girl's name?`,
        answer: `${name} is traditionally given as a ${genderText} name in Kurdish naming conventions.`,
      },
      {
        question: `What is the significance of ${name} in Kurdish literature and folklore?`,
        answer: `The name ${name} holds an esteemed place in Kurdish literature, folklore, and poetic tradition, embodying cultural heritage and expressive linguistic beauty.`,
      },
      {
        question: `What sibling names pair well with ${name}?`,
        answer: `Names that harmonise gracefully with ${name} in cultural resonance and phonetic flow include ${siblings.join(", ")}.`,
      },
    ];
  }

  if (lng === "de") {
    return [
      {
        question: `Was bedeutet der Name ${name}?`,
        answer: `Der Name ${name} hat ${origin}-Herkunft und bedeutet: ${meaning}. Er hat einen authentischen und geschätzten Platz in der kurdischen Namentradition.`,
      },
      {
        question: `Woher stammt der Name ${name} und wie ist sein sprachlicher Hintergrund?`,
        answer: `Der Name ${name} stammt aus der ${origin}-Sprache. ${tagDesc ? `Oft mit dem Thema "${tagDesc}" verbunden,` : ""} repräsentiert er ein tief verwurzeltes Erbe in den kurdischen Kulturtraditionen.`,
      },
      {
        question: `Ist ${name} ein Mädchen- oder Jungenname?`,
        answer: `${name} wird in kurdischen Namensgebungstraditionen traditionell als ${genderText}-Name vergeben.`,
      },
      {
        question: `Welche Bedeutung hat ${name} in der kurdischen Literatur und Folklore?`,
        answer: `Der Name ${name} hat einen geschätzten Platz in der kurdischen Literatur und Volkstradition und spiegelt kulturelles Erbe und sprachliche Schönheit wider.`,
      },
      {
        question: `Welche Geschwisternamen passen klanglich zu ${name}?`,
        answer: `Zu ${name} passen sowohl klanglich als auch kulturell harmonierende Namen wie ${siblings.join(", ")}.`,
      },
    ];
  }

  // Arabic (ar)
  return [
    {
      question: `ما معنى اسم ${name}؟`,
      answer: `اسم ${name} ذو أصل ${origin} ويعني: ${meaning}. ويحتل مكانة أصيلة ومميزة في ثقافة التسمية الكردية.`,
    },
    {
      question: `ما هو أصل اسم ${name} وخلفيته اللغوية؟`,
      answer: `ينحدر اسم ${name} من أصول لغوية ${origin}. ${tagDesc ? `ويرتبط غالباً بموضوع "${tagDesc}"،` : ""} ويمثل إرثاً أصيلاً في التراث الأدبي والثقافي الكردي.`,
    },
    {
      question: `هل ${name} اسم فتاة أم فتى؟`,
      answer: `يُستخدم اسم ${name} تقليدياً اسماً ${genderText} في تقاليد التسمية الكردية.`,
    },
    {
      question: `ما مكانة اسم ${name} في الأدب والفولكلور الكردي؟`,
      answer: `يحظى اسم ${name} بمكانة مرموقة في الأدب الكردي والتقاليد الشعبية والشعرية، مجسداً الهوية الثقافية والجمال اللغوي الأصيل.`,
    },
    {
      question: `ما أسماء الأشقاء المتناسقة مع ${name}؟`,
      answer: `من الأسماء المتناسقة مع ${name} جرساً ومعنى في الثقافة الكردية: ${siblings.join("، ")}.`,
    },
  ];
}
