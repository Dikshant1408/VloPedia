"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/container";
import { AgentCard } from "@/components/agent-card";
import { PageTransition } from "@/components/motion-system";
import type { ValorantAgent } from "@/lib/valorant-types";

const ROLES = ["All", "Duelist", "Controller", "Initiator", "Sentinel"] as const;
type RoleFilter = (typeof ROLES)[number];

const ROLE_ACCENT: Record<string, string> = {
  Duelist:    "border-role-duelist/40  text-role-duelist",
  Controller: "border-role-controller/40 text-role-controller",
  Initiator:  "border-role-initiator/40 text-role-initiator",
  Sentinel:   "border-role-sentinel/40  text-role-sentinel",
};

const ROLE_BG: Record<string, string> = {
  Duelist:    "from-role-duelist/5",
  Controller: "from-role-controller/5",
  Initiator:  "from-role-initiator/5",
  Sentinel:   "from-role-sentinel/5",
};

interface AgentsClientProps {
  initialAgents: ValorantAgent[];
}

export function AgentsClient({ initialAgents }: AgentsClientProps) {
  const [filter, setFilter] = useState<RoleFilter>("All");

  // Group by role for the role-grouped layout
  const roleGroups: Record<string, ValorantAgent[]> = {};
  const displayRoles = filter === "All"
    ? ["Duelist", "Controller", "Initiator", "Sentinel"]
    : [filter];

  for (const role of displayRoles) {
    roleGroups[role] = initialAgents.filter(a => a.role?.displayName === role);
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Page header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#0DF2F2]" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">
                DATABASE_ONLINE // v1.23
              </span>
            </div>
            <h1 className="font-display font-black text-6xl uppercase tracking-tighter text-foreground sm:text-7xl lg:text-8xl flex items-center gap-4">
              AGENTS
              <span className="w-2.5 h-2.5 bg-[#0DF2F2] rounded-full animate-pulse" aria-hidden="true" />
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
              Every operative in the Protocol. Browse by role, study abilities, and build your tactical identity.
            </p>

            {/* Role filter pills */}
            <div
              className="mt-8 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter agents by role"
            >
              {ROLES.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFilter(role)}
                  aria-pressed={filter === role}
                  className={[
                    "border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-200",
                    filter === role
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] text-muted hover:border-white/30 hover:text-white",
                    role !== "All" ? ROLE_ACCENT[role] ?? "" : "",
                    filter === role && role !== "All" ? (ROLE_ACCENT[role] ?? "").replace("/40", "") : "",
                  ].filter(Boolean).join(" ")}
                >
                  {role}
                </button>
              ))}
            </div>
          </Container>
        </div>

        {/* Role-grouped agent grid */}
        <div className="py-16">
          {displayRoles.map(role => {
            const roleAgents = roleGroups[role] ?? [];
            if (roleAgents.length === 0) return null;
            return (
              <section key={role} className="mb-20">
                <Container>
                  {/* Role section header */}
                  <div className={`mb-8 border-b border-border pb-5 flex items-center gap-4`}>
                    <div
                      className={`h-full w-[3px] self-stretch rounded-full bg-gradient-to-b ${ROLE_BG[role] ?? "from-primary/5"} to-transparent`}
                      aria-hidden="true"
                    />
                    <div>
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.4em] ${(ROLE_ACCENT[role] ?? "text-primary").split(" ").find(c => c.startsWith("text-")) ?? "text-primary"}`}>
                        {role}S
                      </span>
                      <p className="font-sans text-[11px] text-muted mt-0.5">
                        {roleAgents.length} operative{roleAgents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Agent cards with layout animation */}
                  <motion.div
                    layout
                    className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {roleAgents.map((agent, i) => (
                        <motion.div
                          key={agent.uuid}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                        >
                          <AgentCard agent={agent} featured={i === 0 && roleAgents.length >= 3} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </Container>
              </section>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
