"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthActions } from "@/components/auth-actions";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { MegaMenu, NAV_GROUPS } from "@/components/mega-menu";
import { GlobalSearchDialog } from "@/components/global-search-dialog";
import { BookmarksDrawer } from "@/components/bookmarks-drawer";
import { Menu, X, Search, ChevronDown, Volume2, VolumeX } from "lucide-react";

import { useSound } from "@/components/sound-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatPatchVersion } from "@/lib/utils";
import { TacticalStatus } from "@/components/tactical-status";

interface SiteHeaderProps {
  version?: string | null;
}

const PRIMARY_LINKS = [
  { label: "Agents",  href: "/agents"  },
  { label: "Weapons", href: "/weapons" },
  { label: "Maps",    href: "/maps"    },
  { label: "Skins",   href: "/skins"   },
  { label: "Tools",   href: "/tools"   },
  { label: "Guides",  href: "/guides"  },
];

export function SiteHeader({ version }: SiteHeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [cachedVer, setCachedVer] = useState<string | null>(null);
  const { isMuted, toggleMute } = useSound();
  const sfxEnabled = !isMuted;

  useEffect(() => {
    if (version) {
      localStorage.setItem("valovault_version", version);
      setCachedVer(version);
    } else {
      setCachedVer(localStorage.getItem("valovault_version"));
    }
  }, [version]);

  const displayVer = version ?? cachedVer;
  const patchVersion = formatPatchVersion(displayVer);

  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [drawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const triggerSearch = () => {
    const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
    window.dispatchEvent(e);
  };

  return (
    <>
      <GlobalSearchDialog />
      <header className="sticky top-0 z-50 border-b border-border bg-[#080F14]/95 backdrop-blur-xl shadow-md">
        {/* Route progress bar */}
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>

        {/* ── Main Command Bar (Height: 64px physical object) ── */}
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-3 sm:px-6 lg:px-8">
          
          {/* ── Left: Brand Identity ── */}
          <div className="flex items-center gap-6 xl:gap-8">
            <Link
              href="/"
              className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shrink-0"
              aria-label="VloPedia Homepage"
            >
              {/* Tactical Diamond Icon */}
              <div className="relative h-7 w-7 bg-primary flex items-center justify-center rotate-45 shrink-0 transition-transform group-hover:scale-105">
                <span className="font-display font-black text-sm text-[#080F14] -rotate-45">V</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-lg tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">
                  VloPedia
                </span>
                <span className="font-mono text-[8px] text-cyan tracking-[0.2em] uppercase mt-0.5 opacity-80">
                  Intel Terminal
                </span>
              </div>
            </Link>

            {/* ── Center: Primary Navigation (Quiet, Authorial, Precise) ── */}
            <nav
              role="navigation"
              aria-label="Main navigation"
              className="hidden lg:flex items-center gap-1 xl:gap-1.5"
            >
              {PRIMARY_LINKS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "nav-active-signal font-extrabold"
                        : "text-secondary hover:text-foreground hover:bg-white/[0.03]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Mega-menu trigger */}
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                onMouseEnter={() => setMegaOpen(true)}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                aria-label="All hubs and sections"
                className={`flex items-center gap-1 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  megaOpen
                    ? "text-primary"
                    : "text-secondary hover:text-foreground hover:bg-white/[0.03]"
                }`}
              >
                More
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-200 ${
                    megaOpen ? "rotate-180 text-primary" : "text-muted"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </nav>
          </div>

          {/* ── Right: Search + Bookmarks + Auth + Mobile ── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Ask the Database Search Box Trigger */}
            <button
              type="button"
              onClick={triggerSearch}
              aria-label="Search database"
              title="Search VloPedia (Ctrl+K)"
              className="group hidden sm:flex items-center justify-between h-9 w-[190px] md:w-[220px] xl:w-[260px] border border-border/80 bg-surface/80 px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-primary/50 hover:bg-surface-elevated hover:text-foreground cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="h-3.5 w-3.5 text-muted group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
                <span className="truncate text-[11px] text-muted group-hover:text-secondary">Search VloPedia...</span>
              </div>
              <kbd className="hidden md:inline-flex items-center rounded-none border border-border/60 bg-background/80 px-1 py-0.5 font-mono text-[9px] text-muted shrink-0">
                Ctrl K
              </kbd>
            </button>

            {/* Mobile search icon only */}
            <button
              type="button"
              onClick={triggerSearch}
              aria-label="Search database"
              className="sm:hidden flex h-9 w-9 items-center justify-center border border-border bg-surface text-muted hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Saved Bookmarks */}
            <BookmarksDrawer />

            {/* User Auth */}
            <div className="border-l border-border/70 pl-2 sm:pl-3">
              <AuthActions />
            </div>

            {/* Mobile Hamburger Menu */}
            <Button
              variant="secondary"
              size="sm"
              className="lg:hidden h-9 w-9 p-0 border-border bg-surface/80"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* ── System Line (Diagnostic Sub-Bar & Utility Area) ── */}
        <div className="border-t border-border/50 bg-[#060B0F]/90 px-3 sm:px-6 lg:px-8 py-1 hidden md:flex items-center justify-between font-mono text-[9px] text-muted tracking-wider select-none">
          <div className="flex items-center gap-3">
            <span className="text-cyan font-bold tracking-widest flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan/80" />
              VLOPEDIA // KNOWLEDGE ENGINE
            </span>
            <span className="text-border">|</span>
            <span className="text-muted/80">PROVENANCE: RIOT CLIENT API TELEMETRY</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Patch & Database sync */}
            <div className="flex items-center gap-2">
              <span className="text-foreground/90 font-bold">PATCH {patchVersion}</span>
              <span className="text-border">·</span>
              <TacticalStatus status="SYNCED" size="sm" className="!py-0 !px-1.5" />
            </div>

            <span className="text-border">|</span>

            {/* Tactical Audio SFX Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              title={sfxEnabled ? "Tactical Audio: Active" : "Tactical Audio: Muted"}
              className="flex items-center gap-1 text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {sfxEnabled ? <Volume2 className="h-3 w-3 text-primary" /> : <VolumeX className="h-3 w-3" />}
              <span>{sfxEnabled ? "SFX: ON" : "SFX: OFF"}</span>
            </button>

            <span className="text-border">|</span>

            {/* Tactical Theme Toggle */}
            <ThemeToggle className="!border-0 !bg-transparent !p-0 hover:!text-primary" />
          </div>
        </div>

        {/* Mega-menu dropdown panel */}
        <div onMouseLeave={() => setMegaOpen(false)} className="relative">
          <MegaMenu isOpen={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>
      </header>

      {/* ── Mobile Drawer (Right-to-Left, Fast 180ms, Staggered Modules) ── */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tactical Navigation"
          className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-md h-full flex flex-col bg-[#080F14] border-l border-border shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Subtle background grid */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-tactical-grid opacity-15" />

            {/* Drawer header */}
            <div className="relative z-10 flex items-center justify-between border-b border-border px-5 py-4 bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-primary flex items-center justify-center rotate-45 shrink-0">
                  <span className="font-display font-black text-xs text-[#080F14] -rotate-45">V</span>
                </div>
                <div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-cyan">INDEX BRIEFING</span>
                  <p className="font-display font-black text-lg uppercase text-foreground leading-none mt-0.5">VloPedia</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Close
              </button>
            </div>

            {/* System Status & Mobile Tactical Controls */}
            <div className="relative z-10 flex items-center justify-between border-b border-border px-5 py-2.5 bg-[#060B0F]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-muted">PATCH {patchVersion}</span>
                <TacticalStatus status="SYNCED" size="sm" className="!py-0 !px-1 text-[8px]" />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex items-center gap-1 font-mono text-[9px] text-muted hover:text-foreground"
                >
                  {sfxEnabled ? <Volume2 className="h-3 w-3 text-primary" /> : <VolumeX className="h-3 w-3" />}
                  <span>{sfxEnabled ? "SFX" : "MUTED"}</span>
                </button>
                <ThemeToggle className="!border-0 !bg-transparent !p-0" />
              </div>
            </div>

            {/* Drawer Groups (Staggered Intelligence Modules) */}
            <div className="relative z-10 flex-1 px-5 py-6 space-y-8">
              {NAV_GROUPS.map((group, groupIdx) => (
                <div key={group.title} className="space-y-3">
                  <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <span className="text-muted/60">{`0${groupIdx + 1} //`}</span>
                    {group.title}
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className="group flex flex-col justify-between border border-border bg-surface/50 p-3 clip-diagonal-sm transition-all hover:border-primary/50 hover:bg-surface-elevated"
                      >
                        <span className="font-sans text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <span className="mt-1 font-mono text-[9px] text-muted leading-tight line-clamp-2">
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer footer */}
            <div className="relative z-10 border-t border-border px-5 py-3 font-mono text-[9px] text-muted bg-[#060B0F] flex items-center justify-between">
              <span>© {new Date().getFullYear()} VLOPEDIA</span>
              <span className="text-cyan text-[8px]">RIOT PROTOCOL COMPLIANT</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
