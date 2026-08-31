import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Shield, Cpu, Target, Compass, Database } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — ValoVault",
  description: "Learn more about ValoVault, the ultimate independent VALORANT companion and tactical encyclopedia.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground font-sans">
        {/* Tactical grid */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />

        <div className="relative z-10">
          {/* Header */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
            <Container>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">CORE INTEL</span>
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tighter text-white sm:text-6xl">
                ABOUT VALOVAULT
              </h1>
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
                The ultimate independent database, collection tracker, and tactical strategy vault for VALORANT players.
              </p>
            </Container>
          </div>

          <Container className="py-16 space-y-12">
            
            {/* Grid details */}
            <div className="grid gap-8 md:grid-cols-2">
              
              {/* Mission column */}
              <Reveal>
                <div className="border border-border bg-[#0D1A22] p-8 space-y-4 cut-corner-br h-full">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl uppercase tracking-wide text-white">Our Mission</h2>
                  </div>
                  <p className="text-xs leading-relaxed text-muted uppercase font-mono">
                    {"// EMPATHETIC DESIGNED FOR COMPETITIVE INTELLIGENCE"}
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    ValoVault was built with a clear purpose: to centralize game diagnostics and cosmetics tracking in a premium, ultra-responsive web environment. We believe that competitive players deserve instant access to frame-accurate weapon parameters, agent ability maps, lore files, and custom strategy builders. 
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    By compiling public metadata and developing interactive tactical tools, we aim to bridge the gap between casual gameplay and deep tactical understanding, helping players optimize their loadouts and compositions.
                  </p>
                </div>
              </Reveal>

              {/* Stack / Features column */}
              <Reveal>
                <div className="border border-border bg-[#0D1A22] p-8 space-y-4 cut-corner-br h-full">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-xl uppercase tracking-wide text-white">Platform Technology</h2>
                  </div>
                  <p className="text-xs leading-relaxed text-muted uppercase font-mono">
                    {"// STATE-OF-THE-ART FRONTEND ARCHITECTURE"}
                  </p>
                  <p className="text-sm leading-relaxed text-muted">
                    ValoVault is built on a modern, high-performance tech stack configured for speed and static delivery:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted font-mono uppercase">
                    <li><strong className="text-white">Framework:</strong> Next.js 15 & React 19 Client Engine</li>
                    <li><strong className="text-white">Styling:</strong> Vanilla CSS & Custom Tailwind Tokens</li>
                    <li><strong className="text-white">Database:</strong> Prisma ORM linked to PostgreSQL</li>
                    <li><strong className="text-white">Client Auth:</strong> Firebase Identity SDK Suite</li>
                    <li><strong className="text-white">Caching:</strong> Custom SessionStorage API Cache Module</li>
                  </ul>
                </div>
              </Reveal>

            </div>

            {/* Core features overview */}
            <Reveal>
              <div className="border border-border bg-[#0D1A22] p-8 space-y-6 cut-corner-br">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-2">
                  <Compass className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl uppercase tracking-wide text-white">Platform Modules</h2>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-3 font-mono text-xs uppercase text-muted">
                  
                  <div className="border border-[rgba(236,232,225,0.06)] bg-black/30 p-4 space-y-2">
                    <span className="text-primary font-black block tracking-widest text-[10px]">{"// ENCYCLOPEDIA"}</span>
                    <p className="text-white font-display text-sm font-bold tracking-wide">ARMORY & AGENT DECKS</p>
                    <p className="font-sans normal-case text-muted leading-relaxed text-[11px]">
                      Access comprehensive agent bios, maps, abilities, weapons parameters, recoil specs, and detailed patch notes indexes.
                    </p>
                  </div>

                  <div className="border border-[rgba(236,232,225,0.06)] bg-black/30 p-4 space-y-2">
                    <span className="text-primary font-black block tracking-widest text-[10px]">{"// COSMETICS"}</span>
                    <p className="text-white font-display text-sm font-bold tracking-wide">COLLECTIONS TRACKER</p>
                    <p className="font-sans normal-case text-muted leading-relaxed text-[11px]">
                      Track skins, bundles, buddies, sprays, and card cosmetics. Complete collection statistics with authenticated wishlist sync.
                    </p>
                  </div>

                  <div className="border border-[rgba(236,232,225,0.06)] bg-black/30 p-4 space-y-2">
                    <span className="text-primary font-black block tracking-widest text-[10px]">{"// STRATEGY"}</span>
                    <p className="text-white font-display text-sm font-bold tracking-wide">TACTICAL WARM-UPS & BUYS</p>
                    <p className="font-sans normal-case text-muted leading-relaxed text-[11px]">
                      Utilize composition builders, economy calculators, sensitivity converters, strat roulettes, and written gameplay guides.
                    </p>
                  </div>

                </div>
              </div>
            </Reveal>

            {/* Disclaimer & Compliance */}
            <Reveal>
              <div className="border border-primary/20 bg-primary/5 p-6 flex gap-4 text-xs font-mono uppercase text-primary items-start">
                <Shield className="h-6 w-6 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block tracking-wider mb-1">RIOT Games Community Disclaimer</span>
                  <p className="text-muted leading-relaxed text-[10px] normal-case font-sans">
                    ValoVault is an independent fan-made companion website created under Riot Games&apos; &quot;Legal Jibber Jabber&quot; policy using assets owned by Riot Games. VALORANT and Riot Games are trademarks or registered trademarks of Riot Games, Inc. ValoVault is not affiliated with, sponsored by, or approved by Riot Games, and has no official affiliation with the game developers.
                  </p>
                </div>
              </div>
            </Reveal>

          </Container>
        </div>
      </div>
    </PageTransition>
  );
}
