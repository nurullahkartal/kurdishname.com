import fs from "fs";
import path from "path";
import crypto from "crypto";

import { buildGraph } from "./generateGraph.js";
import { computeSEOScore } from "../src/core/seo/seoScore.js";
import { buildInternalLinks } from "../src/core/graph/linkScore.js";
import { renderNamePage } from "../src/core/pipeline/namePageRenderer.js";

type NameNode = {
  id: string;
  name: string;
  meaning: string;
  semanticTags: string[];
  gender?: string;
  origin?: string;
};

const DATA_PATH = path.join(process.cwd(), "names_master.json");
const DIST_PATH = path.join(process.cwd(), "dist", "names");
const CACHE_DIR = path.join(process.cwd(), ".cache");
const PUBLIC_DATA_PATH = path.join(process.cwd(), "public", "data");
const DIST_DATA_PATH = path.join(process.cwd(), "dist", "data");

function ensureDirs() {
  [DIST_PATH, CACHE_DIR, PUBLIC_DATA_PATH, DIST_DATA_PATH].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function loadNames(): NameNode[] {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function hashString(str: string): string {
  return crypto.createHash("md5").update(str).digest("hex");
}

function hashFile(filePath: string): string {
  if (!fs.existsSync(filePath)) return "";
  return hashString(fs.readFileSync(filePath, "utf-8"));
}

function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ê', 'e')
    .replaceAll('î', 'i')
    .replaceAll('û', 'u')
    .replaceAll('ç', 'c')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ı', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
    .trim();
}

async function main() {
  console.log("🚀 Build started [Incremental Engine V2]...");
  const startTime = Date.now();
  ensureDirs();

  const hashesPath = path.join(CACHE_DIR, "build_hashes.json");
  let previousHashes: Record<string, string> = {};
  if (fs.existsSync(hashesPath)) {
    previousHashes = JSON.parse(fs.readFileSync(hashesPath, "utf-8"));
  }

  const currentHashes: Record<string, string> = {};

  // File Hashes
  const filesToHash = {
    data: DATA_PATH,
    graphLogic: path.join(process.cwd(), "scripts", "generateGraph.ts"),
    seoLogic: path.join(process.cwd(), "src", "core", "seo", "seoScore.ts"),
    linkLogic: path.join(process.cwd(), "src", "core", "graph", "linkScore.ts"),
    renderLogic: path.join(process.cwd(), "src", "core", "pipeline", "namePageRenderer.ts"),
  };

  for (const [key, filepath] of Object.entries(filesToHash)) {
    currentHashes[key] = hashFile(filepath);
  }

  const names = loadNames();

  // 1. KNOWLEDGE GRAPH
  let graph: any;
  const graphCachePath = path.join(CACHE_DIR, "graph.json");
  if (
    fs.existsSync(graphCachePath) &&
    previousHashes.data === currentHashes.data &&
    previousHashes.graphLogic === currentHashes.graphLogic
  ) {
    console.log("♻️  Loading Knowledge Graph from cache...");
    graph = JSON.parse(fs.readFileSync(graphCachePath, "utf-8"));
  } else {
    console.log("⚙️  Building Knowledge Graph...");
    graph = buildGraph(names as any);
    fs.writeFileSync(graphCachePath, JSON.stringify(graph));
  }

  // 2. SEO SCORES
  let seoScores: Record<string, number>;
  const seoCachePath = path.join(CACHE_DIR, "seo_scores.json");
  if (
    fs.existsSync(seoCachePath) &&
    previousHashes.data === currentHashes.data &&
    previousHashes.graphLogic === currentHashes.graphLogic &&
    previousHashes.seoLogic === currentHashes.seoLogic
  ) {
    console.log("♻️  Loading SEO Scores from cache...");
    seoScores = JSON.parse(fs.readFileSync(seoCachePath, "utf-8"));
  } else {
    console.log("⚙️  Computing SEO Scores...");
    seoScores = {};
    for (const n of names) {
      seoScores[n.id] = computeSEOScore({
        id: n.id,
        contentLength: (n.meaning || "").length,
        faqCount: 3,
        schemaCount: 2,
        graphConnections: graph.edges.filter((e: any) => e.from === n.id).length,
        uniqueness: 0.75
      });
    }
    fs.writeFileSync(seoCachePath, JSON.stringify(seoScores));
  }

  // 3. LINKS (O(n^2) logic)
  let linkMap: Record<string, string[]>;
  const linkCachePath = path.join(CACHE_DIR, "link_map.json");
  if (
    fs.existsSync(linkCachePath) &&
    previousHashes.data === currentHashes.data &&
    previousHashes.graphLogic === currentHashes.graphLogic &&
    previousHashes.seoLogic === currentHashes.seoLogic &&
    previousHashes.linkLogic === currentHashes.linkLogic
  ) {
    console.log("♻️  Loading Internal Semantic Links from cache...");
    linkMap = JSON.parse(fs.readFileSync(linkCachePath, "utf-8"));
  } else {
    console.log("⚙️  Calculating Internal Semantic Links (Heavy O(n²))...");
    linkMap = buildInternalLinks(graph.edges, seoScores);
    fs.writeFileSync(linkCachePath, JSON.stringify(linkMap));
  }

  // Save Artifacts for Client consumption
  fs.writeFileSync(path.join(PUBLIC_DATA_PATH, "seo_scores.json"), JSON.stringify(seoScores));
  fs.writeFileSync(path.join(DIST_DATA_PATH, "seo_scores.json"), JSON.stringify(seoScores));
  fs.writeFileSync(path.join(PUBLIC_DATA_PATH, "link_map.json"), JSON.stringify(linkMap));
  fs.writeFileSync(path.join(DIST_DATA_PATH, "link_map.json"), JSON.stringify(linkMap));

  // 4. HTML RENDER (Incremental & Chunked)
  console.log("⚙️  Rendering Static HTML Pages...");
  const forceRenderAll = previousHashes.renderLogic !== currentHashes.renderLogic;
  
  if (forceRenderAll) {
    console.log("   ⚠️ Render logic changed. Re-rendering all pages.");
  }

  let renderedCount = 0;
  let skippedCount = 0;

  // Render Chunking Function
  const CHUNK_SIZE = 200;
  for (let i = 0; i < names.length; i += CHUNK_SIZE) {
    const chunk = names.slice(i, i + CHUNK_SIZE);
    
    await Promise.all(chunk.map(async (n) => {
      const htmlPath = path.join(DIST_PATH, n.id + ".html");
      const nameHashKey = `name_${n.id}`;
      
      // Calculate composite hash for this specific page
      const compositeState = JSON.stringify(n) + (seoScores[n.id] || 0) + JSON.stringify(linkMap[n.id] || []);
      const pageHash = hashString(compositeState);
      currentHashes[nameHashKey] = pageHash;

      // Skip condition
      if (!forceRenderAll && previousHashes[nameHashKey] === pageHash && fs.existsSync(htmlPath)) {
        skippedCount++;
        return;
      }

      // Render
      const html = renderNamePage({
        name: n,
        seoScore: seoScores[n.id] || 0,
        links: linkMap[n.id] || []
      });

      // We use sync write here because it's parallelized at the chunk level
      fs.writeFileSync(htmlPath, html);
      renderedCount++;
    }));
  }

  // Save state
  fs.writeFileSync(hashesPath, JSON.stringify(currentHashes, null, 2));

  // 5. SEARCH INDEX (Hash-Bucket)
  console.log("⚙️  Generating Hash-Bucket Search Index...");
  const searchBuckets: Record<string, any[]> = {};
  
  for (const n of names) {
    const nn = normalizeText(n.name);
    const prefix = nn.substring(0, 2);
    if (!searchBuckets[prefix]) searchBuckets[prefix] = [];
    
    searchBuckets[prefix].push({
      id: n.id,
      n: n.name,
      nn: nn,
      g: n.gender === 'female' ? 'f' : 'm',
      s: Math.floor(seoScores[n.id] || 0)
    });
  }

  for (const prefix in searchBuckets) {
    searchBuckets[prefix].sort((a, b) => b.s - a.s);
  }

  const searchIndexContent = JSON.stringify(searchBuckets);
  const searchIndexHash = hashString(searchIndexContent).substring(0, 8);
  const searchIndexFileName = `search_index.${searchIndexHash}.json`;

  fs.writeFileSync(path.join(PUBLIC_DATA_PATH, searchIndexFileName), searchIndexContent);
  fs.writeFileSync(path.join(DIST_DATA_PATH, searchIndexFileName), searchIndexContent);

  const manifestContent = JSON.stringify({ searchIndex: searchIndexFileName });
  fs.writeFileSync(path.join(PUBLIC_DATA_PATH, "search_manifest.json"), manifestContent);
  fs.writeFileSync(path.join(DIST_DATA_PATH, "search_manifest.json"), manifestContent);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Build complete in ${duration}s`);
  console.log(`📦 Rendered: ${renderedCount} | ♻️ Skipped: ${skippedCount}`);
  console.log(`🔍 Search Index: ${searchIndexFileName} (${Object.keys(searchBuckets).length} buckets)`);
}

main().catch(console.error);
