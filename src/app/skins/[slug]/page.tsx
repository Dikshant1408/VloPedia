import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles, Shield, Tag, Video, Layers, CheckCircle, HelpCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { ContentTierBadge } from "@/components/content-tier-badge";
import { SkinInspectClient } from "@/components/skin-inspect-client";
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
  "marshal","ares","odin","outlaw","melee"
];

function weaponFromName(name: string, assetPath: string): string {
  const lower = name.toLowerCase();
  for (const w of WEAPON_SLUGS) {
    if (lower.endsWith(w)) return w;
  }
  const p = (assetPath || "").toLowerCase();
  if (p.includes("standardrifle")) return "phantom";
  if (p.includes("dmr")) return "vandal";
  if (p.includes("boltsniper")) return "operator";
  if (p.includes("standardsmg")) return "spectre";
  if (p.includes("revolver")) return "sheriff";
  return "vandal";
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
    slug:             s.uuid,
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
  return skins.map(s => ({ slug: s.uuid }));
}

type Props = { params: Promise<{ slug: string }> };

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function findSkin(skins: ValorantSkin[], slug: string) {
  const norm = slug.toLowerCase().trim();
  return skins.find(s => s.uuid.toLowerCase() === norm || slugify(s.displayName) === norm);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skins = await getAllSkins();
  const skin = findSkin(skins, slug);
  if (!skin) return { title: "Skin Not Found | VloPedia", robots: { index: false } };

  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""];
  const img  = skin.chromas?.[0]?.fullRender ?? skin.displayIcon;
  const weaponName = weaponFromName(skin.displayName, skin.assetPath).toUpperCase();

  const pageTitle = `${skin.displayName} (${weaponName}) Skin: Price, Variants & Inspect | VloPedia`;
  const pageDesc = `Complete ${skin.displayName} ${weaponName} skin showcase in VALORANT. Features ${tier?.price ?? 1775} VP pricing, ${skin.chromas?.length ?? 1} chroma variants, Radianite upgrade levels, inspect animations, and finisher preview.`;

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
      canonical: `${siteConfig.url}/skins/${slug}`,
    },
  };
}

export default async function SkinDetailPage({ params }: Props) {
  const { slug } = await params;
  const skins = await getAllSkins();
  const skin = findSkin(skins, slug);
  if (!skin) notFound();

  const inspectSkin = toInspectShape(skin);
  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""];
  const weaponSlug = weaponFromName(skin.displayName, skin.assetPath);
  const weaponName = weaponSlug.toUpperCase();

  const breadcrumbItems = [
    { label: "Skins", href: "/skins" },
    { label: weaponName, href: `/weapons/${weaponSlug}` },
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
          { "@type": "ListItem", "position": 3, "name": skin.displayName, "item": `${siteConfig.url}/skins/${slug}` }
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
            "name": `How much does the ${skin.displayName} cost?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${skin.displayName} costs ${tier?.price ?? 1775} VP (Valorant Points) in the in-game store rotation.`
            }
          },
          {
            "@type": "Question",
            "name": `How many variants does the ${skin.displayName} have?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${skin.displayName} includes ${skin.chromas?.length ?? 1} colorway variants and ${skin.levels?.length ?? 1} upgrade levels unlockable with Radianite Points.`
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
                    url={`/skins/${slug}`}
                  />
                  <Link
                    href={`/weapons/${weaponSlug}`}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white hover:border-primary/40 transition-colors"
                  >
                    View {weaponName} Stats →
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
            
            {/* Quick Answer Box */}
            <Reveal>
              <AnswerBox
                question={`Is the ${skin.displayName} worth buying in VALORANT?`}
                verdict={`${tier?.rarity || "PREMIUM"} Tier · ${tier?.price || 1775} VP`}
                explanation={`The ${skin.displayName} is a ${tier?.rarity || "Premium"} edition skin for the ${weaponName}. It features ${skin.chromas?.length || 1} color variants and ${skin.levels?.length || 1} upgrade levels unlockable with Radianite Points for custom sound effects, animations, and finishers.`}
                keyTakeaways={[
                  `Weapon Platform: ${weaponName}`,
                  `Store Cost: ${tier?.price ? `${tier.price.toLocaleString()} VP` : "1,775 VP"}`,
                  `Colorway Chromas: ${skin.chromas?.length || 1} Variants`,
                  `Radianite Levels: ${skin.levels?.length || 1} Levels`
                ]}
                ctaLabel={`Compare ${weaponName} with other weapons`}
                ctaHref={weaponSlug === "vandal" ? "/compare/weapons/vandal-vs-phantom" : "/compare"}
              />
            </Reveal>

            {/* Inspect Client with 3D/Video Renderers */}
            <Reveal>
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal shadow-xl">
                <SkinInspectClient skin={inspectSkin as any} />
              </div>
            </Reveal>

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
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-[#0DF2F2]/30 bg-[#0DF2F2]/10 text-[#0DF2F2]">
                          Video Available
                        </span>
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
