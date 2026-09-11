import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md border text-sm font-sans font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary text-white hover:bg-primary/90 shadow-sm active:translate-y-[1px]",
        secondary:
          "border-border bg-surface-elevated text-foreground hover:bg-white/10 active:translate-y-[1px]",
        outline:
          "border-border bg-transparent text-foreground hover:bg-surface-elevated hover:border-border-light active:translate-y-[1px]",
        ghost:
          "border-transparent bg-transparent text-muted hover:text-foreground hover:bg-surface-elevated active:translate-y-[1px]",
        tactical:
          "border-border bg-surface text-foreground hover:border-primary border-l-2 border-l-primary active:translate-y-[1px]",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-5 text-sm font-semibold",
        icon: "h-9 w-9 p-0",
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
