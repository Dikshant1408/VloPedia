import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Shield, Tag, Video, Layers, CheckCircle, HelpCircle, ArrowRight, FolderKanban, Crosshair } from "lucide-react";
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

export const dynamic = "force-static";

const API = "https://valorant-api.com/v1";

const WEAPON_SLUGS = [
  "vandal","phantom","operator","spectre","ghost","classic","sheriff",
  "frenzy","shorty","stinger","bucky","judge","bulldog","guardian",
  "marshal","ares","odin","outlaw","melee","karambit"
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

  // 2. Clean skin slug routes (e.g. /skins/aemondir-vandal) & legacy UUID routes (for 301 redirection)
  for (const s of skins) {
    if (s.displayName.toLowerCase().startsWith("standard")) continue;
    const cleanSlug = slugify(s.displayName);
    if (cleanSlug) {
      params.push({ slug: cleanSlug });
    }
    // Also include legacy UUID so static export generates the redirecting HTML
    params.push({ slug: s.uuid });
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

  const canonicalSlug = slugify(skin.displayName) || skin.uuid;
  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""];
  const img  = skin.chromas?.[0]?.fullRender ?? skin.displayIcon;
  const weaponName = weaponFromName(skin.displayName, skin.assetPath).toUpperCase();

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
    const weaponSkins = skins.filter(s => {
      if (s.displayName.toLowerCase().startsWith("standard")) return false;
      const w = weaponFromName(s.displayName, s.assetPath);
      if (lowerSlug === "karambit") {
        return s.displayName.toLowerCase().includes("karambit");
      }
      return w === targetWeapon;
    });

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

  const canonicalSlug = slugify(skin.displayName);

  // 3. 301 Permanent Redirect if accessed via legacy UUID
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
        "@type": "Product",
        "name": `${skin.displayName} - VALORANT Skin`,
        "image": skin.chromas?.[0]?.fullRender ?? skin.displayIcon,
        "description": `${skin.displayName} is an official ${tier?.rarity ?? "Premium"} edition cosmetic skin for the ${weaponName} in VALORANT. Features ${skin.chromas?.length ?? 1} chroma colorways and ${skin.levels?.length ?? 1} Radianite upgrade levels.`,
        "sku": skin.uuid,
        "category": "Video Game Virtual Item",
        "offers": {
          "@type": "Offer",
          "price": tier?.price ?? 1775,
          "priceCurrency": "VP",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Riot Games Store"
          }
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
              "text": `The ${skin.displayName} costs ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"} (Valorant Points) in the in-game store rotation.`
            }
          },
          {
            "@type": "Question",
            "name": `How many variants and upgrade levels does the ${skin.displayName} have?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${skin.displayName} includes ${skin.chromas?.length ?? 1} colorway variants and ${skin.levels?.length ?? 1} upgrade levels unlockable with Radianite Points.`
            }
          },
          {
            "@type": "Question",
            "name": `Does the ${skin.displayName} have a finisher animation?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": hasVideo
                ? `Yes, the ${skin.displayName} features custom visual effects and finisher animations unlockable at Level ${skin.levels?.length || 4}.`
                : `The ${skin.displayName} is a standard cosmetic skin without custom finisher animations.`
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
        <div className="min-h-screen bg-[#0B141A] text-foreground">

          {/* Header strip */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-10 pb-10">
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
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white hover:border-primary/40 transition-colors"
                  >
                    All {weaponName} Skins →
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      {weaponName} COSMETIC DOSSIER
                    </span>
                  </div>
                  <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {skin.displayName}
                  </h1>
                </div>

                {tier && (
                  <div className="mb-1 flex items-center gap-3">
                    <ContentTierBadge rarity={tier.rarity} showIcon />
                    <span className="font-mono-tactical text-xl font-black text-primary">
                      {tier.price.toLocaleString()}{" "}
                      <span className="text-sm text-white">VP</span>
                    </span>
                  </div>
                )}
              </div>
            </Container>
          </div>

          <Container className="py-12 space-y-12">
            
            {/* Quick Answer Box - Instant Search Intent Satisfaction */}
            <Reveal>
              <AnswerBox
                question={`What are the key facts about the ${skin.displayName} in VALORANT?`}
                verdict={`${tier?.rarity || "PREMIUM"} Edition · ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"}`}
                explanation={`The ${skin.displayName} is an official ${tier?.rarity || "Premium"} edition cosmetic skin for the ${weaponName}. It includes ${skin.chromas?.length || 1} chroma colorways and ${skin.levels?.length || 1} Radianite upgrade levels for custom sound effects, animations, and finishers.`}
                keyTakeaways={[
                  `Store Price: ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"}`,
                  `Weapon Platform: ${weaponName} (${weaponSlug})`,
                  `Collection Line: ${collectionName}`,
                  `Colorway Chromas: ${skin.chromas?.length || 1} Variants`,
                  `Upgrade Levels: ${skin.levels?.length || 1} Progression Levels`,
                  `Finisher VFX: ${hasVideo ? "Yes (Custom Animation)" : "No"}`
                ]}
                ctaLabel={`Explore all ${weaponName} skins`}
                ctaHref={`/skins/${weaponSlug}`}
              />
            </Reveal>

            {/* Inspect Client with 3D/Video Renderers */}
            <Reveal>
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal shadow-xl">
                <SkinInspectClient skin={inspectSkin as any} />
              </div>
            </Reveal>

            {/* Internal Funnel Mesh: Collection & Weapon Hub Cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Link
                href={`/collections/${collectionSlug}`}
                className="group border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-2 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FolderKanban className="h-3.5 w-3.5" />
                    COLLECTION DIRECTORY
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-display font-black text-lg text-white uppercase group-hover:text-primary transition-colors">
                  {collectionName} Collection Hub
                </h4>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  Browse all weapon skins, bundle pricing, and complete set valuations for the {collectionName} collection.
                </p>
              </Link>

              <Link
                href={`/skins/${weaponSlug}`}
                className="group border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-2 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#0DF2F2] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Crosshair className="h-3.5 w-3.5" />
                    WEAPON SKIN HUB
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-[#0DF2F2] group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-display font-black text-lg text-white uppercase group-hover:text-[#0DF2F2] transition-colors">
                  Best {weaponName} Skins
                </h4>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  Compare all {weaponName} skins by price, tier list rank, finisher animations, and community popularity.
                </p>
              </Link>
            </div>

            {/* Server-Rendered Specification & Features Matrix */}
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Specification Table */}
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span>Skin Specifications</span>
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[rgba(236,232,225,0.04)]">
                    <span className="text-muted">Weapon Platform</span>
                    <span className="text-white font-bold">{weaponName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[rgba(236,232,225,0.04)]">
                    <span className="text-muted">Collection Line</span>
                    <span className="text-white font-bold">{collectionName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[rgba(236,232,225,0.04)]">
                    <span className="text-muted">Content Tier</span>
                    <span className="text-[#0DF2F2] font-bold">{tier?.rarity || "PREMIUM"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[rgba(236,232,225,0.04)]">
                    <span className="text-muted">Base Store Price</span>
                    <span className="text-primary font-bold">{tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[rgba(236,232,225,0.04)]">
                    <span className="text-muted">Total Chromas</span>
                    <span className="text-white font-bold">{skin.chromas?.length || 1} Colorways</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted">Upgrade Levels</span>
                    <span className="text-white font-bold">{skin.levels?.length || 1} Levels</span>
                  </div>
                </div>
              </div>

              {/* Radianite & Upgrade Levels */}
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0DF2F2]" />
                  <span>Upgrade Progression</span>
                </h3>
                <div className="space-y-3">
                  {(skin.levels || []).map((lvl, idx) => (
                    <div key={lvl.uuid} className="flex items-center justify-between p-3 border border-[rgba(236,232,225,0.04)] bg-[#08111A]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <span className="font-sans text-xs font-bold text-white block">
                            Level {idx + 1}: {(lvl.displayName || "").replace(skin.displayName, "").trim() || "Base Model"}
                          </span>
                          <span className="font-mono text-[9px] text-muted">
                            {idx === 0 ? "Default Purchase" : `${idx * 10} Radianite Points (RP)`}
                          </span>
                        </div>
                      </div>
                      {lvl.streamedVideo && (
                        <Link
                          href={`/skins/${canonicalSlug}/watch`}
                          className="font-mono text-[9px] uppercase px-2.5 py-1 border border-[#0DF2F2]/40 bg-[#0DF2F2]/10 text-[#0DF2F2] hover:bg-[#0DF2F2]/20 hover:border-[#0DF2F2] transition-colors flex items-center gap-1"
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
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-6">
                <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Available Chroma Variants ({skin.chromas.length})</span>
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {skin.chromas.map((chroma, idx) => (
                    <div key={chroma.uuid} className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-4 space-y-3">
                      <div className="relative h-24 w-full bg-black/40">
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
                        <span className="font-mono text-[9px] uppercase text-primary font-bold block">
                          Variant {idx + 1}
                        </span>
                        <h4 className="font-sans text-xs font-bold text-white line-clamp-1">
                          {(chroma.displayName || "").replace(skin.displayName, "").trim() || `Variant ${idx + 1}`}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </Container>
        </div>
      </PageTransition>
    </>
  );
}

