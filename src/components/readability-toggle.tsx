"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface ReadabilityToggleProps {
  className?: string;
}

export function ReadabilityToggle({ className = "" }: ReadabilityToggleProps) {
  const [isReadMode, setIsReadMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("valovault_read_mode");
      if (saved === "true") {
        setIsReadMode(true);
        document.documentElement.classList.add("read-mode");
      }
    } catch {}
  }, []);

  const toggleReadMode = () => {
    setIsReadMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("valovault_read_mode", String(next));
      } catch {}
      if (next) {
        document.documentElement.classList.add("read-mode");
      } else {
        document.documentElement.classList.remove("read-mode");
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleReadMode}
      aria-pressed={isReadMode}
      aria-label="Toggle content readability mode"
      title={isReadMode ? "Disable Read Mode (Restore tactical styling)" : "Enable Read Mode (Distraction-free reading)"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer border ${
        isReadMode
          ? "border-primary/50 bg-primary/15 text-primary"
          : "border-border/60 bg-surface/40 text-secondary hover:border-primary/40 hover:text-foreground hover:bg-surface"
      } ${className}`}
    >
      <BookOpen className="h-3 w-3" aria-hidden="true" />
      <span>{isReadMode ? "Reading Mode: ON" : "Read Mode"}</span>
    </button>
  );
}
