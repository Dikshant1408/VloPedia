"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ReadabilityToggle } from "@/components/readability-toggle";

export interface NavSection {
  id: string;
  label: string;
  badge?: string;
}

interface StickySectionNavProps {
  sections: NavSection[];
  className?: string;
  title?: string;
}

export function StickySectionNav({
  sections,
  className,
  title,
}: StickySectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 160; // Offset for header + sticky nav
      let currentActive = sections[0].id;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            currentActive = section.id;
          }
        }
      }
      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
    window.history.pushState(null, "", `#${id}`);
  };

  if (!sections || sections.length === 0) return null;

  return (
    <nav
      aria-label="Page section navigation"
      className={cn(
        "sticky top-16 z-40 w-full border-b border-border/80 bg-surface/92 backdrop-blur-md transition-all",
        className
      )}
    >
      <div className="mx-auto flex h-12 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="hidden md:flex items-center gap-2 pr-6 border-r border-border/60">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-secondary">
              {title}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => scrollToSection(e, section.id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors",
                  isActive
                    ? "text-primary nav-active-signal"
                    : "text-secondary hover:text-foreground hover:bg-white/[0.03]"
                )}
              >
                <span>{section.label}</span>
                {section.badge && (
                  <span
                    className={cn(
                      "text-[9px] px-1 py-0.2 border",
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/60 text-muted"
                    )}
                  >
                    {section.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <ReadabilityToggle />
        </div>
      </div>
    </nav>
  );
}
