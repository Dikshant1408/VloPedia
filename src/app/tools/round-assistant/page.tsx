"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Calculator, DollarSign, Shield, Zap, AlertCircle, 
  CheckCircle, ArrowRight, HelpCircle 
} from "lucide-react";

export default function RoundDecisionAssistantPage() {
  const [credits, setCredits] = useState<number>(2800);
  const [lossStreak, setLossStreak] = useState<number>(1);
  const [roundNumber, setRoundNumber] = useState<number>(3);
  const [prevWon, setPrevWon] = useState<boolean>(false);

  const breadcrumbItems = [
    { label: "Tools", href: "/tools" },
    { label: "Economy & Round Decision Assistant" }
  ];

  // Loss streak bonus calculations
  const nextRoundLossBonus = prevWon ? 1900 : Math.min(1900 + lossStreak * 500, 2900);
  const nextRoundWinBonus = 3000;

  // Economy decision rules
  let decisionTitle = "FULL BUY";
  let decisionBadge = "border-primary bg-primary/10 text-primary";
  let maxSpend = 0;
  let explanation = "";

  if (credits >= 3900) {
    decisionTitle = "FULL BUY (RIFLES + HEAVY ARMOR)";
    decisionBadge = "border-primary bg-primary/20 text-primary font-black";
    maxSpend = credits - 3900;
    explanation = "You have sufficient credits to purchase a primary rifle (Vandal / Phantom at 2,900 credits) plus Heavy Shields (1,000 credits) and full utility without risking next round's buy capability.";
  } else if (credits >= 2400 && credits < 3900) {
    if (roundNumber === 2 && prevWon) {
      decisionTitle = "BONUS ROUND (CARRY OVER SMGS)";
      decisionBadge = "border-amber-400 bg-amber-400/20 text-amber-400 font-black";
      explanation = "Round 2 after winning pistol: You hold weapon advantage against enemy eco. Keep your Spectre / Ghost, buy shields, and bank your credits for Round 3 full rifles.";
    } else if (credits + nextRoundLossBonus >= 3900) {
      const allowedSpend = credits + nextRoundLossBonus - 3900;
      decisionTitle = `HALF BUY (SPEND UP TO $${allowedSpend})`;
      decisionBadge = "border-[#0DF2F2] bg-[#0DF2F2]/20 text-[#0DF2F2] font-black";
      explanation = `Buy a Sheriff, Ghost, or Outlaw while keeping at least $${credits - allowedSpend} banked. Guaranteed to reach the $3,900 full rifle threshold next round regardless of round outcome.`;
    } else {
      decisionTitle = "FULL ECO / SAVE";
      decisionBadge = "border-muted bg-surface text-muted font-black";
      explanation = "Save all credits. Buying now will drop your team below the $3,900 threshold next round, causing a staggered multi-round economy deficit.";
    }
  } else {
    decisionTitle = "FULL ECO / SAVE (BUY NOTHING)";
    decisionBadge = "border-muted bg-surface text-muted font-black";
    explanation = "Do not purchase weapons or armor this round. Bank all credits so your team can full buy rifles next round with loss bonus.";
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-12">
        <Container className="space-y-10 max-w-4xl">
          
          {/* Header */}
          <div className="space-y-3 border-b border-[rgba(236,232,225,0.08)] pb-8">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                ECONOMY MATHEMATICS & DECISION ENGINE
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
              ROUND DECISION ASSISTANT
            </h1>
            <p className="font-sans text-sm text-secondary">
              Input your credits and loss streak to receive an algorithmically computed buy/save directive with next-round loss buffer guarantees.
            </p>
          </div>

          {/* Calculator Controls */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Credits */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">Current Credits ($)</label>
              <input
                type="number"
                step="100"
                min="0"
                max="9000"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value) || 0)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none font-bold"
              />
            </div>

            {/* Round Number */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">Round Number</label>
              <input
                type="number"
                min="1"
                max="24"
                value={roundNumber}
                onChange={(e) => setRoundNumber(Number(e.target.value) || 1)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
              />
            </div>

            {/* Previous Round */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">Previous Round Result</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setPrevWon(true); setLossStreak(0); }}
                  className={`py-2 text-xs font-mono uppercase font-bold border transition-all ${
                    prevWon ? "border-primary bg-primary/20 text-primary" : "border-[rgba(236,232,225,0.1)] text-muted"
                  }`}
                >
                  WON
                </button>
                <button
                  type="button"
                  onClick={() => { setPrevWon(false); setLossStreak(Math.max(1, lossStreak)); }}
                  className={`py-2 text-xs font-mono uppercase font-bold border transition-all ${
                    !prevWon ? "border-error bg-error/20 text-error" : "border-[rgba(236,232,225,0.1)] text-muted"
                  }`}
                >
                  LOST
                </button>
              </div>
            </div>

            {/* Loss Streak */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">Consecutive Losses</label>
              <select
                disabled={prevWon}
                value={lossStreak}
                onChange={(e) => setLossStreak(Number(e.target.value))}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2.5 font-sans text-xs text-white focus:border-primary focus:outline-none disabled:opacity-40"
              >
                <option value={0}>0 (Previous Win)</option>
                <option value={1}>1 Loss (+$1,900)</option>
                <option value={2}>2 Losses (+$2,400)</option>
                <option value={3}>3+ Losses (+$2,900 Max)</option>
              </select>
            </div>

          </div>

          {/* ── Calculated Recommendation Box ── */}
          <div className="border border-primary/40 bg-[#0D1A22] p-8 clip-diagonal space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold block">
                  ECONOMY CALL
                </span>
                <h2 className="font-display font-black text-3xl uppercase text-white">
                  {decisionTitle}
                </h2>
              </div>

              <div className="font-mono text-right">
                <span className="text-[10px] text-muted block uppercase">Guaranteed Next Round:</span>
                <span className="text-lg font-black text-[#0DF2F2]">
                  ${credits + nextRoundLossBonus} Minimum
                </span>
              </div>
            </div>

            <p className="font-sans text-sm text-secondary leading-relaxed bg-[#08111A] p-5 border border-[rgba(236,232,225,0.04)]">
              {explanation}
            </p>

            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="p-4 border border-[rgba(236,232,225,0.06)] bg-[#08111A] text-center space-y-1">
                <span className="font-mono text-[9px] uppercase text-muted block">Next Round If You Win</span>
                <span className="font-mono text-base font-bold text-white">${credits + nextRoundWinBonus}</span>
              </div>
              <div className="p-4 border border-[rgba(236,232,225,0.06)] bg-[#08111A] text-center space-y-1">
                <span className="font-mono text-[9px] uppercase text-muted block">Next Round If You Lose</span>
                <span className="font-mono text-base font-bold text-primary">${credits + nextRoundLossBonus}</span>
              </div>
              <div className="p-4 border border-[rgba(236,232,225,0.06)] bg-[#08111A] text-center space-y-1">
                <span className="font-mono text-[9px] uppercase text-muted block">Full Buy Threshold</span>
                <span className="font-mono text-base font-bold text-[#0DF2F2]">$3,900 Credits</span>
              </div>
            </div>
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
