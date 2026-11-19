import type { Metadata } from "next";

// /dashboard is wrapped in ProtectedRoute and renders per-user wishlist,
// queue-prep plans, and collection telemetry. Never index it.
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}