"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Heart } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { PageTransition, Reveal, StaggerContainer } from "@/components/motion-system";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import type { ValorantBundle } from "@/lib/valorant-types";

export default function StorePage() {
  const { user, signInWithDiscord } = useAuth();
  const { addWishlistItem, items } = useUserWishlist();
  const [bundles, setBundles] = useState<ValorantBundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/bundles")
      .then(r => r.json())
      .then(j => { setBundles((j.data ?? []).slice(0, 8)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const wishlist = async (name: string) => {
    if (!user) {
      toast.info("Sign in to save items", { action: { label: "Sign In", onClick: signInWithDiscord }, className: "font-mono rounded-none" });
      return;
    }
    if (items.some(w => w.title === name)) { toast.info(`"${name}" already wishlisted`, { className: "font-mono rounded-none" }); return; }
    try {
      await addWishlistItem({ title: name, category: "bundle" });
      toast.success(`Added "${name}" to wishlist`, { className: "font-mono rounded-none border-primary/40" });
    } catch { toast.error("Could not add to wishlist", { className: "font-mono rounded-none" }); }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">STORE</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">STORE</h1>
            {/* Disclaimer — Req 19.3 */}
            <div className="mt-6 flex items-start gap-3 border border-warning/30 bg-warning/5 p-4 max-w-2xl">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <p className="font-sans text-xs leading-relaxed text-secondary">
                ValoVault cannot access your personal in-game store rotation. Items shown are based on recently available bundles from the VALORANT API.
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-12">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)]" style={{ aspectRatio: "3/4" }} />
              ))}
            </div>
          ) : (
            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {bundles.map(b => {
                const img = b.verticalPromoImage ?? b.displayIcon2 ?? b.displayIcon;
                return (
                  <Reveal key={b.uuid}>
                    <div className="group relative border border-border bg-[#0D1A22] transition-all duration-300 hover:border-primary/50">
                      <Link href={`/bundles/${b.uuid}`}>
                        <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "3/4" }}>
                          {img && <Image src={img} alt={b.displayName} fill sizes="(max-width:768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" unoptimized />}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="font-display text-lg uppercase tracking-wide text-white">{b.displayName}</p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between p-4">
                        <Link href={`/bundles/${b.uuid}`} className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary hover:text-white transition-colors">
                          View Bundle →
                        </Link>
                        <button type="button" onClick={() => wishlist(b.displayName)}
                          aria-label={`Wishlist ${b.displayName}`}
                          className="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                          <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </StaggerContainer>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
