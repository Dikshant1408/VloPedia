import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Composition Builder",
  description: "Build, analyze, and optimize VALORANT 5-agent team compositions for every map.",
  alternates: { canonical: "/comp-builder" },
};

export default function CompBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
