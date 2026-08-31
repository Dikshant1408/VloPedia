import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaks & Unreleased Content",
  description: "Latest datamined info, upcoming skins, agents, and battle pass leaks.",
  alternates: { canonical: "/leaks" },
};

export default function LeaksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
