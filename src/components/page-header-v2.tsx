/**
 * VloPedia Editorial Page Header
 * Clean, readable header for encyclopedia directories and hubs.
 */

interface PageHeaderV2Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional stat badges shown inline with the title */
  stats?: { label: string; value: string | number }[];
  /** Accent color for eyebrow dot — "red" | "cyan" | "neutral" */
  accent?: "red" | "cyan" | "neutral";
}

export function PageHeaderV2({
  eyebrow,
  title,
  subtitle,
  stats,
  accent = "red",
}: PageHeaderV2Props) {
  const isRed = accent === "red";
  const dotColor = isRed ? "bg-primary" : "bg-muted-dark";
  const textColor = isRed ? "text-primary" : "text-secondary";

  return (
    <div className="border-b border-border bg-background pt-12 pb-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} aria-hidden="true" />
          <span className={`font-mono text-xs font-semibold uppercase tracking-wider ${textColor}`}>
            {eyebrow}
          </span>
        </div>

        {/* Title + stat row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display font-black text-4xl uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap gap-3 font-mono">
              {stats.map(s => (
                <div
                  key={s.label}
                  className="rounded-md border border-border bg-surface-card px-4 py-2 min-w-[100px] text-center shadow-xs"
                >
                  <span className="text-xl font-bold block text-foreground">{s.value}</span>
                  <span className="text-[10px] text-muted tracking-wider uppercase font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

