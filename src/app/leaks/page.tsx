import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

const CATEGORY_COLOR: Record<string, string> = {
  Agent:    "border-role-duelist/40 bg-role-duelist/10 text-role-duelist",
  Skin:     "border-tier-premium/40 bg-tier-premium/10 text-tier-premium",
  Map:      "border-role-initiator/40 bg-role-initiator/10 text-role-initiator",
  Gamemode: "border-role-controller/40 bg-role-controller/10 text-role-controller",
};

export default function LeaksPage() {
  const leaks = valorantDb.leaks;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">CLASSIFIED</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">LEAKS</h1>

            {/* Disclaimer */}
            <div className="mt-6 flex items-start gap-3 border border-warning/30 bg-warning/5 p-4 max-w-2xl">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <p className="font-sans text-xs leading-relaxed text-secondary">
                Leaked content is unofficial and subject to change or cancellation. ValoVault does not confirm the accuracy of data-mined material.
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {leaks.map((leak, i) => {
              const catColor = CATEGORY_COLOR[leak.category] ?? "border-border text-muted bg-surface";
              return (
                <Reveal key={leak.slug} delay={i * 0.04}>
                  <Link href={`/leaks/${leak.slug}`}
                    className="group block border border-border bg-[#0D1A22] p-6 transition-all duration-300 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className={`border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider ${catColor}`}>
                        {leak.category}
                      </span>
                      <span className="font-mono text-[9px] text-muted uppercase tracking-wider">
                        {leak.credibility} credibility
                      </span>
                    </div>
                    <h2 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors">
                      {leak.codename}
                    </h2>
                    <p className="mt-2 font-sans text-xs leading-relaxed text-muted line-clamp-2">{leak.details}</p>
                    <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read more <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
