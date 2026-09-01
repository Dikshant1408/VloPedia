/**
 * Homepage — static export compatible.
 * All data fetching is client-side via HomepageClient.
 * generateMetadata is static.
 */
import { Metadata } from "next";
import { HomepageClient } from "./homepage-client";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "VloPedia — VALORANT Database, Tools & Lore Encyclopedia",
  description:
    "The authoritative VALORANT database, tactical utility engine, and lore encyclopedia. Operative guides, damage falloffs, weapon compare, comp builder, and verified lore timeline.",
  openGraph: {
    type: "website",
    title: "VloPedia — VALORANT Database, Tools & Lore Encyclopedia",
    description:
      "The authoritative VALORANT database, tactical utility engine, and lore encyclopedia. Operative guides, damage falloffs, weapon compare, comp builder, and verified lore timeline.",
    url: siteConfig.url,
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "VbOud-rNqUMkcxFbAo5MAilwSmfScxu3ro_2z63BxUw",
  },
};

export default function HomePage() {
  return <HomepageClient />;
}
