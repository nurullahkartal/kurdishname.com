import fs from "fs";
import path from "path";

type NameNode = {
  id: string;
  name: string;
  meaning: string;
  semanticTags: string[];
  phonetics?: Record<string, string>;
  gender?: string;
};

type Edge = {
  from: string;
  to: string;
  type: string;
  weight: number;
  reason: string[];
};

type Graph = {
  nodes: Record<string, NameNode>;
  edges: Edge[];
};

const DATA_PATH = path.join(process.cwd(), "names_master.json");

function loadNames(): NameNode[] {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function tagOverlap(a: NameNode, b: NameNode): number {
  const setA = new Set(a.semanticTags || []);
  const setB = new Set(b.semanticTags || []);

  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;

  return union === 0 ? 0 : intersection / union;
}

function phoneticSimilarity(a: NameNode, b: NameNode): number {
  const pa = a.phonetics?.en || "";
  const pb = b.phonetics?.en || "";

  if (!pa || !pb) return 0;

  const maxLen = Math.max(pa.length, pb.length);
  let match = 0;

  for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
    if (pa[i] === pb[i]) match++;
  }

  return match / maxLen;
}

function meaningSimilarity(a: NameNode, b: NameNode): number {
  if (!a.meaning || !b.meaning) return 0;

  const wordsA = a.meaning.toLowerCase().split(" ");
  const wordsB = b.meaning.toLowerCase().split(" ");

  const intersection = wordsA.filter(w => wordsB.includes(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;

  return union === 0 ? 0 : intersection / union;
}

function similarity(a: NameNode, b: NameNode): number {
  return (
    tagOverlap(a, b) * 0.5 +
    meaningSimilarity(a, b) * 0.3 +
    phoneticSimilarity(a, b) * 0.2
  );
}

export function buildGraph(names: NameNode[]): Graph {
  const nodes: Record<string, NameNode> = {};
  const edges: Edge[] = [];

  for (const n of names) {
    nodes[n.id] = n;
  }

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i];
      const b = names[j];

      const score = similarity(a, b);

      if (score > 0.55) {
        edges.push({
          from: a.id,
          to: b.id,
          type: "semantic_similarity",
          weight: score,
          reason: ["auto_semantic_match"]
        });

        edges.push({
          from: b.id,
          to: a.id,
          type: "semantic_similarity",
          weight: score,
          reason: ["auto_semantic_match"]
        });
      }
    }
  }

  return { nodes, edges };
}

function saveGraph(graph: Graph) {
  const outPath = path.join(process.cwd(), "src/data/graph.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(graph, null, 2)
  );
}

const isCLI = typeof process !== "undefined" && process.argv && import.meta.url === "file://" + process.argv[1].replace(/\\\\/g, "/");
if (isCLI) {
  const names = loadNames();
  const graph = buildGraph(names);
  saveGraph(graph);
  console.log("✅ Graph generated:", graph.edges.length, "edges");
}
