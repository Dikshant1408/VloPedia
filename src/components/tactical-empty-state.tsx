"use client";

import React from "react";
import { AlertCircle, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TacticalEmptyStateProps {
  query?: string;
  onSelectSuggestion?: (term: string) => void;
  onReset?: () => void;
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  "Aemondir Vandal",
  "Jett abilities",
  "Vandal damage",
  "Best agent on Ascent",
];

export function TacticalEmptyState({
  query,
  onSelectSuggestion,
  onReset,
  className = "",
}: TacticalEmptyStateProps) {
  return (
    <div
      className={`border border-border/70 bg-surface-card p-6 sm:p-8 text-center space-y-4 shadow-md ${className}`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
        <AlertCircle className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
          TACTICAL INTEL // 404
        </span>
        <h3 className="font-display font-black text-xl uppercase tracking-wide text-foreground">
          NO MATCH FOUND
        </h3>
        <p className="font-sans text-xs text-muted max-w-md mx-auto leading-relaxed">
          {query ? (
            <>We couldn&apos;t identify any entity matching <strong className="text-foreground">&quot;{query}&quot;</strong>.</>
          ) : (
            <>We couldn&apos;t identify that tactical entity in the database.</>
          )}
        </p>
      </div>

      {/* Actionable suggestions */}
      <div className="pt-2 border-t border-border/50 max-w-sm mx-auto text-left">
        <span className="font-mono text-[10px] uppercase text-muted tracking-wider block mb-2 text-center">
          Try querying:
        </span>
        <div className="space-y-1.5">
          {DEFAULT_SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSelectSuggestion?.(term)}
              className="w-full flex items-center justify-between px-3 py-1.5 border border-border/60 bg-surface hover:border-primary/50 hover:bg-surface-elevated text-secondary hover:text-foreground font-mono text-xs transition-colors cursor-pointer text-left"
            >
              <span>• &quot;{term}&quot;</span>
              <ArrowRight className="h-3 w-3 opacity-40" />
            </button>
          ))}
        </div>
      </div>

      {onReset && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="font-mono text-xs uppercase tracking-wider gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Search Again
          </Button>
        </div>
      )}
    </div>
  );
}
