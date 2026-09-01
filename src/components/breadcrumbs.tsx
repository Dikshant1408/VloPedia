import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted mb-4 flex-wrap">
      <Link
        href="/"
        className="inline-flex items-center gap-1 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted/50 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-white font-bold truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors truncate max-w-[160px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
