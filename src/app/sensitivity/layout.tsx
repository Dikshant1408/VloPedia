import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sensitivity Converter",
  description: "Convert mouse sensitivity from CS2, Apex Legends, Overwatch 2, and Rainbow Six to VALORANT.",
  alternates: { canonical: "/sensitivity" },
};

export default function SensitivityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
