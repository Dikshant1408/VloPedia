/**
 * Homepage — static export compatible.
 * All data fetching is client-side via HomepageClient.
 * generateMetadata is static.
 */
import { Metadata } from "next";
import { HomepageClient } from "./homepage-client";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "ValoVault — The VALORANT Encyclopedia",
  description:
    "The complete VALORANT encyclopedia. Agents, weapons, maps, skins, lore, and the tools you use to win.",
  openGraph: {
    type: "website",
    title: "ValoVault — The VALORANT Encyclopedia",
    description:
      "The complete VALORANT encyclopedia. Agents, weapons, maps, skins, lore, and the tools you use to win.",
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
