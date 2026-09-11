# VloPedia 3D Interaction System

The VloPedia 3D Interaction System provides purposeful, high-performance 3D and 2.5D visual inspection layers across weapons, cosmetic skins, tactical maps, and canonical relationship webs.

The guiding architectural ratio is:
**80% quiet interface // 15% tactical identity // 5% visual spectacle**

---

## 1. Architecture Overview

All 3D components reside in `src/components/3d/`:

```text
src/components/3d/
├── use-scene-lifecycle.ts       # Shared hook (IntersectionObserver, WebGL detection, reduced motion)
├── webgl-detector.ts            # Safe WebGL / WebGL2 environment detector
├── scene-loader.tsx             # Tactical loading state with shimmer line
├── scene-error.tsx              # Resilient 2D fallback with tactical error badge
├── scene-controls-overlay.tsx   # Accessible HUD overlay (Reset, Auto-Rotate, Zoom, Theater, Step Rotate)
├── theater-modal.tsx            # Fullscreen modal with Escape dismiss & scroll lock
├── tactical-scene-stage.tsx     # Three.js / R3F weapon inspection stage (studio lighting, pitch clamping)
├── weapon-inspection-viewer.tsx # Dynamic client container for weapon & skin inspection
├── tactical-map-stage.tsx       # Three.js / R3F 3D radar sandtable with callout beacons
├── tactical-map-viewer.tsx      # Dynamic client container for map exploration & layer filtering
├── knowledge-graph-stage.tsx    # Three.js / R3F spatial relationship web
└── knowledge-graph-3d-modal.tsx # Tactical spatial intelligence modal for agents
```

---

## 2. Dynamic Code-Splitting & Lazy Loading

To protect Core Web Vitals (LCP, FID/INP) and eliminate heavy Three.js execution from the initial JavaScript bundle, all R3F stage components are loaded on the client via `next/dynamic` with `ssr: false`:

```tsx
const TacticalSceneStage = dynamic(
  () => import("./tactical-scene-stage").then((mod) => mod.TacticalSceneStage),
  {
    ssr: false,
    loading: () => <SceneLoader label="INITIALIZING INSPECTION..." />,
  }
);
```

During server-side rendering or on static page generation, lightweight tactical skeletons are emitted, completely preventing hydration mismatch.

---

## 3. Honest 2.5D Weapon Inspection

No authentic `.glb` or `.gltf` meshes exist in the Riot VALORANT API for weapons. Rather than generating misleading pseudo-geometry:
1. Surfaces are labeled honestly as `INSPECT VIEW` or `INTERACTIVE PREVIEW`.
2. Sprites are rendered on a physical plane (`MeshStandardMaterial`, roughness: `0.35`, metalness: `0.25`).
3. Camera pitch is strictly clamped to $\pm 16^\circ$ (`Math.PI / 2 ± 0.28`) and azimuth to $\pm 80^\circ$ (`± Math.PI / 2.2`) via `OrbitControls`. This prevents the paper-thin edge from ever being visible.
4. Studio lighting combines an ambient fill (1.4), key specular directional light (1.8), cyan rim fill (0.9), and Radianite red overhead point light (1.2).
5. A dynamic ground contact shadow and tactical crosshair reticle provide physical grounding.

---

## 4. Tactical Map 3D Sandtable & Coordinate Math

Map callout waypoints are transformed from Riot's engine coordinates into 3D world space using official map scalars:

$$\text{normX} = (\text{callout.location.y} \times \text{map.xMultiplier}) + \text{map.xScalarToAdd}$$
$$\text{normY} = (\text{callout.location.x} \times \text{map.yMultiplier}) + \text{map.yScalarToAdd}$$

In the 6.0-unit 3D sandtable plane centered at the origin:
- $X = (\text{normX} - 0.5) \times 6.0$
- $Z = (\text{normY} - 0.5) \times 6.0$

Waypoints are categorized into:
- `SITES`: Bomb sites (A, B, C) highlighted in Radianite Red (`#FA4454`) with pulsing beacons.
- `SPAWNS`: Attacker and Defender spawn sectors highlighted in Cyan (`#0DF2F2`).
- `CHOKEPOINTS`: Mid lanes, Mains, Longs, and Connectors highlighted in Amber (`#FBBF24`).

---

## 5. Spatial Knowledge Web

The Knowledge Graph 3D Web spatially arranges canonical relationships around a central operative node:
- **Orbit 1 (R = 2.6)**: Tactical Synergies (Cyan `#0DF2F2`) with utility combo annotations.
- **Orbit 2 (R = 3.6)**: Hard Counter Matchups (Warning Red `#FA4454`) with danger ratings.
- **Orbit 3 (R = 4.6)**: Optimal Map Fits (Emerald `#10B981`) with strategic justifications.
- **Orbit 4 (R = 5.4)**: Signature Weapon Loadouts (Amber `#F59E0B`) with situational rationale.

Clicking any node displays its provenance dossier and provides direct navigation to the entity's canonical route.

---

## 6. Performance & Lifecycle Safeguards

- **Viewport Pausing**: `useSceneLifecycle` observes the canvas container via `IntersectionObserver`. When scrolled out of the viewport, the R3F Canvas drops rendering to save CPU/GPU cycles.
- **DPR Capping**: All canvases cap device pixel ratio to `[1, 1.5]` to avoid 3x/4x mobile render penalties.
- **Resource Disposal**: All geometries, materials, and textures are explicitly disposed of on component unmount to prevent WebGL context leaks:
  ```ts
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);
  ```

---

## 7. Accessibility & Reduced Motion

- **Reduced Motion**: If `(prefers-reduced-motion: reduce)` is detected, auto-rotation is disabled by default, idle bobbing is neutralized, and camera transitions are instantaneous.
- **Keyboard Shortcuts**:
  - `R` or Double-Click: Reset camera to initial orientation.
  - `Space`: Toggle auto-rotation.
  - `+` / `-`: Zoom in / Zoom out.
  - `ArrowLeft` / `ArrowRight`: Step rotate horizontally.
  - `Esc`: Close theater inspection mode.
- **Focus Rings**: All interactive controls declare visible `:focus-visible` rings (`focus-visible:ring-1 focus-visible:ring-primary`).
- **Semantic HTML**: 3D viewers always supplement, and never replace, crawlable HTML text, tables, and structured JSON-LD.
