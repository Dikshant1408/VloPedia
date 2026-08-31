/**
 * ValoVault V2 Page Header
 * Replaces the old PageHeader component with the new design language:
 * - Cyan dot eyebrow
 * - Outfit Black display title
 * - Muted subtitle
 * Inspired by VALORANT // PROTOCOL design system
 */

interface PageHeaderV2Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Optional stat badges shown inline with the title */
  stats?: { label: string; value: string | number }[];
  /** Accent color for eyebrow dot — "red" | "cyan" (default: "cyan") */
  accent?: "red" | "cyan";
}

export function PageHeaderV2({
  eyebrow,
  title,
  subtitle,
  stats,
  accent = "cyan",
}: PageHeaderV2Props) {
  const dotColor = accent === "red" ? "bg-primary" : "bg-[#0DF2F2]";
  const textColor = accent === "red" ? "text-primary" : "text-[#0DF2F2]";

  return (
    <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2 h-2 ${dotColor} animate-pulse`} aria-hidden="true" />
          <span className={`font-mono text-xs font-bold uppercase tracking-[0.25em] ${textColor}`}>
            {eyebrow}
          </span>
        </div>

        {/* Title + stat row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tighter text-foreground sm:text-6xl lg:text-7xl flex items-center gap-4">
            {title}
            <span className={`w-2.5 h-2.5 ${dotColor} rounded-full animate-pulse hidden sm:block`} aria-hidden="true" />
          </h1>

          {stats && stats.length > 0 && (
            <div className="flex flex-wrap gap-4 font-mono">
              {stats.map(s => (
                <div
                  key={s.label}
                  className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-4 py-2 clip-diagonal-sm min-w-[100px] text-center"
                >
                  <span className={`text-xl font-black block ${textColor}`}>{s.value}</span>
                  <span className="text-[9px] text-muted tracking-wider uppercase">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
