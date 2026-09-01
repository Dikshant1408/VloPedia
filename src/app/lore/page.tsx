"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal, StaggerContainer } from "@/components/motion-system";
import { CanonBadge, type CanonStatus } from "@/components/canon-evidence-card";
import loreData from "@/data/lore-database.json";
import { ArrowRight, BookOpen, Clock, Layers, ShieldCheck, Users, Sparkles, Filter } from "lucide-react";

export default function LoreHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedCanon, setSelectedCanon] = useState<string>("ALL");

  const categories = ["ALL", "TIMELINE", "EVENT", "FACTION", "DIMENSION", "SUBSTANCE", "AGENT_LORE"];

  const filteredArticles = loreData.articles.filter(article => {
    const matchCat = selectedCategory === "ALL" || article.category === selectedCategory;
    const matchCanon = selectedCanon === "ALL" || article.canonStatus === selectedCanon;
    return matchCat && matchCanon;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-12">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">
                  VLOPEDIA NARRATIVE ARCHIVES // CANON EVIDENCE ENGINE
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted border border-[rgba(236,232,225,0.1)] px-2.5 py-1">
                Data Freshness: Editorial Verified (Patch 9.04)
              </span>
            </div>

            <h1 className="font-display font-black text-5xl uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
              VALORANT <span className="text-[#0DF2F2]">Lore & Factions</span>
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-secondary">
              The verified historical timeline, faction secrets, interdimensional conflict between Alpha and Omega Earths, and deep-cover agent dossiers with full canon evidence verification.
            </p>

            {/* Quick Link Highlights */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link href="/lore/timeline" className="font-mono text-xs font-bold uppercase px-3 py-1.5 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                Chronological Timeline →
              </Link>
              <Link href="/lore/kingdom" className="font-mono text-xs uppercase px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white transition-colors">
                Kingdom Corp
              </Link>
              <Link href="/lore/omega-earth" className="font-mono text-xs uppercase px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white transition-colors">
                Omega Earth & Legion
              </Link>
              <Link href="/lore/hourglass" className="font-mono text-xs uppercase px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white transition-colors">
                Scions of the Hourglass
              </Link>
              <Link href="/lore/omen" className="font-mono text-xs uppercase px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white transition-colors">
                Omen&apos;s Identity Dossier
              </Link>
            </div>
          </Container>
        </div>

        <Container className="py-16 space-y-16">

          {/* ═══════════════════════════════════════════
              1. THE CHRONOLOGICAL ERAS
          ═══════════════════════════════════════════ */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
              <h2 className="font-display font-black text-2xl uppercase tracking-wide text-white">
                Historical Eras
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loreData.eras.map((era, i) => (
                <div key={era.id} className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal-sm relative flex flex-col justify-between group hover:border-[#0DF2F2]/40 transition-colors">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#0DF2F2] font-bold">
                      {era.years}
                    </span>
                    <h3 className="font-display font-black text-lg uppercase text-white group-hover:text-[#0DF2F2] transition-colors">
                      {era.name}
                    </h3>
                    <p className="font-sans text-xs leading-relaxed text-muted">
                      {era.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[rgba(236,232,225,0.06)] flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>Phase 0{i + 1}</span>
                    <span className="text-[#0DF2F2]">ARCHIVED</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              2. EVIDENCE-BASED ARTICLE ARCHIVES
          ═══════════════════════════════════════════ */}
          <section className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#0DF2F2]" aria-hidden="true" />
                <h2 className="font-display font-black text-2xl uppercase tracking-wide text-white">
                  Lore Files & Dossiers ({filteredArticles.length})
                </h2>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <Filter className="h-3.5 w-3.5 text-muted" />
                  <span className="font-mono text-[10px] uppercase text-muted">Category:</span>
                </div>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-black font-bold"
                        : "border border-[rgba(236,232,225,0.1)] text-muted hover:text-white"
                    }`}
                  >
                    {cat.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map(article => (
                <Link
                  key={article.slug}
                  href={`/lore/${article.slug}`}
                  className="group border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal flex flex-col justify-between hover:border-primary/50 hover:bg-[#0D1A22]/90 transition-all shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#0DF2F2]">
                        {article.category.replace("_", " ")}
                      </span>
                      <CanonBadge status={article.canonStatus as CanonStatus} />
                    </div>

                    <h3 className="font-display font-black text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="font-sans text-xs leading-relaxed text-secondary line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[rgba(236,232,225,0.06)] flex items-center justify-between text-xs font-mono">
                    <span className="text-muted flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                    <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Dossier <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </Container>
      </div>
    </PageTransition>
  );
}
