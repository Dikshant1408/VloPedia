import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Core palette */
        background:          "#0B141A",
        surface:             "#0F1C24",
        "surface-elevated":  "#132028",
        "surface-card":      "#0D1A22",
        "surface-glass":     "rgba(11,20,26,0.80)",
        "surface-overlay":   "rgba(11,20,26,0.96)",

        /* Borders */
        border:              "rgba(236,232,225,0.10)",
        "border-light":      "rgba(236,232,225,0.18)",

        /* Primary (Radianite Red) */
        primary:             "#FA4454",
        "primary-soft":      "rgba(250,68,84,0.12)",
        "primary-softer":    "rgba(250,68,84,0.06)",

        /* Cyan accent */
        cyan:                "#0DF2F2",
        "cyan-soft":         "rgba(13,242,242,0.10)",

        /* Text */
        foreground:          "#ECE8E1",
        secondary:           "rgba(236,232,225,0.70)",
        muted:               "rgba(236,232,225,0.55)",
        "muted-dark":        "rgba(236,232,225,0.20)",

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
        glow:      "0 0 20px rgba(250,68,84,0.30), 0 0 50px rgba(250,68,84,0.12)",
        "glow-cyan":"0 0 20px rgba(13,242,242,0.30), 0 0 50px rgba(13,242,242,0.12)",
        soft:      "0 18px 50px rgba(0,0,0,0.55)",
      },

      backgroundImage: {
        "hero-grid":   "linear-gradient(rgba(236,232,225,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(236,232,225,0.025) 1px, transparent 1px)",
        "hero-radial": "radial-gradient(circle at top, rgba(250,68,84,0.12), transparent 45%), radial-gradient(circle at 80% 20%, rgba(13,242,242,0.08), transparent 30%)",
      },

      maxWidth: { "8xl": "88rem", "9xl": "100rem" },
    },
  },
  plugins: [animate],
};

export default config;
