import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store & Market",
  description: "VALORANT daily store rotation, Night Market tracker, and VP prices.",
  alternates: { canonical: "/store" },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
