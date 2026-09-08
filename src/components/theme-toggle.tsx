"use client";

import React from "react";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-sound="theme"
      title={isDark ? "Switch to Tactical Light Theme" : "Switch to Protocol Dark Theme"}
      aria-label={isDark ? "Switch to Tactical Light Theme" : "Switch to Protocol Dark Theme"}
      className={`relative inline-flex items-center justify-center gap-1.5 border border-border bg-surface px-2 sm:px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="relative h-3.5 w-3.5 shrink-0">
        <Sun
          className={`absolute inset-0 h-3.5 w-3.5 transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 text-amber-500"
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`absolute inset-0 h-3.5 w-3.5 transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100 text-cyan" : "-rotate-90 scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
      </div>

      {showLabel && (
        <span className="text-[9px]">
          {isDark ? "DARK MODE" : "LIGHT MODE"}
        </span>
      )}
    </button>
  );
}
