import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { BundleWishlistButton } from "./bundle-wishlist-button";
import type { ValorantBundle, ValorantSkin } from "@/lib/valorant-types";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";

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

async function getAllBundles(): Promise<ValorantBundle[]> {
  if (bundlesCache) return bundlesCache;
  bundlesCache = (async () => {
    try {
      const res = await fetch(`${API}/bundles`);
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

async function getBundleSkins(bundleName: string): Promise<ValorantSkin[]> {
  if (!skinsCache) {
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
  }
  const all = await skinsCache;
  return all
    .filter(s =>
      s.displayName.toLowerCase().includes(bundleName.toLowerCase()) &&
      (s.chromas?.[0]?.fullRender || s.displayIcon)
    )
    .slice(0, 12);
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
  if (!bundle) return { title: "Bundle Not Found | ValoVault", robots: { index: false } };

  const img = bundle.verticalPromoImage ?? bundle.displayIcon2 ?? bundle.displayIcon;
  const pageTitle = `${bundle.displayName} Bundle: Included Skins & Store Prices | ValoVault`;
  const pageDesc = `Discover all weapon skins included in the VALORANT ${bundle.displayName} bundle. View VP pricing details, bundle art, and release telemetry.`;

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      type: "website",
      title: pageTitle,
      description: pageDesc,
      images: img ? [{ url: img }] : [],
    },
    alternates: {
      canonical: `/bundles/${slug}`,
    },
  };
}

export default async function BundleDetailPage({ params }: Props) {
  const { slug } = await params;
  const bundles = await getAllBundles();
  const bundle = bundles.find(b => b.uuid === slug);
  if (!bundle) notFound();

  const heroImage = bundle.verticalPromoImage ?? bundle.displayIcon2 ?? bundle.displayIcon;
  const includedSkins = await getBundleSkins(bundle.displayName);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">

        {/* Cinematic PageHero — promo image full viewport width */}
        <PageHero
          imageSrc={heroImage}
          imageAlt={bundle.displayName}
          eyebrow="WEAPON BUNDLE"
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

        <Container className="py-20 space-y-16">

          {/* Bundle info + wishlist */}
          <Reveal>
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    BUNDLE DETAILS
                  </span>
                </div>
                <h2 className="font-display text-4xl uppercase tracking-wide text-white">
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
              </div>

              {/* Wishlist + CTA */}
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <BundleWishlistButton bundleName={bundle.displayName} bundleUuid={bundle.uuid} />
                <Link href="/store">
                  <Button variant="outline" className="w-full gap-2 group">
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    View in Store
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
                    Included Skins
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

          {/* Promo images grid — displayIcon2 and secondary assets */}
          {(bundle.displayIcon2 || bundle.verticalPromoImage) && (
            <Reveal>
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <h2 className="font-display text-3xl uppercase tracking-wide text-white">
                    Bundle Art
                  </h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {bundle.verticalPromoImage && (
                    <div className="relative overflow-hidden border border-border bg-black" style={{ aspectRatio: "9/16" }}>
                      <Image
                        src={bundle.verticalPromoImage}
                        alt={`${bundle.displayName} promo`}
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
                        alt={`${bundle.displayName} icon`}
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

        </Container>
      </div>
    </PageTransition>
  );
}
