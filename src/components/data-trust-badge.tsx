import React from "react";
import { ShieldCheck, Info, Database, Scale, Cpu, BookOpen } from "lucide-react";
import Link from "next/link";

export type ProvenanceType = "API_TELEMETRY" | "VCT_SNAPSHOT" | "EDITORIAL_ANALYSIS" | "CONFIRMED_CANON" | "COMMUNITY";

interface Props {
  sourceType: ProvenanceType;
  patchVersion?: string;
  sourceName?: string;
  lastVerified?: string;
  confidence?: "CONFIRMED" | "HIGH" | "EDITORIAL" | "COMMUNITY";
  className?: string;
}

const TYPE_CONFIG = {
  API_TELEMETRY: {
    label: "OFFICIAL TELEMETRY",
    icon: Database,
    color: "text-[#0DF2F2]",
    border: "border-[#0DF2F2]/30",
    bg: "bg-[#0DF2F2]/5",
  },
  VCT_SNAPSHOT: {
    label: "VCT PRO DATASET",
    icon: Scale,
    color: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-400/5",
  },
  EDITORIAL_ANALYSIS: {
    label: "EDITORIAL META RATING",
    icon: ShieldCheck,
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/5",
  },
  CONFIRMED_CANON: {
    label: "CANON LORE EVIDENCE",
    icon: BookOpen,
    color: "text-purple-400",
    border: "border-purple-400/30",
    bg: "bg-purple-400/5",
  },
  COMMUNITY: {
    label: "COMMUNITY REPORTED",
    icon: Info,
    color: "text-blue-400",
    border: "border-blue-400/30",
    bg: "bg-blue-400/5",
  },
};

export function DataTrustBadge({
  sourceType,
  patchVersion = "9.04",
  sourceName = "VloPedia Verified Data",
  lastVerified = "September 2, 2026",
  confidence = "HIGH",
  className = "",
}: Props) {
  const config = TYPE_CONFIG[sourceType] || TYPE_CONFIG.EDITORIAL_ANALYSIS;
  const Icon = config.icon;

  return (
    <div className={`border ${config.border} ${config.bg} p-3 sm:p-4 clip-diagonal text-left ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(236,232,225,0.06)] pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${config.color}`}>
            DATA TRUST // {config.label}
          </span>
        </div>
        <Link
          href="/methodology"
          className="font-mono text-[9px] uppercase text-muted hover:text-white transition-colors underline"
        >
          Methodology →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
        <div>
          <span className="text-muted block text-[8px] uppercase">Source:</span>
          <span className="text-white font-bold truncate block">{sourceName}</span>
        </div>
        <div>
          <span className="text-muted block text-[8px] uppercase">Patch Baseline:</span>
          <span className="text-white font-bold block">Patch {patchVersion}</span>
        </div>
        <div>
          <span className="text-muted block text-[8px] uppercase">Confidence:</span>
          <span className={`${config.color} font-bold block`}>{confidence}</span>
        </div>
        <div>
          <span className="text-muted block text-[8px] uppercase">Last Verified:</span>
          <span className="text-muted block truncate">{lastVerified}</span>
        </div>
      </div>
    </div>
  );
}
