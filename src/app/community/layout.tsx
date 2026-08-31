import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community & Discussions",
  description: "Join the ValoVault community, submit lineup guides, and share setups.",
  alternates: { canonical: "/community" },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
