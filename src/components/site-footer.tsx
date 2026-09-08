import Link from "next/link";
import { Shield, Cpu } from "lucide-react";
import { ReportIssueModal } from "@/components/report-issue-modal";
import { formatPatchVersion } from "@/lib/utils";

interface SiteFooterProps {
  version?: string | null;
}

const PRIMARY_NAV = [
  { label: "Agents",       href: "/agents"       },
  { label: "Weapons",      href: "/weapons"      },
  { label: "Maps",         href: "/maps"         },
  { label: "Match Prep",   href: "/match-prep"   },
  { label: "Skins",        href: "/skins"        },
  { label: "Tools",        href: "/tools"        },
  { label: "Compare",      href: "/compare"      },
  { label: "Lore",         href: "/lore"         },
  { label: "Guides",       href: "/guides"       },
  { label: "Data Sources", href: "/data-sources" },
  { label: "Methodology",  href: "/methodology"  },
  { label: "Changelog",    href: "/changelog"    },
  { label: "Terms",        href: "/terms"        },
  { label: "Privacy",      href: "/privacy"      },
];

export function SiteFooter({ version }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const patchVersion = formatPatchVersion(version);

  return (
    <footer
      className="border-t border-border bg-background/98 py-8 z-10"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

          {/* Left — brand + disclaimer */}
          <div className="space-y-4 max-w-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 bg-primary flex items-center justify-center rotate-45 shrink-0">
                <span className="font-display font-black text-sm text-[#0B141A] -rotate-45">V</span>
              </div>
              <span className="font-display font-black text-lg uppercase text-foreground tracking-tight">
                VloPedia
              </span>
              {version && (
                <span className="border border-cyan/30 bg-cyan/5 px-2 py-0.5 font-mono text-[9px] text-cyan tracking-wider">
                  CORE: {patchVersion}
                </span>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2">
              <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="font-mono text-[9px] leading-relaxed text-muted uppercase">
                VloPedia is a non-commercial community encyclopedia and companion tool. VloPedia isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing VALORANT. VALORANT and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
              </p>
            </div>

            <div>
              <ReportIssueModal entityName="VloPedia Database" />
            </div>
          </div>

          {/* Right — nav + meta */}
          <div className="flex flex-col gap-4 sm:items-end shrink-0">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end" role="list">
                {PRIMARY_NAV.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Engine status */}
            <div className="flex items-center gap-2 border border-border bg-surface/50 px-3 py-2">
              <Cpu className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
              <div>
                <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-cyan">DB SYNCED: SEP 4, 2026</span>
                <span className="font-mono text-[9px] text-muted">PATCH {patchVersion} {"//"} RELATIONAL GRAPH {"//"} ACTIVE</span>
              </div>
            </div>

            <span className="font-mono text-[10px] text-muted tracking-wider">
              © {year} VLOPEDIA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
