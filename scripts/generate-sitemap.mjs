import { writeFileSync, join } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const base = "https://vlopedia.website";
const now = new Date().toISOString();

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, lastMod = now, changeFreq = "weekly", priority = 0.8) {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>${changeFreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const entries = [];

// Static routes
const staticRoutes = [
  { url: "/", freq: "daily", priority: 1.0 },
  { url: "/agents", freq: "weekly", priority: 0.9 },
  { url: "/weapons", freq: "weekly", priority: 0.9 },
  { url: "/maps", freq: "weekly", priority: 0.9 },
  { url: "/skins", freq: "daily", priority: 0.8 },
  { url: "/bundles", freq: "daily", priority: 0.8 },
  { url: "/buddies", freq: "weekly", priority: 0.6 },
  { url: "/sprays", freq: "weekly", priority: 0.6 },
  { url: "/playercards", freq: "weekly", priority: 0.6 },
  { url: "/flex", freq: "weekly", priority: 0.6 },
  { url: "/gamemodes", freq: "monthly", priority: 0.5 },
  { url: "/tiers", freq: "monthly", priority: 0.5 },
  { url: "/lore", freq: "weekly", priority: 0.8 },
  { url: "/tools", freq: "weekly", priority: 0.9 },
  { url: "/compare", freq: "weekly", priority: 0.8 },
  { url: "/patch-notes", freq: "weekly", priority: 0.8 },
  { url: "/tier-list", freq: "daily", priority: 0.7 },
  { url: "/comp-builder", freq: "monthly", priority: 0.8 },
  { url: "/crosshair", freq: "monthly", priority: 0.7 },
  { url: "/sensitivity", freq: "monthly", priority: 0.8 },
  { url: "/pro-settings", freq: "weekly", priority: 0.7 },
  { url: "/store", freq: "daily", priority: 0.8 },
  { url: "/search", freq: "weekly", priority: 0.7 },
  { url: "/community", freq: "daily", priority: 0.6 },
  { url: "/leaks", freq: "weekly", priority: 0.6 },
  { url: "/terms", freq: "monthly", priority: 0.3 },
  { url: "/privacy", freq: "monthly", priority: 0.3 },
  { url: "/about", freq: "monthly", priority: 0.5 },
  { url: "/contact", freq: "monthly", priority: 0.5 },
  { url: "/guides", freq: "weekly", priority: 0.8 },
];

for (const route of staticRoutes) {
  entries.push(urlEntry(`${base}${route.url}`, now, route.freq, route.priority));
}

// Dynamic agent pages
for (let i = 0; i < 30; i++) {
  entries.push(urlEntry(`${base}/agents/agent-${i}`, now, "weekly", 0.8));
}

// Dynamic weapon pages
const weaponSlugs = ["vandal", "phantom", "operator", "guardian", "bulldog", "marshal", "ares", "odin", "spectre", "stinger", "bucky", "judge", "shorty", "frenzy", "ghost", "sheriff", "classic", "melee", "warden", "outlaw", "bandit"];
for (const slug of weaponSlugs) {
  entries.push(urlEntry(`${base}/weapons/${slug}`, now, "weekly", 0.8));
}

// Dynamic map pages
const mapSlugs = ["ascent", "bind", "haven", "split", "icebox", "breeze", "fracture", "pearl", "lotus", "sunset", "abyss", "corrode", "summit", "glitch", "piazza", "drift", "kasbah", "district", "breeze"];
for (const slug of mapSlugs) {
  entries.push(urlEntry(`${base}/maps/${slug}`, now, "weekly", 0.8));
}

// Dynamic patch note pages
const patchSlugs = ["patch-1310", "patch-1309", "patch-1308", "patch-1307", "patch-1306", "patch-1200"];
for (const slug of patchSlugs) {
  entries.push(urlEntry(`${base}/patch-notes/${slug}`, now, "monthly", 0.6));
}

// Dynamic comparison pages
const comparisonSlugs = [
  "weapons/vandal-vs-phantom",
  "weapons/warden-vs-vandal",
  "weapons/bandit-vs-sheriff",
  "weapons/operator-vs-outlaw",
  "weapons/spectre-vs-stinger",
  "weapons/sheriff-vs-ghost",
  "weapons/ares-vs-odin",
  "weapons/bulldog-vs-guardian",
  "agents/jett-vs-raze",
  "agents/waylay-vs-jett",
  "agents/tejo-vs-sova",
  "agents/omen-vs-clove",
  "agents/sova-vs-fade",
  "agents/cypher-vs-killjoy",
  "agents/viper-vs-harbor",
  "agents/breach-vs-kayo",
];
for (const slug of comparisonSlugs) {
  entries.push(urlEntry(`${base}/compare/${slug}`, now, "weekly", 0.7));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

writeFileSync(join(__dirname, "../public/sitemap.xml"), sitemap);
console.log(`Generated sitemap with ${entries.length} URLs`);
