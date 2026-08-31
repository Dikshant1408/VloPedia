import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Meta Tier List",
  description: "Current patch VALORANT agent tier list for ranked competitive play.",
  alternates: { canonical: "/tier-list" },
};

export default function TierListLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
