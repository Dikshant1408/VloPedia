"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Volume2, VolumeX, Sun, Moon, X, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useSound } from "@/components/sound-provider";

interface TacticalSettingsPopoverProps {
  patchVersion?: string;
}

export function TacticalSettingsPopover({ patchVersion }: TacticalSettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { isDark, toggleTheme } = useTheme();
  const { isMuted, toggleMute } = useSound();

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Tactical System Settings"
        title="Tactical System Settings"
        className={`flex h-9 w-9 items-center justify-center border transition-colors cursor-pointer ${
          isOpen
            ? "border-primary bg-primary/10 text-primary"
            : "border-border/80 bg-surface/80 text-secondary hover:border-border hover:bg-surface-elevated hover:text-foreground"
        }`}
      >
        <Settings className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-90 text-primary" : ""}`} />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="System Settings Menu"
          className="absolute right-0 top-full mt-2 w-80 z-50 border border-border bg-[#080F14]/98 backdrop-blur-xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 font-mono text-xs"
        >
          {/* Top Panel Bar */}
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-primary rotate-45" />
              <span className="font-display font-black text-xs uppercase tracking-wider text-foreground">
                Terminal Controls
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-foreground p-1"
              aria-label="Close settings"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Setting 1: Theme Mode */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-secondary font-bold uppercase tracking-wider">Display Theme</span>
              <span className="text-[10px] text-cyan font-bold">
                {isDark ? "PROTOCOL DARK" : "TACTICAL LIGHT"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!isDark) toggleTheme();
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 border transition-colors cursor-pointer ${
                  isDark
                    ? "border-primary/60 bg-primary/10 text-foreground font-bold"
                    : "border-border bg-surface/50 text-secondary hover:border-border-light hover:text-foreground"
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-cyan" />
                <span className="text-[10px] uppercase">Dark</span>
                {isDark && <Check className="h-3 w-3 text-primary ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isDark) toggleTheme();
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 border transition-colors cursor-pointer ${
                  !isDark
                    ? "border-primary/60 bg-primary/10 text-foreground font-bold"
                    : "border-border bg-surface/50 text-secondary hover:border-border-light hover:text-foreground"
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[10px] uppercase">Light</span>
                {!isDark && <Check className="h-3 w-3 text-primary ml-auto" />}
              </button>
            </div>
          </div>

          {/* Setting 2: SFX Audio System */}
          <div className="space-y-2 mb-4 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-secondary font-bold uppercase tracking-wider">Tactical SFX</span>
              <span className={`text-[10px] font-bold ${!isMuted ? "text-emerald-400" : "text-muted"}`}>
                {!isMuted ? "ACTIVE" : "MUTED"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isMuted) toggleMute();
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 border transition-colors cursor-pointer ${
                  !isMuted
                    ? "border-emerald-500/50 bg-emerald-500/10 text-foreground font-bold"
                    : "border-border bg-surface/50 text-secondary hover:border-border-light hover:text-foreground"
                }`}
              >
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[10px] uppercase">Sound On</span>
                {!isMuted && <Check className="h-3 w-3 text-emerald-400 ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isMuted) toggleMute();
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 border transition-colors cursor-pointer ${
                  isMuted
                    ? "border-primary/60 bg-primary/10 text-foreground font-bold"
                    : "border-border bg-surface/50 text-secondary hover:border-border-light hover:text-foreground"
                }`}
              >
                <VolumeX className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] uppercase">Mute</span>
                {isMuted && <Check className="h-3 w-3 text-primary ml-auto" />}
              </button>
            </div>
          </div>

          {/* Setting 3: Telemetry & Provenance Info */}
          <div className="border-t border-border/60 pt-3 space-y-1.5 text-[10px] text-muted">
            <div className="flex items-center justify-between">
              <span>PATCH TELEMETRY</span>
              <span className="text-foreground font-bold">
                {patchVersion ? `PATCH ${patchVersion}` : "VAL-API LIVE"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>DATABASE STATUS</span>
              <span className="text-emerald-400 font-bold">● SYNCED</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/30">
              <span>QUICK SEARCH SHORTCUT</span>
              <kbd className="border border-border/70 bg-background/80 px-1 py-0.5 text-[9px] text-secondary">
                Ctrl + K
              </kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
