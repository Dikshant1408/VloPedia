/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { playSFX } from "../utils/sfx";
import { Calendar, Newspaper, Terminal, Radio, Shield, HelpCircle, FileText } from "lucide-react";

interface NewsHubProps {
  subTab: string;
}

export default function NewsHub({ subTab }: NewsHubProps) {
  // 1. All News State
  const articles = [
    {
      title: "EPISODE 9 ACT 1 UPDATE PROTOCOL",
      category: "GAME UPDATES",
      date: "JULY 12, 2026",
      desc: "Introducing Abyss map design specs, heavy adjustments to standard competitive pool queues, and Premier division resets.",
      color: "#FA4454",
      image: "https://media.valorant-api.com/maps/d96436a5-4ef7-b22e-9d99-ca82e11d7862/splash.png"
    },
    {
      title: "CHAMPIONS SEOUL: COMBAT ROSTERS ANNOUNCED",
      category: "ESPORTS NEWS",
      date: "JULY 08, 2026",
      desc: "Verify qualified seed brackets from Americas, EMEA, Pacific, and CN sectors. Standings reset for active pro players.",
      color: "#0DF2F2",
      image: "https://media.valorant-api.com/playercards/2dfb7bb9-4d6d-2391-7290-76bc06a92b23/largeart.png"
    },
    {
      title: "VYSE AGENT DOSSIER RECRUITMENT",
      category: "AGENT ANNOUNCEMENT",
      date: "JULY 01, 2026",
      desc: "Sentinels division recruits Vyse. Read through abilities, liquid steel barriers, and primary blind flash triggers.",
      color: "#ECE8E1",
      image: "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba104/background.png"
    }
  ];

  // 2. Patch Notes details
  const patches = [
    {
      version: "PATCH VERSION 9.02 // BALANCE UPDATE",
      date: "JULY 15, 2026",
      buffs: [
        { target: "Neon Duelist", note: "Increased slide speed velocity by 5%. Slide equip recovery time reduced from 0.4s to 0.2s." },
        { target: "Iso Shield", note: "Energy double-tap active shield duration increased from 12 seconds to 15 seconds." }
      ],
      nerfs: [
        { target: "Vyse Sentinel", note: "Shear wall barrier charge delay increased from 0.2s to 0.4s. Blind flash cooldown increased to 25s." },
        { target: "Outlaw Sniper", note: "Ammunition cost increased from 2400 to 2500 credits. Reload speed on single shot slowed by 8%." }
      ]
    }
  ];

  // 3. Game updates logs
  const announcements = [
    { title: "SERVER REGION STABILITY", date: "JULY 14, 2026", status: "RESOLVED", details: "Server routing nodes in EMEA and APAC underwent emergency repairs. Latency rates successfully normalized back to 14ms." },
    { title: "PREMIER DIVISION BRACKETS", date: "JULY 10, 2026", status: "COMPLETED", details: "Matches under Div 1-5 have completed. Qualification flags set for regional tournament brackets." }
  ];

  // 1. ALL NEWS VIEW
  if (subTab === "news") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-14">
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 bg-[#FA4454]" />
            Communication Portal
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#ECE8E1] tracking-tight uppercase">
            Protocol Intel Directory
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-3 font-sans leading-snug">
            Official central announcements log. Read gaming reports, patch analysis briefings, and tournament highlights.
          </p>
        </div>

        {/* News articles grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <div
              key={idx}
              className="bg-[#0B141A]/90 surface-glass border border-[rgba(236,232,225,0.08)] p-5 clip-diagonal-sm flex flex-col justify-between hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-all group relative"
            >
              <span className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="h-44 overflow-hidden border border-[rgba(236,232,225,0.08)] rounded-xs mb-5 relative">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                    referrerPolicy="no-referrer"
                  />
                  <span className="corner-chip">{art.category}</span>
                </div>
                <span className="font-mono text-[10px] text-white/30 block mb-2">{art.date}</span>
                <h3 className="font-display font-black text-xl text-white leading-tight uppercase group-hover:text-[#FA4454] transition-colors mb-3">
                  {art.title}
                </h3>
                <p className="text-white/60 text-xs leading-snug font-sans">
                  {art.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // 2. PATCH NOTES VIEW
  if (subTab === "patch-notes") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-14">
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 bg-[#0DF2F2]" />
            System Update Details
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#ECE8E1] tracking-tight uppercase">
            Official Balancing Patch Notes
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-3 font-sans leading-snug">
            Dossier tracking active agent buffs, nerfs, coordinate revisions, and weapon price adjustments.
          </p>
        </div>

        {patches.map((patch, idx) => (
          <div key={idx} className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A]/90 surface-glass p-6 clip-diagonal-sm space-y-8">
            <div className="flex justify-between items-center border-b border-[rgba(236,232,225,0.08)] pb-4">
              <span className="font-mono text-[10px] text-[#0DF2F2] font-black uppercase">{patch.version}</span>
              <span className="font-mono text-[10px] text-white/40">{patch.date}</span>
            </div>

            {/* Buffs */}
            <div>
              <h3 className="font-mono text-[10px] text-[#0DF2F2] font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#0DF2F2]" />
                Buffs
              </h3>
              <div className="space-y-5 font-sans text-xs text-white/70">
                {patch.buffs.map((b, bIdx) => (
                  <div key={bIdx} className="border-l-2 border-[#0DF2F2] pl-4">
                    <strong className="font-mono text-white block mb-1 uppercase">{b.target}</strong>
                    {b.note}
                  </div>
                ))}
              </div>
            </div>

            {/* Nerfs */}
            <div className="pt-5 border-t border-[rgba(236,232,225,0.08)]">
              <h3 className="font-mono text-[10px] text-[#FA4454] font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#FA4454]" />
                Nerfs
              </h3>
              <div className="space-y-5 font-sans text-xs text-white/70">
                {patch.nerfs.map((n, nIdx) => (
                  <div key={nIdx} className="border-l-2 border-[#FA4454] pl-4">
                    <strong className="font-mono text-white block mb-1 uppercase">{n.target}</strong>
                    {n.note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  // 3. GAME UPDATES VIEW (Announcements)
  if (subTab === "game-updates") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-14">
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 bg-[#FA4454]" />
            Databank Logs
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#ECE8E1] tracking-tight uppercase">
            System Announcements
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-3 font-sans leading-snug">
            Central transponder status monitor logs. Review server maintenance parameters and division status flags.
          </p>
        </div>

        <div className="space-y-6">
          {announcements.map((ann, idx) => (
            <div key={idx} className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A]/90 surface-glass p-6 clip-diagonal-sm relative">
              <span className="corner-chip">{ann.status}</span>
              <span className="font-mono text-[10px] text-white/30 block mb-2">{ann.date}</span>
              <h3 className="font-display font-black text-xl text-white mb-3 uppercase">{ann.title}</h3>
              <p className="text-white/70 font-sans text-xs leading-snug">{ann.details}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
}
