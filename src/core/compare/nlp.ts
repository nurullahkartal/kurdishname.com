/**
 * Lightweight NLP Layer for Semantic Comparison
 * Computes Cosine Similarity between two meaning strings.
 */

const STOP_WORDS = new Set([
  "ve", "ile", "veya", "bir", "iki", "çok", "en", "da", "de", "için", "gibi",
  "olan", "olarak", "ise", "ki", "bu", "şu", "o", "isim", "ad", "anlamına", "gelen",
  "gelir", "verilen", "kadar", "göre", "kız", "erkek", "çocuk"
]);

function tokenize(text: string): string[] {
  return text
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

  // Benzersiz kelimeleri topla
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
