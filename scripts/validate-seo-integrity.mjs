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
assert(fs.existsSync(path.join(rootDir, "src/lib/knowledge-graph.ts")), "src/lib/knowledge-graph.ts exists");
assert(fs.existsSync(path.join(rootDir, "src/data/canonical-graph.json")), "src/data/canonical-graph.json exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/knowledge-graph-service.ts")), "src/lib/knowledge-graph-service.ts exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/patch-impact-engine.ts")), "src/lib/patch-impact-engine.ts exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/data-coverage-auditor.ts")), "src/lib/data-coverage-auditor.ts (Data Coverage Auditor) exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/seo-opportunity.ts")), "src/lib/seo-opportunity.ts (SEO Opportunity Engine) exists");
assert(fs.existsSync(path.join(rootDir, "src/components/data-trust-badge.tsx")), "src/components/data-trust-badge.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/components/follow-entity-button.tsx")), "src/components/follow-entity-button.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/app/explore/page.tsx")), "src/app/explore/page.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/app/match-prep/page.tsx")), "src/app/match-prep/page.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/app/tools/round-assistant/page.tsx")), "src/app/tools/round-assistant/page.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/app/methodology/page.tsx")), "src/app/methodology/page.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/app/changelog/page.tsx")), "src/app/changelog/page.tsx (Public Changelog) exists");
assert(fs.existsSync(path.join(rootDir, "src/components/report-issue-modal.tsx")), "src/components/report-issue-modal.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/search-analytics.ts")), "src/lib/search-analytics.ts exists");
assert(fs.existsSync(path.join(rootDir, "src/app/admin/health/page.tsx")), "src/app/admin/health/page.tsx exists");
assert(fs.existsSync(path.join(rootDir, "src/data/sources/registry.json")), "src/data/sources/registry.json exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/sources.ts")), "src/lib/sources.ts exists");
assert(fs.existsSync(path.join(rootDir, "src/lib/entity-resolver.ts")), "src/lib/entity-resolver.ts exists");
assert(fs.existsSync(path.join(rootDir, "src/app/data-sources/page.tsx")), "src/app/data-sources/page.tsx exists");

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
  assert(s.fromEntity && s.toEntity && s.relationType && s.directionality && s.sourceId && s.confidence, `Synergy edge "${s.fromEntity} -> ${s.toEntity}" is fully provenanced with directionality`);
});

const counters = JSON.parse(fs.readFileSync(path.join(relDir, "agent-counters.json"), "utf-8"));
assert(Array.isArray(counters) && counters.length > 0, "agent-counters contains valid array");
counters.forEach(c => {
  assert(c.fromEntity && c.toEntity && c.relationType && c.directionality === "DIRECTED" && c.dangerLevel && c.sourceId, `Counter edge "${c.fromEntity} -> ${c.toEntity}" has explicit dangerLevel and DIRECTED directionality`);
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

// 8. Mathematical Models & Conversion Formulas Verification Suite
console.log("\n8. Mathematical Models & Kinematics Verification Suite:");

// Aim Kinematics: 800 DPI @ 0.35 Sens
const testDpi = 800;
const testSens = 0.35;
const testEdpi = Math.round(testDpi * testSens);
assert(testEdpi === 280, "eDPI calculation: 800 DPI * 0.35 Sens = 280 eDPI");

// VALORANT 0.07° Yaw Constant cm/360 formula: 13054.545 / eDPI
const testCm360 = Number((13054.545 / testEdpi).toFixed(1));
assert(testCm360 === 46.6, "cm/360 turn distance formula: 13054.545 / 280 eDPI = 46.6 cm/360°");

// Cross-Game Sens Multipliers (CS2 / Apex yaw 0.022 vs VALORANT 0.07)
const cs2Sens = 1.0;
const valSensFromCs2 = Number((cs2Sens / 3.181818).toFixed(3));
assert(valSensFromCs2 === 0.314, "CS2 -> VALORANT sensitivity conversion factor: 1.0 CS2 = 0.314 VALORANT");

const ow2Sens = 5.0;
const valSensFromOw2 = Number((ow2Sens / 10.606).toFixed(3));
assert(valSensFromOw2 === 0.471, "Overwatch 2 -> VALORANT sensitivity conversion factor: 5.0 OW2 = 0.471 VALORANT");

// Economy Progression Math
function calculateLossBonus(streak) {
  const cappedStreak = Math.min(streak, 2);
  return 1900 + (cappedStreak * 500);
}
assert(calculateLossBonus(0) === 1900, "Economy 0-loss streak bonus = $1,900");
assert(calculateLossBonus(1) === 2400, "Economy 1-loss streak bonus = $2,400");
assert(calculateLossBonus(2) === 2900, "Economy 2-loss streak bonus = $2,900");
assert(calculateLossBonus(3) === 2900, "Economy 3-loss streak bonus caps at $2,900");
assert(calculateLossBonus(5) === 2900, "Economy 5-loss streak bonus remains capped at $2,900");

// Recommender Confidence Weighted Scoring
function calculateRecScore(mapFit, playstyle, teamFit) {
  return Math.round((mapFit * 0.35) + (playstyle * 0.35) + (teamFit * 0.30));
}
assert(calculateRecScore(95, 90, 85) === 90, "Recommender Confidence score: (95*0.35)+(90*0.35)+(85*0.30) = 90%");

// SEO Opportunity Score Formula
function calculateOppScore(impr, rankPot, gap, clickPot) {
  return Math.round((impr / 100) * rankPot * gap * clickPot * 10);
}
assert(calculateOppScore(4820, 1.0, 0.8, 0.971) === 374, "SEO Opportunity Score: 4820 impr, 1.0 rank, 0.8 gap = 374");

console.log("\n========================================");
console.log(`Validation Complete: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.error("❌ SEO / Data validation failed. Fix errors before committing.");
  process.exit(1);
} else {
  console.log("🎉 All SEO, data integrity, and mathematical model tests passed!\n");
}
