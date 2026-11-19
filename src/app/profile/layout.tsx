import type { Metadata } from "next";

// /profile renders the signed-in user's private VALORANT profile from Firestore.
// Keep it out of the index even if the robots.txt disallow is ever lifted.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}