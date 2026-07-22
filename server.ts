import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Intercept robots.txt dynamically to match the current request host
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "vlopedia.app";
    // Detect protocol (behind reverse proxy, look for x-forwarded-proto)
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const origin = `${protocol}://${host}`;

    const content = `# VloPedia Robots Configuration
# ${origin}

User-agent: *
Allow: /

# Prevent indexing of temporary/cache paths if any exist
Disallow: /node_modules/
Disallow: /dist/

# Sitemap location
Sitemap: ${origin}/sitemap.xml
`;
    res.type("text/plain");
    res.send(content);
  });

  // Intercept sitemap.xml dynamically to match the current request host
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "vlopedia.app";
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const origin = `${protocol}://${host}`;

    const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${origin}/</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
  <!-- Agents Database -->
  <url>
    <loc>${origin}/#/agents</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <!-- Weapons Armory & Skin Store -->
  <url>
    <loc>${origin}/#/weapons</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <!-- Interactive Tactical Radar Maps -->
  <url>
    <loc>${origin}/#/maps</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <!-- Bundles & Skin Collection Store -->
  <url>
    <loc>${origin}/#/collection</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <!-- Crosshair Labs & Sensitivity Converter -->
  <url>
    <loc>${origin}/#/meta</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <!-- Leaderboards & Career Profiles -->
  <url>
    <loc>${origin}/#/player-registry</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.80</priority>
  </url>
  <!-- Game Modes & Competitive Guides -->
  <url>
    <loc>${origin}/#/game-modes</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
</urlset>`;

    res.type("application/xml");
    res.send(content);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
