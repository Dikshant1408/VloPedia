"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { valorantDb } from "@/lib/valorant-db";
import type { ValorantAgent } from "@/lib/valorant-types";

export default function LorePage() {
  const [agents, setAgents] = useState<ValorantAgent[]>([]);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => setAgents(j.data ?? []))
      .catch(() => {});
  }, []);

  const loreItems = valorantDb.lore;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">LORE ARCHIVES</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">LORE</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Kingdom Corp, Radianite origins, and the stories behind every operative.
            </p>
          </Container>
        </div>

        <Container className="py-16">
          {/* Timeline layout */}
          <div className="relative">
            {/* Center spine */}
            <div aria-hidden="true" className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-border to-transparent sm:left-1/2" />

            <div className="space-y-12">
              {loreItems.map((item, i) => {
                // Try to match an agent portrait by comparing lore title to agent names
                const matchedAgent = agents.find(a =>
                  item.title.toLowerCase().includes(a.displayName.toLowerCase()) ||
                  a.displayName.toLowerCase().includes(item.title.toLowerCase().split(" ")[0])
                );
                const portraitImg = matchedAgent?.bustPortrait ?? matchedAgent?.displayIcon ?? null;
                const isLeft = i % 2 === 0;

                return (
                  <Reveal key={item.slug} delay={i * 0.04}>
                    <div className={`relative flex flex-col gap-4 pl-12 sm:pl-0 sm:w-[46%] ${isLeft ? "sm:pr-16 sm:ml-0" : "sm:pl-16 sm:ml-auto"}`}>
                      {/* Timeline dot */}
                      <div
                        aria-hidden="true"
                        className={`absolute top-3 h-4 w-4 rounded-full border-2 border-primary bg-background left-0 sm:left-auto ${isLeft ? "sm:right-[-0.55rem]" : "sm:left-[-0.55rem]"}`}
                      />

                      <Link href={`/lore/${item.slug}`}
                        className="group border border-border bg-[#0D1A22] transition-all duration-300 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        {/* Image */}
                        {portraitImg && (
                          <div className="relative h-32 overflow-hidden border-b border-[rgba(236,232,225,0.08)] bg-[#08111A]">
                            <Image src={portraitImg} alt={item.title} fill sizes="400px"
                              className="object-cover object-top opacity-50 transition-opacity duration-300 group-hover:opacity-80" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-card to-transparent" />
                          </div>
                        )}
                        <div className="p-5 space-y-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                            Chapter {item.chapter}
                          </span>
                          <h2 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors">
                            {item.title}
                          </h2>
                          <p className="font-sans text-xs leading-relaxed text-muted line-clamp-2">{item.summary}</p>
                        </div>
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
