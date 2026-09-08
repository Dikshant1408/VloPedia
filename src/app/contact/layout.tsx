import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Community Feedback | VloPedia",
  description: "Get in touch with the VloPedia development team. Submit bug reports, request feature additions, report skin telemetry discrepancies, or discuss tactical partnerships.",
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
    title: "Contact & Community Feedback | VloPedia",
    description: "Get in touch with the VloPedia development team. Submit bug reports, feature requests, or VALORANT data corrections.",
    url: `${siteConfig.url}/contact`,
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact VloPedia",
    "description": "Contact and community feedback portal for the VloPedia VALORANT encyclopedia and database.",
    "url": `${siteConfig.url}/contact`,
    "mainEntity": {
      "@type": "Organization",
      "name": "VloPedia",
      "url": siteConfig.url,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "url": `${siteConfig.url}/contact`
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
