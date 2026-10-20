import { NameData } from "./names-data";

export type Explanation = {
  text: string;
  type: "positive" | "negative" | "neutral";
};

export type CompareResult = {
  score: number;
  label: string;
  color: string;
  explanations: Explanation[];
};

const STOP_WORDS = new Set([
  "ve", "ile", "veya", "bir", "iki", "çok", "en", "da", "de", "için", "gibi",
  "olan", "olarak", "ise", "ki", "bu", "şu", "o", "isim", "ad", "anlamına", "gelen",
  "gelir", "verilen", "kadar", "göre", "kız", "erkek", "çocuk"
]);

function tokenize(text: string): string[] {
  return (text || "")
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function getTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

export function computeCosineSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const tf1 = getTermFrequencies(tokens1);
  const tf2 = getTermFrequencies(tokens2);
  const vocabulary = new Set([...tf1.keys(), ...tf2.keys()]);

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const term of vocabulary) {
    const val1 = tf1.get(term) || 0;
    const val2 = tf2.get(term) || 0;

    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export function compareNames(
  name1: NameData,
  name2: NameData,
  t: (key: string) => string
): CompareResult {
  const n1 = name1.name.toLowerCase();
  const n2 = name2.name.toLowerCase();

  let score = 20;
  const explanations: Explanation[] = [];

  let tagScore = 0;
  if (name1.tags && name2.tags) {
    const sharedTags = name1.tags.filter(tag => name2.tags?.includes(tag));
    tagScore = Math.min(sharedTags.length * 15, 25);
    if (tagScore > 0) {
      explanations.push({ text: `Ortak anlamsal temalar: ${sharedTags.join(", ")}`, type: "positive" });
    }
  }
  score += tagScore;

  const meaningSimilarity = computeCosineSimilarity(name1.meaning, name2.meaning);
  const nlpScore = Math.round(meaningSimilarity * 20);
  score += nlpScore;
  if (nlpScore > 10) {
    explanations.push({ text: `Anlam bağlamı olarak çok güçlü vektörel benzerlik (${Math.round(meaningSimilarity * 100)}% örtüşme)`, type: "positive" });
  } else if (nlpScore > 5 && tagScore === 0) {
    explanations.push({ text: `Anlam olarak benzer çağrışımlar yapıyor`, type: "neutral" });
  }

  if (name1.origin && name2.origin) {
    if (name1.origin === name2.origin) {
      score += 15;
      explanations.push({ text: `Aynı kökenden geliyorlar (${name1.origin})`, type: "positive" });
    } else {
      explanations.push({ text: `Farklı kültür veya lehçe kökenleri (${name1.origin} vs ${name2.origin})`, type: "neutral" });
    }
  }

  if (name1.gender === name2.gender) {
    score += 5;
    explanations.push({ text: `Aynı cinsiyet profili`, type: "positive" });
  } else {
    explanations.push({ text: `Farklı cinsiyetlere hitap ediyor`, type: "negative" });
  }

  const vowels = ['a', 'e', 'i', 'î', 'o', 'u', 'û', 'ê'];
  const vowels1 = Array.from(new Set([...n1].filter(char => vowels.includes(char))));
  const vowels2 = Array.from(new Set([...n2].filter(char => vowels.includes(char))));
  const sharedVowels = vowels1.filter(v => vowels2.includes(v));

  const vowelScore = Math.min(sharedVowels.length * 7.5, 15);
  score += vowelScore;
  if (sharedVowels.length > 0) {
    explanations.push({ text: `Ortak ünlü harf sesleri ('${sharedVowels.join("', '")}')`, type: "positive" });
  }

  const lenDiff = Math.abs(n1.length - n2.length);
  if (lenDiff === 0) {
    score += 10;
    explanations.push({ text: `Aynı hece/harf uzunluğu`, type: "positive" });
  } else if (lenDiff === 1) {
    score += 5;
  }

  let affixScore = 0;
  if (n1.charAt(0) === n2.charAt(0)) {
    affixScore += 5;
    explanations.push({ text: `Aynı harfle başlıyor`, type: "positive" });
  }
  if (n1.slice(-1) === n2.slice(-1)) {
    affixScore += 5;
    explanations.push({ text: `Aynı harfle (kafiye) bitiyor`, type: "positive" });
  }
  score += affixScore;

  const finalScore = Math.min(Math.max(Math.round(score), 12), 98);

  let label = t("harmony_poor") || "Düşük Uyum";
  let color = "#ef4444";
  if (finalScore >= 80) {
    label = t("harmony_perfect") || "Kusursuz Uyum!";
    color = "#f59e0b";
  } else if (finalScore >= 60) {
    label = t("harmony_good") || "Güzel Uyum";
    color = "#10b981";
  } else if (finalScore >= 40) {
    label = t("harmony_neutral") || "Orta Uyum";
    color = "var(--text-muted)";
  }

  return { score: finalScore, label, color, explanations };
}
