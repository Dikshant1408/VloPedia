import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weapons Armory",
  description: "Complete stats, weapon comparison, damage falloff, and skins for all VALORANT guns.",
  alternates: { canonical: "/weapons" },
};

export default function WeaponsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
