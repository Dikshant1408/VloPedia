import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { valorantDb } from "@/lib/valorant-db";
import { guidesDb } from "@/lib/guides-db";
import loreData from "@/data/lore-database.json";

export const dynamic = "force-static";

// Disable cache for fetch during static page generation in Next.js
async function fetchSlugs<T>(
  url: string,
  map: (item: T) => string
): Promise<string[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    const slugs = (json.data ?? []).map(map).filter(Boolean);
    return Array.from(new Set(slugs));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const base = (envUrl && !envUrl.includes("localhost") ? envUrl : siteConfig.url).replace(/\/+$/, "");
  const now  = new Date();

  // 1. Static high-priority routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                          lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/agents`,              lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/weapons`,             lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/maps`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/skins`,               lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/bundles`,             lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/buddies`,             lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/sprays`,              lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/playercards`,         lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/flex`,                lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/gamemodes`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/tiers`,              lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/lore`,               lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/tools`,              lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/compare`,            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/patch-notes`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/tier-list`,          lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/comp-builder`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/crosshair`,          lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/sensitivity`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/pro-settings`,       lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/store`,              lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/search`,             lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/community`,          lastModified: now, changeFrequency: "daily",   priority: 0.6 },
    { url: `${base}/leaks`,              lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/terms`,              lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`,            lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/about`,              lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`,            lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/guides`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
  ];

  // Helper function to slugify text
  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // 2. Dynamic agent pages
  const agentSlugs = await fetchSlugs<{ displayName: string }>(
    "https://valorant-api.com/v1/agents?isPlayableCharacter=true",
    a => slugify(a.displayName)
  );
  if (!agentSlugs.includes("hush")) {
    agentSlugs.push("hush");
  }
  const agentRoutes: MetadataRoute.Sitemap = agentSlugs.map(slug => ({
    url:             `${base}/agents/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  // 3. Dynamic weapon pages
  const weaponSlugs = await fetchSlugs<{ displayName: string }>(
    "https://valorant-api.com/v1/weapons",
    w => slugify(w.displayName)
  );
  const weaponRoutes: MetadataRoute.Sitemap = weaponSlugs.map(slug => ({
    url:             `${base}/weapons/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.7,
  }));

  // 4. Dynamic map pages (only competitive/playable maps with minimap displayIcon)
  const mapSlugs = await fetchSlugs<{ displayName: string; splash?: string; displayIcon?: string }>(
    "https://valorant-api.com/v1/maps",
    m => (m.splash && m.displayIcon ? slugify(m.displayName) : "")
  );
  const mapRoutes: MetadataRoute.Sitemap = mapSlugs.map(slug => ({
    url:             `${base}/maps/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.7,
  }));

// NOTE: Keeping patch routes as they contain valuable changelog content.
   const patchRoutes: MetadataRoute.Sitemap = valorantDb.patches.map(p => ({
     url: `${base}/patch-notes/${p.slug}`,
     lastModified: now,
     changeFrequency: "monthly",
     priority: 0.6,
   }));
   // Keeping lore routes as they provide curated content.
   const loreRoutes: MetadataRoute.Sitemap = loreData.articles.map(l => ({
     url: `${base}/lore/${l.slug}`,
     lastModified: now,
     changeFrequency: "weekly",
     priority: 0.8,
   }));
   // Keeping comparison routes as they add value.
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
   const compareRoutes: MetadataRoute.Sitemap = comparisonSlugs.map(slug => ({
     url: `${base}/compare/${slug}`,
     lastModified: now,
     changeFrequency: "weekly",
     priority: 0.7,
   }));
   // Keeping leaks routes as they provide community value.
   const leaksRoutes: MetadataRoute.Sitemap = valorantDb.leaks.map(l => ({
     url: `${base}/leaks/${l.slug}`,
     lastModified: now,
     changeFrequency: "weekly",
     priority: 0.5,
   }));

   // 10. Dynamic skin pages
   const skinSlugs = await fetchSlugs<{ uuid: string; displayName: string }>(
     "https://valorant-api.com/v1/weapons/skins",
     s => s.displayName.toLowerCase() !== "none" ? s.uuid : ""
   );
   const skinRoutes: MetadataRoute.Sitemap = skinSlugs.map(slug => ({
     url:             `${base}/skins/${slug}`,
     lastModified:    now,
     changeFrequency: "weekly",
     priority:        0.8,
   }));

   // 11. Dynamic collection pages
   let collectionSlugs: string[] = [];
   try {
     const guidesRes = await fetch(`${base}/guides`);
     if (guidesRes.ok) {
       const discoveredCols = new Set<string>();
       const html = await guidesRes.text();
       const parts = html.split(/\/collections\//);
       for (let i = 1; i < parts.length; i++) {
         const colPrefix = parts[i].split(/[\/\?"' ]/)[0];
         const colSlug = slugify(colPrefix);
         if (colSlug) discoveredCols.add(colSlug);
       }
       collectionSlugs = Array.from(discoveredCols);
     }
   } catch (e) {
     // Ignore fetch error
   }

   const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map(slug => ({
     url:             `${base}/collections/${slug}`,
     lastModified:    now,
     changeFrequency: "weekly",
     priority:        0.8,
   }));

  // 12. Dynamic bundle pages (only valid named bundles)
  const bundleSlugs = await fetchSlugs<{ uuid: string; displayName?: string }>(
    "https://valorant-api.com/v1/bundles",
    b => (b.displayName && b.displayName.trim().toLowerCase() !== "null" ? b.uuid : "")
  );
  const bundleRoutes: MetadataRoute.Sitemap = bundleSlugs.map(slug => ({
    url:             `${base}/bundles/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.7,
  }));

  // 13. Dynamic flex pages (excluding 'none' expression)
  const flexSlugs = await fetchSlugs<{ uuid: string; displayName: string }>(
    "https://valorant-api.com/v1/flex",
    f => f.displayName.toLowerCase() !== "none" ? f.uuid : ""
  );
  const flexRoutes: MetadataRoute.Sitemap = flexSlugs.map(slug => ({
    url:             `${base}/flex/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.5,
  }));

  // 14. Dynamic guides pages (High-value editorial content)
  const guidesRoutes: MetadataRoute.Sitemap = guidesDb.map(g => ({
    url:             `${base}/guides/${g.slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.9,
  }));

  // 15. Dynamic Best-For Intent pages
  const bestSlugs = [
    "agents-for-beginners",
    "agents-for-solo-queue",
    "duelists",
    "controllers",
    "agents-on-ascent",
  ];
  const bestRoutes: MetadataRoute.Sitemap = bestSlugs.map(slug => ({
    url:             `${base}/best/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  // Deduplicate entries by URL
const allRoutes = [
     ...staticRoutes,
     ...agentRoutes,
     ...weaponRoutes,
     ...mapRoutes,
     ...patchRoutes,
     ...loreRoutes,
     ...compareRoutes,
     ...bestRoutes,
     ...leaksRoutes,
     ...collectionRoutes,
     ...skinRoutes,
     ...bundleRoutes,
     ...flexRoutes,
     ...guidesRoutes,
   ];

  const uniqueMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const route of allRoutes) {
    if (!uniqueMap.has(route.url)) {
      uniqueMap.set(route.url, route);
    }
  }

  return Array.from(uniqueMap.values());
}
