import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VALORANT Lore & Story",
  description: "Deep dive into the VALORANT Protocol story, Earth-1 vs Earth-2, agent voice logs, and realm history.",
  alternates: { canonical: "/lore" },
};

export default function LoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
