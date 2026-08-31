import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] transition-colors duration-200 hover:border-border-light",
        className
      )}
      {...props}
    />
  );
}
