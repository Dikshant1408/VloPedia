import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { PageHero } from "@/components/page-hero";
import { RoleBadge } from "@/components/role-badge";
import { AbilitySelector } from "@/components/ability-selector";
import { AgentRelatedWeapons } from "./related-weapons";
import type { ValorantAgent } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AnswerBox } from "@/components/answer-box";
import { BookmarkButton } from "@/components/bookmark-button";
import agentMetaData from "@/data/agent-meta.json";

const API = "https://valorant-api.com/v1";

let agentsCache: Promise<ValorantAgent[]> | null = null;

async function getAllAgents(): Promise<ValorantAgent[]> {
  if (agentsCache) return agentsCache;
  agentsCache = (async () => {
    try {
      const res = await fetch(`${API}/agents?isPlayableCharacter=true`);
      if (!res.ok) {
        agentsCache = null;
        return [];
      }
      const json = await res.json();
      return json.data ?? [];
    } catch {
      agentsCache = null;
      return [];
    }
  })();
  return agentsCache;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getAgent(slug: string): Promise<ValorantAgent | null> {
  const agents = await getAllAgents();
  const norm = slug.toLowerCase();
  
  // 1. Exact match
  const exact = agents.find(
    a =>
      slugify(a.displayName) === norm ||
      a.displayName.toLowerCase() === norm ||
      a.displayName.toLowerCase().replace(/\s+/g, "-") === norm
  );
  if (exact) return exact;

  // 2. Prefix recovery match (e.g. "reyna-devour" -> "reyna")
  const prefixMatch = agents.find(
    a => norm.startsWith(slugify(a.displayName) + "-")
  );
  if (prefixMatch) return prefixMatch;

  return null;
}

export async function generateStaticParams() {
  const agents = await getAllAgents();
  return agents.map(a => ({ slug: slugify(a.displayName) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) return { title: "Agent Not Found | ValoVault", robots: { index: false } };

  const pageTitle = `${agent.displayName} Agent Guide: Abilities, Role & Tactics | ValoVault`;
  const pageDesc = `Comprehensive ${agent.displayName} guide in VALORANT. Learn key ability tactics, agent role details, counter strategies, and background lore.`;

  return {
    title: pageTitle,
    description: pageDesc,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      title: pageTitle,
      description: pageDesc,
      images: [{ url: agent.fullPortrait }],
    },
    alternates: {
      canonical: `${siteConfig.url}/agents/${slug}`,
    },
  };
}

export default async function AgentDetailPage({ params }: Props) {
  const { slug } = await params;
  const allAgents = await getAllAgents();
  const agent = await getAgent(slug);
  if (!agent) notFound();

  const gradient = agent.backgroundGradientColors?.[0];
  const gradientHex = gradient ? `#${gradient}` : undefined;
  const metaTier = (agentMetaData.tiers as Record<string, string>)[agent.displayName] || "A-Tier";
  const pickRate = (agentMetaData.pickRates as Record<string, string>)[agent.displayName] || "Pro Benchmark Pending";
  const difficulty = (agentMetaData.difficulty as Record<string, string>)[agent.displayName] || "MEDIUM";

  const bestMaps = (agentMetaData.bestMaps as Record<string, string[]>)[agent.displayName] ?? ["Ascent", "Haven"];
  const teammates = (agentMetaData.teammates as Record<string, string[]>)[agent.displayName] ?? ["Omen", "Sova"];
  const counters = (agentMetaData.counters as Record<string, string[]>)[agent.displayName] ?? ["KAY/O", "Cypher"];
  const tips = AGENT_TIPS[agent.displayName] ?? {
    beginner: ["Focus on understanding ability ranges and cast times.", "Coordinate with initiators before pushing through chokepoints."],
    advanced: ["Use audio cues to mask movement abilities.", "Combine abilities with teammate utility for guaranteed site entry."],
  };

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
          { "@type": "ListItem", "position": 2, "name": "Agents", "item": `${siteConfig.url}/agents` },
          { "@type": "ListItem", "position": 3, "name": agent.displayName, "item": `${siteConfig.url}/agents/${slug}` }
        ]
      },
      {
        "@type": "Article",
        "headline": `${agent.displayName} VALORANT Guide: Abilities, Role, Tips & Matchups`,
        "description": agent.description,
        "image": [agent.fullPortrait || agent.bustPortrait],
        "author": { "@type": "Organization", "name": "VloPedia" },
        "publisher": { "@type": "Organization", "name": "VloPedia", "url": siteConfig.url },
        "mainEntityOfPage": `${siteConfig.url}/agents/${slug}`
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What is ${agent.displayName}'s role in VALORANT?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${agent.displayName} is a ${agent.role?.displayName || "Agent"} who excels with abilities: ${agent.abilities.map(a => a.displayName).join(", ")}.`
            }
          },
          {
            "@type": "Question",
            "name": `What are the best maps for ${agent.displayName}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${agent.displayName} has the highest competitive win rate on ${bestMaps.join(", ")}.`
            }
          }
        ]
      }
    ]
  };

  const breadcrumbItems = [
    { label: "Agents", href: "/agents" },
    { label: agent.role?.displayName || "Operative", href: `/agents?role=${encodeURIComponent(agent.role?.displayName || "")}` },
    { label: agent.displayName }
  ];

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background text-foreground">

        {/* Top Breadcrumbs Strip */}
        <div className="border-b border-border bg-[#0B141A] pt-6 pb-4">
          <Container>
            <Breadcrumbs items={breadcrumbItems} />
          </Container>
        </div>

        {/* Full-bleed hero */}
        <PageHero
          imageSrc={agent.fullPortrait || agent.bustPortrait}
          imageAlt={agent.displayName}
          eyebrow={agent.role?.displayName?.toUpperCase() ?? "AGENT"}
          title={agent.displayName.toUpperCase()}
          subtitle={agent.description}
          priority
        >
          <div className="flex flex-wrap items-center gap-3">
            <RoleBadge role={agent.role?.displayName ?? ""} size="md" />
            <BookmarkButton
              id={`agent-${agent.uuid}`}
              title={agent.displayName}
              category="Agent"
              url={`/agents/${slug}`}
            />
            <Link href={`/comp-builder?agents=${slug}`}>
              <Button variant="primary" size="sm" className="gap-2 font-mono text-xs">
                Build Team Comp
              </Button>
            </Link>
            <Link href="/agents">
              <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                All Agents
              </Button>
            </Link>
          </div>
        </PageHero>

        {/* Main content */}
        <Container className="py-16">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-start">

            {/* Left — portrait + operative meta stats */}
            <Reveal>
              <div className="sticky top-24 space-y-6">
                <div
                  className="relative overflow-hidden border border-border bg-surface-card"
                  style={{ aspectRatio: "3/4" }}
                >
                  {gradientHex && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-40"
                      style={{
                        background: `radial-gradient(ellipse at 50% 100%, ${gradientHex} 0%, transparent 65%)`,
                      }}
                    />
                  )}
                  {/* Background art */}
                  {agent.background && (
                    <Image
                      src={agent.background}
                      alt=""
                      fill
                      sizes="(max-width:1024px) 100vw, 45vw"
                      className="object-cover opacity-15"
                      unoptimized
                    />
                  )}
                  {/* Full portrait */}
                  <Image
                    src={agent.fullPortraitV2 || agent.fullPortrait}
                    alt={agent.displayName}
                    fill
                    sizes="(max-width:1024px) 100vw, 45vw"
                    className="relative z-10 object-contain object-bottom"
                    unoptimized
                  />
                  {/* Corner accent */}
                  <div aria-hidden="true" className="absolute left-0 top-0 z-20 h-[2px] w-12 bg-primary" />
                  <div aria-hidden="true" className="absolute left-0 top-0 z-20 h-12 w-[2px] bg-primary" />
                </div>

                {/* Tactical Meta Stats Grid */}
                <div className="border border-border bg-[#0D1820] p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="font-mono-tactical text-[9px] uppercase tracking-widest text-muted block mb-1">
                        ROLE TIER
                      </span>
                      <span className="font-display font-black text-xl text-[#0DF2F2]">
                        {metaTier}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono-tactical text-[9px] uppercase tracking-widest text-muted block mb-1">
                        PRO PRESENCE
                      </span>
                      <span className="font-display font-black text-xl text-primary">
                        {pickRate}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono-tactical text-[9px] uppercase tracking-widest text-muted block mb-1">
                        DIFFICULTY
                      </span>
                      <span className="font-display font-black text-xl text-white">
                        {difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[rgba(236,232,225,0.06)] pt-2 flex items-center justify-between text-[9px] font-mono text-muted">
                    <span>{agentMetaData.metadata.source} · {agentMetaData.metadata.patchVersion}</span>
                    <span>Verified: {agentMetaData.metadata.lastVerified}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right — info + abilities + synergies */}
            <div className="space-y-12">

              {/* Instant Answer Box */}
              <Reveal>
                <AnswerBox
                  question={`Is ${agent.displayName} good in the current meta?`}
                  verdict={`${metaTier} Operative`}
                  explanation={`${agent.displayName} is evaluated as an ${metaTier} ${agent.role?.displayName || "Agent"} with ${pickRate !== "Pro Benchmark Pending" ? `a ${pickRate} competitive pro tournament presence` : "active tactical utility"}. Recommended on ${bestMaps.slice(0, 2).join(" & ")}.`}
                  keyTakeaways={[
                    `Primary Role: ${agent.role?.displayName}`,
                    `Best Team Synergy: ${teammates.slice(0, 2).join(", ")}`,
                    `Counter Threats: ${counters.slice(0, 2).join(", ")}`,
                    `Tactical Difficulty: ${difficulty}`
                  ]}
                  ctaLabel={`Build Team Comp for ${agent.displayName}`}
                  ctaHref={`/comp-builder?agents=${slug}`}
                />
              </Reveal>

              {/* Operative Profile Header */}
              <Reveal>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      OPERATIVE DOSSIER
                    </span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white">
                    {agent.displayName}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed text-secondary">
                    {agent.description}
                  </p>
                </div>
              </Reveal>

              {/* Abilities */}
              <Reveal>
                <div className="space-y-4">
                  <div className="border-b border-border pb-4">
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      TACTICAL ABILITY ARSENAL
                    </span>
                  </div>
                  <AbilitySelector abilities={agent.abilities} />
                </div>
              </Reveal>

              {/* Strengths & Weaknesses */}
              <Reveal>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-success/25 bg-success/5 p-5 space-y-3">
                    <h3 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-success">Strengths</h3>
                    <ul className="space-y-2">
                      {AGENT_STRENGTHS[agent.displayName]?.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 font-sans text-xs text-secondary">
                          <span className="text-success font-bold shrink-0">+</span>{s}
                        </li>
                      )) ?? <li className="font-sans text-xs text-muted">Role: {agent.role?.displayName}</li>}
                    </ul>
                  </div>
                  <div className="border border-error/25 bg-error/5 p-5 space-y-3">
                    <h3 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-error">Weaknesses</h3>
                    <ul className="space-y-2">
                      {AGENT_WEAKNESSES[agent.displayName]?.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 font-sans text-xs text-secondary">
                          <span className="text-error font-bold shrink-0">−</span>{w}
                        </li>
                      )) ?? <li className="font-sans text-xs text-muted">Check the tier list for meta insights.</li>}
                    </ul>
                  </div>
                </div>
              </Reveal>

              {/* Synergies & Teammates */}
              <Reveal>
                <div className="space-y-4">
                  <div className="border-b border-border pb-3">
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      BEST TEAMMATES & SYNERGY
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {teammates.map(name => (
                      <Link
                        key={name}
                        href={`/agents/${slugify(name)}`}
                        className="p-3 border border-border bg-[#0D1820] hover:border-primary/50 text-center transition-all group"
                      >
                        <span className="font-display font-bold text-sm uppercase text-white group-hover:text-primary transition-colors block">
                          {name}
                        </span>
                        <span className="font-mono text-[9px] text-[#0DF2F2] uppercase block mt-0.5">
                          High Synergy
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Counters */}
              <Reveal>
                <div className="space-y-4">
                  <div className="border-b border-border pb-3">
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-error">
                      DIRECT COUNTERS
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {counters.map(name => (
                      <Link
                        key={name}
                        href={`/agents/${slugify(name)}`}
                        className="p-3 border border-error/20 bg-error/5 hover:border-error/50 transition-all group"
                      >
                        <span className="font-display font-bold text-sm uppercase text-white group-hover:text-error transition-colors block">
                          {name}
                        </span>
                        <span className="font-mono text-[9px] text-error/80 uppercase block mt-0.5">
                          Direct Counter Pick
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Best Maps */}
              <Reveal>
                <div className="space-y-3">
                  <div className="border-b border-border pb-3">
                    <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      BEST MAPS & WIN CONDITIONS
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bestMaps.map(map => (
                      <Link
                        key={map}
                        href={`/maps/${slugify(map)}`}
                        className="border border-border bg-surface px-4 py-2 font-mono-tactical text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:border-primary hover:text-primary"
                      >
                        📍 {map}
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Tactical Tips (Beginner & Advanced) */}
              <Reveal>
                <div className="space-y-4 border border-[rgba(236,232,225,0.1)] bg-[#0D1820] p-6">
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-[#0DF2F2] block mb-2">
                    TACTICAL TIPS & PLAYBOOK
                  </span>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-mono text-[10px] uppercase font-bold text-primary mb-1.5">
                        {"// Beginner Fundamentals"}
                      </h4>
                      <ul className="space-y-1.5 font-sans text-xs text-secondary pl-2">
                        {tips.beginner.map((t, i) => (
                          <li key={i} className="list-disc list-inside leading-relaxed">{t}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-[rgba(236,232,225,0.06)] pt-3">
                      <h4 className="font-mono text-[10px] uppercase font-bold text-[#0DF2F2] mb-1.5">
                        {"// Advanced Mechanics & Lineups"}
                      </h4>
                      <ul className="space-y-1.5 font-sans text-xs text-secondary pl-2">
                        {tips.advanced.map((t, i) => (
                          <li key={i} className="list-disc list-inside leading-relaxed">{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* FAQ */}
              <Reveal>
                <AgentFAQ agent={agent} />
              </Reveal>
            </div>
          </div>
        </Container>

        {/* Related weapons */}
        <AgentRelatedWeapons roleName={agent.role?.displayName ?? ""} agentName={agent.displayName} />

        {/* More agents from same role */}
        <MoreAgents currentUuid={agent.uuid} roleName={agent.role?.displayName ?? ""} allAgents={allAgents} />
      </div>
    </PageTransition>
  );
}

/* ------------------------------------------------------------------ */
/* Extended Tactical Meta Data & Gameplay Coaching Tips               */
/* ------------------------------------------------------------------ */

const AGENT_TIPS: Record<string, { beginner: string[]; advanced: string[] }> = {
  Jett: {
    beginner: [
      "Always have Tailwind primed before taking aggressive peek duels.",
      "Cloudburst smokes only last a few seconds — use them as temporary blinders or to cross sniper angles.",
      "Blade Storm right-click is deadly at close range on eco rounds."
    ],
    advanced: [
      "Combine Updraft with Tailwind to perform high-angle off-angle entries over enemy smokes.",
      "Use directional dashing backwards immediately upon firing an Operator round.",
      "Hover in mid-air above chokepoints using passive drift to catch enemies aiming at head height."
    ]
  },
  Omen: {
    beginner: [
      "Place smokes flush with doorways to deny enemies vision of the surrounding site.",
      "Paranoia travels through walls — communicate with your duelists before casting into site.",
      "Shrouded Step can be used to cross open sniper lanes safely."
    ],
    advanced: [
      "Use one-way smokes on Ascent B Main and Split A Main for free headshot duels.",
      "Cast Shrouded Step while dropping from high ground to silent-teleport behind attackers.",
      "From the Shadows can be cancelled instantly to gather full-map enemy positioning info."
    ]
  },
  Sova: {
    beginner: [
      "Learn 1 standard Recon Bolt lineup per site to reveal defenders at round start.",
      "Always fly your Owl Drone ahead of your team to tag enemies before entering.",
      "Shock Bolts do maximum damage in the exact center of the explosion."
    ],
    advanced: [
      "Master double Shock Bolt lineups to destroy defusers from across the map.",
      "Tag enemies with Owl Drone, then immediately cast Hunter's Fury through walls.",
      "Bounce Recon Darts off floors into open skyboxes for delayed ceiling scans."
    ]
  }
};

const AGENT_STRENGTHS: Record<string, string[]> = {
  Jett:       ["Best Operator agent — dash after shots","Unmatched vertical mobility with Updraft","Blade Storm works as a free eco weapon"],
  Neon:       ["Fastest agent in the game","Two smoke walls for full site coverage","Ultimate recharges on kills"],
  Raze:       ["Highest burst damage potential","Satchels enable complex movement","Paint Shells clear corners instantly"],
  Reyna:      ["Self-sufficient entry fragger","Soul Orbs make her nearly unkillable on a streak","Leer is instant and undodgeable"],
  Phoenix:    ["Self-healing via Blaze and Hot Hands","Run it Back provides a free life","Flash is one-way — safe for self-use"],
  Omen:       ["Best smokes for team play","Paranoia flash covers wide angles","Teleports enable unpredictable plays"],
  Viper:      ["Persistent smokes that cost no credits","Decay weakens enemies through walls","Viper's Pit is map-controlling for defending"],
  Astra:      ["Global map presence with stars","Gravity Well and Nova Pulse are powerful stall tools","Cosmic Divide divides maps perfectly"],
  Brimstone:  ["Fastest smoke deployment — instant orbital","Stim Beacon buffs team fire rate","Sky Smokes are easiest smokes to learn"],
  Sova:       ["Best recon ability in the game","Dart lineup knowledge is extremely powerful","Hunters Fury one-shots through walls"],
  Fade:       ["Haunt reveals exact enemy position","Seize traps enemies in place","Ultimate terrorizes with full lineup of debuffs"],
  Breach:     ["Fault Line and Rolling Thunder go through walls","Aftershock clears corners reliably","Flashpoint is undodgeable"],
  Killjoy:    ["Best sentinel for locking down sites","Alarmbot reveals enemies in range","Lockdown forces full-site retakes"],
  Cypher:     ["Passive intel from anywhere on map","Trapwire catches flanks reliably","Neural Theft reveals all enemies on round win"],
  Sage:       ["Only agent with a healing ability","Wall blocks spike plants and rushes","Resurrection can swing rounds"],
  Chamber:    ["Headhunter and Tour de Force are free weapons","Rendezvous is the fastest teleport","Trademark watches flanks passively"],
  Skye:       ["Trailblazer pops and concusses simultaneously","Guiding Light flashes are controllable","Seekers track all three enemies"],
  Gekko:      ["Recallable ultimates — Mosh Pit and Dizzy cost no charges","Wingman can plant the spike","Thrash can detain enemies in place"],
  Deadlock:   ["GravNet prevents enemies from using abilities","Barrier Mesh blocks chokes completely","Annihilation is an inescapable capture"],
  "KAY/O":    ["ZERO/POINT suppresses abilities — counters Jett, Reyna","NULL/CMD suppresses the entire enemy team","FLASH/DRIVE is a full-angle flash"],
  Harbor:     ["High Tide wall blocks long sightlines","Cove is the only deployable shield","Reckoning covers both sites simultaneously"],
  Iso:        ["Double Tap shield rewards good aim","Undercut strips all armor off enemies","Kill Contract removes one enemy to a 1v1"],
  Yoru:       ["Fakeout creates perfect decoys","Gatecrash teleports are reusable","Dimensional Drift provides full invincibility"],
  Clove:      ["Can use abilities after death","Not Your Grave resurrects on kills","Pick-me-up can be saved and used later"],
  Vyse:       ["Shear wall blocks chokes completely","Arc Rose blinds through angles","Steel Garden traps multiple enemies"],
  Tejo:       ["Guided Salvo hits precise targets","Stealth Drone scouts without risking self","Armageddon clears entire sites"],
  Waylay:     ["Relay bounces hit two targets","Interference disrupts enemy flanks","Phase Shift provides brief invincibility"],
};

const AGENT_WEAKNESSES: Record<string, string[]> = {
  Jett:       ["Dash requires a kill or activation to reset","Smokes are very short-lived","Very aim-dependent — weak when not winning duels"],
  Neon:       ["Sprint drains a charge — must manage carefully","Relay Bolt can miss if enemies move","Limited utility outside of aggressive plays"],
  Raze:       ["Satchels have only 2 charges","Grenadier grenades require precise timing","Very telegraphed — enemies can hear/see approach"],
  Reyna:      ["Zero utility for team — entirely selfish","Leer is breakable and has a short range","Useless in a losing round — needs kills to heal"],
  Phoenix:    ["Run it Back gives enemies information on position","Smokes and flashes are small","Limited range — best only in close quarters"],
  Omen:       ["Smokes are slow to deploy vs. Brimstone","Shrouded Step is loud — telegraphed","Shadow Travel is easily countered once learned"],
  Viper:      ["Requires strict lineup knowledge","Poison Cloud uses a fuel gauge","Viper's Pit is devastating but loses value if Viper dies"],
  Astra:      ["Stars must be placed far in advance","Global presence requires leaving physical form","Hard to learn — highest skill floor among controllers"],
  Brimstone:  ["Must be in-range of site for smokes","Limited to 3 smokes per round","Stim and Molly are easy to dodge"],
  Sova:       ["Recon Bolt can be destroyed quickly","Dart lineups require significant study","Owl Drone requires positioning safely"],
  Fade:       ["Abilities require direct line of sight","Haunt can be shot down","Nightfall requires slow careful aim"],
  Breach:     ["Abilities go both ways — can affect teammates","Must know wall lineups to use full value","Rolling Thunder is easy to move away from"],
  Killjoy:    ["Utilities are easily detectable and destroyable","Requires setup time — struggles on attacker side","Lockdown is slow to charge and easy to avoid"],
  Cypher:     ["No offensive capability whatsoever","Trapwires can be spotted and avoided","Cage utility requires very specific positioning"],
  Sage:       ["Slow Orb slows teammates too","Wall can be broken by enemies","Resurrection requires surviving, which can be difficult"],
  Chamber:    ["Tour de Force requires staying still","Rendezvous is countered by jamming flanks","Heavily nerfed — lower pick rate competitively"],
  Skye:       ["Trailblazer requires close range","Guiding Light uses charges","Seekers can be killed before tracking"],
  Gekko:      ["Recall takes time and exposes position","Mosh Pit can be moved out of quickly","Wingman plant is slow and destroyable"],
  Deadlock:   ["GravNet can be shot out of","Barrier Mesh has limited duration","Annihilation can be freed before extraction"],
  "KAY/O":    ["NULL/CMD makes KAY/O vulnerable — needs teammates to protect","Zero/Point can be destroyed early","Limited healing and mobility"],
  Harbor:     ["Tidal Bore and High Tide are loud","Smokes are slow to set up vs. Brimstone","Reckoning is easy to step out of"],
  Iso:        ["Undercut requires precise timing","Kill Contract takes one player out of round","Very reliant on winning the 1v1"],
  Yoru:       ["Decoys are only useful with good micro","Gatecrash is loud and telegraphed","Dimensional Drift does not make Yoru untargetable to all"],
  Clove:      ["Regen ability requires kills to sustain","Complex ability timing — high skill floor","Resurrection is powerful but requires staying alive"],
  Vyse:       ["Steel Garden has delayed activation","Arc Rose can be pre-aimed","Low combat utility — mostly defensive"],
  Tejo:       ["Guided Salvo requires precise aim","Armageddon takes time to charge","Stealth Drone is slow and easily shot down"],
  Waylay:     ["Relay Bounce angles are predictable","Limited range on all abilities","Phase Shift is very short duration"],
};

const AGENT_BEST_MAPS: Record<string, string[]> = {
  Jett:       ["Icebox","Breeze","Ascent"],
  Neon:       ["Lotus","Haven","Bind"],
  Raze:       ["Bind","Split","Pearl"],
  Reyna:      ["Ascent","Haven","Split"],
  Phoenix:    ["Split","Bind","Haven"],
  Omen:       ["Bind","Haven","Icebox"],
  Viper:      ["Breeze","Icebox","Pearl"],
  Astra:      ["Bind","Fracture","Lotus"],
  Brimstone:  ["Ascent","Split","Haven"],
  Sova:       ["Bind","Icebox","Breeze"],
  Fade:       ["Ascent","Haven","Breeze"],
  Breach:     ["Split","Haven","Lotus"],
  Killjoy:    ["Ascent","Bind","Sunset"],
  Cypher:     ["Bind","Pearl","Sunset"],
  Sage:       ["Icebox","Ascent","Split"],
  Chamber:    ["Breeze","Fracture","Pearl"],
  Skye:       ["Breeze","Icebox","Fracture"],
  Gekko:      ["Lotus","Pearl","Ascent"],
  Deadlock:   ["Icebox","Lotus","Haven"],
  "KAY/O":   ["Ascent","Split","Haven"],
  Harbor:     ["Pearl","Lotus","Bind"],
  Iso:        ["Split","Haven","Ascent"],
  Yoru:       ["Bind","Icebox","Fracture"],
  Clove:      ["Ascent","Haven","Lotus"],
  Vyse:       ["Abyss","Pearl","Bind"],
  Tejo:       ["Breeze","Icebox","Lotus"],
  Waylay:     ["Abyss","Sunset","Pearl"],
};

/* ------------------------------------------------------------------ */
/* FAQ Component                                                        */
/* ------------------------------------------------------------------ */

function AgentFAQ({ agent }: { agent: ValorantAgent }) {
  const role = agent.role?.displayName ?? "Agent";
  const maps = AGENT_BEST_MAPS[agent.displayName]?.join(", ") ?? "multiple maps";
  const faqs = [
    {
      q: `How do I play ${agent.displayName} effectively in VALORANT?`,
      a: AGENT_STRENGTHS[agent.displayName]?.[0]
        ? `Focus on ${AGENT_STRENGTHS[agent.displayName][0].toLowerCase()}. Use abilities to gain an advantage and coordinate with your team.`
        : `${agent.displayName} is a ${role}. Use abilities strategically and communicate with teammates.`,
    },
    {
      q: `What are ${agent.displayName}'s strengths?`,
      a: AGENT_STRENGTHS[agent.displayName]?.join(". ") ?? `${agent.displayName} excels as a ${role} with unique abilities that support the team.`,
    },
    {
      q: `What are ${agent.displayName}'s weaknesses?`,
      a: AGENT_WEAKNESSES[agent.displayName]?.join(". ") ?? `Like all agents, ${agent.displayName} has situational limitations. Study the meta for current context.`,
    },
    {
      q: `What are the best maps for ${agent.displayName}?`,
      a: `${agent.displayName} performs well on ${maps}.`,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="border-b border-border pb-3">
        <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">FAQ</span>
      </div>
      {faqs.map((faq, i) => (
        <details key={i} className="group border border-border bg-surface-card">
          <summary className="flex cursor-pointer items-center justify-between p-4 font-sans text-sm font-bold text-white list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
            {faq.q}
            <span className="ml-3 shrink-0 font-mono-tactical text-primary transition-transform group-open:rotate-180">▾</span>
          </summary>
          <p className="border-t border-border px-4 pb-4 pt-3 font-sans text-xs leading-relaxed text-secondary">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* More Agents from same role                                           */
/* ------------------------------------------------------------------ */

function MoreAgents({ currentUuid, roleName, allAgents }: { currentUuid: string; roleName: string; allAgents: ValorantAgent[] }) {
  const sameRole = allAgents
    .filter(a => a.role?.displayName === roleName && a.uuid !== currentUuid)
    .slice(0, 6);

  if (sameRole.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/20 py-16">
      <Container>
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
            <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              More {roleName}s
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {sameRole.map(agent => (
              <Link key={agent.uuid}
                href={`/agents/${slugify(agent.displayName)}`}
                className="group relative overflow-hidden border border-border bg-surface-card transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                style={{ aspectRatio: "3/4" }}
              >
                <Image src={agent.fullPortrait || agent.bustPortrait} alt={agent.displayName}
                  fill sizes="160px" className="object-cover object-top opacity-60 transition-opacity group-hover:opacity-90" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="font-display text-xs uppercase text-white group-hover:text-primary transition-colors">{agent.displayName}</p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
