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
  // Only statically generate watch pages for skins that contain showcase videos
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
  if (!skin) return { title: "Showcase Not Found | ValoVault", robots: { index: false } };

  const pageTitle = `${skin.displayName} Video Showcase: Animations & VFX | ValoVault`;
  const pageDesc = `Watch the official video showcase for the ${skin.displayName} VALORANT weapon skin. Play level upgrades, finishers, reload sounds, and visual effects in theater mode.`;
  const img = skin.chromas?.[0]?.fullRender ?? skin.displayIcon;

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
      images: img ? [{ url: img }] : [],
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
  const videoAssets: { uuid: string; name: string; videoUrl: string }[] = [];

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
    "@type": "VideoObject",
    "name": `${skin.displayName} Skin Showcase Video`,
    "description": `Watch the official showcase video for the ${skin.displayName} weapon skin in VALORANT. Play level upgrades, finishers, reload sounds, and visual effects in theater mode.`,
    "thumbnailUrl": [thumbnailUrl],
    "uploadDate": "2026-05-23T00:00:00Z",
    "contentUrl": defaultVideo.videoUrl,
    "duration": "PT15S",
  };

  const clientSkin = {
    uuid: skin.uuid,
    displayName: skin.displayName,
    weaponSlug: "",
    contentTierUuid: skin.contentTierUuid,
    displayIcon: skin.displayIcon,
  };

  return (
    <PageTransition>
      {/* Google SEO VideoObject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <div className="min-h-screen bg-[#070C12] text-foreground py-16">
        <Container>
          <WatchClient skin={clientSkin} videoAssets={videoAssets} />
        </Container>
      </div>
    </PageTransition>
  );
}
