import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Database",
  description: "Search agents, weapons, skins, maps, bundles, and patch notes in ValoVault.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
