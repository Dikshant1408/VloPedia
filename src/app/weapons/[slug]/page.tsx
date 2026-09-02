import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ValorantWeapon } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";
import { WeaponDetailClient } from "./weapon-detail-client";

const API = "https://valorant-api.com/v1";

let weaponsCache: Promise<ValorantWeapon[]> | null = null;

async function getAllWeapons(): Promise<ValorantWeapon[]> {
  if (weaponsCache) return weaponsCache;
  weaponsCache = (async () => {
    try {
      const res = await fetch(`${API}/weapons`);
      if (!res.ok) {
        weaponsCache = null;
        return [];
      }
      const json = await res.json();
      return json.data ?? [];
    } catch {
      weaponsCache = null;
      return [];
    }
  })();
  return weaponsCache;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findWeapon(weapons: ValorantWeapon[], slug: string): ValorantWeapon | null {
  const norm = slug.toLowerCase();
  return (
    weapons.find(
      w =>
        slugify(w.displayName) === norm ||
        w.displayName.toLowerCase() === norm ||
        w.displayName.toLowerCase().replace(/\s+/g, "-") === norm
    ) ?? null
  );
}

export async function generateStaticParams() {
  const weapons = await getAllWeapons();
  return weapons.map(w => ({
    slug: slugify(w.displayName),
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const weapons = await getAllWeapons();
  const weapon = findWeapon(weapons, slug);
  if (!weapon) return { title: "Weapon Not Found | VloPedia", robots: { index: false } };

  const pageTitle = `${weapon.displayName} VALORANT Guide: Stats, Damage & Skins | VloPedia`;
  const pageDesc = `Master the ${weapon.displayName} in VALORANT. View full damage profiles, fire rate stats, reload times, active weapon skins, and 3D models.`;

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
      images: [{ url: weapon.displayIcon }],
    },
    alternates: {
      canonical: `${siteConfig.url}/weapons/${slug}`,
    },
  };
}

export default async function WeaponDetailPage({ params }: Props) {
  const { slug } = await params;
  const weapons = await getAllWeapons();
  const weapon = findWeapon(weapons, slug);
  if (!weapon) notFound();

  // Category-mates for the compare feature
  const sameCategory = weapons
    .filter(w => w.category === weapon.category && w.uuid !== weapon.uuid)
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
          { "@type": "ListItem", "position": 2, "name": "Weapons", "item": `${siteConfig.url}/weapons` },
          { "@type": "ListItem", "position": 3, "name": weapon.displayName, "item": `${siteConfig.url}/weapons/${slug}` }
        ]
      },
      {
        "@type": "Product",
        "name": `${weapon.displayName} - VALORANT Weapon`,
        "image": [weapon.displayIcon],
        "description": `Full tactical stats and damage falloff profiles for the ${weapon.displayName} in VALORANT.`,
        "offers": {
          "@type": "Offer",
          "price": weapon.shopData?.cost || 0,
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
      <WeaponDetailClient weapon={weapon} sameCategory={sameCategory} />
    </>
  );
}
