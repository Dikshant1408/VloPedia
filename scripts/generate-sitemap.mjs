import { writeFileSync } from "fs";
import { siteConfig } from "../src/lib/site.ts";
import { valorantDb } from "../src/lib/valorant-db.ts";
import { guidesDb } from "../src/lib/guides-db.ts";
import loreData from "../src/data/lore-database.json";

const base = siteConfig.url.replace(/\/+$/, "");
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
for (const agent of valorantDb.agents) {
  entries.push(urlEntry(`${base}/agents/${agent.slug}`, now, "weekly", 0.8));
}

// Dynamic weapon pages
for (const weapon of valorantDb.weapons) {
  entries.push(urlEntry(`${base}/weapons/${weapon.slug}`, now, "weekly", 0.8));
}

// Dynamic map pages
for (const map of valorantDb.maps) {
  entries.push(urlEntry(`${base}/maps/${map.slug}`, now, "weekly", 0.8));
}

// Dynamic skin pages
for (const skin of valorantDb.skins) {
  entries.push(urlEntry(`${base}/skins/${skin.slug}`, now, "weekly", 0.8));
}

// Dynamic bundle pages
for (const bundle of valorantDb.bundles) {
  entries.push(urlEntry(`${base}/bundles/${bundle.slug}`, now, "weekly", 0.8));
}

// Dynamic patch note pages
for (const patch of valorantDb.patches) {
  entries.push(urlEntry(`${base}/patch-notes/${patch.slug}`, now, "monthly", 0.6));
}

// Dynamic lore pages
for (const article of loreData.articles) {
  entries.push(urlEntry(`${base}/lore/${article.slug}`, now, "weekly", 0.7));
}

// Dynamic leak pages
for (const leak of valorantDb.leaks) {
  entries.push(urlEntry(`${base}/leaks/${leak.slug}`, now, "weekly", 0.5));
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

writeFileSync("../public/sitemap.xml", sitemap);
console.log(`Generated sitemap with ${entries.length} URLs`);
