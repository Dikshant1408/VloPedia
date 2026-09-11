import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface-card transition-colors duration-200 hover:border-border-light shadow-sm",
        className
      )}
      {...props}
    />
  );
}
