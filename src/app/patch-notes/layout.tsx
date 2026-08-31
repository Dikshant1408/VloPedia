import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patch Notes History",
  description: "Track official VALORANT patch notes, agent buffs/nerfs, weapon balance, and system updates.",
  alternates: { canonical: "/patch-notes" },
};

export default function PatchNotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
