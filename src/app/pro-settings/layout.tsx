import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Player Settings",
  description: "Pro player VALORANT settings, crosshairs, DPI, resolution, and gear loadouts.",
  alternates: { canonical: "/pro-settings" },
};

export default function ProSettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
