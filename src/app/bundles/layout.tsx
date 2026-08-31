import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bundles Archive",
  description: "All historical and current VALORANT store bundles, team capsules, and pricing.",
  alternates: { canonical: "/bundles" },
};

export default function BundlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
