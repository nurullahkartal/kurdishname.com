import fs from "fs";
import path from "path";

import { buildGraph } from "./generateGraph.js";
import { computeSEOScore } from "../src/core/seo/seoScore.js";
import { buildInternalLinks } from "../src/core/graph/linkScore.js";
import { renderNamePage } from "../src/core/pipeline/namePageRenderer.js";

type NameNode = {
  id: string;
  name: string;
  meaning: string;
  semanticTags: string[];
};

const DATA_PATH = path.join(process.cwd(), "names_master.json");
const DIST_PATH = path.join(process.cwd(), "dist", "names");

function ensureDist() {
  if (!fs.existsSync(DIST_PATH)) {
    fs.mkdirSync(DIST_PATH, { recursive: true });
  }
}

function loadNames(): NameNode[] {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function main() {
  console.log("🚀 Build started...");

  ensureDist();

  const names = loadNames();

  // 1. GRAPH
  console.log("⚙️ Building Knowledge Graph...");
  const graph = buildGraph(names as any);

  // 2. SEO SCORES
  console.log("⚙️ Computing SEO Scores...");
  const seoScores: Record<string, number> = {};

  for (const n of names) {
    seoScores[n.id] = computeSEOScore({
      id: n.id,
      contentLength: (n.meaning || "").length,
      faqCount: 3,
      schemaCount: 2,
      graphConnections: graph.edges.filter(e => e.from === n.id).length,
      uniqueness: 0.75
    });
  }

  // 3. LINKS
  console.log("⚙️ Calculating Internal Semantic Links...");
  const linkMap = buildInternalLinks(graph.edges, seoScores);

  // 4. RENDER HTML
  console.log("⚙️ Rendering Static HTML Pages...");
  let count = 0;
  for (const n of names) {
    const html = renderNamePage({
      name: n,
      seoScore: seoScores[n.id] || 0,
      links: linkMap[n.id] || []
    });

    fs.writeFileSync(
      path.join(DIST_PATH, n.id + ".html"),
      html
    );
    count++;
  }

  // 5. SAVE ARTIFACTS
  console.log("⚙️ Saving Generated Artifacts...");
  
  const publicDataPath = path.join(process.cwd(), "public", "data");
  if (!fs.existsSync(publicDataPath)) {
    fs.mkdirSync(publicDataPath, { recursive: true });
  }

  const distDataPath = path.join(process.cwd(), "dist", "data");
  if (!fs.existsSync(distDataPath)) {
    fs.mkdirSync(distDataPath, { recursive: true });
  }

  const seoJson = JSON.stringify(seoScores, null, 2);
  const linkJson = JSON.stringify(linkMap, null, 2);

  fs.writeFileSync(path.join(publicDataPath, "seo_scores.json"), seoJson);
  fs.writeFileSync(path.join(distDataPath, "seo_scores.json"), seoJson);

  fs.writeFileSync(path.join(publicDataPath, "link_map.json"), linkJson);
  fs.writeFileSync(path.join(distDataPath, "link_map.json"), linkJson);

  console.log("✅ Build complete");
  console.log("📦 Pages generated: " + count);
}

main();
