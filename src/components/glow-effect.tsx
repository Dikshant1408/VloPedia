interface GlowEffectProps {
  /** Opacity of the glow — 0.1 to 0.4. Default: 0.2 */
  opacity?: number;
  /** CSS color value. Default: var(--primary) */
  color?: string;
  className?: string;
}

/**
 * Absolutely-positioned radial gradient overlay.
 * Place inside a `relative overflow-hidden` container.
 * Used on hero images and featured cards.
 */
export function GlowEffect({
  opacity = 0.2,
  color = "var(--primary)",
  className,
}: GlowEffectProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={{
        background: `radial-gradient(ellipse at 50% 0%, ${color} 0%, transparent 70%)`,
        opacity,
      }}
    />
  );
}
