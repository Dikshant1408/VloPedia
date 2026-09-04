import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { siteConfig } from "@/lib/site";
import type { ValorantSkin } from "@/lib/valorant-types";
import { getAllSkins } from "../page";
import { WatchClient } from "./watch-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const skins = await getAllSkins();
  // Statically generate watch pages for all skins containing showcase videos
  return skins
    .filter(
      (s) =>
        s.levels?.some((l) => l.streamedVideo) ||
        s.chromas?.some((c) => c.streamedVideo)
    )
    .map((s) => ({ slug: s.uuid }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skins = await getAllSkins();
  const skin = skins.find((s) => s.uuid === slug);
  if (!skin) return { title: "Showcase Not Found | VloPedia", robots: { index: false } };

  const defaultVideoUrl =
    skin.levels?.find((l) => l.streamedVideo)?.streamedVideo ||
    skin.chromas?.find((c) => c.streamedVideo)?.streamedVideo ||
    "";

  const pageTitle = `${skin.displayName} Video Showcase: Animations & VFX | VloPedia`;
  const pageDesc = `Watch the official video showcase for the ${skin.displayName} VALORANT weapon skin. Play level upgrades, finishers, reload sounds, and visual effects in theater mode.`;
  const img = skin.chromas?.[0]?.fullRender ?? skin.displayIcon;
  const thumbnailUrl = img
    ? (img.startsWith("http") ? img : `${siteConfig.url}${img.startsWith("/") ? "" : "/"}${img}`)
    : `${siteConfig.url}/images/bundle-eviction.webp`;

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
      type: "video.other",
      title: pageTitle,
      description: pageDesc,
      url: `${siteConfig.url}/skins/${slug}/watch`,
      siteName: "VloPedia",
      images: [
        {
          url: thumbnailUrl,
          width: 1200,
          height: 630,
          alt: `${skin.displayName} Showcase Video Thumbnail`,
        },
      ],
      videos: defaultVideoUrl
        ? [
            {
              url: defaultVideoUrl,
              width: 1920,
              height: 1080,
              type: "video/mp4",
            },
          ]
        : [],
    },
    twitter: {
      card: "player",
      title: pageTitle,
      description: pageDesc,
      images: [thumbnailUrl],
      players: defaultVideoUrl
        ? [
            {
              playerUrl: `${siteConfig.url}/skins/${slug}/watch`,
              streamUrl: defaultVideoUrl,
              width: 1920,
              height: 1080,
            },
          ]
        : [],
    },
    alternates: {
      canonical: `${siteConfig.url}/skins/${slug}/watch`,
    },
  };
}

export default async function SkinWatchPage({ params }: Props) {
  const { slug } = await params;
  const skins = await getAllSkins();
  const skin = skins.find((s) => s.uuid === slug);
  if (!skin) notFound();

  // Collate video assets from levels and chromas
  const videoAssets: { uuid: string; name: string; videoUrl: string; isChroma?: boolean }[] = [];

  // Add level videos
  (skin.levels || []).forEach((lvl, idx) => {
    if (lvl.streamedVideo) {
      const cleanName = lvl.displayName
        ? lvl.displayName.replace(skin.displayName, "").trim()
        : "";
      videoAssets.push({
        uuid: lvl.uuid,
        name: cleanName || `Level ${idx + 1}`,
        videoUrl: lvl.streamedVideo,
        isChroma: false,
      });
    }
  });

  // Add chroma variant videos
  (skin.chromas || []).forEach((chr, idx) => {
    if (chr.streamedVideo) {
      const cleanName = chr.displayName
        ? chr.displayName.replace(skin.displayName, "").trim()
        : "";
      videoAssets.push({
        uuid: chr.uuid,
        name: cleanName || `Variant ${idx + 1}`,
        videoUrl: chr.streamedVideo,
        isChroma: true,
      });
    }
  });

  // If there are absolutely no video assets, the page should 404
  if (videoAssets.length === 0) {
    notFound();
  }

  // Set up schema parameters
  const defaultVideo = videoAssets[0];
  const img = skin.chromas?.[0]?.fullRender ?? skin.displayIcon;
  const thumbnailUrl = img
    ? (img.startsWith("http") ? img : `${siteConfig.url}${img.startsWith("/") ? "" : "/"}${img}`)
    : `${siteConfig.url}/images/bundle-eviction.webp`;

  const videoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteConfig.url,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Skins",
            "item": `${siteConfig.url}/skins`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": skin.displayName,
            "item": `${siteConfig.url}/skins/${slug}`,
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": `${skin.displayName} Video Showcase`,
            "item": `${siteConfig.url}/skins/${slug}/watch`,
          },
        ],
      },
      {
        "@type": "VideoObject",
        "name": `${skin.displayName} - VALORANT Skin Video Showcase`,
        "description": `Watch the official showcase video for the ${skin.displayName} weapon skin in VALORANT. Inspect animations, reload sound effects, pull-out motions, and finisher VFX in theater mode.`,
        "thumbnailUrl": [thumbnailUrl],
        "uploadDate": "2024-01-01T00:00:00Z",
        "contentUrl": defaultVideo.videoUrl,
        "embedUrl": `${siteConfig.url}/skins/${slug}/watch`,
        "duration": "PT15S",
        "inLanguage": "en-US",
        "isFamilyFriendly": true,
        "mainEntityOfPage": `${siteConfig.url}/skins/${slug}/watch`,
        "publisher": {
          "@type": "Organization",
          "name": "VloPedia",
          "url": siteConfig.url,
          "logo": {
            "@type": "ImageObject",
            "url": `${siteConfig.url}/favicon.ico`,
          },
        },
        "potentialAction": {
          "@type": "WatchAction",
          "target": `${siteConfig.url}/skins/${slug}/watch`,
        },
      },
    ],
  };

  const clientSkin = {
    uuid: skin.uuid,
    displayName: skin.displayName,
    weaponSlug: "",
    contentTierUuid: skin.contentTierUuid,
    displayIcon: skin.displayIcon,
    thumbnailUrl,
  };

  return (
    <PageTransition>
      {/* Google SEO VideoObject & Breadcrumbs Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <div className="min-h-screen bg-[#070C12] text-foreground pt-4 sm:pt-6 pb-16">
        <Container>
          <WatchClient skin={clientSkin} videoAssets={videoAssets} />
        </Container>
      </div>
    </PageTransition>
  );
}
