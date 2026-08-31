import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crosshair Generator & Codes",
  description: "Create, test, and copy VALORANT crosshair import codes for pro players and custom setups.",
  alternates: { canonical: "/crosshair" },
};

export default function CrosshairLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
