import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site";
import { ValorantApiClient } from "@/lib/valorantApi";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["VALORANT", "VloPedia", "VALORANT Database", "Agents", "Weapons", "Maps", "Skins", "Companion", "Encyclopedia", "Lore", "Comp Builder", "Sensitivity"],
  authors: [
    { name: "Godrikt", url: "https://github.com/Godrikt" },
    { name: "AxrydeStudio", url: "https://github.com/AxrydeStudio" },
    { name: siteConfig.name },
  ],
  creator: "Godrikt",
  publisher: "AxrydeStudio",
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
    images: [
      {
        url: `${siteConfig.url}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og-image.png`],
  },
  verification: {
    google: [
      "FlbgsDmDRsMGCDsekr2iLEDY7e_nW547KQEN3kcFNRI",
      "3vDY6qxEsTfaDAK803XjxHNSHmszpmX484JGXnKeJOw",
      "VbOud-rNqUMkcxFbAo5MAilwSmfScxu3ro_2z63BxUw",
    ],
  },
  other: {
    "google-adsense-account": "ca-pub-5851997796287592",
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
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = localStorage.getItem("valovault_theme");
                if (storedTheme === "light") {
                  document.documentElement.classList.remove("dark");
                  document.documentElement.classList.add("light");
                  document.documentElement.style.colorScheme = "light";
                } else {
                  document.documentElement.classList.remove("light");
                  document.documentElement.classList.add("dark");
                  document.documentElement.style.colorScheme = "dark";
                }
              } catch (e) {}
            `,
          }}
        />
        <meta name="google-site-verification" content="FlbgsDmDRsMGCDsekr2iLEDY7e_nW547KQEN3kcFNRI" />
        <meta name="google-site-verification" content="3vDY6qxEsTfaDAK803XjxHNSHmszpmX484JGXnKeJOw" />
        <meta name="google-site-verification" content="VbOud-rNqUMkcxFbAo5MAilwSmfScxu3ro_2z63BxUw" />
        <meta name="c5e365bb4ddff86b4d42f01bc4bd01051bc9845a" content="c5e365bb4ddff86b4d42f01bc4bd01051bc9845a" />
        <meta name="google-adsense-account" content="ca-pub-5851997796287592" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e && e.message && (e.message.indexOf('Loading chunk') !== -1 || e.message.indexOf('ChunkLoadError') !== -1)) {
                  if (!sessionStorage.getItem('chunk_reload_time')) {
                    sessionStorage.setItem('chunk_reload_time', Date.now());
                    window.location.reload();
                  }
                }
              });
            `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5851997796287592"
          crossOrigin="anonymous"
        />
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
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
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
      </body>
    </html>
  );
}
