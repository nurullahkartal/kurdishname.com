import { NameData } from "../../data/names";
import { computeCosineSimilarity } from "./nlp";

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

export function compareNames(name1: NameData, name2: NameData, t: (key: string, defaultText: string) => string): CompareResult {
  const n1 = name1.name.toLowerCase();
  const n2 = name2.name.toLowerCase();

  let score = 20; // Base baseline
  const explanations: Explanation[] = [];

  // 1. Semantic Tags Overlap (Graph Engine Component) - Max 25
  let tagScore = 0;
  if (name1.tags && name2.tags) {
    const sharedTags = name1.tags.filter(tag => name2.tags?.includes(tag));
    tagScore = Math.min(sharedTags.length * 15, 25);
    if (tagScore > 0) {
      explanations.push({ text: `Ortak anlamsal temalar: ${sharedTags.join(", ")}`, type: "positive" });
    }
  }
  score += tagScore;

  // 2. Vector Meaning Embedding (NLP Component) - Max 20
  // Fallback if tags are missing or to boost semantic proximity
  const meaningSimilarity = computeCosineSimilarity(name1.meaning, name2.meaning);
  const nlpScore = Math.round(meaningSimilarity * 20);
  score += nlpScore;
  if (nlpScore > 10) {
    explanations.push({ text: `Anlam bağlamı olarak çok güçlü vektörel benzerlik (${Math.round(meaningSimilarity * 100)}% örtüşme)`, type: "positive" });
  } else if (nlpScore > 5 && tagScore === 0) {
    explanations.push({ text: `Anlam olarak benzer çağrışımlar yapıyor`, type: "neutral" });
  }

  // 3. Cultural / Origin Match (Graph Engine Component) - Max 15
  if (name1.origin && name2.origin) {
    if (name1.origin === name2.origin) {
      score += 15;
      explanations.push({ text: `Aynı kökenden geliyorlar (${name1.origin})`, type: "positive" });
    } else {
      explanations.push({ text: `Farklı kültür veya lehçe kökenleri (${name1.origin} vs ${name2.origin})`, type: "neutral" });
    }
  }

  // 4. Gender Match - Max 5
  if (name1.gender === name2.gender) {
    score += 5;
    explanations.push({ text: `Aynı cinsiyet profili`, type: "positive" });
  } else {
    explanations.push({ text: `Farklı cinsiyetlere hitap ediyor`, type: "negative" });
  }

  // 5. Phonetic / Vowel Overlap (Heuristic Component) - Max 15
  const vowels = ['a', 'e', 'i', 'î', 'o', 'u', 'û', 'ê'];
  const vowels1 = Array.from(new Set([...n1].filter(char => vowels.includes(char))));
  const vowels2 = Array.from(new Set([...n2].filter(char => vowels.includes(char))));
  const sharedVowels = vowels1.filter(v => vowels2.includes(v));
  
  const vowelScore = Math.min(sharedVowels.length * 7.5, 15);
  score += vowelScore;
  if (sharedVowels.length > 0) {
    explanations.push({ text: `Ortak ünlü harf sesleri ('${sharedVowels.join("', '")}')`, type: "positive" });
  }

  // 6. Structural & Letter Length (Heuristic Component) - Max 20
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

  // Final Limits
  const finalScore = Math.min(Math.max(Math.round(score), 12), 98);

  let label = t("harmony_poor", "Düşük Uyum");
  let color = "#ef4444"; // red
  if (finalScore >= 80) {
    label = t("harmony_perfect", "Kusursuz Uyum!");
    color = "#f59e0b"; // golden
  } else if (finalScore >= 60) {
    label = t("harmony_good", "Güzel Uyum");
    color = "#10b981"; // green
  } else if (finalScore >= 40) {
    label = t("harmony_neutral", "Orta Uyum");
    color = "var(--text-muted)";
  }

  return { score: finalScore, label, color, explanations };
}
