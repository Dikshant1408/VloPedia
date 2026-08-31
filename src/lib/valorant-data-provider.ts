import { getFirebaseFirestore } from "@/services/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { valorantDb as mockDb } from "./valorant-db";
import {
  CONTENT_TIER_MAP,
  DEFAULT_TIER,
  deterministicScore,
  deterministicRating,
  type ValorantSkin,
  type ValorantBundle,
  type ValorantMap,
} from "./valorant-types";

const getWeaponSlugFromName = (name: string, assetPath: string): string => {
  const lowerName = name.toLowerCase();
  const weapons = ["vandal", "phantom", "classic", "sheriff", "ghost", "shorty", "frenzy", "stinger", "spectre", "bucky", "judge", "bulldog", "guardian", "marshal", "operator", "ares", "odin", "outlaw", "melee"];
  for (const w of weapons) {
    if (lowerName.endsWith(w)) {
      return w;
    }
  }

  const path = (assetPath || "").toLowerCase();
  if (path.includes("vesta")) return "classic";
  if (path.includes("slim")) return "shorty";
  if (path.includes("hollow")) return "frenzy";
  if (path.includes("spirit")) return "ghost";
  if (path.includes("revolver")) return "sheriff";
  if (path.includes("burstsmg")) return "stinger";
  if (path.includes("standardsmg")) return "spectre";
  if (path.includes("pumpshotgun")) return "bucky";
  if (path.includes("autoshotgun")) return "judge";
  if (path.includes("burstrifle")) return "bulldog";
  if (path.includes("leversniper") && path.includes("marshal")) return "marshal";
  if (path.includes("leversniper")) return "guardian";
  if (path.includes("standardrifle")) return "phantom";
  if (path.includes("dmr")) return "vandal";
  if (path.includes("boltsniper")) return "operator";
  if (path.includes("outlaw")) return "outlaw";
  if (path.includes("lightmachinegun")) return "ares";
  if (path.includes("heavymachinegun")) return "odin";
  if (path.includes("melee")) return "melee";

  return "vandal";
};

export class ValorantDataProvider {
  private static db = getFirebaseFirestore();

  // 1. Agents Queries
  public static async getAgents(): Promise<any[]> {
    try {
      const colRef = collection(this.db, "agents");
      const snap = await getDocs(colRef);
      if (snap.empty) return mockDb.agents;
      return snap.docs.map(d => d.data());
    } catch {
      return mockDb.agents;
    }
  }

  // V1 pages use dynamic mock shape; will be replaced with typed implementation in Task 6
  public static async getAgentBySlug(slug: string): Promise<any | null> {
    try {
      const docRef = doc(this.db, "agents", slug.toLowerCase());
      const snap = await getDoc(docRef);
      if (snap.exists()) return snap.data();
      return mockDb.agents.find(a => a.slug === slug) ?? null;
    } catch {
      return mockDb.agents.find(a => a.slug === slug) ?? null;
    }
  }

  // 2. Weapons Queries
  public static async getWeapons(): Promise<any[]> {
    try {
      const colRef = collection(this.db, "weapons");
      const snap = await getDocs(colRef);
      if (snap.empty) return mockDb.weapons;
      return snap.docs.map(d => d.data());
    } catch {
      return mockDb.weapons;
    }
  }

  // V1 pages use dynamic mock shape; will be replaced in Task 8
  public static async getWeaponBySlug(slug: string): Promise<any | null> {
    try {
      const docRef = doc(this.db, "weapons", slug.toLowerCase());
      const snap = await getDoc(docRef);
      if (snap.exists()) return snap.data();
      return mockDb.weapons.find(w => w.slug === slug) ?? null;
    } catch {
      return mockDb.weapons.find(w => w.slug === slug) ?? null;
    }
  }

  // 3. Skins Queries
  public static async getSkins(): Promise<any[]> {
    try {
      const res = await fetch("https://valorant-api.com/v1/weapons/skins");
      if (res.ok) {
        const json = await res.json();
        const apiSkins = json.data || [];

          return apiSkins.map((apiSkin: ValorantSkin) => {
            const tier = CONTENT_TIER_MAP[apiSkin.contentTierUuid ?? ""] ?? DEFAULT_TIER;

            const variants = (apiSkin.chromas ?? []).map((c, idx) => ({
              id: c.uuid,
              name: c.displayName.replace(apiSkin.displayName, "").trim() || "Default",
              hex: ["#FF4655", "#3b82f6", "#10b981", "#a855f7", "#eab308", "#f43f5e"][idx % 6],
              hueRotate: "",
              displayIcon: c.fullRender || c.displayIcon || apiSkin.displayIcon,
              videoUrl: c.streamedVideo ?? null,
            }));

            const levels = (apiSkin.levels ?? []).map((l) => ({
              uuid: l.uuid,
              name: l.displayName.replace(apiSkin.displayName, "").trim() || "Base Level",
              displayIcon: l.displayIcon,
              videoUrl: l.streamedVideo,
            }));

            const weaponSlug = getWeaponSlugFromName(apiSkin.displayName, apiSkin.assetPath);

            return {
              slug: apiSkin.uuid,
              name: apiSkin.displayName.toUpperCase(),
              weaponSlug,
              price: tier.price,
              rarity: tier.rarity,
              rarityIcon: tier.iconUrl,
              variants,
              levels,
              inspectVideoUrl: apiSkin.levels?.find((l) => l.streamedVideo)?.streamedVideo ?? null,
              reloadVideoUrl: apiSkin.chromas?.find((c) => c.streamedVideo)?.streamedVideo ?? null,
              communityRating: deterministicRating(apiSkin.uuid),
              popularity: deterministicScore(apiSkin.uuid),
              displayIcon: apiSkin.chromas?.[0]?.fullRender || apiSkin.chromas?.[0]?.displayIcon || apiSkin.displayIcon,
            };
          });
      }
    } catch {
      // Fallback to Firestore or mock below
    }

    try {
      const colRef = collection(this.db, "skins");
      const snap = await getDocs(colRef);
      if (snap.empty) {
        return mockDb.skins;
      }
      return snap.docs.map(d => d.data());
    } catch {
      return mockDb.skins;
    }
  }

  // V1 pages use dynamic mock shape; will be replaced in Task 12
  public static async getSkinBySlug(slug: string): Promise<any | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) {
      try {
        const res = await fetch("https://valorant-api.com/v1/weapons/skins");
        if (res.ok) {
          const json = await res.json();
          const apiSkins: ValorantSkin[] = json.data ?? [];
          const apiSkin = apiSkins.find((s) => s.uuid === slug);
          if (apiSkin) {
            const tier = CONTENT_TIER_MAP[apiSkin.contentTierUuid ?? ""] ?? DEFAULT_TIER;
            const variants = (apiSkin.chromas ?? []).map((c, idx) => ({
              id: c.uuid,
              name: c.displayName.replace(apiSkin.displayName, "").trim() || "Default",
              hex: ["#FF4655", "#3b82f6", "#10b981", "#a855f7", "#eab308", "#f43f5e"][idx % 6],
              hueRotate: "",
              displayIcon: c.fullRender || c.displayIcon || apiSkin.displayIcon,
              videoUrl: c.streamedVideo ?? null,
            }));
            const levels = (apiSkin.levels ?? []).map((l) => ({
              uuid: l.uuid,
              name: l.displayName.replace(apiSkin.displayName, "").trim() || "Base Level",
              displayIcon: l.displayIcon,
              videoUrl: l.streamedVideo,
            }));
            const weaponSlug = getWeaponSlugFromName(apiSkin.displayName, apiSkin.assetPath);
            return {
              slug: apiSkin.uuid,
              name: apiSkin.displayName.toUpperCase(),
              weaponSlug,
              price: tier.price,
              rarity: tier.rarity,
              rarityIcon: tier.iconUrl,
              variants,
              levels,
              inspectVideoUrl: apiSkin.levels?.find((l) => l.streamedVideo)?.streamedVideo ?? null,
              reloadVideoUrl: apiSkin.chromas?.find((c) => c.streamedVideo)?.streamedVideo ?? null,
              communityRating: deterministicRating(apiSkin.uuid),
              popularity: deterministicScore(apiSkin.uuid),
            };
          }
        }
      } catch {
        // fall through to Firestore/mock
      }
    }

    try {
      const docRef = doc(this.db, "skins", slug.toLowerCase());
      const snap = await getDoc(docRef);
      if (snap.exists()) return snap.data();
      return mockDb.skins.find(s => s.slug === slug) ?? null;
    } catch {
      return mockDb.skins.find(s => s.slug === slug) ?? null;
    }
  }

  // 4. Bundles Queries
  public static async getBundles(): Promise<any[]> {
    try {
      const res = await fetch("https://valorant-api.com/v1/bundles");
      if (res.ok) {
        const json = await res.json();
        const apiBundles: ValorantBundle[] = json.data ?? [];
        return apiBundles.map((b, idx) => ({
          slug: b.uuid,
          name: b.displayName.toUpperCase(),
          description: b.description || `Special edition weapon skins bundle: ${b.displayName}.`,
          price: [8700, 7100, 5100][idx % 3],
          active: idx === 0,
          displayIcon: b.displayIcon,
          verticalPromoImage: b.verticalPromoImage ?? b.displayIcon2 ?? b.displayIcon,
          skins: [],
        }));
      }
    } catch {
      // fall through
    }
    try {
      const colRef = collection(this.db, "bundles");
      const snap = await getDocs(colRef);
      if (snap.empty) return mockDb.bundles;
      return snap.docs.map(d => d.data());
    } catch {
      return mockDb.bundles;
    }
  }

  // V1 pages use dynamic mock shape; will be replaced in Task 14
  public static async getBundleBySlug(slug: string): Promise<any | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) {
      try {
        const res = await fetch("https://valorant-api.com/v1/bundles");
        if (res.ok) {
          const json = await res.json();
          const apiBundles: ValorantBundle[] = json.data ?? [];
          const b = apiBundles.find((item) => item.uuid === slug);
          if (b) {
            const skinsRes = await fetch("https://valorant-api.com/v1/weapons/skins");
            let bundleSkins: string[] = [];
            if (skinsRes.ok) {
              const skinsJson = await skinsRes.json();
              const allSkins: ValorantSkin[] = skinsJson.data ?? [];
              bundleSkins = allSkins
                .filter((s) => s.displayName.toLowerCase().includes(b.displayName.toLowerCase()) && s.displayIcon)
                .map((s) => s.displayName);
            }
            return {
              slug: b.uuid,
              name: b.displayName.toUpperCase(),
              description: b.description || `Special edition weapon skins bundle: ${b.displayName}.`,
              price: 7100,
              active: false,
              displayIcon: b.displayIcon,
              verticalPromoImage: b.verticalPromoImage ?? b.displayIcon2 ?? b.displayIcon,
              skins: bundleSkins,
              trailerUrl: "https://www.youtube.com/embed/e_E9W2GD7Zw",
            };
          }
        }
      } catch {
        // fall through
      }
    }
    try {
      const docRef = doc(this.db, "bundles", slug.toLowerCase());
      const snap = await getDoc(docRef);
      if (snap.exists()) return snap.data();
      return mockDb.bundles.find(b => b.slug === slug) ?? null;
    } catch {
      return mockDb.bundles.find(b => b.slug === slug) ?? null;
    }
  }

  // 5. Maps Queries
  public static async getMaps(): Promise<any[]> {
    try {
      const res = await fetch("https://valorant-api.com/v1/maps");
      if (res.ok) {
        const json = await res.json();
        const apiMaps: ValorantMap[] = json.data ?? [];
        return apiMaps
          .filter((m) => m.displayIcon && m.splash)
          .map((m) => {
            const mappedCallouts = m.callouts
              ? m.callouts.map((c) =>
                  c.superRegionName ? `${c.superRegionName} ${c.regionName}` : c.regionName
                )
              : ["A SITE", "B SITE", "MID AREA"];
            const uniqueCallouts = Array.from(new Set(mappedCallouts)).filter(Boolean);
            const hasThreeSites = uniqueCallouts.some(c => String(c).includes("C "));
            const strategies = hasThreeSites
              ? [
                  "Establish lane controls early to leverage the pressure of a three-site layout (A, B, and C).",
                  "Coordinate utility blocks and split rotations to deny quick anchor defense shifts.",
                ]
              : [
                  "Control key choke points and block long sightlines using standard smoke execution loops.",
                  "Coordinate utility sweeps and site retakes utilizing default setups for A and B site control.",
                ];
            return {
              slug: m.displayName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
              name: m.displayName.toUpperCase(),
              location: m.coordinates ?? "Classified Coordinates",
              lore: m.narrativeDescription ?? `Tactical layout for sector ${m.displayName}. Secure site defenses.`,
              callouts: uniqueCallouts.slice(0, 12),
              strategies,
              minimapUrl: m.displayIcon,
              splashUrl: m.splash,
              listViewIcon: m.listViewIcon,
              listViewIconTall: m.listViewIconTall,
              stylizedBackgroundImage: m.stylizedBackgroundImage,
              premierBackgroundImage: m.premierBackgroundImage,
              xMultiplier: m.xMultiplier,
              yMultiplier: m.yMultiplier,
              xScalarToAdd: m.xScalarToAdd,
              yScalarToAdd: m.yScalarToAdd,
              rawCallouts: m.callouts ?? [],
            };
          });
      }
    } catch {
      // fall through
    }
    try {
      const colRef = collection(this.db, "maps");
      const snap = await getDocs(colRef);
      if (snap.empty) return mockDb.maps;
      return snap.docs.map(d => d.data());
    } catch {
      return mockDb.maps;
    }
  }

  // V1 pages use dynamic mock shape; will be replaced in Task 10
  public static async getMapBySlug(slug: string): Promise<any | null> {
    try {
      const res = await fetch("https://valorant-api.com/v1/maps");
      if (res.ok) {
        const json = await res.json();
        const apiMaps: ValorantMap[] = json.data ?? [];
        const norm = slug.toLowerCase();
        const m = apiMaps.find(
          (item) =>
            item.uuid.toLowerCase() === norm ||
            item.displayName.toLowerCase() === norm ||
            item.displayName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") === norm
        );
        if (m) {
          const mappedCallouts = m.callouts
            ? m.callouts.map((c) =>
                c.superRegionName ? `${c.superRegionName} ${c.regionName}` : c.regionName
              )
            : ["A SITE", "B SITE", "MID AREA"];
          const uniqueCallouts = Array.from(new Set(mappedCallouts)).filter(Boolean);
          const hasThreeSites = uniqueCallouts.some(c => String(c).includes("C "));
          const strategies = hasThreeSites
            ? [
                "Establish lane controls early to leverage the pressure of a three-site layout (A, B, and C).",
                "Coordinate utility blocks and split rotations to deny quick anchor defense shifts.",
              ]
            : [
                "Control key choke points and block long sightlines using standard smoke execution loops.",
                "Coordinate utility sweeps and site retakes utilizing default setups for A and B site control.",
              ];
          return {
            slug: m.displayName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
            name: m.displayName.toUpperCase(),
            location: m.coordinates ?? "Classified Coordinates",
            lore: m.narrativeDescription ?? `Tactical layout for sector ${m.displayName}. Secure site defenses.`,
            callouts: uniqueCallouts.slice(0, 12),
            strategies,
            minimapUrl: m.displayIcon,
            splashUrl: m.splash,
            listViewIcon: m.listViewIcon,
            listViewIconTall: m.listViewIconTall,
            stylizedBackgroundImage: m.stylizedBackgroundImage,
            premierBackgroundImage: m.premierBackgroundImage,
            xMultiplier: m.xMultiplier,
            yMultiplier: m.yMultiplier,
            xScalarToAdd: m.xScalarToAdd,
            yScalarToAdd: m.yScalarToAdd,
            rawCallouts: m.callouts ?? [],
          };
        }
      }
    } catch {
      // fall through
    }
    try {
      const docRef = doc(this.db, "maps", slug.toLowerCase());
      const snap = await getDoc(docRef);
      if (snap.exists()) return snap.data();
      return mockDb.maps.find(m => m.slug === slug) ?? null;
    } catch {
      return mockDb.maps.find(m => m.slug === slug) ?? null;
    }
  }
}
