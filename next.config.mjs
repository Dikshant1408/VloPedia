/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@tanstack/react-query"]
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "media.valorant-api.com"
      }
    ]
  }
};

export default nextConfig;
