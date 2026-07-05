export type Edge = {
  from: string;
  to: string;
  weight: number;
};

export type SEO = Record<string, number>;

export function buildInternalLinks(edges: Edge[], seo: SEO) {
  const linkMap: Record<string, string[]> = {};

  for (const edge of edges) {
    if (!linkMap[edge.from]) linkMap[edge.from] = [];

    const boost = seo[edge.to] || 0;

    const score = edge.weight * 0.6 + (boost / 100) * 0.4;

    if (score > 0.75) {
      linkMap[edge.from].push(edge.to);
    }
  }

  // limit to top 5 links per page for stronger authority signals
  Object.keys(linkMap).forEach(id => {
    linkMap[id] = linkMap[id].slice(0, 5);
  });

  return linkMap;
}
