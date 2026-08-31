"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { useFirestoreUserDocument } from "@/hooks/use-firestore-user-document";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import { WishlistManager } from "@/components/wishlist-manager";
import { QueuePrepPlanner } from "@/components/queue-prep-planner";
import { useQueuePrepPlans } from "@/hooks/use-queue-prep-plans";
import { ArrowRight, Flame, Gamepad2, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const { data: userDocument, loading, error } = useFirestoreUserDocument();
  const { items: wishlistItems } = useUserWishlist();
  const queuePrep = useQueuePrepPlans();

  // Local storage collections telemetry state
  const [collectionStats, setCollectionStats] = useState({
    kuronami: 0,
    reaver: 0,
    oni: 0
  });

  useEffect(() => {
    const getStats = (key: string, total: number) => {
      const saved = localStorage.getItem(`valovault_collection_${key}`);
      if (saved) {
        try {
          const items = JSON.parse(saved);
          return Math.round((items.length / total) * 100);
        } catch {
          return 0;
        }
      }
      return 0;
    };

    setCollectionStats({
      kuronami: getStats("kuronami-vandal", 4),
      reaver: getStats("reaver-vandal", 5),
      oni: getStats("oni-phantom", 5)
    });
  }, []);

  const stats = [
    { label: "Prep Plans", value: String(queuePrep.plans.length), icon: Gamepad2 },
    { label: "Wishlisted", value: String(wishlistItems.length), icon: Flame },
    { label: "System Sync", value: "ACTIVE", icon: ShieldCheck }
  ];

  return (
    <ProtectedRoute
      title="Dashboard access is private"
      description="Your dashboard will store saved loadouts, alerts, and personal VALORANT data behind Firebase authentication."
    >
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">COMMAND DECK</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">DASHBOARD</h1>
                <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
                  Track queue plans, wishlisted items, and collection progress.
                </p>
              </div>
              <a href="/profile" className="hidden sm:flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:text-white transition-colors">
                Profile <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-8xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Left — stats + collections */}
            <div className="space-y-6">
              {/* User + stats */}
              <div className="border border-border bg-[#0D1A22] p-6 space-y-5 cut-corner-br">
                <div className="border-b border-border pb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Signed in as</span>
                  <p className="mt-1 font-display text-2xl uppercase text-white">
                    {loading ? "Loading…" : userDocument?.displayName ?? userDocument?.email ?? "Authenticated User"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {stats.map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-4">
                        <Icon className="h-4 w-4 text-primary mb-2" aria-hidden="true" />
                        <p className="font-mono text-2xl font-black text-white">{s.value}</p>
                        <p className="font-mono text-[10px] font-bold uppercase text-muted mt-1">{s.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collection overview */}
              <div className="border border-border bg-[#0D1A22] p-6 space-y-5 cut-corner-br">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Collections</span>
                  <Link href="/collections" className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Kuronami Collection", progress: collectionStats.kuronami, slug: "kuronami-vandal" },
                    { name: "Reaver Collection",   progress: collectionStats.reaver,   slug: "reaver-vandal"  },
                    { name: "Oni Collection",      progress: collectionStats.oni,       slug: "oni-phantom"   },
                  ].map(col => (
                    <div key={col.slug} className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-white">{col.name}</span>
                        <span className="text-success">{col.progress}%</span>
                      </div>
                      <div className="stat-bar-track" role="progressbar" aria-valuenow={col.progress} aria-valuemin={0} aria-valuemax={100}>
                        <div className="stat-bar-fill bg-success" style={{ transform:`scaleX(${col.progress/100})` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — wishlist + queue */}
            <div className="space-y-6">
              <WishlistManager />
              <QueuePrepPlanner
                plans={queuePrep.plans}
                loading={queuePrep.loading}
                error={queuePrep.error}
                addQueuePrepPlan={queuePrep.addQueuePrepPlan}
                updateQueuePrepStatus={queuePrep.updateQueuePrepStatus}
                removeQueuePrepPlan={queuePrep.removeQueuePrepPlan}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
