import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Core palette */
        background:          "var(--background)",
        surface:             "var(--surface)",
        "surface-elevated":  "var(--surface-elevated)",
        "surface-card":      "var(--surface-card)",
        "surface-glass":     "var(--surface-glass)",
        "surface-overlay":   "var(--surface-overlay)",

        /* Borders */
        border:              "var(--border)",
        "border-light":      "var(--border-light)",

        /* Primary (Radianite Red) */
        primary:             "var(--primary)",
        "primary-soft":      "var(--primary-soft)",
        "primary-softer":    "var(--primary-softer)",

        /* Cyan accent */
        cyan:                "var(--cyan)",
        "cyan-soft":         "var(--cyan-soft)",

        /* Text */
        foreground:          "var(--foreground)",
        secondary:           "var(--secondary)",
        muted:               "var(--muted)",
        "muted-dark":        "var(--muted-dark)",
        "text-primary":      "var(--text-primary)",
        "text-secondary":    "var(--text-secondary)",
        "text-muted":        "var(--text-muted)",

        /* Semantic */
        success:             "#22c55e",
        warning:             "#eab308",
        error:               "#FA4454",
        danger:              "#FA4454",

        /* Role accent colors */
        "role-duelist":      "#F87171",
        "role-controller":   "#A78BFA",
        "role-initiator":    "#FBBF24",
        "role-sentinel":     "#34D399",

        /* Content tier colors */
        "tier-select":       "#9CA3AF",
        "tier-deluxe":       "#60A5FA",
        "tier-premium":      "#C084FC",
        "tier-ultra":        "#FBBF24",
        "tier-exclusive":    "#F87171",
      },

      fontFamily: {
        sans:    ["var(--font-inter)",      "Inter",           "system-ui", "sans-serif"],
        display: ["var(--font-outfit)",     "Outfit",          "sans-serif"],
        mono:    ["var(--font-jetbrains)",  "JetBrains Mono",  "monospace"],
        /* Legacy aliases kept for backward compat */
        grotesk: ["var(--font-inter)",      "Inter",           "sans-serif"],
        bebas:   ["var(--font-outfit)",     "Outfit",          "sans-serif"],
        spacemono: ["var(--font-jetbrains)","JetBrains Mono",  "monospace"],
      },

      boxShadow: {
        glow:      "0 4px 20px rgba(255,70,85,0.15)",
        "glow-cyan":"0 4px 20px rgba(0,0,0,0.25)",
        soft:      "0 10px 30px rgba(0,0,0,0.35)",
      },

      backgroundImage: {
        "hero-grid":   "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "hero-radial": "radial-gradient(circle at top, rgba(255,70,85,0.08), transparent 50%)",
      },

      maxWidth: { "8xl": "88rem", "9xl": "100rem" },
    },
  },
  plugins: [animate],
};

export default config;
