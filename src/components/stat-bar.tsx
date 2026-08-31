import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  className?: string;
}

export function StatBar({ label, value, max = 100, className }: StatBarProps) {
  const clamped = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted">
        <span>{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full border border-border bg-background overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
