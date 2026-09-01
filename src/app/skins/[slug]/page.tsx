import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { ContentTierBadge } from "@/components/content-tier-badge";
import { SkinInspectClient } from "@/components/skin-inspect-client";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";
import type { ValorantSkin } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";

const API = "https://valorant-api.com/v1";

// Reuse the weapon-slug derivation logic (same as skins page)
const WEAPON_SLUGS = ["vandal","phantom","operator","spectre","ghost","classic","sheriff","frenzy","shorty","stinger","bucky","judge","bulldog","guardian","marshal","ares","odin","outlaw","melee"];
function weaponFromName(name: string, assetPath: string): string {
  const lower = name.toLowerCase();
  for (const w of WEAPON_SLUGS) if (lower.endsWith(w)) return w;
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

// Shape expected by SkinInspectClient (uses old mockDb shape)
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
    uuid:     l.uuid,
    name:     (l.displayName || "").replace(s.displayName || "", "").trim() || `Level ${i + 1}`,
    displayIcon: l.displayIcon,
    videoUrl: l.streamedVideo ?? null,
  }));

  const inspectVideoUrl = s.levels.find(l => l.streamedVideo)?.streamedVideo ?? null;
  const reloadVideoUrl  = s.chromas.find(c => c.streamedVideo)?.streamedVideo ?? null;

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
  if (!skin) return { title: "Skin Not Found | ValoVault", robots: { index: false } };

  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""];
  const img  = skin.chromas?.[0]?.fullRender ?? skin.displayIcon;
  const pageTitle = `${skin.displayName} Skin Showcase: Prices, Variants & Levels | ValoVault`;
  const pageDesc = `Explore the ${skin.displayName} VALORANT skin. Inspect all variants, upgrade levels, chromas, reload videos, and official VP store prices.`;

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
        "description": `VALORANT cosmetic skin ${skin.displayName} featuring custom variants, chromas, and inspect animations.`,
        "offers": {
          "@type": "Offer",
          "price": tier?.price ?? 1775,
          "priceCurrency": "VP",
          "availability": "https://schema.org/InStock"
        }
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

        {/* Header strip */}
        <div className="border-b border-border bg-background pt-16 pb-10">
          <Container>
            <Link
              href="/skins"
              className="inline-flex items-center gap-2 font-mono-tactical text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-primary mb-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All Skins
            </Link>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    SKIN INSPECT
                  </span>
                </div>
                <h1 className="font-display text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {skin.displayName}
                </h1>
              </div>

              {tier && (
                <div className="mb-1 flex items-center gap-3">
                  <ContentTierBadge rarity={tier.rarity} showIcon />
                  <span className="font-mono-tactical text-lg font-black text-white">
                    {tier.price.toLocaleString()}{" "}
                    <span className="text-sm text-primary">VP</span>
                  </span>
                </div>
              )}
            </div>
          </Container>
        </div>

        {/* Inspect client — fully preserved V1 functionality */}
        <Container className="py-16">
          <SkinInspectClient skin={inspectSkin as any} />
        </Container>
      </div>
    </PageTransition>
    </>
  );
}
