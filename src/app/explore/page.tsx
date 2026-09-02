"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Network, Users, Shield, BookOpen, Crosshair, 
  MapPin, Sparkles, ArrowRight, Compass, Zap, HelpCircle 
} from "lucide-react";

type NodeType = "AGENT" | "FACTION" | "EVENT" | "WEAPON" | "MAP";

interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  roleOrCategory?: string;
  desc: string;
  href: string;
  connections: string[]; // Connected node IDs
}

interface RelationshipDetail {
  from: string;
  to: string;
  relationType: "SYNERGY" | "COUNTER" | "LORE_ALLY" | "LORE_RIVAL" | "FACTION_MEMBER" | "SIGNATURE_LOADOUT" | "HOME_BATTLEGROUND";
  explanation: string;
}

const GRAPH_NODES: Record<string, GraphNode> = {
  // Agents
  omen: {
    id: "omen",
    name: "Omen",
    type: "AGENT",
    roleOrCategory: "Controller",
    desc: "A phantom of a memory with shadow manipulation abilities, seeking his fractured human identity.",
    href: "/agents/omen",
    connections: ["viper", "sage", "kingdom", "valorant-protocol", "first-light", "phantom", "ascent", "jett"]
  },
  viper: {
    id: "viper",
    name: "Viper (Dr. Sabine Callas)",
    type: "AGENT",
    roleOrCategory: "Controller",
    desc: "Founding chemist of VALORANT Protocol and former Kingdom Corp chief scientific researcher.",
    href: "/agents/viper",
    connections: ["omen", "kingdom", "valorant-protocol", "first-light", "bind", "breeze", "phantom"]
  },
  jett: {
    id: "jett",
    name: "Jett (Sunwoo Han)",
    type: "AGENT",
    roleOrCategory: "Duelist",
    desc: "South Korean radiant with atmospheric wind currents manipulation. Accused of the Venice Ascent incident.",
    href: "/agents/jett",
    connections: ["omen", "sova", "valorant-protocol", "ascent", "vandal", "operator", "raze", "first-light"]
  },
  sova: {
    id: "sova",
    name: "Sova (Sasha Novikov)",
    type: "AGENT",
    roleOrCategory: "Initiator",
    desc: "Master Siberian tracker utilizing high-tech cybernetic archery and recon drones.",
    href: "/agents/sova",
    connections: ["jett", "killjoy", "valorant-protocol", "ascent", "icebox", "odin", "vandal"]
  },
  killjoy: {
    id: "killjoy",
    name: "Killjoy (Klara Böhringer)",
    type: "AGENT",
    roleOrCategory: "Sentinel",
    desc: "German engineering prodigy, creator of Spike containment units and Protocol defense grid.",
    href: "/agents/killjoy",
    connections: ["sova", "kingdom", "valorant-protocol", "ascent", "lotus", "phantom"]
  },
  cypher: {
    id: "cypher",
    name: "Cypher (Aamir El Amari)",
    type: "AGENT",
    roleOrCategory: "Sentinel",
    desc: "Moroccan one-man surveillance network keeping eyes on Kingdom, Legion, and the Protocol.",
    href: "/agents/cypher",
    connections: ["jett", "valorant-protocol", "sunset", "split", "bind", "phantom"]
  },
  raze: {
    id: "raze",
    name: "Raze (Tayane Alves)",
    type: "AGENT",
    roleOrCategory: "Duelist",
    desc: "Impulsive Salvadorian demolition expert who turned industrial mining tools into explosive mobility weapons.",
    href: "/agents/raze",
    connections: ["jett", "killjoy", "valorant-protocol", "bind", "lotus", "phantom"]
  },

  // Factions
  "valorant-protocol": {
    id: "valorant-protocol",
    name: "VALORANT Protocol",
    type: "FACTION",
    roleOrCategory: "Shadow Organization",
    desc: "Covert multinational emergency defense organization established by Brimstone and Viper following First Light.",
    href: "/lore/valorant-protocol",
    connections: ["omen", "viper", "jett", "sova", "killjoy", "cypher", "raze", "kingdom", "legion", "first-light"]
  },
  kingdom: {
    id: "kingdom",
    name: "Kingdom Corporation",
    type: "FACTION",
    roleOrCategory: "Mega-Corporation",
    desc: "Global energy conglomerate that privatized Radianite refining, dominating world power infrastructure.",
    href: "/lore/kingdom",
    connections: ["viper", "omen", "killjoy", "valorant-protocol", "first-light", "bind", "icebox"]
  },
  legion: {
    id: "legion",
    name: "Legion (Omega Earth)",
    type: "FACTION",
    roleOrCategory: "Counterpart Taskforce",
    desc: "Omega Earth's mirror operative initiative crossing dimensional rifts to siphon Alpha Earth's Radianite reserves.",
    href: "/lore/legion",
    connections: ["valorant-protocol", "first-light", "pearl", "lotus"]
  },

  // Events
  "first-light": {
    id: "first-light",
    name: "First Light Event",
    type: "EVENT",
    roleOrCategory: "Cataclysmic Epoch",
    desc: "The global cosmological event that introduced Radianite to Earth and triggered spontaneous human mutations.",
    href: "/lore/first-light",
    connections: ["omen", "viper", "jett", "valorant-protocol", "kingdom", "radianite"]
  },
  radianite: {
    id: "radianite",
    name: "Radianite Element",
    type: "EVENT",
    roleOrCategory: "Supernatural Mineral",
    desc: "Dense, hyper-potent crystalline energy source capable of warping physical space, telekinesis, and matter.",
    href: "/lore/radianite",
    connections: ["first-light", "kingdom", "valorant-protocol"]
  },

  // Maps
  ascent: {
    id: "ascent",
    name: "Ascent (Venice, Italy)",
    type: "MAP",
    roleOrCategory: "Battleground",
    desc: "Floating Italian city sector ripped into the sky during an early Omega Earth dimensional rift detonation.",
    href: "/maps/ascent",
    connections: ["jett", "omen", "sova", "killjoy", "valorant-protocol"]
  },
  bind: {
    id: "bind",
    name: "Bind (Rabat, Morocco)",
    type: "MAP",
    roleOrCategory: "Battleground",
    desc: "Kingdom Radianite processing facility in the Moroccan desert featuring experimental teleportation arches.",
    href: "/maps/bind",
    connections: ["viper", "raze", "cypher", "kingdom", "valorant-protocol"]
  },
  sunset: {
    id: "sunset",
    name: "Sunset (Los Angeles, USA)",
    type: "MAP",
    roleOrCategory: "Battleground",
    desc: "Kingdom research center nestled in a vibrant Los Angeles cultural corridor.",
    href: "/maps/sunset",
    connections: ["cypher", "valorant-protocol"]
  },
  icebox: {
    id: "icebox",
    name: "Icebox (Bennett Island, Russia)",
    type: "MAP",
    roleOrCategory: "Battleground",
    desc: "Secret Kingdom arctic container port shipping high-grade Radianite through frozen sea lanes.",
    href: "/maps/icebox",
    connections: ["sova", "viper", "kingdom"]
  },

  // Weapons
  vandal: {
    id: "vandal",
    name: "Vandal Rifle",
    type: "WEAPON",
    roleOrCategory: "Assault Rifle",
    desc: "2,900 VP high-damage rifle providing guaranteed 160-damage one-tap headshots across all ranges.",
    href: "/weapons/vandal",
    connections: ["jett", "sova", "operator", "phantom"]
  },
  phantom: {
    id: "phantom",
    name: "Phantom Rifle",
    type: "WEAPON",
    roleOrCategory: "Assault Rifle",
    desc: "2,900 VP silenced assault rifle with 30-round magazine and zero bullet tracers through smoke.",
    href: "/weapons/phantom",
    connections: ["omen", "viper", "killjoy", "cypher", "raze", "vandal"]
  },
  operator: {
    id: "operator",
    name: "Operator Heavy Sniper",
    type: "WEAPON",
    roleOrCategory: "Sniper Rifle",
    desc: "4,700 VP one-shot body kill high-impact sniper rifle favored by mobility duelists.",
    href: "/weapons/operator",
    connections: ["jett", "vandal"]
  },
  odin: {
    id: "odin",
    name: "Odin Heavy Machine Gun",
    type: "WEAPON",
    roleOrCategory: "Machine Gun",
    desc: "3,200 VP high-penetration suppression weapon that shreds paper-thin walls on Ascent and Haven.",
    href: "/weapons/odin",
    connections: ["sova", "ascent"]
  },
};

const RELATIONSHIPS: Record<string, RelationshipDetail> = {
  "omen-viper": {
    from: "omen",
    to: "viper",
    relationType: "LORE_ALLY",
    explanation: "Viper (Dr. Sabine Callas) was present during the Kingdom laboratory catastrophe that destroyed Omen's human body. She holds deep guilt and possesses fragments of his lost past identity."
  },
  "jett-omen": {
    from: "jett",
    to: "omen",
    relationType: "SYNERGY",
    explanation: "Tactical Execution Synergy: Omen's Paranoia blind isolates bomb site chokepoints, enabling Jett to Tailwind dash safely onto site."
  },
  "jett-ascent": {
    from: "jett",
    to: "ascent",
    relationType: "HOME_BATTLEGROUND",
    explanation: "Narrative & Map Fit: Omega Earth Jett was framed by media for the Venice explosion. In gameplay, Ascent's open courtyards make Jett's Operator angles S-Tier."
  },
  "sova-ascent": {
    from: "sova",
    to: "ascent",
    relationType: "HOME_BATTLEGROUND",
    explanation: "Wall Penetration Synergy: Sova's Recon Bolt scans open skyboxes and highlights enemies through Ascent's paper-thin wall-bangable structures for Odin/Vandal finishes."
  },
  "jett-cypher": {
    from: "jett",
    to: "cypher",
    relationType: "COUNTER",
    explanation: "Hard Matchup Counter: Cypher's hidden Trapwires halt Jett's dash momentum mid-air, leaving her vulnerable to immediate crossfire punishment."
  },
  "omen-phantom": {
    from: "omen",
    to: "phantom",
    relationType: "SIGNATURE_LOADOUT",
    explanation: "Weapon Synergy: The Phantom's silenced bullet tracers allow Omen to spam through Dark Cover hollow smokes without revealing muzzle direction."
  },
};

const TYPE_COLORS: Record<NodeType, { border: string; bg: string; text: string; badge: string }> = {
  AGENT:   { border: "border-primary/40", bg: "bg-primary/10", text: "text-primary", badge: "border-primary/30 text-primary" },
  FACTION: { border: "border-[#0DF2F2]/40", bg: "bg-[#0DF2F2]/10", text: "text-[#0DF2F2]", badge: "border-[#0DF2F2]/30 text-[#0DF2F2]" },
  EVENT:   { border: "border-amber-400/40", bg: "bg-amber-400/10", text: "text-amber-400", badge: "border-amber-400/30 text-amber-400" },
  WEAPON:  { border: "border-purple-400/40", bg: "bg-purple-400/10", text: "text-purple-400", badge: "border-purple-400/30 text-purple-400" },
  MAP:     { border: "border-emerald-400/40", bg: "bg-emerald-400/10", text: "text-emerald-400", badge: "border-emerald-400/30 text-emerald-400" },
};

export default function KnowledgeGraphExplorerPage() {
  const [activeNodeId, setActiveNodeId] = useState<string>("omen");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [inspectTargetId, setInspectTargetId] = useState<string>("viper");

  const activeNode = GRAPH_NODES[activeNodeId] || GRAPH_NODES.omen;

  // Filter nodes
  const visibleNodes = useMemo(() => {
    let list = Object.values(GRAPH_NODES);
    if (filterType !== "ALL") {
      list = list.filter(n => n.type === filterType);
    }
    return list;
  }, [filterType]);

  // Connected nodes to the active node
  const connectedNodes = useMemo(() => {
    return activeNode.connections
      .map(id => GRAPH_NODES[id])
      .filter(Boolean);
  }, [activeNode]);

  // Relationship detail between activeNode and inspectTarget
  const relationDetail = useMemo(() => {
    const key1 = `${activeNodeId}-${inspectTargetId}`;
    const key2 = `${inspectTargetId}-${activeNodeId}`;
    return RELATIONSHIPS[key1] || RELATIONSHIPS[key2] || {
      from: activeNodeId,
      to: inspectTargetId,
      relationType: "SYNERGY",
      explanation: `${activeNode.name} and ${GRAPH_NODES[inspectTargetId]?.name || inspectTargetId} are interconnected in the VloPedia tactical and lore knowledge network.`
    };
  }, [activeNodeId, inspectTargetId, activeNode]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Knowledge Graph Explorer" }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-12">
        <Container className="space-y-10">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-8">
            <div className="space-y-2">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                  INTERACTIVE KNOWLEDGE GRAPH EXPLORER
                </span>
              </div>
              <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
                RELATIONAL INTELLIGENCE WEB
              </h1>
              <p className="font-sans text-sm text-secondary max-w-2xl leading-relaxed">
                Explore the interconnected web linking Operatives, Factions, Lore Cataclysms, Weapon Armory, and Map Geography. Click any entity to inspect its live relational pathways.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">Active Node:</span>
              <span className="font-mono text-xs uppercase px-3 py-1 border border-primary/40 bg-primary/10 text-primary font-bold">
                {activeNode.name}
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(236,232,225,0.08)] pb-4">
            {["ALL", "AGENT", "FACTION", "EVENT", "WEAPON", "MAP"].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`font-mono text-xs uppercase px-3 py-1.5 border transition-all ${
                  filterType === f
                    ? "border-primary bg-primary text-black font-bold"
                    : "border-[rgba(236,232,225,0.1)] bg-surface text-secondary hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ── Main Graph Explorer Grid ── */}
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left: Node Cloud Picker */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <div className="flex items-center gap-2 text-primary">
                  <Network className="h-4 w-4" />
                  <h3 className="font-display font-black text-lg uppercase text-white">Select Anchor Node</h3>
                </div>
                <span className="font-mono text-[10px] text-muted">{visibleNodes.length} Nodes</span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[480px] overflow-y-auto pr-1">
                {visibleNodes.map(node => {
                  const isActive = node.id === activeNodeId;
                  const isConnected = activeNode.connections.includes(node.id);
                  const colors = TYPE_COLORS[node.type];

                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        setActiveNodeId(node.id);
                        if (node.connections[0]) setInspectTargetId(node.connections[0]);
                      }}
                      className={`font-mono text-xs uppercase px-3 py-2 border transition-all text-left flex items-center justify-between gap-2 ${
                        isActive
                          ? "border-primary bg-primary text-black font-black shadow-lg scale-105"
                          : isConnected
                          ? `border-[rgba(236,232,225,0.25)] bg-[#08111A] text-white hover:border-primary`
                          : "border-[rgba(236,232,225,0.08)] bg-[#08111A]/60 text-muted hover:text-white"
                      }`}
                    >
                      <span>{node.name}</span>
                      {isConnected && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0DF2F2]" title="Connected" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Middle: Active Node Details & Connected Hub */}
            <div className="border border-primary/40 bg-[#0D1A22] p-6 clip-diagonal space-y-6 shadow-xl">
              
              <div className="space-y-2 border-b border-[rgba(236,232,225,0.08)] pb-4">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[9px] uppercase px-2 py-0.5 border font-bold ${TYPE_COLORS[activeNode.type].badge}`}>
                    {`${activeNode.type} // ${activeNode.roleOrCategory || "Core Entity"}`}
                  </span>
                  <Link
                    href={activeNode.href}
                    className="font-mono text-[10px] uppercase text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Full Dossier</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <h2 className="font-display font-black text-3xl uppercase text-white">
                  {activeNode.name}
                </h2>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  {activeNode.desc}
                </p>
              </div>

              {/* Connected Nodes List */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted block">
                  Directly Connected Entities ({connectedNodes.length}):
                </span>
                
                <div className="grid gap-2 sm:grid-cols-2">
                  {connectedNodes.map(cNode => {
                    const isInspecting = cNode.id === inspectTargetId;
                    const cColors = TYPE_COLORS[cNode.type];

                    return (
                      <button
                        key={cNode.id}
                        onClick={() => setInspectTargetId(cNode.id)}
                        className={`p-2.5 text-left border transition-all ${
                          isInspecting
                            ? "border-[#0DF2F2] bg-[#0DF2F2]/10 ring-1 ring-[#0DF2F2]/30"
                            : "border-[rgba(236,232,225,0.06)] bg-[#08111A] hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-mono text-[8px] uppercase ${cColors.text}`}>
                            {cNode.type}
                          </span>
                          {isInspecting && <span className="font-mono text-[8px] text-[#0DF2F2]">INSPECTING</span>}
                        </div>
                        <span className="font-display font-black text-xs uppercase text-white block truncate">
                          {cNode.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right: "Why are they connected?" Pathway Explanation */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-6">
              <div className="flex items-center gap-2 text-[#0DF2F2] border-b border-[rgba(236,232,225,0.08)] pb-3">
                <Zap className="h-4 w-4" />
                <h3 className="font-display font-black text-lg uppercase text-white">Relationship Insight</h3>
              </div>

              <div className="p-4 border border-[rgba(236,232,225,0.06)] bg-[#08111A] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary font-bold">{activeNode.name}</span>
                  <span className="text-muted">⟷</span>
                  <span className="text-[#0DF2F2] font-bold">{GRAPH_NODES[inspectTargetId]?.name || inspectTargetId}</span>
                </div>

                <p className="font-sans text-xs text-secondary leading-relaxed pt-2 border-t border-[rgba(236,232,225,0.04)]">
                  {relationDetail.explanation}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-mono text-[10px] uppercase text-muted tracking-wider">
                  Quick Actions:
                </h4>
                <div className="flex flex-col gap-2">
                  <Link
                    href={activeNode.href}
                    className="w-full text-center font-mono text-xs uppercase py-2 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                  >
                    Explore {activeNode.name} Page →
                  </Link>
                  {GRAPH_NODES[inspectTargetId] && (
                    <Link
                      href={GRAPH_NODES[inspectTargetId].href}
                      className="w-full text-center font-mono text-xs uppercase py-2 border border-[rgba(236,232,225,0.1)] bg-[#08111A] text-secondary hover:text-white transition-colors"
                    >
                      Explore {GRAPH_NODES[inspectTargetId].name} Page →
                    </Link>
                  )}
                </div>
              </div>
            </div>

          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
