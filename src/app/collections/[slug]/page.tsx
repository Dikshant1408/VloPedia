import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CollectionTrackerClient } from "@/components/collection-tracker-client";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

type Props = {
  params: Promise<{ slug: string }>;
};

const collectionsDb: Record<string, {
  name: string;
  cost: number;
  rating: string;
  items: { id: string; name: string; type: string; price: number }[];
}> = {
  "kuronami-vandal": {
    name: "KURONAMI COLLECTION",
    cost: 9500,
    rating: "EXCLUSIVE",
    items: [
      { id: "k_vandal", name: "Kuronami Vandal", type: "Rifle Skin", price: 2375 },
      { id: "k_sheriff", name: "Kuronami Sheriff", type: "Sidearm Skin", price: 1775 },
      { id: "k_melee", name: "Kuronami Melee (Noxtil)", type: "Melee Skin", price: 4350 },
      { id: "k_marshal", name: "Kuronami Marshal", type: "Sniper Skin", price: 1775 }
    ]
  },
  "reaver-vandal": {
    name: "REAVER 2.0 COLLECTION",
    cost: 7100,
    rating: "PREMIUM",
    items: [
      { id: "r_vandal", name: "Reaver Vandal", type: "Rifle Skin", price: 1775 },
      { id: "r_phantom", name: "Reaver Phantom", type: "Rifle Skin", price: 1775 },
      { id: "r_operator", name: "Reaver Operator", type: "Sniper Skin", price: 1775 },
      { id: "r_ghost", name: "Reaver Ghost", type: "Sidearm Skin", price: 1775 },
      { id: "r_karambit", name: "Reaver Karambit Melee", type: "Melee Skin", price: 3550 }
    ]
  },
  "oni-phantom": {
    name: "ONI 2.0 COLLECTION",
    cost: 7100,
    rating: "PREMIUM",
    items: [
      { id: "o_phantom", name: "Oni Phantom", type: "Rifle Skin", price: 1775 },
      { id: "o_vandal", name: "Oni Vandal", type: "Rifle Skin", price: 1775 },
      { id: "o_bulldog", name: "Oni Bulldog", type: "Rifle Skin", price: 1775 },
      { id: "o_ares", name: "Oni Ares", type: "Heavy Skin", price: 1775 },
      { id: "o_katana", name: "Onimaru Kunitsuna Melee", type: "Melee Skin", price: 4350 }
    ]
  }
};

export async function generateStaticParams() {
  return [
    { slug: "kuronami-vandal" },
    { slug: "reaver-vandal" },
    { slug: "oni-phantom" }
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = collectionsDb[slug];
  if (!col) return { title: "Collection Unavailable // ValoVault" };

  return {
    title: `${col.name} Inventory Tracker // VALORANT Database`,
    description: `Track your owned components of the ${col.name} and monitor complete account valuations.`,
    openGraph: {
      title: `${col.name} Valuation - ValoVault`,
      description: `Rarity: ${col.rating} // Est Value: ${col.cost} VP`
    },
    alternates: {
      canonical: `/collections/${slug}`,
    }
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const col = collectionsDb[slug];

  if (!col) {
    redirect("/collections");
  }

  return (
    <div className="min-h-screen bg-background py-16 text-foreground">
      <Container>
        <div className="mb-8">
          <Link href="/collections">
            <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              BACK TO COLLECTIONS
            </Button>
          </Link>
        </div>

        <PageHeader
          eyebrow="COLLECTION TELEMETRY"
          title={col.name}
          description={`Track your owned components and monitor complete account valuations. Estimated value: ${col.cost} VP`}
        />

        <div className="mt-10">
          <CollectionTrackerClient
            slug={slug}
            name={col.name}
            cost={col.cost}
            rating={col.rating}
            items={col.items}
          />
        </div>
      </Container>
    </div>
  );
}
