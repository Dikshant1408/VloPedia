import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { valorantDb } from "@/lib/valorant-db";

export default function PatchNotesPage() {
  const patches = valorantDb.patches;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">PATCH LOGS</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">PATCH NOTES</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Balance changes, buffs, nerfs, and deployment notes by version. Official logs sourced directly from the{" "}
              <a
                href="https://playvalorant.com/en-us/news/game-updates/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0DF2F2] hover:underline"
              >
                Official VALORANT Game Updates
              </a>.
            </p>
          </Container>
        </div>

        <Container className="py-12 space-y-4">
          {patches.map((patch, i) => (
            <Reveal key={patch.slug} delay={i * 0.03}>
              <Link href={`/patch-notes/${patch.slug}`}
                className={[
                  "group block border bg-[#0D1A22] p-6 transition-all duration-300 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                  i === 0 ? "border-primary/40" : "border-border",
                ].join(" ")}
              >
                {/* Latest badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-3xl uppercase text-white group-hover:text-primary transition-colors">
                      Patch {patch.version}
                    </span>
                    {i === 0 && (
                      <span className="bg-primary px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-black">
                        LATEST
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-muted shrink-0">{patch.date}</span>
                </div>

                {/* Buff/nerf preview */}
                <div className="flex flex-wrap gap-4">
                  {patch.buffs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
                      <span className="font-mono text-[10px] text-success font-bold">
                        {patch.buffs.map(b => b.subject).join(" · ")}
                      </span>
                    </div>
                  )}
                  {patch.nerfs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-3.5 w-3.5 text-error shrink-0" aria-hidden="true" />
                      <span className="font-mono text-[10px] text-error font-bold">
                        {patch.nerfs.map(n => n.subject).join(" · ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read patch notes →
                </div>
              </Link>
            </Reveal>
          ))}
        </Container>
      </div>
    </PageTransition>
  );
}
