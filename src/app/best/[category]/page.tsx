import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { siteConfig } from "@/lib/site";
import { ArrowLeft, Trophy, Star, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";

export const dynamic = "force-static";

interface BestCategory {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  criteria: string[];
  rankings: {
    rank: number;
    name: string;
    role: string;
    tier: string;
    reason: string;
    link: string;
    stats: { label: string; value: string }[];
  }[];
}

const BEST_CATEGORIES: Record<string, BestCategory> = {
  "agents-for-beginners": {
    slug: "agents-for-beginners",
    title: "Best VALORANT Agents for Beginners",
    subtitle: "Forgiving mechanics, straightforward utility, and maximum team value",
    badge: "BEGINNER TIER LIST",
    description: "When starting VALORANT, choosing agents with intuitive utility allows you to focus on fundamental gunplay and crosshair placement without being overwhelmed by complicated lineups.",
    criteria: ["Simple ability execution", "Low penalty for missed utility", "High baseline team support"],
    rankings: [
      {
        rank: 1,
        name: "Sage",
        role: "Sentinel",
        tier: "S-Tier Beginner",
        reason: "Healing Orb and Slow Orb give immediate defensive stall without requiring complex lineups. Barrier Orb provides intuitive chokepoint control.",
        link: "/agents/sage",
        stats: [{ label: "Ease of Use", value: "10/10" }, { label: "Team Value", value: "9/10" }]
      },
      {
        rank: 2,
        name: "Brimstone",
        role: "Controller",
        tier: "S-Tier Beginner",
        reason: "Sky Smokes use an intuitive tactical pad with generous duration, making smoking essential choke points reliable and foolproof.",
        link: "/agents/brimstone",
        stats: [{ label: "Ease of Use", value: "9.5/10" }, { label: "Team Value", value: "9.5/10" }]
      },
      {
        rank: 3,
        name: "Reyna",
        role: "Duelist",
        tier: "A-Tier Beginner",
        reason: "Leer is an omni-directional flash that doesn't blind teammates. Dismiss and Devour allow self-sufficient sustain after winning duels.",
        link: "/agents/reyna",
        stats: [{ label: "Ease of Use", value: "9/10" }, { label: "Duel Potential", value: "10/10" }]
      },
      {
        rank: 4,
        name: "Gekko",
        role: "Initiator",
        tier: "A-Tier Beginner",
        reason: "Wingman can plant and defuse the spike automatically, while Dizzy and Thrash are reclaimable utilities that forgive missed throws.",
        link: "/agents/gekko",
        stats: [{ label: "Ease of Use", value: "8.5/10" }, { label: "Reusability", value: "10/10" }]
      },
    ]
  },
  "agents-for-solo-queue": {
    slug: "agents-for-solo-queue",
    title: "Best VALORANT Agents for Solo Queue",
    subtitle: "Self-sufficient 1v9 agents that don't rely on uncoordinated teammates",
    badge: "RANKED CLIMBING",
    description: "In Solo Queue ranked, team communication can be inconsistent. The best solo queue agents have autonomous fragging potential, self-sustain, or round-winning clutch utility.",
    criteria: ["Self-sufficiency", "Clutch / 1vX capability", "Low reliance on teammate setup"],
    rankings: [
      {
        rank: 1,
        name: "Clove",
        role: "Controller",
        tier: "S-Tier SoloQ",
        reason: "Highest ranked win-rate in the game. Clove can drop smokes after death, gain self-heal/speed on kills, and self-revive in 1v1 clutch scenarios.",
        link: "/agents/clove",
        stats: [{ label: "Solo Win Rate", value: "54.2%" }, { label: "Clutch Power", value: "10/10" }]
      },
      {
        rank: 2,
        name: "Omen",
        role: "Controller",
        tier: "S-Tier SoloQ",
        reason: "Rechargeable global smokes, an unavoidable nearsight Paranoia flash, and teleportation for aggressive off-angles and lurk plays.",
        link: "/agents/omen",
        stats: [{ label: "Flexibility", value: "10/10" }, { label: "Outplay Ability", value: "9.5/10" }]
      },
      {
        rank: 3,
        name: "Jett",
        role: "Duelist",
        tier: "S-Tier SoloQ",
        reason: "Tailwind dash provides the safest Operator holding angles and instant space creation on attack regardless of teammate flash timing.",
        link: "/agents/jett",
        stats: [{ label: "First Bloods", value: "9.8/10" }, { label: "Op Synergy", value: "10/10" }]
      },
      {
        rank: 4,
        name: "Cypher",
        role: "Sentinel",
        tier: "A-Tier SoloQ",
        reason: "Solo hold an entire bomb site with Trapwires, Cage one-ways, and Spycam intel, allowing your random teammates to stack the opposite site.",
        link: "/agents/cypher",
        stats: [{ label: "Site Anchor", value: "10/10" }, { label: "Map Intel", value: "9.5/10" }]
      },
    ]
  },
  "duelists": {
    slug: "duelists",
    title: "Best VALORANT Duelists Ranked",
    subtitle: "Entry fraggers, space creators, and primary duel winners",
    badge: "DUELIST TIER LIST",
    description: "Duelists are self-sufficient fraggers who create space on attack and hold aggressive first-contact angles on defense.",
    criteria: ["Space creation speed", "First blood conversion", "Escape mechanics"],
    rankings: [
      { rank: 1, name: "Jett", role: "Duelist", tier: "S-Tier", reason: "The gold standard Operator duelist with instant Tailwind escape.", link: "/agents/jett", stats: [{ label: "Pick Rate", value: "78%" }] },
      { rank: 2, name: "Raze", role: "Duelist", tier: "S-Tier", reason: "Explosive Satchel mobility, Boombot recon, and massive AOE Paint Shell damage.", link: "/agents/raze", stats: [{ label: "Site Clear", value: "10/10" }] },
      { rank: 3, name: "Neon", role: "Duelist", tier: "A-Tier", reason: "Relentless slide accuracy and lightning wall that dismantles sentinel crosshairs.", link: "/agents/neon", stats: [{ label: "Speed", value: "10/10" }] },
      { rank: 4, name: "Yoru", role: "Duelist", tier: "A-Tier", reason: "Flash-teleport executes and Dimensional Drift team recon.", link: "/agents/yoru", stats: [{ label: "Deception", value: "10/10" }] },
    ]
  },
  "controllers": {
    slug: "controllers",
    title: "Best VALORANT Controllers Ranked",
    subtitle: "Smoke masters who block vision, control chokepoints, and dictate map flow",
    badge: "CONTROLLER TIER LIST",
    description: "Controllers are the backbone of any tactical execution, carving up territory and blocking enemy sniper sightlines.",
    criteria: ["Smoke duration & refresh", "Vision denial flexibility", "Post-plant stall"],
    rankings: [
      { rank: 1, name: "Omen", role: "Controller", tier: "S-Tier", reason: "30-second regenerating hollow smokes, global cast range, and blinding flash.", link: "/agents/omen", stats: [{ label: "Versatility", value: "10/10" }] },
      { rank: 2, name: "Clove", role: "Controller", tier: "S-Tier", reason: "Post-death smoke placement ensures your team never plays without vision blocks.", link: "/agents/clove", stats: [{ label: "Combat Smoke", value: "10/10" }] },
      { rank: 3, name: "Viper", role: "Controller", tier: "S-Tier (Breeze/Icebox)", reason: "Toxic Screen and Poison Cloud decay with Snake Bite vulnerability mollies.", link: "/agents/viper", stats: [{ label: "Wall Smoke", value: "10/10" }] },
      { rank: 4, name: "Astra", role: "Controller", tier: "A-Tier", reason: "Global Astral Form concusses, gravity wells, and bullet-blocking Cosmic Divide.", link: "/agents/astra", stats: [{ label: "Global Presence", value: "10/10" }] },
    ]
  },
  "agents-on-ascent": {
    slug: "agents-on-ascent",
    title: "Best Agents for Ascent",
    subtitle: "The definitive meta composition and tier rankings for Ascent",
    badge: "MAP SPECIFIC",
    description: "Ascent is heavily centered around Mid Courtyard control, thin wall-bangable paper doors, and tight choke points on A Main and B Main.",
    criteria: ["Mid recon capability", "Wall penetration utility", "Door stall & close"],
    rankings: [
      { rank: 1, name: "Sova", role: "Initiator", tier: "S+ Mandatory", reason: "Recon Bolt reveals B Main and Mid Courtyard instantly through Ascent's open skyboxes. Hunter's Fury secures post-plants across entire bomb sites.", link: "/agents/sova", stats: [{ label: "Ascent Pick", value: "94%" }] },
      { rank: 2, name: "Omen", role: "Controller", tier: "S-Tier", reason: "One-way smokes on A Main and B Main, paired with Paranoia down B Lane or A Tree.", link: "/agents/omen", stats: [{ label: "Ascent Win Rate", value: "53.8%" }] },
      { rank: 3, name: "Killjoy", role: "Sentinel", tier: "S-Tier", reason: "Lockdown ultimate covers all of A Site or B Site. Nanoswarms deny the button door switch.", link: "/agents/killjoy", stats: [{ label: "Site Anchor", value: "9.8/10" }] },
      { rank: 4, name: "KAY/O", role: "Initiator", tier: "S-Tier", reason: "ZERO/point knife suppresses Sova recon and Killjoy setups through middle walls.", link: "/agents/kay-o", stats: [{ label: "Suppression", value: "10/10" }] },
      { rank: 5, name: "Jett", role: "Duelist", tier: "S-Tier", reason: "Operator anchor on Mid Catwalk and A Short with instant Tailwind dash.", link: "/agents/jett", stats: [{ label: "Mid Control", value: "9.6/10" }] },
    ]
  },
};

export async function generateStaticParams() {
  return Object.keys(BEST_CATEGORIES).map(category => ({
    category,
  }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const data = BEST_CATEGORIES[category];
  if (!data) return { title: "Category Not Found | VloPedia" };

  return {
    title: `${data.title} — Meta Rankings & Tier List | VloPedia`,
    description: data.description,
    openGraph: {
      title: `${data.title} | VloPedia`,
      description: data.description,
      url: `${siteConfig.url}/best/${category}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/best/${category}`,
    },
  };
}

export default async function BestCategoryPage({ params }: Props) {
  const { category } = await params;
  const data = BEST_CATEGORIES[category];
  if (!data) notFound();

  const breadcrumbItems = [
    { label: "Guides", href: "/guides" },
    { label: "Best Ranked", href: "/guides" },
    { label: data.title }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-10 pb-12">
          <Container>
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="h-[2px] w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                {data.badge}
              </span>
            </div>

            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
              {data.title}
            </h1>

            <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-secondary border-l-2 border-primary/60 pl-4">
              {data.description}
            </p>

            {/* Criteria chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-muted tracking-wider mr-2">
                Ranking Criteria:
              </span>
              {data.criteria.map((c, i) => (
                <span key={i} className="font-mono text-[10px] uppercase px-2.5 py-1 border border-[rgba(236,232,225,0.1)] bg-surface text-white">
                  ✓ {c}
                </span>
              ))}
            </div>
          </Container>
        </div>

        {/* Rankings Container */}
        <Container className="py-16 space-y-8">
          <div className="space-y-6">
            {data.rankings.map(item => (
              <div
                key={item.name}
                className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-all shadow-xl"
              >
                <div className="flex items-start gap-6">
                  {/* Rank number badge */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 font-display font-black text-2xl text-primary">
                    #{item.rank}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display font-black text-2xl sm:text-3xl uppercase text-white">
                        {item.name}
                      </h2>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#0DF2F2]/30 bg-[#0DF2F2]/10 text-[#0DF2F2]">
                        {item.tier}
                      </span>
                      <span className="font-mono text-[10px] uppercase text-muted">
                        {item.role}
                      </span>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-secondary leading-relaxed max-w-2xl">
                      {item.reason}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      {item.stats.map((st, i) => (
                        <div key={i} className="font-mono text-xs">
                          <span className="text-muted">{st.label}: </span>
                          <span className="text-white font-bold">{st.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Link
                    href={item.link}
                    className="w-full md:w-auto text-center font-mono text-xs uppercase px-5 py-3 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Related Tools & Explore */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-surface p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-lg uppercase text-white">
                Test Team Compositions with These Agents
              </h3>
              <p className="font-sans text-xs text-muted">
                Calculate full 5-agent synergy ratings and map execute scores.
              </p>
            </div>
            <Link
              href="/comp-builder"
              className="font-mono text-xs uppercase px-4 py-2 bg-primary text-black font-bold hover:bg-primary-hover transition-colors"
            >
              Launch Comp Builder →
            </Link>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
