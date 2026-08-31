import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 border text-xs font-bold uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 font-mono cursor-pointer",
  {
    variants: {
      variant: {
        primary: "border-primary bg-primary text-black btn-slide-glow hover:brightness-110 hover:shadow-[0_0_18px_rgba(255,70,85,0.35)] active:translate-y-[1px]",
        secondary: "border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] text-foreground hover:border-primary hover:bg-primary-soft active:translate-y-[1px]",
        ghost: "border-transparent bg-transparent text-muted hover:text-foreground hover:bg-white/5 active:translate-y-[1px]",
        outline: "border-border bg-transparent text-foreground hover:border-primary hover:text-primary active:translate-y-[1px]"
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-3.5 py-2 text-[10px]",
        lg: "px-7 py-3.5 text-sm"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      type={type}
      {...props}
    />
  );
}

export { buttonVariants };
