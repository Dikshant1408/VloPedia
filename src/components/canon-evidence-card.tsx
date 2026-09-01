"use client";

import { ShieldCheck, HelpCircle, AlertTriangle, FileText, ExternalLink } from "lucide-react";

export type CanonStatus = "CONFIRMED" | "STRONGLY IMPLIED" | "THEORY";

interface CanonEvidenceCardProps {
  status: CanonStatus;
  source: string;
  whyDoWeKnowThis: string;
}

export function CanonBadge({ status }: { status: CanonStatus }) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
        <ShieldCheck className="h-3 w-3" />
        Canon: Confirmed
      </span>
    );
  }

  if (status === "STRONGLY IMPLIED") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-[#0DF2F2]/10 border border-[#0DF2F2]/30 text-[#0DF2F2]">
        <HelpCircle className="h-3 w-3" />
        Canon: Strongly Implied
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
      <AlertTriangle className="h-3 w-3" />
      Canon: Community Theory
    </span>
  );
}

export function CanonEvidenceCard({ status, source, whyDoWeKnowThis }: CanonEvidenceCardProps) {
  return (
    <div className="border border-[rgba(236,232,225,0.1)] bg-[rgba(13,24,32,0.85)] p-6 space-y-4 clip-diagonal-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs uppercase font-bold tracking-widest text-white">
            EVIDENCE & VERIFICATION
          </span>
        </div>
        <CanonBadge status={status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-[rgba(236,232,225,0.06)] bg-surface/40 p-3.5">
          <span className="block font-mono text-[9px] uppercase tracking-wider text-muted mb-1">
            CANONICAL SOURCE
          </span>
          <p className="font-mono text-xs font-semibold text-white/90 leading-relaxed">
            {source}
          </p>
        </div>

        <div className="border border-[rgba(236,232,225,0.06)] bg-surface/40 p-3.5">
          <span className="block font-mono text-[9px] uppercase tracking-wider text-primary mb-1">
            WHY DO WE KNOW THIS?
          </span>
          <p className="font-sans text-xs text-secondary leading-relaxed">
            {whyDoWeKnowThis}
          </p>
        </div>
      </div>
    </div>
  );
}
