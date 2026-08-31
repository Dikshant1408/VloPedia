import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { MapGalleryClient } from "@/components/map-gallery-client";
import type { ValorantMap } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";

const API = "https://valorant-api.com/v1";

let mapsCache: Promise<ValorantMap[]> | null = null;

async function getAllMaps(): Promise<ValorantMap[]> {
  if (mapsCache) return mapsCache;
  mapsCache = (async () => {
    try {
      const res = await fetch(`${API}/maps`);
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

function buildStrategies(map: ValorantMap): string[] {
  if (!map.callouts) {
    return [
      "Control key choke points and block long sightlines using standard smoke execution loops.",
      "Coordinate utility sweeps and site retakes using default setups for A and B site control.",
    ];
  }
  const regions = [...new Set(map.callouts.map(c => c.superRegionName).filter(Boolean))];
  const siteCount = regions.filter(r => /^[A-Z]\s*site/i.test(r) || r.toUpperCase().includes("SITE")).length;
  const hasThreeSites = siteCount >= 3 || regions.some(r => /^C\s/i.test(r));

  return hasThreeSites
    ? [
        "Establish lane controls early to leverage the pressure of a three-site layout (A, B, and C).",
        "Coordinate utility blocks and split rotations to deny quick anchor defense shifts.",
      ]
    : [
        "Control key choke points and block long sightlines using standard smoke execution loops.",
        "Coordinate utility sweeps and site retakes using default setups for A and B site control.",
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
  if (!map) return { title: "Map Not Found | ValoVault", robots: { index: false } };

  const pageTitle = `${map.displayName} Map Guide: Callouts, Layout & Strategies | ValoVault`;
  const pageDesc = `Master the ${map.displayName} map in VALORANT. Interactive minimap assets, callout locations, layout structure, and site tactical setup guides.`;

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">

        {/* Full-bleed splash hero */}
        <PageHero
          imageSrc={map.splash}
          imageAlt={map.displayName}
          eyebrow="TACTICAL DEPLOYMENT"
          title={map.displayName.toUpperCase()}
          subtitle={map.narrativeDescription ?? undefined}
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

        {/* Main content */}
        <Container className="py-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">

            {/* Left — gallery */}
            <Reveal>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    MAP ASSETS
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
                        CALLOUTS
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
                    TACTICAL STRATEGIES
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

          {/* Lore section — uses stylizedBackgroundImage as backdrop */}
          {map.narrativeDescription && (
            <Reveal className="mt-20">
              <div className="relative overflow-hidden border border-border">
                {map.stylizedBackgroundImage && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={map.stylizedBackgroundImage}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover opacity-10"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
                  </div>
                )}
                <div className="relative z-10 p-10 lg:p-16">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      LORE INTELLIGENCE
                    </span>
                  </div>
                  <p className="max-w-3xl font-sans text-base leading-relaxed text-secondary">
                    {map.narrativeDescription}
                  </p>
                  {map.coordinates && (
                    <p className="mt-4 font-mono-tactical text-[11px] text-muted">
                      COORDINATES: {map.coordinates}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
