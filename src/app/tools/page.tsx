import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal, StaggerContainer } from "@/components/motion-system";
import { ArrowRight, Calculator, Users, Crosshair, Laptop, GitCompare, Sparkles, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "VALORANT Tactical Tools & Utilities Engine | VloPedia",
  description: "Free competitive VALORANT tools: Sensitivity converter with eDPI/cm360, 5-dimensional Team Comp Builder, Crosshair builder, Loadout setup generator, and Weapon Compare.",
  alternates: {
    canonical: "/tools",
  },
};

const TOOLS = [
  {
    id: "sensitivity",
    name: "Sensitivity & DPI Converter",
    desc: "Accurately convert your mouse sensitivity between CS2, Apex Legends, Overwatch 2, Fortnite, Rainbow Six Siege, COD, and VALORANT. Calculate exact eDPI and cm/360° with VCT pro benchmarks.",
    href: "/sensitivity",
    icon: Calculator,
    tag: "POPULAR",
    color: "#FA4454",
  },
  {
    id: "comp-builder",
    name: "Tactical Comp Builder",
    desc: "Build and evaluate 5-agent team compositions with map-specific weighting. Calculates multi-dimensional ratings across Execution, Site Control, Info/Intel, Post-Plant, and Defensive Anchor.",
    href: "/comp-builder",
    icon: Users,
    tag: "SYNERGY /100",
    color: "#0DF2F2",
  },
  {
    id: "setup",
    name: "My VALORANT Setup / Loadout",
    desc: "Generate and share your personalized player card featuring your main agent, sensitivity @ DPI, crosshair code, signature weapon & skin, and hardware peripherals.",
    href: "/setup",
    icon: Laptop,
    tag: "SHAREABLE",
    color: "#10B981",
  },
  {
    id: "compare",
    name: "Weapon & Agent Compare",
    desc: "Head-to-head comparison matrices for Vandal vs. Phantom, Operator vs. Outlaw, and agent pairings with side-by-side damage, fire rate, and tactical advantage tables.",
    href: "/compare/weapons/vandal-vs-phantom",
    icon: GitCompare,
    tag: "HEAD-TO-HEAD",
    color: "#C084FC",
  },
  {
    id: "crosshair",
    name: "Crosshair Generator & Pro Codes",
    desc: "Design, test, and export pixel-perfect VALORANT crosshairs. Includes 1-click import profile codes for top VCT Champions like TenZ, Demon1, and Aspas.",
    href: "/crosshair",
    icon: Crosshair,
    tag: "PRO PRESETS",
    color: "#F59E0B",
  },
  {
    id: "strat-roulette",
    name: "Strat Roulette Generator",
    desc: "Fun tactical challenge generator for 5-stack unrated and custom games with hundreds of hilarious and creative team constraints.",
    href: "/strat-roulette",
    icon: Sparkles,
    tag: "COMMUNITY",
    color: "#EC4899",
  },
];

export default function ToolsHubPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-12">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">
                TACTICAL UTILITIES ENGINE // v2.0
              </span>
            </div>
            <h1 className="font-display font-black text-5xl uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
              Competitive <span className="text-primary">Tools</span>
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-secondary">
              Everything competitive players need: Sensitivity converters with cm/360 calculations, intelligent map-weighted comp synergy evaluators, shareable player setup cards, and head-to-head comparison matrices.
            </p>
          </Container>
        </div>

        <Container className="py-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map(tool => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-8 clip-diagonal flex flex-col justify-between hover:border-primary/50 hover:bg-[#0D1A22]/90 transition-all shadow-xl"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center border border-[rgba(236,232,225,0.1)] bg-surface text-primary group-hover:border-primary/40 group-hover:scale-105 transition-all">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border border-[rgba(236,232,225,0.12)] bg-surface text-muted">
                        {tool.tag}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-2xl uppercase tracking-wide text-white group-hover:text-primary transition-colors">
                      {tool.name}
                    </h2>

                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-secondary">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[rgba(236,232,225,0.06)] flex items-center justify-between font-mono text-xs text-primary font-bold">
                    <span>Launch Utility</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
