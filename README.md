# VloPedia — VALORANT Database, Tools & Lore Encyclopedia

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment Status](https://img.shields.io/badge/Vercel-Live-brightgreen?style=flat&logo=vercel)](https://valovault-ivory.vercel.app)

**VloPedia** is an open-source, search-driven VALORANT knowledge graph, tactical utility engine, and lore encyclopedia. Built for competitive players, theorycrafters, and lore enthusiasts.

🌐 **Live Production App:** [https://valovault-ivory.vercel.app](https://valovault-ivory.vercel.app)

---

## 🏛️ The Three Pillars

### 1. 🗄️ Database & Knowledge Graph
- **Operatives (`/agents`)**: Deep tactical dossiers for all 26 agents with ability breakdowns, playstyles, high-synergy teammates, direct counter-picks, best maps, pro meta ratings, and audio voice lines.
- **Weapons & Ballistics (`/weapons`)**: Comprehensive damage matrices across distance falloffs, fire rates, magazine sizes, first-bullet spread, and wall penetration.
- **Tactical Maps (`/maps`)**: Site layouts, default callouts, execute paths, and agent win-rate tiers.
- **Skins & Cosmetics (`/skins`)**: Over 1,400 skins with chromas, finisher previews, streamed inspect videos, and VP valuations.

### 2. 🛠️ Tactical Tools & Problem Solvers
- **Comp Synergy Builder (`/comp-builder`)**: Map-weighted 5-agent tactical evaluation measuring Execution, Site Control, Recon/Intel, Retake, and Post-Plant ratings (/100) with strategic breakdowns.
- **Sensitivity & DPI Converter (`/sensitivity`)**: Yaw conversion between CS2, Apex Legends, Overwatch 2, Rainbow Six Siege, Fortnite, Call of Duty, and VALORANT with exact cm/360° and eDPI metrics.
- **Head-to-Head Compare (`/compare`)**: Side-by-side matrices (e.g. *Vandal vs. Phantom*, *Jett vs. Raze*) with tactical situational verdicts.
- **Crosshair Generator (`/crosshair`)**: In-browser reticle designer with 1-click import profile codes for top VCT Champions (TenZ, Demon1, Aspas).
- **Player Setup Cards (`/setup`)**: Shareable loadout cards featuring your main agent, sensitivity @ DPI, crosshair code, and signature weapon.

### 3. 📜 Lore Archives & Canon Evidence System
- **Chronological Timeline (`/lore`)**: 5 historical eras covering the Pre-First Light world, 2039 First Light cataclysm, Protocol founding, Omega Earth invasion, and the Order of the Hourglass.
- **Canon Evidence Badges (`CanonEvidenceCard`)**: Distinct verification indicators (`CONFIRMED`, `STRONGLY IMPLIED`, `THEORY / SPECULATION`) with primary source citations (Cinematics, Patch Audio Logs, Kingdom Emails, Map Assets).
- **Faction Dossiers**: Kingdom Corp, VALORANT Protocol, VALORANT Legion, REALM, ATLAS, and Scions of the Hourglass.

---

## ⚡ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Static Site Generation / SSG, ISR)
- **UI & Motion:** [React 19](https://react.dev/), [Framer Motion](https://www.framer.com/motion/), [Lucide Icons](https://lucide.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **State & Data:** Centralized versioned JSON configs (`src/data/`), Firebase Auth & Firestore, Prisma ORM, In-memory API caching
- **Command Palette:** Global `Ctrl/Cmd + K` search dialog indexing agents, weapons, maps, skins, guides, lore files, and compare routes.
- **SEO Architecture:** Automatic 1,812-route XML sitemap (`/sitemap.xml`), robots.txt, canonical alternates, OpenGraph previews, and Schema.org JSON-LD (`Article`, `BreadcrumbList`, `FAQPage`, `Product`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Dikshant1408/VloPedia.git
cd VloPedia

# Install dependencies
npm install

# Set up local environment variables (.env.local)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build & Static Generation

```bash
npm run build
```

---

## ⚖️ Legal Disclaimer

VloPedia is a non-commercial fan project and community encyclopedia. VloPedia isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing VALORANT. VALORANT and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
