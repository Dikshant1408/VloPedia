"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

type SkinPick = {
  id: number;
  name: string;
  weapon: "VANDAL" | "PHANTOM" | "OPERATOR" | "SHERIFF" | "GHOST";
  rarity: string;
  votes: number;
  userVoted: "up" | "down" | null;
  commentCount: number;
};

const INITIAL_PICKS: SkinPick[] = [
  { id: 1, name: "Kuronami Vandal", weapon: "VANDAL", rarity: "EXCLUSIVE", votes: 4821, userVoted: null, commentCount: 34 },
  { id: 2, name: "Reaver Vandal", weapon: "VANDAL", rarity: "PREMIUM", votes: 4322, userVoted: null, commentCount: 28 },
  { id: 3, name: "Oni Phantom", weapon: "PHANTOM", rarity: "PREMIUM", votes: 3982, userVoted: null, commentCount: 22 },
  { id: 4, name: "Elderflame Operator", weapon: "OPERATOR", rarity: "ULTRA", votes: 3491, userVoted: null, commentCount: 45 },
  { id: 5, name: "Neo Frontier Sheriff", weapon: "SHERIFF", rarity: "EXCLUSIVE", votes: 2981, userVoted: null, commentCount: 19 },
  { id: 6, name: "Sovereign Ghost", weapon: "GHOST", rarity: "PREMIUM", votes: 1821, userVoted: null, commentCount: 14 }
];

const TABS = ["ALL", "RIFLES", "SNIPERS", "SIDEARMS"] as const;

export default function CommunityHubPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("ALL");
  const [picks, setPicks] = useState<SkinPick[]>(INITIAL_PICKS);
  const [suggestionName, setSuggestionName] = useState("");
  const [suggestionWeapon, setSuggestionWeapon] = useState<SkinPick["weapon"]>("VANDAL");

  const filteredPicks = picks.filter((pick) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "RIFLES") return pick.weapon === "VANDAL" || pick.weapon === "PHANTOM";
    if (activeTab === "SNIPERS") return pick.weapon === "OPERATOR";
    if (activeTab === "SIDEARMS") return pick.weapon === "SHERIFF" || pick.weapon === "GHOST";
    return true;
  });

  const handleVote = (id: number, direction: "up" | "down") => {
    setPicks((prev) =>
      prev.map((pick) => {
        if (pick.id !== id) return pick;

        let diff = 0;
        let nextVoted: "up" | "down" | null = direction;

        if (pick.userVoted === direction) {
          diff = direction === "up" ? -1 : 1;
          nextVoted = null;
        } else if (pick.userVoted) {
          diff = direction === "up" ? 2 : -2;
        } else {
          diff = direction === "up" ? 1 : -1;
        }

        return { ...pick, votes: pick.votes + diff, userVoted: nextVoted };
      })
    );
    toast.success("Telemetry vote logged.", {
      className: "font-mono rounded-none"
    });
  };

  const handleAddSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionName.trim()) {
      toast.error("Please enter a skin name.");
      return;
    }

    const newSuggestion: SkinPick = {
      id: Date.now(),
      name: suggestionName.trim(),
      weapon: suggestionWeapon,
      rarity: "PREMIUM",
      votes: 1,
      userVoted: "up",
      commentCount: 0
    };

    setPicks([newSuggestion, ...picks]);
    setSuggestionName("");
    toast.success(`Suggested "${newSuggestion.name}" successfully!`, {
      className: "font-mono rounded-none border-[#FF4655]"
    });
  };

  return (
    <div className="min-h-screen bg-[#0B141A] py-16 text-foreground">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />
      <div className="relative z-10">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">COMMUNITY HUB</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">COMMUNITY</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Vote, suggest, and track the most popular skin picks across the ValoVault community.
            </p>
          </Container>
        </div>

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] items-start">
          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-4" role="tablist" aria-label="Filter by weapon type">
              {TABS.map((tab) => (
                <button key={tab} type="button" role="tab" aria-selected={activeTab===tab}
                  onClick={() => setActiveTab(tab)}
                  className={[
                    "border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeTab===tab ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-white/30 hover:text-white",
                  ].join(" ")}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Picks */}
            <div className="space-y-3">
              {filteredPicks.map((pick, i) => (
                <Reveal key={pick.id} delay={i * 0.03}>
                  <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-border bg-[#0D1A22] p-5 transition-all duration-200 hover:border-primary/40">
                    <div aria-hidden="true" className="absolute left-0 inset-y-0 w-[3px] bg-border transition-all group-hover:bg-primary" />
                    <div className="pl-4 space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[9px]">
                        <span className="font-bold text-white">{pick.weapon}</span>
                        <span className="text-muted">·</span>
                        <span className="text-primary font-bold">{pick.rarity}</span>
                        <span className="text-muted">· {pick.commentCount} comments</span>
                      </div>
                      <h3 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors truncate">
                        {pick.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 pl-4 sm:pl-0 shrink-0">
                      <span className={["font-mono text-2xl font-black", pick.userVoted ? "text-primary" : "text-foreground"].join(" ")}>
                        {pick.votes.toLocaleString()}
                      </span>
                      <div className="flex flex-col gap-1">
                        <button type="button" onClick={() => handleVote(pick.id, "up")} aria-label={`Upvote ${pick.name}`} aria-pressed={pick.userVoted==="up"}
                          className={["flex h-8 w-8 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                            pick.userVoted==="up" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/50 hover:text-primary"].join(" ")}>
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => handleVote(pick.id, "down")} aria-label={`Downvote ${pick.name}`} aria-pressed={pick.userVoted==="down"}
                          className={["flex h-8 w-8 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                            pick.userVoted==="down" ? "border-white/40 bg-white/10 text-white" : "border-border text-muted hover:border-white/30 hover:text-white"].join(" ")}>
                          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Suggest form */}
          <Reveal className="border border-border bg-[#0D1A22] p-6 space-y-5 cut-corner-br">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-border pb-4">
              Suggest a Skin
            </h2>
            <form onSubmit={handleAddSuggestion} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="suggest-weapon" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Weapon</label>
                <select id="suggest-weapon" value={suggestionWeapon} onChange={e => setSuggestionWeapon(e.target.value as SkinPick["weapon"])}
                  className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
                  {(["VANDAL","PHANTOM","OPERATOR","SHERIFF","GHOST"] as const).map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="suggest-name" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Skin Name</label>
                <input id="suggest-name" type="text" value={suggestionName} onChange={e => setSuggestionName(e.target.value)}
                  placeholder="e.g. Kuronami, Prime…"
                  className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none" />
              </div>
              <Button type="submit" variant="primary" className="w-full cut-corner-br">Submit</Button>
            </form>
            <p className="font-sans text-[11px] leading-relaxed text-muted">
              Top-rated suggestions are tracked in our store registries.
            </p>
          </Reveal>
        </div>
      </Container>
      </div>
    </div>
  );
}
