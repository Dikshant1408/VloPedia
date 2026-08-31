"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";

/* ── Round economy constants ── */
const WEAPONS = [
  { name: "Classic",   cost: 0,    type: "Sidearm",  slug: "classic"  },
  { name: "Shorty",    cost: 300,  type: "Sidearm",  slug: "shorty"   },
  { name: "Frenzy",    cost: 450,  type: "Sidearm",  slug: "frenzy"   },
  { name: "Ghost",     cost: 500,  type: "Sidearm",  slug: "ghost"    },
  { name: "Sheriff",   cost: 800,  type: "Sidearm",  slug: "sheriff"  },
  { name: "Stinger",   cost: 950,  type: "SMG",      slug: "stinger"  },
  { name: "Spectre",   cost: 1600, type: "SMG",      slug: "spectre"  },
  { name: "Bucky",     cost: 850,  type: "Shotgun",  slug: "bucky"    },
  { name: "Judge",     cost: 1850, type: "Shotgun",  slug: "judge"    },
  { name: "Bulldog",   cost: 2050, type: "Rifle",    slug: "bulldog"  },
  { name: "Guardian",  cost: 2250, type: "Rifle",    slug: "guardian" },
  { name: "Phantom",   cost: 2900, type: "Rifle",    slug: "phantom"  },
  { name: "Vandal",    cost: 2900, type: "Rifle",    slug: "vandal"   },
  { name: "Marshal",   cost: 950,  type: "Sniper",   slug: "marshal"  },
  { name: "Outlaw",    cost: 2400, type: "Sniper",   slug: "outlaw"   },
  { name: "Operator",  cost: 4700, type: "Sniper",   slug: "operator" },
  { name: "Ares",      cost: 1600, type: "Heavy",    slug: "ares"     },
  { name: "Odin",      cost: 3200, type: "Heavy",    slug: "odin"     },
];

const SHIELDS = [
  { name: "No Shield",    cost: 0,   hp: 0  },
  { name: "Light Shield", cost: 400, hp: 25 },
  { name: "Heavy Shield", cost: 1000,hp: 50 },
];

const ARMOR_COST = { none: 0, light: 400, heavy: 1000 };

/* ── Economy decision guide ── */
const SCENARIOS = [
  {
    situation: "Pistol Round (Round 1)",
    recommendation: "Start with Classic (free) or buy Frenzy/Ghost/Sheriff. Save abilities for Signature only.",
    budget: "0–800 VP",
    color: "border-sky-400/30 bg-sky-400/5 text-sky-400",
  },
  {
    situation: "Full Buy",
    recommendation: "Phantom or Vandal + Heavy Shield + abilities. Full utility is available.",
    budget: "3900–5000+ VP",
    color: "border-success/30 bg-[rgba(34,197,94,0.05)] text-success",
  },
  {
    situation: "Half Buy / Force Buy",
    recommendation: "Spectre or Bulldog + Light Shield. Use when you can't full buy but must fight.",
    budget: "2000–2800 VP",
    color: "border-warning/30 bg-warning/5 text-warning",
  },
  {
    situation: "Eco Round",
    recommendation: "Classic or Shorty only. Save credits. Let teammates know you're saving.",
    budget: "0–300 VP",
    color: "border-error/30 bg-[rgba(250,68,84,0.05)] text-error",
  },
  {
    situation: "Bonus Round (won eco)",
    recommendation: "Upgrade to Ghost/Sheriff + Light Shield. Bridge into full buy next round.",
    budget: "900–1500 VP",
    color: "border-role-controller/30 bg-role-controller/5 text-role-controller",
  },
];

export default function EconomyGuidePage() {
  const [credits, setCredits] = useState(3900);
  const [armor,   setArmor]   = useState<"none"|"light"|"heavy">("heavy");
  const [weapon,  setWeapon]  = useState(WEAPONS.find(w => w.name === "Vandal")!);

  const armorCost   = ARMOR_COST[armor];
  const remaining   = credits - weapon.cost - armorCost;
  const canAfford   = remaining >= 0;
  const abilityFund = Math.max(0, remaining);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Tactical grid */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />

        <div className="relative z-10">
          {/* Header */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
            <Container>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">ECONOMY GUIDE</span>
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">ECONOMY</h1>
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
                Learn when to buy, save, and force-buy. Master credit management to win more rounds.
              </p>
            </Container>
          </div>

          <Container className="py-12 space-y-12">

            {/* ── Credit Calculator ── */}
            <Reveal>
              <div className="border border-border bg-[#0D1A22] p-6 space-y-6 cut-corner-br">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-border pb-4">
                  Round Budget Calculator
                </h2>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* Credits */}
                  <div className="space-y-2">
                    <label htmlFor="credits-input" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                      Available Credits
                    </label>
                    <input
                      id="credits-input"
                      type="number"
                      min={0} max={9000} step={100}
                      value={credits}
                      onChange={e => setCredits(Number(e.target.value))}
                      className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-lg font-black text-white focus:border-primary focus:outline-none"
                    />
                    <input type="range" min={0} max={9000} step={100} value={credits}
                      onChange={e => setCredits(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer" aria-label="Credits slider" />
                  </div>

                  {/* Weapon */}
                  <div className="space-y-2">
                    <label htmlFor="weapon-select" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                      Weapon
                    </label>
                    <select id="weapon-select" value={weapon.slug}
                      onChange={e => setWeapon(WEAPONS.find(w => w.slug === e.target.value) ?? weapon)}
                      className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm font-bold text-white focus:border-primary focus:outline-none">
                      {["Sidearm","SMG","Shotgun","Rifle","Sniper","Heavy"].map(type => (
                        <optgroup key={type} label={type}>
                          {WEAPONS.filter(w => w.type === type).map(w => (
                            <option key={w.slug} value={w.slug}>{w.name} — {w.cost} creds</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Armor */}
                  <div className="space-y-2">
                    <fieldset>
                      <legend className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Shield</legend>
                      <div className="space-y-2">
                        {(["none","light","heavy"] as const).map(a => (
                          <label key={a} className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="armor" value={a} checked={armor===a} onChange={() => setArmor(a)}
                              className="accent-primary" />
                            <span className="font-mono text-[11px] text-white capitalize">{a} Shield</span>
                            <span className="ml-auto font-mono text-[10px] text-muted">{ARMOR_COST[a]} creds</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Result */}
                <div className={`border p-5 space-y-3 ${canAfford ? "border-success/30 bg-[rgba(34,197,94,0.05)]" : "border-error/30 bg-[rgba(250,68,84,0.05)]"}`}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-center">
                    {[
                      { label: "Weapon",   val: `${weapon.cost} creds`, color: "text-foreground" },
                      { label: "Shield",   val: `${armorCost} creds`,   color: "text-foreground" },
                      { label: "Total",    val: `${weapon.cost + armorCost} creds`, color: canAfford ? "text-success" : "text-error" },
                      { label: "For Abilities", val: `${Math.max(0,abilityFund)} creds`, color: "text-primary" },
                    ].map(r => (
                      <div key={r.label} className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-3">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-muted mb-1">{r.label}</span>
                        <span className={`text-lg font-black ${r.color}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <p className={`font-mono text-[11px] font-bold ${canAfford ? "text-success" : "text-error"}`}>
                    {canAfford
                      ? `✓ You can afford this loadout with ${abilityFund} credits left for abilities.`
                      : `✗ You need ${Math.abs(remaining)} more credits for this loadout.`}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── Scenario Guide ── */}
            <Reveal>
              <div className="space-y-4">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Round Scenarios</h2>
                <div className="space-y-3">
                  {SCENARIOS.map((s, i) => (
                    <div key={i} className={`border p-5 space-y-2 ${s.color.split(" ").slice(0,2).join(" ")}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-mono text-[11px] font-black uppercase tracking-wider ${s.color.split(" ")[2]}`}>
                          {s.situation}
                        </h3>
                        <span className="font-mono text-[10px] text-muted">{s.budget}</span>
                      </div>
                      <p className="font-sans text-xs leading-relaxed text-secondary">{s.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ── Credit Income Table ── */}
            <Reveal>
              <div className="border border-border bg-[#0D1A22] p-6 space-y-4 cut-corner-br">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-border pb-4">
                  Credit Income Reference
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-[11px]" aria-label="Credit income table">
                    <thead>
                      <tr className="border-b border-border text-muted">
                        <th className="py-2 pr-6 text-left font-bold uppercase tracking-wider">Condition</th>
                        <th className="py-2 px-4 text-right font-bold uppercase tracking-wider text-success">Credits Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Round Win",                   "+3,000"],
                        ["Round Loss (1st consecutive)","+1,900"],
                        ["Round Loss (2nd consecutive)","+2,400"],
                        ["Round Loss (3+  consecutive)","+2,900"],
                        ["Kill Bonus",                  "+200 per kill"],
                        ["Spike Plant (attacker)",      "+300"],
                        ["Spike Defuse (defender)",     "+300"],
                        ["Unused credits carry over",   "Max 9,000"],
                      ].map(([cond, val]) => (
                        <tr key={cond} className="border-b border-[rgba(236,232,225,0.06)]">
                          <td className="py-2 pr-6 text-muted">{cond}</td>
                          <td className="py-2 px-4 text-right font-bold text-white">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>

          </Container>
        </div>
      </div>
    </PageTransition>
  );
}
