import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl = envUrl && !envUrl.includes("localhost")
    ? envUrl
    : "https://valovault-ivory.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow private/user pages — Req 29.4
        disallow: ["/dashboard", "/profile", "/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
