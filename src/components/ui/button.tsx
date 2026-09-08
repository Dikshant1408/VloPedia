import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-[#0B141A] font-black clip-diagonal-sm hover:brightness-105 active:translate-y-[1px]",
        secondary:
          "border-border bg-surface text-foreground clip-diagonal-sm hover:border-primary/50 hover:bg-surface-elevated active:translate-y-[1px]",
        outline:
          "border-border bg-transparent text-foreground clip-diagonal-sm hover:border-primary/60 hover:text-primary active:translate-y-[1px]",
        ghost:
          "border-transparent bg-transparent text-muted hover:text-foreground hover:bg-surface/80 active:translate-y-[1px]",
        tactical:
          "border-border bg-surface text-foreground clip-diagonal-sm hover:border-primary border-l-2 border-l-primary active:translate-y-[1px]",
      },
      size: {
        default: "px-5 py-2.5 text-xs",
        sm: "px-3 py-1.5 text-[10px] tracking-wide",
        lg: "px-6 py-3 text-xs tracking-widest",
        icon: "h-9 w-9 p-0 clip-diagonal-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}

export { buttonVariants };
