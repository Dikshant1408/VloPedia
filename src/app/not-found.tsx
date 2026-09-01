"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Compass, ArrowRight, ShieldAlert, BookOpen, Layers } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";

const SUGGESTED_ROUTES = [
  { name: "Jett Dossier", href: "/agents/jett", category: "Agent" },
  { name: "Omen Dossier", href: "/agents/omen", category: "Agent" },
  { name: "Vandal Guide", href: "/weapons/vandal", category: "Weapon" },
  { name: "Vandal vs. Phantom", href: "/compare/weapons/vandal-vs-phantom", category: "Compare" },
  { name: "Ascent Map Guide", href: "/maps/ascent", category: "Map" },
  { name: "Comp Builder", href: "/comp-builder", category: "Tool" },
  { name: "Sensitivity Converter", href: "/sensitivity", category: "Tool" },
  { name: "First Light Lore", href: "/lore/first-light", category: "Lore" },
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground flex flex-col justify-center py-20">
        <Container className="max-w-3xl text-center space-y-8">
          
          {/* Tactical 404 Badge */}
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-primary font-mono text-xs uppercase tracking-widest">
            <ShieldAlert className="h-4 w-4" />
            <span>404 // CLASSIFIED INTEL NOT FOUND</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl uppercase text-white tracking-tight">
            TACTICAL SIGNAL LOST
          </h1>

          <p className="font-sans text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            The requested protocol document or tactical route does not exist or has been relocated by Kingdom Corp security.
          </p>

          {/* Quick Search Box */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Agents, Weapons, Lore, Tools..."
                className="w-full bg-[#0D1820] border border-[rgba(236,232,225,0.15)] pl-10 pr-4 py-2.5 font-sans text-xs text-white placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-primary text-black font-mono text-xs uppercase font-bold hover:bg-primary-hover transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Suggested Destinations */}
          <div className="pt-8 border-t border-[rgba(236,232,225,0.08)] space-y-4 text-left">
            <h3 className="font-mono text-xs uppercase text-muted tracking-wider text-center">
              Were you looking for one of these intelligence hubs?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SUGGESTED_ROUTES.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="border border-[rgba(236,232,225,0.08)] bg-[#0D1820] p-3 text-left hover:border-primary/40 transition-colors group block"
                >
                  <span className="font-mono text-[9px] uppercase text-primary block">
                    {item.category}
                  </span>
                  <span className="font-sans text-xs font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-primary hover:text-primary-hover font-bold"
            >
              <Compass className="h-4 w-4" />
              <span>Return to VloPedia Command Center →</span>
            </Link>
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
