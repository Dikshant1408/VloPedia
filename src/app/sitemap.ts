import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { valorantDb } from "@/lib/valorant-db";
import { guidesDb } from "@/lib/guides-db";

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
    { url: `${base}/lore`,               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/patch-notes`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/tier-list`,          lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/comp-builder`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/crosshair`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sensitivity`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
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
    { url: `${base}/setup`,              lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
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

  // 8. Dynamic lore logs (from mock valorantDb)
  const loreRoutes: MetadataRoute.Sitemap = valorantDb.lore.map(l => ({
    url:             `${base}/lore/${l.slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.5,
  }));

  // 9. Dynamic leaks logs (from mock valorantDb)
  const leaksRoutes: MetadataRoute.Sitemap = valorantDb.leaks.map(l => ({
    url:             `${base}/leaks/${l.slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.5,
  }));

  // 10. Dynamic collections Checklist routes
  const collectionSlugs = ["kuronami-vandal", "reaver-vandal", "oni-phantom"];
  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map(slug => ({
    url:             `${base}/collections/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.6,
  }));

  // 11. Dynamic skin pages and watch pages (excluding Standard base skins)
  let skinSlugs: string[] = [];
  let watchSlugs: string[] = [];
  try {
    const skinsRes = await fetch("https://valorant-api.com/v1/weapons/skins", { next: { revalidate: 3600 } });
    if (skinsRes.ok) {
      const skinsJson = await skinsRes.json();
      const allSkins = skinsJson.data ?? [];
      allSkins.forEach((s: any) => {
        if (s.displayName.toLowerCase().startsWith("standard")) return;
        skinSlugs.push(s.uuid);
        const hasVideo = s.levels?.some((l: any) => l.streamedVideo) || s.chromas?.some((c: any) => c.streamedVideo);
        if (hasVideo) {
          watchSlugs.push(s.uuid);
        }
      });
    }
  } catch (e) {
    // Ignore fetch error
  }

  const skinRoutes: MetadataRoute.Sitemap = skinSlugs.map(slug => ({
    url:             `${base}/skins/${slug}`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.6,
  }));

  const watchRoutes: MetadataRoute.Sitemap = watchSlugs.map(slug => ({
    url:             `${base}/skins/${slug}/watch`,
    lastModified:    now,
    changeFrequency: "weekly",
    priority:        0.7,
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

  // Deduplicate entries by URL
  const allRoutes = [
    ...staticRoutes,
    ...agentRoutes,
    ...weaponRoutes,
    ...mapRoutes,
    ...patchRoutes,
    ...loreRoutes,
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
