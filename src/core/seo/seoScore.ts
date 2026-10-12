export type ScoreInput = {
  id: string;
  contentLength: number;
  faqCount: number;
  schemaCount: number;
  graphConnections: number;
  uniqueness: number;
};

export function computeSEOScore(input: ScoreInput): number {
  const {
    contentLength,
    faqCount,
    schemaCount,
    graphConnections,
    uniqueness
  } = input;

  const contentDepth = Math.min(contentLength / 1000, 1);
  const graphScore = Math.min(Math.log(1 + graphConnections) / 5, 1);
  const schemaScore = Math.min(schemaCount / 3, 1);
  const faqScore = Math.min(faqCount / 5, 1);

  return Math.round(
    (contentDepth * 0.30 +
    graphScore * 0.25 +
    schemaScore * 0.15 +
    faqScore * 0.10 +
    uniqueness * 0.20) * 100
  );
}
