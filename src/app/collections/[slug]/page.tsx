import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, FolderKanban, Layers, Tag, ShieldCheck } from "lucide-react";
import { CollectionTrackerClient } from "@/components/collection-tracker-client";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SkinCard } from "@/components/skin-card";
import { PageTransition, Reveal } from "@/components/motion-system";
import { siteConfig } from "@/lib/site";
import { getAllSkins } from "@/app/skins/[slug]/page";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";
import type { ValorantSkin } from "@/lib/valorant-types";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ slug: string }>;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCollectionName(skinName: string): string {
  const parts = skinName.trim().split(/\s+/);
  if (parts.length > 1) {
    return parts.slice(0, -1).join(" ");
  }
  return skinName;
}

interface DiscoveredCollection {
  slug: string;
  name: string;
  rarity: string;
  cost: number;
  skins: ValorantSkin[];
  items: { id: string; name: string; type: string; price: number }[];
}

async function getCollectionsMap(): Promise<Map<string, DiscoveredCollection>> {
  const skins = await getAllSkins();
  const map = new Map<string, DiscoveredCollection>();

  skins.forEach((skin) => {
    if (skin.displayName.toLowerCase().startsWith("standard")) return;
    const colName = getCollectionName(skin.displayName);
    const colSlug = slugify(colName);
    if (!colSlug) return;

    const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""] ?? DEFAULT_TIER;
    const price = tier.price ?? 1775;

    if (!map.has(colSlug)) {
      map.set(colSlug, {
        slug: colSlug,
        name: `${colName.toUpperCase()} COLLECTION`,
        rarity: tier.rarity,
        cost: 0,
        skins: [],
        items: [],
      });
    }

    const col = map.get(colSlug)!;
    col.skins.push(skin);
    col.cost += price;
    col.items.push({
      id: skin.uuid,
      name: skin.displayName,
      type: "Weapon Skin",
      price,
    });
  });

  return map;
}

export async function generateStaticParams() {
  const map = await getCollectionsMap();
  const params = Array.from(map.keys()).map((slug) => ({ slug }));
  // Also include hardcoded aliases if any
  ["kuronami-vandal", "reaver-vandal", "oni-phantom"].forEach((legacy) => {
    if (!map.has(legacy)) {
      params.push({ slug: legacy });
    }
  });
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const map = await getCollectionsMap();
  const col = map.get(slug.toLowerCase());

  if (!col) {
    return { title: "Collection Not Found | VloPedia", robots: { index: false } };
  }

  const pageTitle = `${col.name} VALORANT: All Skins, VP Prices & Upgrades | VloPedia`;
  const pageDesc = `Explore the official ${col.name} weapon skin collection in VALORANT. Check individual item prices (${col.cost.toLocaleString()} VP total value), Radianite upgrade levels, finisher animations, and track collection completion.`;

  return {
    title: pageTitle,
    description: pageDesc,
    robots: { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `${siteConfig.url}/collections/${slug}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/collections/${slug}`,
    },
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const map = await getCollectionsMap();
  const col = map.get(slug.toLowerCase());

  if (!col) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: col.name },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
          { "@type": "ListItem", "position": 2, "name": "Collections", "item": `${siteConfig.url}/collections` },
          { "@type": "ListItem", "position": 3, "name": col.name, "item": `${siteConfig.url}/collections/${slug}` },
        ],
      },
      {
        "@type": "CollectionPage",
        "name": col.name,
        "description": `Complete ${col.name} cosmetic skins directory in VALORANT. Includes ${col.skins.length} weapon cosmetics.`,
        "url": `${siteConfig.url}/collections/${slug}`,
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": col.skins.length,
          "itemListElement": col.skins.map((s, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": s.displayName,
            "url": `${siteConfig.url}/skins/${slugify(s.displayName)}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How much does the ${col.name} cost in VALORANT?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The total individual component value of the ${col.name} is ${col.cost.toLocaleString()} VP (Valorant Points). Bundle purchases typically offer the melee weapon free of charge when purchased in store rotation.`,
            },
          },
          {
            "@type": "Question",
            "name": `Which weapon skins are included in the ${col.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${col.name} contains ${col.skins.length} weapon skins: ${col.skins.map((s) => s.displayName).join(", ")}.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTransition>
        <div className="min-h-screen bg-[#0B141A] text-foreground">
          {/* Header Strip */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-8 pb-10">
            <Container>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <Breadcrumbs items={breadcrumbs} />
                <Link
                  href="/skins"
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white hover:border-primary/40 transition-colors"
                >
                  All Weapon Skins Catalogue →
                </Link>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-[2px] w-8 bg-primary" />
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      COLLECTION DIRECTORY
                    </span>
                  </div>
                  <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
                    {col.name}
                  </h1>
                  <p className="text-sm text-muted max-w-2xl font-sans leading-relaxed">
                    Explore all weapon skins in the {col.name}. Check individual store VP pricing,
                    inspect Radianite upgrades, and track your account collection valuation.
                  </p>
                </div>

                {/* Quick Metrics Bar */}
                <div className="flex flex-wrap gap-4 border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-4 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-muted block uppercase">TOTAL ITEMS</span>
                    <span className="text-lg font-bold text-white">{col.skins.length} WEAPONS</span>
                  </div>
                  <div className="h-8 w-[1px] bg-[rgba(236,232,225,0.08)] my-auto" />
                  <div>
                    <span className="text-[10px] text-muted block uppercase">RARITY EDITION</span>
                    <span className="text-lg font-bold text-[#0DF2F2]">{col.rarity}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-[rgba(236,232,225,0.08)] my-auto" />
                  <div>
                    <span className="text-[10px] text-muted block uppercase">TOTAL VALUE</span>
                    <span className="text-lg font-bold text-primary">{col.cost.toLocaleString()} VP</span>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          <Container className="py-12 space-y-12">
            {/* Skins in this Collection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <h3 className="font-display font-black text-xl uppercase text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Skins in this Collection ({col.skins.length})</span>
                </h3>
                <span className="font-mono text-xs text-muted">
                  Click any skin to open complete 3D & video dossier
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {col.skins.map((skin) => (
                  <SkinCard key={skin.uuid} skin={skin} />
                ))}
              </div>
            </div>

            {/* Interactive Collection Completion Tracker */}
            <div className="space-y-4">
              <div className="border-b border-[rgba(236,232,225,0.08)] pb-3">
                <h3 className="font-display font-black text-xl uppercase text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0DF2F2]" />
                  <span>Account Inventory Checklist & Valuation Tracker</span>
                </h3>
              </div>
              <CollectionTrackerClient
                slug={slug}
                name={col.name}
                cost={col.cost}
                rating={col.rarity}
                items={col.items}
              />
            </div>
          </Container>
        </div>
      </PageTransition>
    </>
  );
}

