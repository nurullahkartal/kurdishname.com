import fs from "fs";
import path from "path";
import { buildGraph } from "../../../scripts/generateGraph.js";
import { computeSEOScore } from "../seo/seoScore.js";
import { buildInternalLinks } from "../graph/linkScore.js";

export function runPipeline() {
  const dataPath = path.join(process.cwd(), "names_master.json");
  const names = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const graph = buildGraph(names);

  const seoScores: Record<string, number> = {};

  for (const n of names) {
    seoScores[n.id] = computeSEOScore({
      id: n.id,
      contentLength: n.meaning?.length || 0,
      faqCount: 3,
      schemaCount: 2,
      graphConnections: graph.edges.filter(e => e.from === n.id).length,
      uniqueness: 0.7
    });
  }

  const linkMap = buildInternalLinks(graph.edges, seoScores);

  const dataDir = path.join(process.cwd(), "src/data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDir, "seo_scores.json"),
    JSON.stringify(seoScores, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, "link_map.json"),
    JSON.stringify(linkMap, null, 2)
  );

  console.log("✅ Pipeline complete. SEO scores and Link Map generated.");
}

// CLI
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  runPipeline();
}
