import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maps & Callouts",
  description: "Explore all VALORANT map layouts, callouts, site strategies, and 3D mini-maps.",
  alternates: { canonical: "/maps" },
};

export default function MapsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
