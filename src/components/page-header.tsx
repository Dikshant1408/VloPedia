import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 border-b border-border pb-6 relative", className)}>
      <div className="absolute right-0 top-0 bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] text-primary font-black uppercase">
        {eyebrow}
      </div>
      <span className="text-[11px] text-primary font-bold block tracking-widest">SYSTEM_SYS</span>
      <h1 className="text-4xl font-black text-foreground font-sans uppercase tracking-wide">{title}</h1>
      <p className="text-sm text-muted leading-relaxed max-w-2xl">{description}</p>
    </div>
  );
}
