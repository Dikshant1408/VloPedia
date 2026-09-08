import React from "react";
import { cn } from "@/lib/utils";

export type TacticalStatusType = "LIVE" | "SYNCED" | "REVIEW" | "STALE" | "THEORY" | "CONFIRMED";

interface TacticalStatusProps {
  status: TacticalStatusType;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

interface StatusConfig {
  icon: React.ReactNode;
  label: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

const STATUS_CONFIGS: Record<TacticalStatusType, StatusConfig> = {
  LIVE: {
    icon: <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />,
    label: "LIVE",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/5",
  },
  SYNCED: {
    icon: <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />,
    label: "SYNCED",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/5",
  },
  REVIEW: {
    icon: <span className="text-[10px] leading-none" aria-hidden="true">◐</span>,
    label: "REVIEW",
    textColor: "text-amber-400",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-400/5",
  },
  STALE: {
    icon: <span className="text-[10px] leading-none" aria-hidden="true">⚠</span>,
    label: "STALE",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-400/30",
    bgColor: "bg-yellow-400/5",
  },
  THEORY: {
    icon: <span className="text-[10px] leading-none font-bold" aria-hidden="true">?</span>,
    label: "THEORY",
    textColor: "text-purple-400",
    borderColor: "border-purple-400/30",
    bgColor: "bg-purple-400/5",
  },
  CONFIRMED: {
    icon: <span className="text-[10px] leading-none font-bold" aria-hidden="true">✓</span>,
    label: "CONFIRMED",
    textColor: "text-cyan",
    borderColor: "border-cyan/30",
    bgColor: "bg-cyan/5",
  },
};

export function TacticalStatus({
  status,
  label,
  size = "sm",
  className,
}: TacticalStatusProps) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.SYNCED;
  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-mono font-bold uppercase tracking-wider",
        config.borderColor,
        config.bgColor,
        config.textColor,
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-[11px]",
        className
      )}
    >
      {config.icon}
      <span>{displayLabel}</span>
    </span>
  );
}
