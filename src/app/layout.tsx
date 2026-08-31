import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site";
import { ValorantApiClient } from "@/lib/valorantApi";
import Script from "next/script";
import AdSenseLoader from "@/components/AdSenseLoader";

/* ── Fonts ── */
const displayFont = Outfit({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["VALORANT", "ValoVault", "Agents", "Weapons", "Maps", "Skins", "Companion", "Encyclopedia"],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
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
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  verification: {
    google: "VbOud-rNqUMkcxFbAo5MAilwSmfScxu3ro_2z63BxUw",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* Server-side version fetch for nav + footer badge */
  const versionData = await ValorantApiClient.getVersion().catch(() => null);
  const version = versionData?.riotClientVersion ?? null;

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable} dark`}
    >
      <head>
        <meta name="google-site-verification" content="VbOud-rNqUMkcxFbAo5MAilwSmfScxu3ro_2z63BxUw" />
        <meta name="google-adsense-account" content="ca-pub-5851997796287592" />
        <link rel="dns-prefetch" href="https://wsrv.nl" />
        <link rel="dns-prefetch" href="https://valorant-api.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteConfig.url}/#website`,
                  "url": siteConfig.url,
                  "name": siteConfig.name,
                  "description": siteConfig.description,
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${siteConfig.url}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": `${siteConfig.url}/#organization`,
                  "name": siteConfig.name,
                  "url": siteConfig.url,
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0B141A] text-foreground antialiased font-sans">
        <Providers>
          <div className="relative isolate min-h-screen overflow-x-hidden">
            {/* Skip to content */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:bg-primary focus:text-black focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider"
            >
              Skip to content
            </a>

            {/* Tactical grid overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[1] bg-tactical-grid opacity-[0.4]"
            />

            {/* Scanline overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[1] crt-scanlines opacity-[0.03]"
            />

            <SiteHeader version={version} />
            <main id="main-content" className="relative z-10">
              {children}
            </main>
            <SiteFooter version={version} />
          </div>
        </Providers>
        <AdSenseLoader />
      </body>
    </html>
  );
}
