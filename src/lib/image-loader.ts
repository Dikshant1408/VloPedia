export default function weservLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (
    src.startsWith("/") ||
    src.startsWith("data:") ||
    src.includes("localhost") ||
    src.includes("127.0.0.1") ||
    src.includes("media.valorant-api.com") ||
    src.includes("valorant.dyn.riotcdn.net") ||
    src.includes("images.unsplash.com")
  ) {
    return src;
  }

  const encodedUrl = encodeURIComponent(src);
  return `https://wsrv.nl/?url=${encodedUrl}&w=${width}&q=${quality || 80}&output=webp`;
}

