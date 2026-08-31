import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents Database",
  description: "Browse all VALORANT agents, study abilities, stats, and role breakdowns.",
  alternates: { canonical: "/agents" },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
