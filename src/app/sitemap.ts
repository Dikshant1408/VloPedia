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
    { url: `${base}/guides`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/setup`,              lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/match-prep`,         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/explore`,            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/methodology`,        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/data-sources`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/what-to-play`, lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/tools/round-assistant`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
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

  // 4. Dynamic map pages
  const mapSlugs = await fetchSlugs<{ displayName: string }>(
    "https://valorant-api.com/v1/maps",
    m => slugify(m.displayName)
  );
  const mapRoutes: MetadataRoute.Sitemap = mapSlugs.map(slug => ({
    url:             `${base}/maps/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.7,
  }));

  // 7. Dynamic patches (from mock valorantDb)
  const patchRoutes: MetadataRoute.Sitemap = valorantDb.patches.map(p => ({
    url:             `${base}/patch-notes/${p.slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.6,
  }));

  // 8. Dynamic lore archives (from loreData.articles)
  const loreRoutes: MetadataRoute.Sitemap = loreData.articles.map(l => ({
    url:             `${base}/lore/${l.slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  // 9. Dynamic comparison routes
  const comparisonSlugs = [
    "weapons/vandal-vs-phantom",
    "weapons/operator-vs-outlaw",
    "weapons/spectre-vs-stinger",
    "weapons/sheriff-vs-ghost",
    "weapons/ares-vs-odin",
    "weapons/bulldog-vs-guardian",
    "agents/jett-vs-raze",
    "agents/omen-vs-clove",
    "agents/sova-vs-fade",
    "agents/cypher-vs-killjoy",
    "agents/viper-vs-harbor",
    "agents/breach-vs-kayo",
  ];
  const compareRoutes: MetadataRoute.Sitemap = comparisonSlugs.map(slug => ({
    url:             `${base}/compare/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.7,
  }));

  // 10. Dynamic leaks logs (from mock valorantDb)
  const leaksRoutes: MetadataRoute.Sitemap = valorantDb.leaks.map(l => ({
    url:             `${base}/leaks/${l.slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.5,
  }));

  // 10. Dynamic Weapon Skin Hubs (/skins/vandal, /skins/phantom, etc.)
  const weaponHubSlugs = [
    "vandal","phantom","operator","spectre","ghost","classic","sheriff",
    "frenzy","shorty","stinger","bucky","judge","bulldog","guardian",
    "marshal","ares","odin","outlaw","melee","karambit"
  ];
  const weaponHubRoutes: MetadataRoute.Sitemap = weaponHubSlugs.map(w => ({
    url:             `${base}/skins/${w}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  // 11. Dynamic skin pages, watch pages, and collection lines
  let skinSlugs: string[] = [];
  let watchSlugs: string[] = [];
  let collectionSlugs: string[] = ["kuronami", "reaver", "oni", "prime", "glitchpop", "aemondir", "aeris", "helix", "minima", "montage"];

  try {
    const skinsRes = await fetch("https://valorant-api.com/v1/weapons/skins", { next: { revalidate: 3600 } });
    if (skinsRes.ok) {
      const skinsJson = await skinsRes.json();
      const allSkins = skinsJson.data ?? [];
      const discoveredCols = new Set<string>();

      allSkins.forEach((s: any) => {
        if (s.displayName.toLowerCase().startsWith("standard")) return;
        const cleanSlug = slugify(s.displayName);
        if (cleanSlug) {
          skinSlugs.push(cleanSlug);
          const hasVideo = s.levels?.some((l: any) => l.streamedVideo) || s.chromas?.some((c: any) => c.streamedVideo);
          if (hasVideo) {
            watchSlugs.push(cleanSlug);
          }
          // Parse collection line
          const parts = s.displayName.trim().split(/\s+/);
          if (parts.length > 1) {
            const colPrefix = parts.slice(0, -1).join(" ");
            const colSlug = slugify(colPrefix);
            if (colSlug) discoveredCols.add(colSlug);
          }
        }
      });
      collectionSlugs = Array.from(discoveredCols);
    }
  } catch (e) {
    // Ignore fetch error
  }

  const skinRoutes: MetadataRoute.Sitemap = skinSlugs.map(slug => ({
    url:             `${base}/skins/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  const watchRoutes: MetadataRoute.Sitemap = watchSlugs.map(slug => ({
    url:             `${base}/skins/${slug}/watch`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map(slug => ({
    url:             `${base}/collections/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.8,
  }));

  // 12. Dynamic bundle pages
  const bundleSlugs = await fetchSlugs<{ uuid: string }>(
    "https://valorant-api.com/v1/bundles",
    b => b.uuid
  );
  const bundleRoutes: MetadataRoute.Sitemap = bundleSlugs.map(slug => ({
    url:             `${base}/bundles/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.6,
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

  // 14. Dynamic guides pages
  const guidesRoutes: MetadataRoute.Sitemap = guidesDb.map(g => ({
    url:             `${base}/guides/${g.slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.7,
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
    ...weaponHubRoutes,
    ...mapRoutes,
    ...patchRoutes,
    ...loreRoutes,
    ...compareRoutes,
    ...bestRoutes,
    ...leaksRoutes,
    ...collectionRoutes,
    ...skinRoutes,
    ...watchRoutes,
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
