import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Sparkles, HelpCircle, Layers, Info, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BundleWishlistButton } from "./bundle-wishlist-button";
import type { ValorantBundle, ValorantSkin } from "@/lib/valorant-types";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const API = "https://valorant-api.com/v1";

let bundlesCache: Promise<ValorantBundle[]> | null = null;
let skinsCache: Promise<ValorantSkin[]> | null = null;
let buddiesCache: Promise<any[]> | null = null;
let cardsCache: Promise<any[]> | null = null;
let spraysCache: Promise<any[]> | null = null;

async function getAllBundles(): Promise<ValorantBundle[]> {
  if (bundlesCache) return bundlesCache;
  bundlesCache = (async () => {
    try {
      const res = await fetch(`${API}/bundles`, { next: { revalidate: 3600 } });
      if (!res.ok) {
        bundlesCache = null;
        return [];
      }
      const json = await res.json();
      return json.data ?? [];
    } catch {
      bundlesCache = null;
      return [];
    }
  })();
  return bundlesCache;
}

interface BundleAccessory {
  uuid: string;
  displayName: string;
  displayIcon: string;
  type: "Gun Buddy" | "Player Card" | "Spray";
  href: string;
}

interface BundleItemsPayload {
  skins: ValorantSkin[];
  accessories: BundleAccessory[];
  totalCost: number;
}

async function getBundleItems(bundleName: string): Promise<BundleItemsPayload> {
  if (!skinsCache) {
    skinsCache = fetch(`${API}/weapons/skins`, { next: { revalidate: 3600 } })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(j => j.data ?? [])
      .catch(() => []);
  }
  if (!buddiesCache) {
    buddiesCache = fetch(`${API}/buddies`, { next: { revalidate: 3600 } })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(j => j.data ?? [])
      .catch(() => []);
  }
  if (!cardsCache) {
    cardsCache = fetch(`${API}/playercards`, { next: { revalidate: 3600 } })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(j => j.data ?? [])
      .catch(() => []);
  }
  if (!spraysCache) {
    spraysCache = fetch(`${API}/sprays`, { next: { revalidate: 3600 } })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(j => j.data ?? [])
      .catch(() => []);
  }

  const [allSkins, allBuddies, allCards, allSprays] = await Promise.all([
    skinsCache,
    buddiesCache,
    cardsCache,
    spraysCache
  ]);

  const cleanName = bundleName.replace(/(Signature|Capsule|Bundle|Collection|\/\/)/gi, "").trim();
  const vctMatch = bundleName.match(/VCT(?:25|26)?\s*x\s*([A-Za-z0-9]+)/i);
  const teamTag = vctMatch ? vctMatch[1].toLowerCase() : null;

  const matchFn = (itemTitle: string) => {
    const t = itemTitle.toLowerCase();
    if (teamTag) {
      return (t.includes("vct") && t.includes(teamTag)) || t.includes(bundleName.toLowerCase());
    }
    return t.includes(bundleName.toLowerCase()) || (cleanName.length >= 4 && t.includes(cleanName.toLowerCase()));
  };

  const matchedSkins = allSkins
    .filter(s => matchFn(s.displayName) && (s.chromas?.[0]?.fullRender || s.displayIcon))
    .slice(0, 16);

  const accessories: BundleAccessory[] = [];

  allBuddies.filter(b => matchFn(b.displayName)).slice(0, 8).forEach(b => {
    accessories.push({
      uuid: b.uuid,
      displayName: b.displayName,
      displayIcon: b.displayIcon,
      type: "Gun Buddy",
      href: "/buddies"
    });
  });

  allCards.filter(c => matchFn(c.displayName)).slice(0, 8).forEach(c => {
    accessories.push({
      uuid: c.uuid,
      displayName: c.displayName,
      displayIcon: c.largeArt ?? c.displayIcon,
      type: "Player Card",
      href: "/playercards"
    });
  });

  allSprays.filter(sp => matchFn(sp.displayName)).slice(0, 8).forEach(sp => {
    accessories.push({
      uuid: sp.uuid,
      displayName: sp.displayName,
      displayIcon: sp.fullTransparentIcon ?? sp.displayIcon,
      type: "Spray",
      href: "/sprays"
    });
  });

  let totalCost = 0;
  matchedSkins.forEach(s => {
    const tier = CONTENT_TIER_MAP[s.contentTierUuid ?? ""];
    totalCost += tier?.price ?? 1775;
  });

  return {
    skins: matchedSkins,
    accessories,
    totalCost: totalCost > 0 ? totalCost : 7100
  };
}

export async function generateStaticParams() {
  const bundles = await getAllBundles();
  return bundles.map(b => ({ slug: b.uuid }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bundles = await getAllBundles();
  const bundle = bundles.find(b => b.uuid === slug);
  if (!bundle) return { title: "Bundle Not Found | VloPedia", robots: { index: false } };

  const img = bundle.verticalPromoImage ?? bundle.displayIcon2 ?? bundle.displayIcon;
  const pageTitle = `${bundle.displayName} Bundle: Price, Included Skins & Overview | VloPedia`;
  const pageDesc = `Complete ${bundle.displayName} bundle guide in VALORANT. View VP store pricing, included weapon skins, gun buddies, player cards, sprays, and store rotation rules.`;

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
      url: `${siteConfig.url}/bundles/${slug}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/bundles/${slug}`,
    },
  };
}

export default async function BundleDetailPage({ params }: Props) {
  const { slug } = await params;
  const bundles = await getAllBundles();
  const bundle = bundles.find(b => b.uuid === slug);
  if (!bundle) notFound();

  const heroImage = bundle.verticalPromoImage ?? bundle.displayIcon2 ?? bundle.displayIcon;
  const { skins: includedSkins, accessories, totalCost } = await getBundleItems(bundle.displayName);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Bundles", href: "/bundles" },
    { label: bundle.displayName },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
          { "@type": "ListItem", "position": 2, "name": "Bundles", "item": `${siteConfig.url}/bundles` },
          { "@type": "ListItem", "position": 3, "name": bundle.displayName, "item": `${siteConfig.url}/bundles/${slug}` }
        ]
      },
      {
        "@type": "Product",
        "name": `${bundle.displayName} VALORANT Bundle`,
        "image": heroImage ? [heroImage] : [],
        "description": bundle.extraDescription || bundle.description || `Official ${bundle.displayName} cosmetic collection package in VALORANT.`,
        "sku": `bundle-${bundle.uuid}`,
        "category": "Video Game Virtual Bundle",
        "offers": {
          "@type": "Offer",
          "price": totalCost,
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
            "name": `How much does the ${bundle.displayName} bundle cost in VALORANT?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The individual item valuation of the ${bundle.displayName} collection is approximately ${totalCost.toLocaleString()} VP. Bundles purchased in the Featured Store generally grant the melee skin and player accessories at a discount or free of charge.`
            }
          },
          {
            "@type": "Question",
            "name": `What items are included in the ${bundle.displayName} bundle?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The ${bundle.displayName} bundle contains ${includedSkins.length} weapon cosmetics${accessories.length > 0 ? ` and ${accessories.length} accessories including gun buddies, player cards, and sprays.` : "."}`
            }
          },
          {
            "@type": "Question",
            "name": `Will the ${bundle.displayName} bundle return to the VALORANT store?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Individual gun skins from non-exclusive bundles can reappear in daily 24-hour store rotations or the Night.Market. However, limited-edition championship capsules (VCT Champions, VCT Team Capsules) are time-limited and do not return once retired.`
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

          {/* Cinematic PageHero — promo image full viewport width */}
          <PageHero
            imageSrc={heroImage}
            imageAlt={bundle.displayName}
            eyebrow="WEAPON BUNDLE ARCHIVE"
            title={bundle.displayName.toUpperCase()}
            subtitle={bundle.description || undefined}
            priority
            overlayFrom={0.25}
            overlayTo={0.88}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/bundles">
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  All Bundles
                </Button>
              </Link>
            </div>
          </PageHero>

          {/* Breadcrumb strip */}
          <div className="border-b border-border bg-[#0B141A] pt-4 pb-4">
            <Container>
              <Breadcrumbs items={breadcrumbs} />
            </Container>
          </div>

          <Container className="py-16 space-y-16">

            {/* Bundle details strip */}
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start border border-border bg-surface-card p-6 md:p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      BUNDLE SPECIFICATIONS
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wide text-white">
                    {bundle.displayName}
                  </h2>
                  {bundle.description && (
                    <p className="max-w-2xl font-sans text-sm leading-relaxed text-secondary">
                      {bundle.description}
                    </p>
                  )}
                  {bundle.extraDescription && (
                    <p className="max-w-2xl font-sans text-sm leading-relaxed text-muted">
                      {bundle.extraDescription}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 pt-2 font-mono-tactical text-xs text-muted">
                    <div className="flex items-center gap-1.5 border border-border bg-black/40 px-3 py-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      <span>{includedSkins.length} WEAPON SKINS</span>
                    </div>
                    {accessories.length > 0 && (
                      <div className="flex items-center gap-1.5 border border-border bg-black/40 px-3 py-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                        <span>{accessories.length} ACCESSORIES</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 border border-border bg-black/40 px-3 py-1.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
                      <span>EST. {totalCost.toLocaleString()} VP</span>
                    </div>
                  </div>
                </div>

                {/* Wishlist + CTAs */}
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:min-w-[200px]">
                  <BundleWishlistButton bundleName={bundle.displayName} bundleUuid={bundle.uuid} />
                  <Link href="/store">
                    <Button variant="outline" className="w-full gap-2 group">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Live Store Telemetry
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Included skins gallery */}
            {includedSkins.length > 0 && (
              <Reveal>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">
                      Included Weapon Skins
                    </h2>
                    <span className="ml-auto font-mono-tactical text-[10px] text-muted">
                      {includedSkins.length} items
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {includedSkins.map(skin => {
                      const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""];
                      const img  = skin.chromas?.[0]?.fullRender ?? skin.displayIcon ?? "";
                      const skinSlug = slugify(skin.displayName) || skin.uuid;
                      return (
                        <Link
                          key={skin.uuid}
                          href={`/skins/${skinSlug}`}
                          className="group relative border border-border bg-surface-card transition-all duration-300 hover:border-primary/50"
                          style={{ borderLeftColor: tier?.color ?? "#C084FC", borderLeftWidth: "2px" }}
                        >
                          <div className="relative bg-black/40" style={{ aspectRatio: "1/1" }}>
                            {img && (
                              <Image
                                src={img}
                                alt={skin.displayName}
                                fill
                                sizes="(max-width:768px) 50vw, 25vw"
                                className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
                                unoptimized
                              />
                            )}
                          </div>
                          <div className="p-4 space-y-1">
                            <p className="font-display text-sm uppercase leading-tight tracking-wide text-white">
                              {skin.displayName}
                            </p>
                            {tier && (
                              <p className="font-mono-tactical text-[10px] font-bold"
                                style={{ color: tier.color }}>
                                {tier.rarity} · {tier.price.toLocaleString()} VP
                              </p>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Included accessories */}
            {accessories.length > 0 && (
              <Reveal>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <span className="h-[2px] w-8 bg-yellow-400" aria-hidden="true" />
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">
                      Included Accessories & Cosmetics
                    </h2>
                    <span className="ml-auto font-mono-tactical text-[10px] text-muted">
                      {accessories.length} items
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {accessories.map((acc, idx) => (
                      <Link
                        key={`${acc.uuid}-${idx}`}
                        href={acc.href}
                        className="group relative border border-border bg-surface-card transition-all duration-300 hover:border-primary/50"
                      >
                        <div className="relative bg-black/40" style={{ aspectRatio: acc.type === "Player Card" ? "9/16" : "1/1" }}>
                          {acc.displayIcon && (
                            <Image
                              src={acc.displayIcon}
                              alt={acc.displayName}
                              fill
                              sizes="(max-width:768px) 50vw, 25vw"
                              className={acc.type === "Player Card" ? "object-cover" : "object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"}
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          <span className="font-mono-tactical text-[9px] uppercase tracking-wider text-primary">
                            {acc.type}
                          </span>
                          <p className="font-display text-sm uppercase leading-tight tracking-wide text-white">
                            {acc.displayName}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Tactical acquisition & store rotation guide */}
            <Reveal>
              <div className="border border-border bg-surface-card/60 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h3 className="font-mono-tactical text-xs uppercase tracking-[0.3em] text-primary">
                    VALORANT Store & Bundle Mechanics Guide
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-3 font-sans text-sm text-secondary">
                  <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                    <p className="font-display text-white text-base uppercase">Bundle Discounts</p>
                    <p className="text-xs leading-relaxed text-muted">
                      Purchasing complete bundles during their featured period in the in-game store provides automatic discounts, frequently giving melee weapons and player cards free of charge.
                    </p>
                  </div>
                  <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                    <p className="font-display text-white text-base uppercase">Daily Rotations</p>
                    <p className="text-xs leading-relaxed text-muted">
                      Once a featured bundle expires, its standard weapon skins enter the daily 4-slot store rotation pool at full individual item VP prices.
                    </p>
                  </div>
                  <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                    <p className="font-display text-white text-base uppercase">Night.Market Eligibility</p>
                    <p className="text-xs leading-relaxed text-muted">
                      Select, Deluxe, and Premium edition skins from previous acts become eligible for randomized personal discounts in the periodic Night.Market.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Promo images grid — displayIcon2 and secondary assets */}
            {(bundle.displayIcon2 || bundle.verticalPromoImage) && (
              <Reveal>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                    <h2 className="font-display text-3xl uppercase tracking-wide text-white">
                      Official Artwork & Key Visuals
                    </h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {bundle.verticalPromoImage && (
                      <div className="relative overflow-hidden border border-border bg-black" style={{ aspectRatio: "9/16" }}>
                        <Image
                          src={bundle.verticalPromoImage}
                          alt={`${bundle.displayName} vertical promo`}
                          fill
                          sizes="(max-width:768px) 100vw, 50vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    {bundle.displayIcon2 && (
                      <div className="relative overflow-hidden border border-border bg-black" style={{ aspectRatio: "16/9" }}>
                        <Image
                          src={bundle.displayIcon2}
                          alt={`${bundle.displayName} wide promo`}
                          fill
                          sizes="(max-width:768px) 100vw, 50vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Bundle FAQs */}
            <Reveal>
              <div className="border border-border bg-surface-card p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <h3 className="font-mono-tactical text-xs uppercase tracking-[0.3em] text-primary">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border border-border/60 bg-black/30 p-4 space-y-2">
                    <p className="font-display text-sm uppercase text-white">
                      How much does the {bundle.displayName} bundle cost in VALORANT?
                    </p>
                    <p className="text-xs leading-relaxed text-muted">
                      The total standalone item valuation of the {bundle.displayName} collection is approximately {totalCost.toLocaleString()} VP. In-store featured bundles generally bundle weapon skins together with free melee weapons or accessory packs.
                    </p>
                  </div>
                  <div className="border border-border/60 bg-black/30 p-4 space-y-2">
                    <p className="font-display text-sm uppercase text-white">
                      Can I buy skins from this bundle individually?
                    </p>
                    <p className="text-xs leading-relaxed text-muted">
                      Yes. During the featured window, weapon skins can be bought individually at their standard tier price. When retired, skins can appear in your daily store offers.
                    </p>
                  </div>
                  <div className="border border-border/60 bg-black/30 p-4 space-y-2">
                    <p className="font-display text-sm uppercase text-white">
                      Will the {bundle.displayName} collection return?
                    </p>
                    <p className="text-xs leading-relaxed text-muted">
                      Standard bundles can return during special &ldquo;Give Back&rdquo; charity bundles or &ldquo;Run It Back&rdquo; packages. Exclusive event capsules (Champions, Masters) do not return.
                    </p>
                  </div>
                  <div className="border border-border/60 bg-black/30 p-4 space-y-2">
                    <p className="font-display text-sm uppercase text-white">
                      Can I upgrade {bundle.displayName} skins with Radianite?
                    </p>
                    <p className="text-xs leading-relaxed text-muted">
                      Skins in this bundle that feature custom animations, reload sound effects, or finishers can be upgraded using Radianite Points (RP) unlocked via the Battle Pass.
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
