interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Remove the default border. Default: false */
  noBorder?: boolean;
  /** Apply cut-corner-tl-br clip path. Default: false */
  cutCorner?: boolean;
}

/**
 * Glassmorphism surface panel.
 * Applies backdrop-blur, semi-transparent background, and subtle border.
 */
export function GlassPanel({
  children,
  className,
  noBorder = false,
  cutCorner = false,
}: GlassPanelProps) {
  return (
    <div
      className={[
        "surface-glass",
        noBorder ? "" : "border border-white/[0.06]",
        cutCorner ? "cut-corner-tl-br" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
