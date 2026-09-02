export const siteConfig = {
  name: "VloPedia",
  description:
    "The definitive VALORANT tactical encyclopedia. Agents, weapons, maps, skins, tools, and source-backed lore — all in one unified knowledge engine.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://valovault-ivory.vercel.app",
};

export const navigationItems = [
  { label: "Home",         href: "/"           },
  { label: "Agents",       href: "/agents"     },
  { label: "Weapons",      href: "/weapons"    },
  { label: "Skins",        href: "/skins"      },
  { label: "Bundles",      href: "/bundles"    },
  { label: "Flex Items",   href: "/flex"       },
  { label: "Maps",         href: "/maps"       },
  { label: "Lore",         href: "/lore"       },
  { label: "Patch Notes",  href: "/patch-notes"},
  { label: "Leaks",        href: "/leaks"      },
  { label: "Crosshairs",   href: "/crosshair"  },
  { label: "Pro Settings", href: "/pro-settings"},
  { label: "Store",        href: "/store"      },
  { label: "Community",    href: "/community"  },
  { label: "Search",       href: "/search"     },
] as const;
