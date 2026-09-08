import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Compass, HelpCircle, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MapGalleryClient } from "@/components/map-gallery-client";
import type { ValorantMap } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";

const API = "https://valorant-api.com/v1";

let mapsCache: Promise<ValorantMap[]> | null = null;

async function getAllMaps(): Promise<ValorantMap[]> {
  if (mapsCache) return mapsCache;
  mapsCache = (async () => {
    try {
      const res = await fetch(`${API}/maps`, { next: { revalidate: 3600 } });
      if (!res.ok) {
        mapsCache = null;
        return [];
      }
      const json = await res.json();
      return (json.data ?? []).filter((m: ValorantMap) => m.splash && m.displayIcon);
    } catch {
      mapsCache = null;
      return [];
    }
  })();
  return mapsCache;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findMap(maps: ValorantMap[], slug: string): ValorantMap | null {
  const norm = slug.toLowerCase();
  return (
    maps.find(
      m =>
        slugify(m.displayName) === norm ||
        m.displayName.toLowerCase() === norm ||
        m.displayName.toLowerCase().replace(/\s+/g, "-") === norm
    ) ?? null
  );
}

const MAP_LORE_FALLBACKS: Record<string, string> = {
  corrode: "A specialized tactical facility featuring heavy industrial pipelines and rusted chemical corridors. Designed for intense vertical confrontations and tight choke-point utility warfare.",
  pearl: "Located on Omega Earth in an underwater biodome off the coast of Lisbon, Portugal. Pearl provides classic tactical combat across two sites with no doors, ascenders, or teleporters.",
  lotus: "An ancient subterranean complex situated in the Western Ghats of India. Lotus challenges teams with a rare three-site layout (A, B, C) featuring rotating stone doorways and destructible barriers.",
  abyss: "A vertigo-inducing underground facility shrouded by cavernous chasms and deadly drops. Demands precise movement discipline and creative displacement utility.",
};

function buildStrategies(map: ValorantMap): string[] {
  const regions = [...new Set((map.callouts || []).map(c => c.superRegionName).filter(Boolean))];
  const siteCount = regions.filter(r => /^[A-Z]\s*site/i.test(r) || r.toUpperCase().includes("SITE")).length;
  const hasThreeSites = siteCount >= 3 || regions.some(r => /^C\s/i.test(r));

  if (hasThreeSites) {
    return [
      "Establish early mid-lane control to divide defender attention across the three distinct bomb sites (A, B, and C).",
      "Coordinate fast rotation feints to exploit extended anchor defender travel times between perimeter sites.",
      "Deploy persistent sentinel information traps on secondary corridors to deny aggressive defender flanks.",
    ];
  }

  return [
    "Control key choke points and block long sightlines using standard smoke execution loops.",
    "Coordinate initiator utility sweeps and flash timings to flush out defenders from common anchor corners.",
    "Secure deep map control during post-plant scenarios to deny defuse kits through multi-angle crossfires.",
  ];
}

function groupCallouts(map: ValorantMap): Record<string, string[]> {
  if (!map.callouts) return {};
  const groups: Record<string, string[]> = {};
  for (const c of map.callouts) {
    const region = c.superRegionName || "Other";
    if (!groups[region]) groups[region] = [];
    if (!groups[region].includes(c.regionName)) {
      groups[region].push(c.regionName);
    }
  }
  return groups;
}

export async function generateStaticParams() {
  const maps = await getAllMaps();
  return maps.map(m => ({ slug: slugify(m.displayName) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const maps = await getAllMaps();
  const map = findMap(maps, slug);
  if (!map) return { title: "Map Not Found | VloPedia", robots: { index: false } };

  const pageTitle = `${map.displayName} Map Guide: Callouts, Minimap & Tactics | VloPedia`;
  const pageDesc = `Complete ${map.displayName} tactical map breakdown in VALORANT. Interactive minimap, callout locations, site strategies, bomb site count, and layout guide.`;

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
      images: [{ url: map.splash }],
      url: `${siteConfig.url}/maps/${slug}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/maps/${slug}`,
    },
  };
}

export default async function MapDetailPage({ params }: Props) {
  const { slug } = await params;
  const maps = await getAllMaps();
  const map = findMap(maps, slug);
  if (!map) notFound();

  const strategies = buildStrategies(map);
  const calloutGroups = groupCallouts(map);
  const calloutGroupKeys = Object.keys(calloutGroups);
  const loreText = map.narrativeDescription || MAP_LORE_FALLBACKS[slug.toLowerCase()] || `Tactical competitive deployment zone ${map.displayName} in the VALORANT protocol.`;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Maps", href: "/maps" },
    { label: map.displayName },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
          { "@type": "ListItem", "position": 2, "name": "Maps", "item": `${siteConfig.url}/maps` },
          { "@type": "ListItem", "position": 3, "name": map.displayName, "item": `${siteConfig.url}/maps/${slug}` }
        ]
      },
      {
        "@type": "Place",
        "name": `${map.displayName} (VALORANT Map)`,
        "description": loreText,
        "image": map.splash,
        "geo": map.coordinates ? {
          "@type": "GeoCoordinates",
          "name": map.coordinates
        } : undefined
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How many bomb sites does the ${map.displayName} map have in VALORANT?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": map.displayName.toLowerCase() === "haven" || map.displayName.toLowerCase() === "lotus"
                ? `${map.displayName} features 3 bomb sites (A, B, and C), creating unique rotation dynamics for both attackers and defenders.`
                : `${map.displayName} features a standard 2-site layout (A and B sites) centered around tactical choke points and mid control.`
            }
          },
          {
            "@type": "Question",
            "name": `What are the official callouts for ${map.displayName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${map.displayName} features ${map.callouts?.length ?? 20} primary callout regions, including ${calloutGroupKeys.slice(0, 3).join(", ")}.`
            }
          },
          {
            "@type": "Question",
            "name": `Where is ${map.displayName} located in VALORANT lore?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": loreText
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

          {/* Full-bleed splash hero */}
          <PageHero
            imageSrc={map.splash}
            imageAlt={map.displayName}
            eyebrow="TACTICAL DEPLOYMENT ZONE"
            title={map.displayName.toUpperCase()}
            subtitle={loreText}
            priority
            overlayFrom={0.3}
            overlayTo={0.9}
          >
            <div className="flex flex-wrap items-center gap-3">
              {map.coordinates && (
                <div className="flex items-center gap-1.5 border border-border bg-surface/80 px-3 py-1.5 backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span className="font-mono-tactical text-[11px] font-bold text-white">{map.coordinates}</span>
                </div>
              )}
              <Link href="/maps">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  All Maps
                </Button>
              </Link>
            </div>
          </PageHero>

          {/* Breadcrumbs bar */}
          <div className="border-b border-border bg-[#0B141A] pt-4 pb-4">
            <Container>
              <Breadcrumbs items={breadcrumbs} />
            </Container>
          </div>

          {/* Main content */}
          <Container className="py-16">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">

              {/* Left — gallery */}
              <Reveal>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      MINIMAP & CARTOGRAPHY
                    </span>
                  </div>
                  <MapGalleryClient map={{
                    name:                    map.displayName,
                    minimapUrl:              map.displayIcon ?? "",
                    splashUrl:               map.splash,
                    listViewIcon:            map.listViewIcon ?? undefined,
                    listViewIconTall:        map.listViewIconTall ?? undefined,
                    stylizedBackgroundImage: map.stylizedBackgroundImage ?? undefined,
                    premierBackgroundImage:  map.premierBackgroundImage ?? undefined,
                  }} />
                </div>
              </Reveal>

              {/* Right — callouts + strategies */}
              <div className="space-y-10">

                {/* Callouts grouped by region */}
                {calloutGroupKeys.length > 0 && (
                  <Reveal>
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 border-b border-border pb-4">
                        <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
                        <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                          COMPETITIVE CALLOUTS
                        </h2>
                      </div>
                      <div className="space-y-5">
                        {calloutGroupKeys.map(region => (
                          <div key={region}>
                            <h3 className="font-mono-tactical text-[10px] font-bold uppercase tracking-widest text-muted mb-2">
                              {region}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {calloutGroups[region].map(name => (
                                <span
                                  key={name}
                                  className="border border-border bg-surface px-3 py-1.5 font-mono-tactical text-[11px] font-bold uppercase text-foreground"
                                >
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}

                {/* Tactical strategies */}
                <Reveal>
                  <div className="space-y-4">
                    <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary border-b border-border pb-4">
                      TACTICAL STRATEGIES & ROTATIONS
                    </h2>
                    <div className="space-y-3">
                      {strategies.map((s, i) => (
                        <div
                          key={i}
                          className="relative border border-border bg-surface/50 p-5 font-sans text-sm leading-relaxed text-secondary"
                        >
                          <div
                            aria-hidden="true"
                            className="absolute left-0 inset-y-0 w-[3px] bg-primary"
                          />
                          <span className="mr-2 font-mono-tactical text-[10px] font-black text-primary">
                            0{i + 1}
                          </span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Lore and Tactical Intelligence */}
            <Reveal className="mt-16">
              <div className="relative overflow-hidden border border-border bg-surface-card p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    TACTICAL INTELLIGENCE & LORE
                  </span>
                </div>
                <p className="max-w-3xl font-sans text-base leading-relaxed text-secondary">
                  {loreText}
                </p>
                {map.coordinates && (
                  <p className="mt-4 font-mono-tactical text-[11px] text-muted">
                    GEO-COORDINATES: {map.coordinates}
                  </p>
                )}
              </div>
            </Reveal>

            {/* FAQ Section */}
            <Reveal className="mt-12">
              <div className="border border-border bg-surface-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <h3 className="font-mono-tactical text-xs uppercase tracking-[0.3em] text-primary">
                    {map.displayName} Strategy FAQs
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border border-border/60 bg-black/30 p-4 space-y-2">
                    <p className="font-display text-sm uppercase text-white">
                      Which agents have the highest pick rate on {map.displayName}?
                    </p>
                    <p className="text-xs leading-relaxed text-muted">
                      Controllers with wide sightline denial and Initiators equipped with deep recon darts or flashes are top tier on {map.displayName} to secure mid dominance.
                    </p>
                  </div>
                  <div className="border border-border/60 bg-black/30 p-4 space-y-2">
                    <p className="font-display text-sm uppercase text-white">
                      How does mid control impact rounds on {map.displayName}?
                    </p>
                    <p className="text-xs leading-relaxed text-muted">
                      Controlling mid isolates anchor defenders and enables rapid split attacks onto plant zones while denying defenders fast and safe rotations.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

          </Container>
        </div>
      </PageTransition>
    </>
  );
}
