import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface EntityCardProps {
  title: string;
  description?: string;
  href: string;
  imageUrl?: string;
  badge?: string;
  meta?: string;
  className?: string;
  square?: boolean;
  accentColor?: string;
}

export function EntityCard({ title, description, href, imageUrl, badge, meta, className, square }: EntityCardProps) {
  return (
    <Card className={cn("group flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-surface-card hover:border-border-light hover:shadow-md transition-all relative", className)}>
      {imageUrl ? (
        <div className={cn("relative w-full overflow-hidden bg-surface-muted", square ? "aspect-square" : "h-48")}>
          <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          {badge ? (
            <span className="absolute left-3 top-3 rounded-sm border border-border bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground tracking-wide">
              {badge}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="px-6 pt-6">
          {badge ? (
            <span className="inline-flex items-center rounded-sm border border-border bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground tracking-wide mb-3">
              {badge}
            </span>
          ) : null}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground font-sans tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description ? (
            <p className="text-xs leading-relaxed text-secondary line-clamp-2">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/50">
          {meta ? <span className="text-[11px] text-muted font-mono">{meta}</span> : <span />}
          <Link href={href} className="text-xs font-semibold text-primary hover:underline transition-colors">
            View details →
          </Link>
        </div>
      </div>
    </Card>
  );
}
