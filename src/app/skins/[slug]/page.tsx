import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Shield, Tag, Video, Layers, CheckCircle, HelpCircle, ArrowRight, FolderKanban, Crosshair, ShoppingBag, Coins, Zap, Award, Info } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { ContentTierBadge } from "@/components/content-tier-badge";
import { SkinInspectClient } from "@/components/skin-inspect-client";
import { WeaponSkinHub } from "@/components/weapon-skin-hub";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";
import type { ValorantSkin } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AnswerBox } from "@/components/answer-box";
import { BookmarkButton } from "@/components/bookmark-button";
import { RecordRecentView } from "@/components/record-recent-view";

export const dynamic = "force-static";
export const dynamicParams = false;

const API = "https://valorant-api.com/v1";

const WEAPON_SLUGS = [
  "vandal","phantom","operator","spectre","ghost","classic","sheriff",
  "frenzy","shorty","stinger","bucky","judge","bulldog","guardian",
  "marshal","ares","odin","outlaw","warden","bandit","melee","karambit"
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function weaponFromName(name: string, assetPath: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("karambit")) return "melee";
  for (const w of WEAPON_SLUGS) {
    if (lower.endsWith(w)) return w;
  }
  const p = (assetPath || "").toLowerCase();
  if (p.includes("standardrifle")) return "phantom";
  if (p.includes("dmr")) return "vandal";
  if (p.includes("boltsniper")) return "operator";
  if (p.includes("standardsmg")) return "spectre";
  if (p.includes("revolver")) return "sheriff";
  if (p.includes("battlerifle") || p.includes("warden")) return "warden";
  if (p.includes("compact") || p.includes("bandit")) return "bandit";
  if (p.includes("melee")) return "melee";
  return "vandal";
}

function getCollectionName(skinName: string): string {
  const parts = skinName.trim().split(/\s+/);
  if (parts.length > 1) {
    return parts.slice(0, -1).join(" ");
  }
  return skinName;
}

const WEAPON_ARCHETYPES: Record<string, string> = {
  vandal: "high-precision assault rifle renowned for its guaranteed 1-tap lethal headshot damage at all ranges",
  phantom: "silenced tactical assault rifle optimized for close-to-medium spray transfers and stealth smoke spraying",
  operator: "devastating high-impact sniper rifle capable of one-shot lethal hits to the chest and head across any engagement distance",
  spectre: "silenced compact submachine gun tailored for rapid eco-round maneuverability and high mobile accuracy",
  ghost: "silenced semi-automatic sidearm favored during pistol rounds for pinpoint first-shot accuracy and stealth penetration",
  classic: "standard-issue semi-automatic sidearm featuring an alternative secondary right-click 3-round burst for close-quarters duels",
  sheriff: "high-caliber heavy revolver providing lethal single-shot headshot capability against unarmored and light-shield adversaries",
  frenzy: "fully automatic machine pistol built for aggressive close-range run-and-gun entry engagements",
  shorty: "compact double-barrel sidearm shotgun designed for ambush angles and high close-quarters burst damage",
  stinger: "rapid-fire submachine gun with an explosive 4-round burst zoom mode for budget anti-eco rounds",
  bucky: "pump-action tactical shotgun offering wide spread pellet bursts and an alternate right-click air-burst slug mode",
  judge: "fully automatic combat shotgun engineered for aggressive site containment and close-quarters anchor holds",
  bulldog: "budget bullpup assault rifle featuring automatic hip-fire and a high-cadence 3-round burst zoom mode",
  guardian: "high-powered semi-automatic designated marksman rifle offering high wall penetration and 1-tap lethal headshots",
  marshal: "lever-action lightweight sniper rifle optimized for fast scope recovery and cost-efficient anti-eco rounds",
  ares: "heavy machine gun with a high-capacity drum magazine and high wall penetration tailored for defensive utility suppression",
  odin: "rapid-fire heavy machine gun delivering overwhelming bullet saturation and extreme bullet penetration through walls",
  outlaw: "double-barrel armor-piercing sniper rifle built to punish half-shield purchases with 140 body-shot damage",
  melee: "tactical hand-to-hand combat melee weapon providing zero-footstep movement speed advantage and silent backstabs",
};

let skinsCache: Promise<ValorantSkin[]> | null = null;

export async function getAllSkins(): Promise<ValorantSkin[]> {
  if (skinsCache) return skinsCache;
  skinsCache = (async () => {
    try {
      const res = await fetch(`${API}/weapons/skins`);
      if (!res.ok) {
        skinsCache = null;
        return [];
      }
      const json = await res.json();
      return json.data ?? [];
    } catch {
      skinsCache = null;
      return [];
    }
  })();
  return skinsCache;
}

function toInspectShape(s: ValorantSkin) {
  const tierInfo = CONTENT_TIER_MAP[s.contentTierUuid ?? ""];
  const rarity  = tierInfo?.rarity  ?? "PREMIUM";
  const price   = tierInfo?.price   ?? 1775;

  const variants = (s.chromas || []).map((c, i) => ({
    id:           c.uuid,
    name:         (c.displayName || "").replace(s.displayName || "", "").trim() || (i === 0 ? "Default" : `Variant ${i + 1}`),
    hex:          ["#FF4655","#3b82f6","#10b981","#a855f7","#eab308","#f43f5e"][i % 6],
    hueRotate:    "",
    displayIcon:  c.fullRender ?? c.displayIcon ?? s.displayIcon,
    videoUrl:     c.streamedVideo ?? null,
  }));

  const levels = (s.levels || []).map((l, i) => ({
    uuid:        l.uuid,
    name:        (l.displayName || "").replace(s.displayName || "", "").trim() || `Level ${i + 1}`,
    displayIcon: l.displayIcon,
    videoUrl:    l.streamedVideo ?? null,
  }));

  const inspectVideoUrl = s.levels?.find(l => l.streamedVideo)?.streamedVideo ?? null;
  const reloadVideoUrl  = s.chromas?.find(c => c.streamedVideo)?.streamedVideo ?? null;

  return {
    slug:             slugify(s.displayName) || s.uuid,
    name:             s.displayName.toUpperCase(),
    weaponSlug:       weaponFromName(s.displayName, s.assetPath),
    rarity,
    rarityIcon:       tierInfo?.iconUrl ?? "",
    price,
    variants,
    levels,
    inspectVideoUrl:  inspectVideoUrl ?? null,
    reloadVideoUrl:   reloadVideoUrl  ?? null,
    communityRating:  "4.5",
    popularity:       80,
  };
}

export async function generateStaticParams() {
  const skins = await getAllSkins();
  const params: { slug: string }[] = [];

  // 1. Weapon Skin Hub routes (e.g. /skins/vandal)
  for (const w of WEAPON_SLUGS) {
    params.push({ slug: w });
  }

  // 2. Clean skin slug routes (e.g. /skins/aemondir-vandal)
  for (const s of skins) {
    if (s.displayName.toLowerCase().startsWith("standard")) {
      continue;
    }
    const cleanSlug = slugify(s.displayName);
    if (cleanSlug) {
      params.push({ slug: cleanSlug });
    }
  }

  // Deduplicate params
  const seen = new Set<string>();
  return params.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

type Props = { params: Promise<{ slug: string }> };

function findSkin(skins: ValorantSkin[], slug: string) {
  const norm = slug.toLowerCase().trim();
  return skins.find(s => s.uuid.toLowerCase() === norm || slugify(s.displayName) === norm);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase().trim();

  // Check if this is a weapon hub
  if (WEAPON_SLUGS.includes(lowerSlug)) {
    const weaponName = lowerSlug.toUpperCase();
    const pageTitle = `Best ${weaponName} Skins in VALORANT: Prices, Tier List & Finishers | VloPedia`;
    const pageDesc = `Explore all official ${weaponName} weapon skins in VALORANT. Compare VP store prices, inspect finisher visual effects, Radianite upgrades, and browse the complete tier list.`;
    return {
      title: pageTitle,
      description: pageDesc,
      robots: { index: true, follow: true },
      openGraph: { title: pageTitle, description: pageDesc },
      alternates: { canonical: `${siteConfig.url}/skins/${lowerSlug}` },
    };
  }

  const skins = await getAllSkins();
  const skin = findSkin(skins, slug);
  if (!skin) return { title: "Skin Not Found | VloPedia", robots: { index: false } };

  if (skin.displayName.toLowerCase().startsWith("standard")) {
    const targetWeapon = weaponFromName(skin.displayName, skin.assetPath);
    return {
      title: `${skin.displayName} | VloPedia`,
      description: `Default baseline weapon model for the ${targetWeapon.toUpperCase()} in VALORANT.`,
      robots: { index: false, follow: true },
      alternates: { canonical: `${siteConfig.url}/skins/${targetWeapon}` },
    };
  }

  const canonicalSlug = slugify(skin.displayName) || skin.uuid;

  // If accessed via legacy UUID alias, instruct search engines not to index this URL and point canonical to clean slug
  const isLegacyUuid = lowerSlug === skin.uuid.toLowerCase() && canonicalSlug && lowerSlug !== canonicalSlug.toLowerCase();
  if (isLegacyUuid) {
    return {
      title: `${skin.displayName} VALORANT Skin | VloPedia`,
      description: `Official details and video showcase for ${skin.displayName} in VALORANT.`,
      robots: {
        index: false,
        follow: true,
      },
      alternates: {
        canonical: `${siteConfig.url}/skins/${canonicalSlug}`,
      },
    };
  }

  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""];
  const img  = skin.chromas?.[0]?.fullRender ?? skin.displayIcon;

  const pageTitle = `${skin.displayName} — Price, Variants, Upgrades & Showcase | VloPedia`;
  const pageDesc = `${skin.displayName} VALORANT skin: check its in-game store price (${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"}), ${skin.chromas?.length ?? 1} chroma colorways, Radianite upgrades, custom reload sounds, finisher VFX, and release details.`;

  return {
    title: pageTitle,
    description: pageDesc,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      title: pageTitle,
      description: pageDesc,
      images: img ? [{ url: img }] : [],
    },
    alternates: {
      canonical: `${siteConfig.url}/skins/${canonicalSlug}`,
    },
  };
}

export default async function SkinDetailPage({ params }: Props) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase().trim();
  const skins = await getAllSkins();

  // 1. Check if this is a Weapon Skin Hub (e.g. /skins/vandal)
  if (WEAPON_SLUGS.includes(lowerSlug)) {
    const targetWeapon = lowerSlug === "karambit" ? "melee" : lowerSlug;
    const weaponSkins = skins
      .filter(s => {
        if (s.displayName.toLowerCase().startsWith("standard")) return false;
        const w = weaponFromName(s.displayName, s.assetPath);
        if (lowerSlug === "karambit") {
          return s.displayName.toLowerCase().includes("karambit");
        }
        return w === targetWeapon;
      })
      .map(s => ({
        uuid: s.uuid,
        displayName: s.displayName,
        themeUuid: s.themeUuid,
        contentTierUuid: s.contentTierUuid,
        displayIcon: s.displayIcon,
        wallpaper: null,
        assetPath: s.assetPath,
        chromas: (s.chromas || []).slice(0, 1).map(c => ({
          uuid: c.uuid,
          displayName: c.displayName,
          displayIcon: c.displayIcon,
          fullRender: c.fullRender,
          swatch: null,
          streamedVideo: s.chromas?.some(x => x.streamedVideo) ? "video" : null,
          assetPath: "",
        })),
        levels: s.levels?.some(l => l.streamedVideo) ? [{
          uuid: s.levels[0]?.uuid ?? s.uuid,
          displayName: s.levels[0]?.displayName ?? "",
          levelItem: null,
          displayIcon: null,
          streamedVideo: "video",
          assetPath: "",
        }] : [],
      }));

    return (
      <WeaponSkinHub
        weaponSlug={lowerSlug}
        weaponName={lowerSlug.toUpperCase()}
        skins={weaponSkins}
      />
    );
  }

  // 2. Find Skin by UUID or clean slug
  const skin = findSkin(skins, slug);
  if (!skin) notFound();

  // 3. 301 Permanent Redirect for standard base skins to weapon hub
  if (skin.displayName.toLowerCase().startsWith("standard")) {
    const targetWeapon = weaponFromName(skin.displayName, skin.assetPath);
    permanentRedirect(`/skins/${targetWeapon}`);
  }

  const canonicalSlug = slugify(skin.displayName);

  // 4. 301 Permanent Redirect if accessed via legacy UUID
  if (canonicalSlug && slug.toLowerCase() === skin.uuid.toLowerCase() && slug.toLowerCase() !== canonicalSlug) {
    permanentRedirect(`/skins/${canonicalSlug}`);
  }

  const inspectSkin = toInspectShape(skin);
  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""];
  const weaponSlug = weaponFromName(skin.displayName, skin.assetPath);
  const weaponName = weaponSlug.toUpperCase();
  const collectionName = getCollectionName(skin.displayName);
  const collectionSlug = slugify(collectionName);
  const hasVideo = (skin.levels || []).some((l) => l.streamedVideo) || (skin.chromas || []).some((c) => c.streamedVideo);

  // Content enrichment data
  const isNightMarketEligible = tier && (tier.rarity === "SELECT" || tier.rarity === "DELUXE" || tier.rarity === "PREMIUM") && !skin.displayName.toLowerCase().includes("vct");
  const upgradeCount = Math.max(0, (skin.levels?.length || 1) - 1);
  const chromaCount = Math.max(0, (skin.chromas?.length || 1) - 1);
  const totalRadianiteCost = (upgradeCount * 10) + (chromaCount * 15);
  const weaponArchetypeDesc = WEAPON_ARCHETYPES[weaponSlug] || "primary tactical firearm in VALORANT";

  // Related skins for same weapon
  const relatedSkins = skins
    .filter(s => {
      if (s.uuid === skin.uuid) return false;
      if (s.displayName.toLowerCase().startsWith("standard")) return false;
      return weaponFromName(s.displayName, s.assetPath) === weaponSlug;
    })
    .slice(0, 4)
    .map(s => ({
      uuid: s.uuid,
      displayName: s.displayName,
      themeUuid: s.themeUuid,
      contentTierUuid: s.contentTierUuid,
      displayIcon: s.displayIcon,
      wallpaper: null,
      assetPath: "",
      chromas: s.chromas && s.chromas.length > 0 ? [{
        uuid: s.chromas[0].uuid,
        displayName: s.chromas[0].displayName,
        displayIcon: s.chromas[0].displayIcon,
        fullRender: s.chromas[0].fullRender,
        swatch: null,
        streamedVideo: null,
        assetPath: "",
      }] : [],
      levels: [],
    }));

  const breadcrumbItems = [
    { label: "Skins", href: "/skins" },
    { label: `${weaponName} Skins`, href: `/skins/${weaponSlug}` },
    { label: skin.displayName }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
          { "@type": "ListItem", "position": 2, "name": "Skins", "item": `${siteConfig.url}/skins` },
          { "@type": "ListItem", "position": 3, "name": `${weaponName} Skins`, "item": `${siteConfig.url}/skins/${weaponSlug}` },
          { "@type": "ListItem", "position": 4, "name": skin.displayName, "item": `${siteConfig.url}/skins/${canonicalSlug}` }
        ]
      },
      {
        "@type": "ItemPage",
        "name": `${skin.displayName} - VALORANT Skin Showcase & Chromas`,
        "url": `${siteConfig.url}/skins/${canonicalSlug}`,
        "description": `${skin.displayName} is an official ${tier?.rarity ?? "Premium"} edition cosmetic skin for the ${weaponName} in VALORANT. Features ${skin.chromas?.length ?? 1} chroma colorways and ${skin.levels?.length ?? 1} Radianite upgrade levels.`,
        "mainEntity": {
          "@type": "Thing",
          "name": skin.displayName,
          "image": skin.chromas?.[0]?.fullRender ?? skin.displayIcon,
          "description": `In-game store price: ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"} (Valorant Points). Weapon: ${weaponName}.`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How much does the ${skin.displayName} cost in VALORANT?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${skin.displayName} costs ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"} (Valorant Points) in the in-game store rotation (approximately $${(tier?.price ? tier.price * 0.01 : 17.75).toFixed(2)} USD).`
            }
          },
          {
            "@type": "Question",
            "name": `Can the ${skin.displayName} appear in the VALORANT Night.Market?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": isNightMarketEligible
                ? `Yes! Because the ${skin.displayName} is priced at or under 1,775 VP (${tier?.rarity ?? "Select/Deluxe/Premium"} edition), it is fully eligible to appear in the bi-monthly Night.Market with randomized discounts between 10% and 49%.`
                : `No. The ${skin.displayName} belongs to a tier or category (such as Exclusive or Ultra) that is excluded from the Night.Market and can only be acquired when it rolls in your daily 24-hour store rotation.`
            }
          },
          {
            "@type": "Question",
            "name": `How many variants and upgrade levels does the ${skin.displayName} have?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${skin.displayName} includes ${skin.chromas?.length ?? 1} colorway variants and ${skin.levels?.length ?? 1} upgrade levels unlockable with Radianite Points (RP). Total RP required to unlock all enhancements is approximately ${totalRadianiteCost} RP.`
            }
          },
          {
            "@type": "Question",
            "name": `Does the ${skin.displayName} have a finisher animation?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": hasVideo
                ? `Yes, the ${skin.displayName} features custom visual effects and finisher animations unlockable at Level ${skin.levels?.length || 4}.`
                : `The ${skin.displayName} is a standard cosmetic model prioritizing competitive clarity without heavy finisher animations.`
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTransition>
        <div className="min-h-screen bg-background text-foreground">
          <RecordRecentView
            id={skin.uuid}
            title={skin.displayName}
            subtitle={`${weaponName} Skin · ${tier?.price ? `${tier.price} VP` : "Store Skin"}`}
            category="Skin"
            href={`/skins/${canonicalSlug}`}
          />

          {/* Header strip */}
          <div className="border-b border-border bg-background pt-10 pb-10">
            <Container>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="flex items-center gap-2">
                  <BookmarkButton
                    id={`skin-${skin.uuid}`}
                    title={skin.displayName}
                    category="Skin"
                    url={`/skins/${canonicalSlug}`}
                  />
                  {hasVideo && (
                    <Link
                      href={`/skins/${canonicalSlug}/watch`}
                      className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                    >
                      <Video className="h-3 w-3" />
                      <span>Watch Showcase ↗</span>
                    </Link>
                  )}
                  <Link
                    href={`/skins/${weaponSlug}`}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-border bg-surface-card text-muted hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    All {weaponName} Skins →
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                      {weaponName} Skin
                    </span>
                  </div>
                  <h1 className="font-display font-black text-4xl uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    {skin.displayName}
                  </h1>
                </div>

                {tier && (
                  <div className="mb-1 flex items-center gap-3">
                    <ContentTierBadge rarity={tier.rarity} showIcon />
                    <span className="font-mono text-xl font-bold text-primary">
                      {tier.price.toLocaleString()}{" "}
                      <span className="text-sm text-foreground">VP</span>
                    </span>
                  </div>
                )}
              </div>
            </Container>
          </div>

          <Container className="py-12 space-y-10">
            
            {/* Quick Answer Box - Instant Search Intent Satisfaction */}
            <Reveal>
              <AnswerBox
                question={`What are the key facts about the ${skin.displayName} in VALORANT?`}
                verdict={`${tier?.rarity || "PREMIUM"} Edition · ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"}`}
                explanation={`The ${skin.displayName} is an official ${tier?.rarity || "Premium"} edition cosmetic skin for the ${weaponName}. Designed for the ${weaponArchetypeDesc}, it includes ${skin.chromas?.length || 1} chroma colorways and ${skin.levels?.length || 1} progression levels unlockable with Radianite Points.`}
                keyTakeaways={[
                  `Store Price: ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"} (~$${(tier?.price ? tier.price * 0.01 : 17.75).toFixed(2)} USD)`,
                  `Weapon Platform: ${weaponName} (${weaponSlug})`,
                  `Collection Line: ${collectionName}`,
                  `Night.Market Status: ${isNightMarketEligible ? "Eligible (Up to 49% Off)" : "Daily Store Only"}`,
                  `Colorway Chromas: ${skin.chromas?.length || 1} Variants`,
                  `Max RP Investment: ${totalRadianiteCost} Radianite Points`,
                  `Finisher VFX: ${hasVideo ? "Yes (Custom Animation)" : "No (Clean Competitive Handling)"}`
                ]}
                ctaLabel={`Explore all ${weaponName} skins`}
                ctaHref={`/skins/${weaponSlug}`}
              />
            </Reveal>

            {/* Inspect Client with 3D/Video Renderers */}
            <Reveal>
              <div className="rounded-lg border border-border bg-surface-card p-6 shadow-xs">
                <SkinInspectClient skin={inspectSkin as any} />
              </div>
            </Reveal>

            {/* Internal Funnel Mesh: Collection & Weapon Hub Cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Link
                href={`/collections/${collectionSlug}`}
                className="group rounded-lg border border-border bg-surface-card p-6 space-y-2 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <FolderKanban className="h-3.5 w-3.5" />
                    Collection
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-display font-bold text-lg text-foreground uppercase group-hover:text-primary transition-colors">
                  {collectionName} Collection Hub
                </h4>
                <p className="text-xs text-secondary leading-relaxed font-sans">
                  Browse all weapon skins, bundle pricing, and complete set valuations for the {collectionName} collection.
                </p>
              </Link>

              <Link
                href={`/skins/${weaponSlug}`}
                className="group rounded-lg border border-border bg-surface-card p-6 space-y-2 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Crosshair className="h-3.5 w-3.5" />
                    Weapon Skins
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-display font-bold text-lg text-foreground uppercase group-hover:text-primary transition-colors">
                  Best {weaponName} Skins
                </h4>
                <p className="text-xs text-secondary leading-relaxed font-sans">
                  Compare all {weaponName} skins by price, tier list rank, finisher animations, and community popularity.
                </p>
              </Link>
            </div>

            {/* Server-Rendered Specification & Features Matrix */}
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Specification Table */}
              <div className="rounded-lg border border-border bg-surface-card p-6 space-y-4 shadow-xs">
                <h3 className="font-display font-bold text-lg uppercase text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span>Skin Specifications</span>
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Weapon Platform</span>
                    <span className="text-foreground font-semibold">{weaponName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Collection Line</span>
                    <span className="text-foreground font-semibold">{collectionName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Content Tier</span>
                    <span className="text-foreground font-semibold">{tier?.rarity || "PREMIUM"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Base Store Price</span>
                    <span className="text-primary font-bold">{tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"} (~${(tier?.price ? tier.price * 0.01 : 17.75).toFixed(2)})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Night.Market Eligible</span>
                    <span className={`font-semibold ${isNightMarketEligible ? "text-emerald-400" : "text-amber-400"}`}>
                      {isNightMarketEligible ? "Yes (Discount Eligible)" : "No (Store Only)"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/40">
                    <span className="text-muted">Total Chromas</span>
                    <span className="text-foreground font-semibold">{skin.chromas?.length || 1} Colorways</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted">Upgrade Levels</span>
                    <span className="text-foreground font-semibold">{skin.levels?.length || 1} Levels</span>
                  </div>
                </div>
              </div>

              {/* Radianite & Upgrade Levels */}
              <div className="rounded-lg border border-border bg-surface-card p-6 space-y-4 shadow-xs">
                <h3 className="font-display font-bold text-lg uppercase text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Upgrade Progression ({totalRadianiteCost} Total RP)</span>
                </h3>
                <div className="space-y-3">
                  {(skin.levels || []).map((lvl, idx) => (
                    <div key={lvl.uuid} className="flex items-center justify-between p-3 rounded-md border border-border/60 bg-surface-muted">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <span className="font-sans text-xs font-semibold text-foreground block">
                            Level {idx + 1}: {(lvl.displayName || "").replace(skin.displayName, "").trim() || "Base Model"}
                          </span>
                          <span className="font-mono text-[10px] text-muted">
                            {idx === 0 ? "Default Purchase" : `${idx * 10} Radianite Points (RP)`}
                          </span>
                        </div>
                      </div>
                      {lvl.streamedVideo && (
                        <Link
                          href={`/skins/${canonicalSlug}/watch`}
                          className="rounded px-2.5 py-1 font-sans text-xs font-medium border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                        >
                          <span>Watch Video</span>
                          <span>↗</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Chroma Colorways Grid */}
            {skin.chromas && skin.chromas.length > 1 && (
              <div className="rounded-lg border border-border bg-surface-card p-6 space-y-6 shadow-xs">
                <h3 className="font-display font-bold text-lg uppercase text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Available Chroma Variants ({skin.chromas.length})</span>
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {skin.chromas.map((chroma, idx) => (
                    <div key={chroma.uuid} className="rounded-md border border-border/60 bg-surface-muted p-4 space-y-3">
                      <div className="relative h-24 w-full rounded bg-surface">
                        {(chroma.fullRender || chroma.displayIcon || skin.displayIcon) && (
                          <Image
                            src={chroma.fullRender || chroma.displayIcon || skin.displayIcon || ""}
                            alt={chroma.displayName || `${skin.displayName} Variant ${idx + 1}`}
                            fill
                            className="object-contain p-2"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] uppercase text-primary font-semibold block">
                          Variant {idx + 1}
                        </span>
                        <h4 className="font-sans text-xs font-medium text-foreground line-clamp-1">
                          {(chroma.displayName || "").replace(skin.displayName, "").trim() || `Variant ${idx + 1}`}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tactical Evaluation, Acquisition & Night.Market Guide */}
            <div className="grid gap-6 md:grid-cols-3">
              
              <div className="rounded-lg border border-border bg-surface-card p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <ShoppingBag className="h-4 w-4" />
                  <h4 className="font-display font-bold text-sm uppercase text-foreground">How To Acquire</h4>
                </div>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  The {skin.displayName} is acquired through the daily rotating store for {tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"}. In-game store rotations update every 24 hours at 00:00 UTC with 4 random weapon skins.
                </p>
                <div className="pt-2">
                  <span className="font-mono text-[10px] uppercase text-muted block">Store Slot Type</span>
                  <span className="font-sans text-xs font-semibold text-foreground">Individual Weapon Cosmetic</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface-card p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Coins className="h-4 w-4" />
                  <h4 className="font-display font-bold text-sm uppercase text-foreground">Night.Market Status</h4>
                </div>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  {isNightMarketEligible
                    ? `Eligible for the Night.Market! Because this skin is priced ≤ 1,775 VP, it can roll in your personal bi-monthly Night.Market card deck with discounts from 10% to 49% off.`
                    : `Ineligible for Night.Market discounts. High-tier Exclusive, Ultra, or Battle Pass skins do not appear in the Night.Market pool and must be bought at full VP store price.`}
                </p>
                <div className="pt-2">
                  <span className="font-mono text-[10px] uppercase text-muted block">Estimated Cash Valuation</span>
                  <span className="font-sans text-xs font-semibold text-foreground">~${(tier?.price ? tier.price * 0.01 : 17.75).toFixed(2)} USD</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-surface-card p-6 space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-4 w-4" />
                  <h4 className="font-display font-bold text-sm uppercase text-foreground">Tactical Feedback</h4>
                </div>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  {hasVideo
                    ? `Equipped with custom auditory and visual feedback. Includes specialized inspect animations, custom weapon equip sound effects, and celebratory finisher animations.`
                    : `Engineered for clean competitive performance. Retains the standard weapon firing audio profile and recoil animations, providing consistent audio cues preferred by tactical purists.`}
                </p>
                <div className="pt-2">
                  <span className="font-mono text-[10px] uppercase text-muted block">Platform Archetype</span>
                  <span className="font-sans text-xs font-semibold text-foreground capitalize">{weaponName} ({weaponSlug})</span>
                </div>
              </div>

            </div>

            {/* Related Weapon Skins Comparison Mesh */}
            {relatedSkins.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl uppercase tracking-tight text-foreground">
                      Other Popular {weaponName} Skins
                    </h3>
                    <p className="font-sans text-xs text-muted">
                      Compare pricing, tiers, and community ratings across other {weaponName} cosmetics.
                    </p>
                  </div>
                  <Link
                    href={`/skins/${weaponSlug}`}
                    className="font-mono text-xs font-bold text-primary hover:underline"
                  >
                    View All {weaponName} Skins →
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedSkins.map((relSkin) => {
                    const relTier = CONTENT_TIER_MAP[relSkin.contentTierUuid ?? ""];
                    const relSlug = slugify(relSkin.displayName);
                    const relImg = relSkin.chromas?.[0]?.fullRender ?? relSkin.displayIcon;
                    return (
                      <Link
                        key={relSkin.uuid}
                        href={`/skins/${relSlug}`}
                        className="group rounded-lg border border-border bg-surface-card p-4 space-y-3 hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <div className="relative h-28 w-full rounded bg-surface">
                          {relImg && (
                            <Image
                              src={relImg}
                              alt={relSkin.displayName}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-semibold text-primary uppercase">
                              {relTier?.rarity || "SKIN"}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-foreground">
                              {relTier?.price ? `${relTier.price.toLocaleString()} VP` : "1,775 VP"}
                            </span>
                          </div>
                          <h4 className="font-sans text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {relSkin.displayName}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </Container>
        </div>
      </PageTransition>
    </>
  );
}
