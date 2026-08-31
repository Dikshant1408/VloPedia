"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthActions } from "@/components/auth-actions";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { MegaMenu, NAV_GROUPS } from "@/components/mega-menu";
import { Menu, X, Search, ChevronDown, Radio } from "lucide-react";

interface SiteHeaderProps {
  version?: string | null;
}

const PRIMARY_LINKS = [
  { label: "Agents",  href: "/agents"  },
  { label: "Weapons", href: "/weapons" },
  { label: "Maps",    href: "/maps"    },
  { label: "Skins",   href: "/skins"   },
  { label: "Search",  href: "/search"  },
];

export function SiteHeader({ version }: SiteHeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [megaOpen,   setMegaOpen]     = useState(false);
  const [cachedVer,  setCachedVer]    = useState<string | null>(null);

  useEffect(() => {
    if (version) {
      localStorage.setItem("valovault_version", version);
      setCachedVer(version);
    } else {
      setCachedVer(localStorage.getItem("valovault_version"));
    }
  }, [version]);

  const displayVer = version ?? cachedVer;

  useEffect(() => { setMegaOpen(false); setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [drawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[rgba(236,232,225,0.10)] bg-[#0B141A]/92 backdrop-blur-xl">
        {/* Route progress bar */}
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>

        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link href="/" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
            {/* Diamond V icon */}
            <div className="relative h-8 w-8 bg-primary flex items-center justify-center rotate-45 shrink-0 transition-transform group-hover:scale-110">
              <span className="font-display font-black text-base text-[#0B141A] -rotate-45">V</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors uppercase">
                ValoVault
              </span>
              <span className="font-mono text-[9px] text-[#0DF2F2] tracking-[0.2em] opacity-70 uppercase mt-0.5">
                Tactical Encyclopedia
              </span>
            </div>
          </Link>

          {/* ── Primary nav — desktop ── */}
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden items-center md:flex h-[36px] min-h-[36px] border border-[rgba(236,232,225,0.08)] bg-[rgba(11,20,26,0.6)] backdrop-blur-sm px-1 py-0.5"
          >
            {PRIMARY_LINKS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "border-r border-[rgba(236,232,225,0.06)] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all last:border-0",
                  pathname === item.href
                    ? "text-primary text-glow-red bg-primary/5"
                    : "text-muted hover:bg-primary/5 hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}

            {/* Mega-menu trigger */}
            <button
              type="button"
              onClick={() => setMegaOpen(v => !v)}
              onMouseEnter={() => setMegaOpen(true)}
              aria-expanded={megaOpen}
              aria-haspopup="true"
              aria-label="More sections"
              className="flex items-center gap-1 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-muted transition-all hover:bg-primary/5 hover:text-foreground"
            >
              More
              <ChevronDown className={["h-3 w-3 transition-transform duration-200", megaOpen ? "rotate-180" : ""].join(" ")} aria-hidden="true" />
            </button>
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            {/* Version badge */}
            {displayVer && (
              <div className="hidden lg:flex flex-col items-end font-mono leading-tight">
                <span className="text-[#0DF2F2] text-[10px] font-bold tracking-wider">
                  CORE: {displayVer.split("-")[0]}
                </span>
                <span className="text-muted text-[9px] flex items-center gap-1">
                  <Radio className="h-2.5 w-2.5 animate-pulse text-[#0DF2F2]" aria-hidden="true" />
                  ONLINE
                </span>
              </div>
            )}

            {/* Search */}
            <Link
              href="/search"
              aria-label="Search ValoVault"
              className="flex items-center gap-1.5 border border-[rgba(236,232,225,0.1)] px-2 py-2 sm:px-3 sm:py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded-none border border-[rgba(236,232,225,0.1)] bg-surface px-1 py-0.5 font-mono text-[9px] lg:inline">⌘K</kbd>
            </Link>

            {/* Auth */}
            <div className="border-l border-[rgba(236,232,225,0.1)] pl-3">
              <AuthActions />
            </div>

            {/* Mobile hamburger */}
            <Button
              variant="secondary"
              size="sm"
              className="md:hidden border-[rgba(236,232,225,0.1)] bg-[rgba(11,20,26,0.6)]"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Mega-menu */}
        <div onMouseLeave={() => setMegaOpen(false)} className="relative">
          <MegaMenu isOpen={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All sections"
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#0B141A]/98 backdrop-blur-xl"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-tactical-grid opacity-20" />

          {/* Drawer header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[rgba(236,232,225,0.1)] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 bg-primary flex items-center justify-center rotate-45 shrink-0">
                <span className="font-display font-black text-sm text-[#0B141A] -rotate-45">V</span>
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#0DF2F2]">All Sections</span>
                <p className="font-display font-black text-xl uppercase text-foreground leading-none mt-0.5">ValoVault</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
              className="flex items-center gap-2 border border-[rgba(236,232,225,0.1)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" /> Close
            </button>
          </div>

          {/* Drawer groups */}
          <div className="relative z-10 flex-1 px-6 py-8 space-y-10">
            {NAV_GROUPS.map(group => (
              <div key={group.title}>
                <h2 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                  {`// ${group.title}`}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {group.items.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className="group flex flex-col justify-between border border-[rgba(236,232,225,0.08)] bg-[rgba(11,20,26,0.6)] p-4 clip-diagonal-sm transition-all hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span className="font-display text-sm font-black uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <span className="mt-2 font-mono text-[10px] leading-relaxed text-muted">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Drawer footer */}
          <div className="relative z-10 border-t border-[rgba(236,232,225,0.1)] px-6 py-4 font-mono text-[10px] text-muted">
            © {new Date().getFullYear()} ValoVault · Not affiliated with Riot Games
          </div>
        </div>
      )}
    </>
  );
}
