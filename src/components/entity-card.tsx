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

export function EntityCard({ title, description, href, imageUrl, badge, meta, className, square, accentColor }: EntityCardProps) {
  return (
    <Card className={cn("group flex flex-col justify-between overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] hover:border-primary/60 transition-colors relative", className)}>
      {imageUrl ? (
        <div className={cn("relative w-full overflow-hidden bg-background", square ? "aspect-square" : "h-48")}>
          <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          {badge ? (
            <span className="absolute left-3 top-3 border border-primary/30 bg-primary/5 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {badge}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="px-6 pt-6">
          {badge ? (
            <span className="inline-flex items-center border border-primary/30 bg-primary/5 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-3">
              {badge}
            </span>
          ) : null}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-black text-foreground uppercase leading-tight font-sans tracking-wide group-hover:text-white transition-colors">
            {title}
          </h3>
          {description ? (
            <p className="text-sm leading-6 text-muted">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-4">
          {meta ? <span className="text-[11px] text-muted">{meta}</span> : <span />}
          <Link href={href} className="text-sm font-semibold text-primary transition-colors">
            Inspect →
          </Link>
        </div>
      </div>
    </Card>
  );
}
