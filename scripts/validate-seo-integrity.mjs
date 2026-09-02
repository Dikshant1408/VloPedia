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
assert(fs.existsSync(path.join(rootDir, "src/app/match-prep/page.tsx")), "src/app/match-prep/page.tsx (Match Prep Companion) exists");
assert(fs.existsSync(path.join(rootDir, "src/app/tools/round-assistant/page.tsx")), "src/app/tools/round-assistant/page.tsx (Round Decision Assistant) exists");
assert(fs.existsSync(path.join(rootDir, "src/app/methodology/page.tsx")), "src/app/methodology/page.tsx (Methodology Documentation) exists");
assert(fs.existsSync(path.join(rootDir, "src/components/report-issue-modal.tsx")), "src/components/report-issue-modal.tsx (Community Reporter) exists");

console.log("\n========================================");
console.log(`Validation Complete: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.error("❌ SEO / Data validation failed. Fix errors before committing.");
  process.exit(1);
} else {
  console.log("🎉 All SEO and data integrity tests passed!\n");
}
