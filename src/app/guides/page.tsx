"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { guidesDb } from "@/lib/guides-db";
import { Search, BookOpen, Clock, ArrowRight, Compass } from "lucide-react";

const CATEGORIES = ["All", "Beginner", "Economy", "Map", "Aim & Settings"] as const;

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredGuides = guidesDb.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(search.toLowerCase()) || 
                          guide.summary.toLowerCase().includes(search.toLowerCase()) ||
                          guide.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || guide.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Tactical grid background */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />

        <div className="relative z-10">
          {/* Header */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
            <Container>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">TACTICAL INTEL</span>
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tighter text-white sm:text-6xl lg:text-7xl flex items-center gap-4">
                TACTICAL GUIDES
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse hidden sm:block" aria-hidden="true" />
              </h1>
              <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-secondary">
                Improve your competitive performance. Explore expert game strategies, credit management guides, aim warm-up routines, and map executes designed by top-tier players.
              </p>
            </Container>
          </div>

          <Container className="py-12 space-y-8">
            {/* Search and Filters panel */}
            <Reveal>
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22]/90 backdrop-blur-md p-6 cut-corner-br flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search field */}
                <div className="relative w-full md:max-w-md">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search strategy guides..."
                    className="w-full bg-black/40 border border-border hover:border-border-light focus:border-primary pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end" role="group" aria-label="Filter by category">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={activeCategory === category}
                      className={`border px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                        activeCategory === category 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-border text-muted hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

              </div>
            </Reveal>

            {/* Guides Bento Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {filteredGuides.length > 0 ? (
                filteredGuides.map((guide, idx) => (
                  <Reveal key={guide.slug} delay={idx * 0.05}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="group flex flex-col justify-between border border-border bg-[#0D1A22] p-6 hover:border-primary/50 transition-all duration-300 relative cut-corner-br h-full"
                    >
                      {/* Top banner */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[9px] text-primary tracking-wider uppercase">
                            {guide.category}
                          </span>
                          <span className="font-mono text-[9px] text-muted uppercase">
                            {guide.publishedAt}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors line-clamp-2 mb-3">
                          {guide.title}
                        </h2>

                        {/* Summary */}
                        <p className="font-sans text-xs leading-relaxed text-muted line-clamp-3 mb-6">
                          {guide.summary}
                        </p>
                      </div>

                      {/* Bottom action panel */}
                      <div className="border-t border-[rgba(236,232,225,0.06)] pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[10px] font-mono text-muted uppercase">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-primary" /> {guide.author.split(" ")[1] || "Staff"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary" /> {guide.readTime}
                          </span>
                        </div>

                        <span className="font-mono text-[10px] font-black uppercase text-primary group-hover:text-white transition-colors flex items-center gap-1">
                          READ INTEL <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))
              ) : (
                <div className="sm:col-span-2 border border-dashed border-border p-12 text-center space-y-4">
                  <Compass className="h-8 w-8 text-muted mx-auto animate-pulse" />
                  <p className="font-mono text-xs text-muted uppercase tracking-wider">
                    No tactical intel fits the specified query filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearch(""); setActiveCategory("All"); }}
                    className="border border-border bg-[rgba(15,28,36,0.8)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:border-primary transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    </PageTransition>
  );
}
