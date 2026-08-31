import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-primary/20 bg-primary-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary font-mono",
        className
      )}
      {...props}
    />
  );
}
