import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skins Catalog",
  description: "Browse all VALORANT gun skins, chromas, level upgrades, and video demonstrations.",
  alternates: { canonical: "/skins" },
};

export default function SkinsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
