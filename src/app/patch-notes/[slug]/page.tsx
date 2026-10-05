import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

export async function generateStaticParams() {
  return valorantDb.patches.map((p) => ({
    slug: p.slug
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

const KNOWN_AGENTS = new Set([
  "brimstone", "viper", "omen", "killjoy", "cypher", "sova", "sage", "phoenix",
  "jett", "reyna", "raze", "breach", "skye", "yoru", "astra", "kay/o", "kay-o",
  "chamber", "neon", "fade", "harbor", "gekko", "deadlock", "iso", "clove", "vyse", "tejo", "veto", "waylay"
]);

const KNOWN_MAPS = new Set([
  "ascent", "bind", "breeze", "fracture", "haven", "icebox", "lotus", "pearl",
  "split", "sunset", "abyss", "corrode", "summit", "drift", "district", "kasbah", "piazza", "glitch"
]);

const KNOWN_WEAPONS = new Set([
  "classic", "shorty", "frenzy", "ghost", "sheriff",
  "stinger", "spectre", "bucky", "judge", "bulldog",
  "guardian", "phantom", "vandal", "marshal", "outlaw",
  "operator", "ares", "odin", "warden", "bandit", "melee"
]);

function getSubjectMeta(subject: string): { href: string | null; isLink: boolean } {
  const s = subject.toLowerCase().trim();

  // Maps (e.g. "Summit Map", "Corrode Map", "Lotus C Site")
  if (s.endsWith(" map") || s.includes(" site")) {
    const mapName = s.replace(/ map$/, "").replace(/ [abc] site$/, "").trim().toLowerCase();
    const mapSlug = mapName.replace(/[^a-z0-9]+/g, "-");
    if (KNOWN_MAPS.has(mapSlug)) {
      return { href: `/maps/${mapSlug}`, isLink: true };
    }
    return { href: "/maps", isLink: true };
  }

  // Weapons (e.g. "Bandit Weapon", "Outlaw Sniper", "Ares LMG", "Spectre SMG")
  if (s.endsWith(" weapon") || s.endsWith(" sniper") || s.endsWith(" lmg") || s.endsWith(" smg") || s.endsWith(" sidearm")) {
    const weaponName = s.replace(/ (weapon|sniper|lmg|smg|sidearm)$/, "").trim().toLowerCase();
    const weaponSlug = weaponName.replace(/[^a-z0-9]+/g, "-");
    if (KNOWN_WEAPONS.has(weaponSlug)) {
      return { href: `/weapons/${weaponSlug}`, isLink: true };
    }
    return { href: "/weapons", isLink: true };
  }

  // Agents or Agent Abilities (e.g. "Reyna Devour", "Iso Double Tap", "Neon Agent", "Phoenix Run It Back")
  const firstWord = s.split(" ")[0].replace(/[^a-z0-9]/g, "");
  if (KNOWN_AGENTS.has(firstWord)) {
    return { href: `/agents/${firstWord}`, isLink: true };
  }

  if (s.startsWith("kay/o") || s.startsWith("kay-o")) {
    return { href: "/agents/kay-o", isLink: true };
  }

  // Non-linked subjects (e.g. "Retakes Mode", "Sentinels", "Initiators", "Weapon Prices", "Signature Abilities")
  return { href: null, isLink: false };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const patch = valorantDb.patches.find((p) => p.slug === slug);
  if (!patch) return { title: "Patch Notes Not Found | VloPedia" };
  return {
    title: `VALORANT Patch ${patch.version} Notes & Balance Changes | VloPedia`,
    description: `VALORANT Patch ${patch.version} notes (${patch.date}). Tactical overview of buffs: ${patch.buffs.map(b=>b.subject).join(", ") || "None"}.`,
    openGraph: { type:"website", title:`Patch ${patch.version} | VloPedia`, description:`Balance changes for ${patch.version}.` },
    alternates: {
      canonical: `/patch-notes/${slug}`,
    },
  };
}

export default async function PatchNotesDetailPage({ params }: Props) {
  const { slug } = await params;
  const patch = valorantDb.patches.find((p) => p.slug === slug);
  if (!patch) notFound();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background pt-16 pb-10">
          <Container>
            <Link href="/patch-notes" className="inline-flex items-center gap-2 font-mono-tactical text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors mb-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All Patch Notes
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Deployed {patch.date}</span>
                </div>
                <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">Patch {patch.version}</h1>
              </div>
              {patch.url && (
                <a
                  href={patch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-primary bg-primary/10 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-primary transition-all duration-300 hover:bg-primary hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary self-start sm:self-center"
                >
                  Official Patch Notes
                </a>
              )}
            </div>
          </Container>
        </div>

        <Container className="py-16 space-y-6 max-w-3xl">
          {/* Buffs */}
          {patch.buffs.length > 0 && (
            <Reveal>
              <div className="border border-success/25 bg-success/5 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-success/20 pb-3">
                  <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
                  <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-success">Buffs</h2>
                </div>
                <div className="space-y-3">
                  {patch.buffs.map((buff) => {
                    const meta = getSubjectMeta(buff.subject);
                    return (
                      <div key={buff.subject} className="border border-border bg-background/50 p-4">
                        {meta.isLink && meta.href ? (
                          <Link
                            href={meta.href}
                            className="font-mono-tactical text-[11px] font-black uppercase tracking-wider text-success hover:text-white transition-colors"
                          >
                            {buff.subject}
                          </Link>
                        ) : (
                          <span className="font-mono-tactical text-[11px] font-black uppercase tracking-wider text-success">
                            {buff.subject}
                          </span>
                        )}
                        <p className="mt-1 font-sans text-xs leading-relaxed text-muted">{buff.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          )}

          {/* Nerfs */}
          {patch.nerfs.length > 0 && (
            <Reveal>
              <div className="border border-error/25 bg-error/5 p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-error/20 pb-3">
                  <TrendingDown className="h-4 w-4 text-error" aria-hidden="true" />
                  <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-error">Nerfs</h2>
                </div>
                <div className="space-y-3">
                  {patch.nerfs.map((nerf) => {
                    const meta = getSubjectMeta(nerf.subject);
                    return (
                      <div key={nerf.subject} className="border border-border bg-background/50 p-4">
                        {meta.isLink && meta.href ? (
                          <Link
                            href={meta.href}
                            className="font-mono-tactical text-[11px] font-black uppercase tracking-wider text-error hover:text-white transition-colors"
                          >
                            {nerf.subject}
                          </Link>
                        ) : (
                          <span className="font-mono-tactical text-[11px] font-black uppercase tracking-wider text-error">
                            {nerf.subject}
                          </span>
                        )}
                        <p className="mt-1 font-sans text-xs leading-relaxed text-muted">{nerf.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          )}

          {/* General updates */}
          {patch.updates?.length > 0 && (
            <Reveal>
              <div className="border border-border bg-surface-card p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <RefreshCw className="h-4 w-4 text-muted" aria-hidden="true" />
                  <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-muted">General Updates</h2>
                </div>
                <ul className="space-y-2">
                  {patch.updates.map((u, i) => (
                    <li key={i} className="flex gap-2 font-sans text-xs leading-relaxed text-muted">
                      <span className="font-mono-tactical text-[10px] font-bold text-primary shrink-0">{"/ /"}</span>
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
