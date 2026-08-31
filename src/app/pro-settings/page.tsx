"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Copy, Search, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Button } from "@/components/ui/button";

/* ── Static pro data (admin-managed in production via Firestore) ── */
type ProPlayer = {
  name: string; team: string; region: string;
  dpi: number; sens: number; edpi: number;
  mouse: string; resolution: string; crosshair: string;
};

const PLAYERS: ProPlayer[] = [
  { name:"TenZ",       team:"Sentinels",    region:"NA",   dpi:1600, sens:0.3,  edpi:480, mouse:"Lamzu Thorn",          resolution:"1920×1080", crosshair:"0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;1b;0" },
  { name:"aspas",      team:"Leviatán",     region:"LATAM",dpi:800,  sens:0.4,  edpi:320, mouse:"Wooting 60HE",          resolution:"1920×1080", crosshair:"0;p;0;s;1;P;c;5;o;1;d;1;f;0;0t;4;0l;6;0o;2;0a;1;1b;0" },
  { name:"Boaster",    team:"Fnatic",       region:"EMEA", dpi:800,  sens:0.22, edpi:176, mouse:"Logitech G Pro X 2",    resolution:"1920×1080", crosshair:"0;p;0;s;1;P;c;1;o;1;d;1;0b;0;1b;0" },
  { name:"Chronicle",  team:"Fnatic",       region:"EMEA", dpi:800,  sens:0.24, edpi:192, mouse:"Razer DeathAdder V3",   resolution:"1920×1080", crosshair:"0;p;0;s;1;P;c;5;o;1;d;1;z;1;0t;3;0l;2;0o;2;0a;1;1b;0" },
  { name:"Derke",      team:"Fnatic",       region:"EMEA", dpi:800,  sens:0.35, edpi:280, mouse:"Logitech G Pro Wireless",resolution:"1920×1080", crosshair:"0;s;1;P;c;1;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0" },
  { name:"cNed",       team:"BBL Esports",  region:"EMEA", dpi:800,  sens:0.44, edpi:352, mouse:"Logitech G Pro X 2",    resolution:"1920×1080", crosshair:"0;p;0;s;1;P;c;5;h;0;0l;4;0o;2;0a;1;1b;0" },
  { name:"yay",        team:"Cloud9",       region:"NA",   dpi:800,  sens:0.28, edpi:224, mouse:"Finalmouse Starlight-12",resolution:"1920×1080", crosshair:"0;p;0;s;1;P;c;5;h;0;m;1;0l;4;0o;2;0a;1;1b;0" },
  { name:"Zellsis",    team:"Sentinels",    region:"NA",   dpi:800,  sens:0.25, edpi:200, mouse:"Logitech G Pro X 2",    resolution:"1920×1080", crosshair:"0;p;0;s;1;P;c;5;h;0;0l;4;0o;2;0a;1;1b;0" },
];

type SortKey = "edpi" | "team" | "region" | "name";
type SortDir = "asc" | "desc";

export default function ProSettingsPage() {
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("edpi");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let p = PLAYERS;
    if (search) p = p.filter(pl =>
      pl.name.toLowerCase().includes(search.toLowerCase()) ||
      pl.team.toLowerCase().includes(search.toLowerCase())
    );
    return [...p].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "edpi")   cmp = a.edpi - b.edpi;
      else if (sortKey === "team") cmp = a.team.localeCompare(b.team);
      else if (sortKey === "region") cmp = a.region.localeCompare(b.region);
      else cmp = a.name.localeCompare(b.name);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, sortKey, sortDir]);

  const copyCrosshair = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    // Silent failure per spec — no toast on error
    toast.success("Crosshair code copied", { className:"font-mono rounded-none border-primary/40" });
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === "asc" ? <ChevronUp className="h-3 w-3" aria-hidden="true" /> : <ChevronDown className="h-3 w-3" aria-hidden="true" />
      : <span className="h-3 w-3 opacity-30 inline-block" aria-hidden="true" />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">

        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">PRO SETTINGS</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">PRO DATABASE</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Verified crosshair codes, DPI, sensitivity, and hardware from top competitive players.
            </p>

            {/* Search */}
            <div className="relative mt-8 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by player or team…"
                aria-label="Search pro settings"
                className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2.5 pl-9 pr-4 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none" />
            </div>
          </Container>
        </div>

        <Container className="py-12">

          {/* Desktop table */}
          <Reveal className="hidden md:block">
            <div className="border border-border overflow-hidden">
              <table className="w-full" aria-label="Pro player settings">
                <thead>
                  <tr className="border-b border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)]">
                    {([
                      { key:"name",   label:"Player"      },
                      { key:"team",   label:"Team"        },
                      { key:"region", label:"Region"      },
                      { key:"edpi",   label:"eDPI"        },
                      { label:"DPI",  key:null },
                      { label:"Sens", key:null },
                      { label:"Mouse",key:null },
                      { label:"Resolution",key:null },
                    ] as {key:SortKey|null;label:string}[]).map(col => (
                      <th key={col.label}
                        className={["py-3 px-4 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-muted",
                          col.key ? "cursor-pointer select-none hover:text-primary transition-colors" : ""].join(" ")}
                        onClick={() => col.key && toggleSort(col.key)}
                        aria-sort={col.key && sortKey===col.key ? (sortDir==="asc"?"ascending":"descending") : undefined}
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          {col.key && <SortIcon k={col.key} />}
                        </span>
                      </th>
                    ))}
                    <th className="py-3 px-4 font-mono text-[10px] font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.name} className={["border-b border-border transition-colors hover:bg-surface", i%2===0?"bg-background":"bg-[#0F1C24]"].join(" ")}>
                      <td className="py-4 px-4 font-display text-base uppercase text-white">{p.name}</td>
                      <td className="py-4 px-4 font-mono text-[11px] text-muted">{p.team}</td>
                      <td className="py-4 px-4 font-mono text-[11px] text-muted">{p.region}</td>
                      <td className="py-4 px-4 font-mono text-sm font-black text-primary">{p.edpi}</td>
                      <td className="py-4 px-4 font-mono text-[11px] text-white">{p.dpi}</td>
                      <td className="py-4 px-4 font-mono text-[11px] text-white">{p.sens}</td>
                      <td className="py-4 px-4 font-sans text-[11px] text-muted">{p.mouse}</td>
                      <td className="py-4 px-4 font-mono text-[11px] text-muted">{p.resolution}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => copyCrosshair(p.crosshair)}
                            aria-label={`Copy ${p.name}'s crosshair code`}
                            className="border border-border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary flex items-center gap-1">
                            <Copy className="h-3 w-3" aria-hidden="true" /> Copy
                          </button>
                          <Link href={`/crosshair?code=${encodeURIComponent(p.crosshair)}`}
                            aria-label={`Load ${p.name}'s crosshair in generator`}
                            className="border border-border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" aria-hidden="true" /> Load
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Mobile card grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {filtered.map(p => (
              <Reveal key={p.name}>
                <div className="border border-border bg-[#0D1A22] p-5 space-y-4 cut-corner-br">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-display text-2xl uppercase text-white">{p.name}</h2>
                      <p className="font-mono text-[10px] text-muted mt-0.5">{p.team} · {p.region}</p>
                    </div>
                    <span className="font-mono text-xl font-black text-primary">{p.edpi} <span className="text-xs text-muted">eDPI</span></span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[{l:"DPI",v:p.dpi},{l:"Sens",v:p.sens},{l:"eDPI",v:p.edpi}].map(r=>(
                      <div key={r.l} className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-2">
                        <span className="block font-mono text-[9px] text-muted uppercase">{r.l}</span>
                        <span className="block font-mono text-sm font-black text-white mt-0.5">{r.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => copyCrosshair(p.crosshair)}
                      className="flex-1 border border-border py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary flex items-center justify-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy Crosshair
                    </button>
                    <Link href={`/crosshair?code=${encodeURIComponent(p.crosshair)}`}
                      className="flex-1 border border-border py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary flex items-center justify-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Load
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center font-mono text-sm text-muted">
              No players match &quot;{search}&quot;
            </p>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
