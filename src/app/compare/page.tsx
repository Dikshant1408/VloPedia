import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { ArrowRight, GitCompare, Swords, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "VALORANT Comparisons — Weapons & Agents Head-to-Head | VloPedia",
  description: "Compare VALORANT weapons and agents head-to-head. Side-by-side spec differences, damage comparisons, pro pick rates, and meta analysis.",
  alternates: {
    canonical: "/compare",
  },
};

const WEAPON_COMPARISONS = [
  { slug: "vandal-vs-phantom", title: "Vandal vs. Phantom", desc: "The definitive rifle duel: One-tap range vs. fire rate, bullet tracers, and recoil reset." },
  { slug: "operator-vs-outlaw", title: "Operator vs. Outlaw", desc: "4,700 VP sniper vs. 2,400 VP double-barrel sniper through half-shields." },
  { slug: "spectre-vs-stinger", title: "Spectre vs. Stinger", desc: "Run-and-gun SMG fire rates, burst mechanics, and eco round buy values." },
  { slug: "sheriff-vs-ghost", title: "Sheriff vs. Ghost", desc: "Eco one-taps vs. high-capacity silenced pistol accuracy." },
  { slug: "ares-vs-odin", title: "Ares vs. Odin", desc: "Wall-bang suppression weapons, spin-up times, and Ascent B main spam." },
  { slug: "bulldog-vs-guardian", title: "Bulldog vs. Guardian", desc: "Burst-fire budget rifle vs. high-precision DMR single-taps." },
];

const AGENT_COMPARISONS = [
  { slug: "jett-vs-raze", title: "Jett vs. Raze", desc: "Operator dash entry vs. explosive satchel space creation and AOE damage." },
  { slug: "omen-vs-clove", title: "Omen vs. Clove", desc: "Tactical team controller vs. aggressive combat controller with self-revive." },
  { slug: "sova-vs-fade", title: "Sova vs. Fade", desc: "Long-range bounce recon dart lineups vs. close-range haunt and tether debuffs." },
  { slug: "cypher-vs-killjoy", title: "Cypher vs. Killjoy", desc: "Global map trapwire intel vs. site lockdown and automated turrets." },
  { slug: "viper-vs-harbor", title: "Viper vs. Harbor", desc: "Toxic screen decay stall vs. flexible water wave sightline blocks." },
  { slug: "breach-vs-kayo", title: "Breach vs. KAY/O", desc: "Concussive wall tremor initiator vs. ability suppression knife and flash." },
];

export default function CompareHubPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-12">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">
                HEAD-TO-HEAD COMPARISON MATRICES
              </span>
            </div>
            <h1 className="font-display font-black text-5xl uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
              Tactical <span className="text-primary">Compare</span>
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-secondary">
              Direct side-by-side evaluations of VALORANT weapons and agents. Compare damage numbers, fire rates, tactical advantages, and situational win conditions.
            </p>
          </Container>
        </div>

        <Container className="py-16 space-y-16">
          {/* Weapon Comparisons */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <Swords className="h-5 w-5 text-primary" />
              <h2 className="font-display font-black text-2xl uppercase tracking-wide text-white">
                Weapon Comparisons
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {WEAPON_COMPARISONS.map(item => (
                <Link
                  key={item.slug}
                  href={`/compare/weapons/${item.slug}`}
                  className="group border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal flex flex-col justify-between hover:border-primary/50 hover:bg-[#0D1A22]/90 transition-all shadow-lg"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary">
                      WEAPON VERSUS
                    </span>
                    <h3 className="font-display font-black text-xl uppercase text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[rgba(236,232,225,0.06)] flex items-center justify-between font-mono text-xs text-primary font-bold">
                    <span>Compare Stats</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Agent Comparisons */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <Users className="h-5 w-5 text-[#0DF2F2]" />
              <h2 className="font-display font-black text-2xl uppercase tracking-wide text-white">
                Operative Comparisons
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {AGENT_COMPARISONS.map(item => (
                <Link
                  key={item.slug}
                  href={`/compare/agents/${item.slug}`}
                  className="group border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal flex flex-col justify-between hover:border-[#0DF2F2]/50 hover:bg-[#0D1A22]/90 transition-all shadow-lg"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#0DF2F2]">
                      OPERATIVE VERSUS
                    </span>
                    <h3 className="font-display font-black text-xl uppercase text-white group-hover:text-[#0DF2F2] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[rgba(236,232,225,0.06)] flex items-center justify-between font-mono text-xs text-[#0DF2F2] font-bold">
                    <span>Compare Operatives</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
