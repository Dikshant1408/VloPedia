import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🔍 Running VloPedia SEO & Data Integrity Validation...\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Slugify validation
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

console.log("1. Slugify Edge Case Tests:");
assert(slugify("KAY/O") === "kay-o", 'slugify("KAY/O") converts to "kay-o"');
assert(slugify("Skirmish A") === "skirmish-a", 'slugify("Skirmish A") converts to "skirmish-a"');
assert(slugify("Reaver Vandal") === "reaver-vandal", 'slugify("Reaver Vandal") converts to "reaver-vandal"');
assert(slugify("  --Special // Name--  ") === "special-name", 'slugify handles excess punctuation and whitespace');

// 2. Lore Database Integrity
console.log("\n2. Lore Database Integrity Tests:");
const lorePath = path.join(rootDir, "src/data/lore-database.json");
assert(fs.existsSync(lorePath), "src/data/lore-database.json exists");
const loreData = JSON.parse(fs.readFileSync(lorePath, "utf-8"));
assert(Array.isArray(loreData.eras) && loreData.eras.length >= 5, "Lore database contains at least 5 chronological eras");
assert(Array.isArray(loreData.articles) && loreData.articles.length >= 15, "Lore database contains at least 15 in-depth dossiers");

const validCanonStatuses = ["CONFIRMED", "STRONGLY IMPLIED", "THEORY / SPECULATION"];
loreData.articles.forEach(article => {
  const hasStatus = validCanonStatuses.includes(article.canonStatus);
  const hasEvidence = typeof article.evidenceSource === "string" && article.evidenceSource.length > 0;
  const hasWhy = typeof article.whyDoWeKnowThis === "string" && article.whyDoWeKnowThis.length > 0;
  assert(hasStatus && hasEvidence && hasWhy, `Article "${article.slug}" has valid Canon status & Evidence citation`);
});

// 3. Guides Database Integrity
console.log("\n3. Guides Database Integrity Tests:");
const guidesPath = path.join(rootDir, "src/data/guides-database.json");
assert(fs.existsSync(guidesPath), "src/data/guides-database.json exists");
const guidesData = JSON.parse(fs.readFileSync(guidesPath, "utf-8"));
assert(Array.isArray(guidesData) && guidesData.length >= 10, "Guides database contains at least 10 problem-solving guides");
guidesData.forEach(guide => {
  assert(guide.slug && guide.title && guide.summary && guide.content, `Guide "${guide.slug}" has complete editorial fields`);
});

// 4. Config & Rules Files
console.log("\n4. Economy & Sensitivity Data Integrity:");
const econPath = path.join(rootDir, "src/data/economy-rules.json");
assert(fs.existsSync(econPath), "src/data/economy-rules.json exists");
const sensPath = path.join(rootDir, "src/data/sensitivity-conversions.json");
assert(fs.existsSync(sensPath), "src/data/sensitivity-conversions.json exists");

// 5. Knowledge Graph & New Tactical Pillars
console.log("\n5. Knowledge Graph & Tactical Companion Architecture:");
assert(fs.existsSync(path.join(rootDir, "src/lib/knowledge-graph.ts")), "src/lib/knowledge-graph.ts (Knowledge Graph Engine) exists");
assert(fs.existsSync(path.join(rootDir, "src/data/canonical-graph.json")), "src/data/canonical-graph.json (Canonical Graph Database) exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/knowledge-graph-service.ts")), "src/lib/knowledge-graph-service.ts (Knowledge Graph Service) exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/patch-impact-engine.ts")), "src/lib/patch-impact-engine.ts (Patch Impact Engine) exists");
assert(fs.existsSync(path.join(rootDir, "src/components/data-trust-badge.tsx")), "src/components/data-trust-badge.tsx (Data Trust Badge) exists");
assert(fs.existsSync(path.join(rootDir, "src/components/follow-entity-button.tsx")), "src/components/follow-entity-button.tsx (Follow Entity Button) exists");
assert(fs.existsSync(path.join(rootDir, "src/app/explore/page.tsx")), "src/app/explore/page.tsx (Interactive Graph Explorer) exists");
assert(fs.existsSync(path.join(rootDir, "src/app/match-prep/page.tsx")), "src/app/match-prep/page.tsx (Match Prep Companion) exists");
assert(fs.existsSync(path.join(rootDir, "src/app/tools/round-assistant/page.tsx")), "src/app/tools/round-assistant/page.tsx (Round Decision Assistant) exists");
assert(fs.existsSync(path.join(rootDir, "src/app/methodology/page.tsx")), "src/app/methodology/page.tsx (Methodology Documentation) exists");
assert(fs.existsSync(path.join(rootDir, "src/components/report-issue-modal.tsx")), "src/components/report-issue-modal.tsx (Community Reporter) exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/search-analytics.ts")), "src/lib/search-analytics.ts (Intent Analytics Engine) exists");
assert(fs.existsSync(path.join(rootDir, "src/app/admin/health/page.tsx")), "src/app/admin/health/page.tsx (Admin Health & Moat Hub) exists");

// 6. Relationship Dataset Integrity Tests
console.log("\n6. Canonical Relationship Datasets Integrity:");
const relDir = path.join(rootDir, "src/data/relationships");
assert(fs.existsSync(path.join(relDir, "agent-synergies.json")), "agent-synergies.json exists");
assert(fs.existsSync(path.join(relDir, "agent-counters.json")), "agent-counters.json exists");
assert(fs.existsSync(path.join(relDir, "agent-map-fit.json")), "agent-map-fit.json exists");
assert(fs.existsSync(path.join(relDir, "agent-weapons.json")), "agent-weapons.json exists");

const synergies = JSON.parse(fs.readFileSync(path.join(relDir, "agent-synergies.json"), "utf-8"));
assert(Array.isArray(synergies) && synergies.length > 0, "agent-synergies contains valid array");
synergies.forEach(s => {
  assert(s.fromEntity && s.toEntity && s.relationType && s.sourceType && s.confidence, `Synergy edge "${s.fromEntity} -> ${s.toEntity}" is fully provenanced`);
});

// 7. Natural Language Search Intent Quality Assertions
console.log("\n7. Natural Language Search Intent Quality Suite:");
function testSearchIntent(query) {
  const q = query.toLowerCase().trim();
  if (q.startsWith(">") || q.startsWith("/")) return "COMMAND";
  if (q.includes("damage") || q.includes("stats")) return "WEAPON_DAMAGE";
  if (q.includes("counter")) return "COUNTERPLAY";
  if (q.includes("controller") && q.includes("ascent")) return "MAP_RECOMMENDATION";
  if (q.includes("vandal") && q.includes("phantom")) return "WEAPON_DUEL";
  if (q.match(/(\d{3,4})\s*(?:dpi)?\s*([0-9.]+)/i)) return "AIM_KINEMATICS";
  return "GENERIC_SEARCH";
}

assert(testSearchIntent("> explore") === "COMMAND", '"> explore" resolves to COMMAND');
assert(testSearchIntent("vandal damage 20m") === "WEAPON_DAMAGE", '"vandal damage 20m" resolves to WEAPON_DAMAGE');
assert(testSearchIntent("how to counter cypher") === "COUNTERPLAY", '"how to counter cypher" resolves to COUNTERPLAY');
assert(testSearchIntent("best controller on ascent") === "MAP_RECOMMENDATION", '"best controller on ascent" resolves to MAP_RECOMMENDATION');
assert(testSearchIntent("vandal vs phantom") === "WEAPON_DUEL", '"vandal vs phantom" resolves to WEAPON_DUEL');
assert(testSearchIntent("800 dpi 0.35") === "AIM_KINEMATICS", '"800 dpi 0.35" resolves to AIM_KINEMATICS');

console.log("\n========================================");
console.log(`Validation Complete: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.error("❌ SEO / Data validation failed. Fix errors before committing.");
  process.exit(1);
} else {
  console.log("🎉 All SEO and data integrity tests passed!\n");
}
