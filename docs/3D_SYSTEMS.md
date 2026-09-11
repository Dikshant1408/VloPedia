# VloPedia 3D Interaction Systems Documentation

## 1. Architecture Overview

VloPedia's 3D interaction system delivers a **purposeful, tactical inspection experience** adhering to the product design ratio: **80% quiet interface, 15% tactical identity, 5% visual spectacle**.

The system lives in `src/components/3d/`:

```text
src/components/3d/
├── webgl-detector.ts             # SSR-safe WebGL/WebGL2 capability test
├── tactical-scene-stage.tsx      # R3F Canvas, OrbitControls, lights, pitch-clamped mesh
├── scene-controls-overlay.tsx    # HUD overlay (Auto-rotate, Zoom, Reset, Theater)
├── theater-modal.tsx             # Fullscreen in-page modal inspection with scroll-lock
├── scene-loader.tsx              # Tactical loading sequence indicator
├── scene-error.tsx               # Graceful 2D fallback when WebGL is unavailable
└── weapon-inspection-viewer.tsx  # Master orchestrator component
```

`src/components/WeaponViewer3D.tsx` is preserved as a lightweight wrapper that delegates to `WeaponInspectionViewer` for backward compatibility.

---

## 2. Honest 2.5D Optical Mechanics & Pitch Clamping

VALORANT weapon assets sourced from the Riot Client API are high-resolution transparent planar renders, not polygonal `.glb` meshes. 

To create a physical, tactile inspection experience without deceptive claims:

1. **Accurate Labeling**: The UI explicitly uses `INSPECT VIEW` or `INTERACTIVE PREVIEW`, never claiming to be a "True 3D Model".
2. **Pitch Clamping (`minPolarAngle` / `maxPolarAngle`)**:
   Rotating a transparent plane freely on the X-axis exposes razor-thin edges. The controls strictly clamp polar angle to $\approx \pm 15^\circ$ (`Math.PI / 2 \pm 0.28`). This introduces perspective depth and surface sheen without breaking the physical illusion.
3. **Yaw Clamping (`minAzimuthAngle` / `maxAzimuthAngle`)**:
   Horizontal rotation is clamped to $\approx \pm 80^\circ$ (`\pm Math.PI / 2.2`), keeping the face of the weapon readable while allowing full directional inspection.
4. **Specular Studio Lighting**:
   A key directional light (`#ffffff`), a cyan rim backlight (`#0DF2F2`), and an overhead primary red accent light (`#FA4454`) react dynamically with `MeshStandardMaterial` roughness/metalness properties as the weapon turns.
5. **Ground Shadow Projection & Reticle**:
   A planar shadow disc and tactical coordinate reticle ground the weapon in 3D space, preventing it from appearing as a disconnected floating sticker.

---

## 3. Fallback Hierarchy & Graceful Degradation

The viewer enforces a strict fallback cascade:

```text
Interactive 2.5D WebGL Stage
       ↓ (WebGL disabled / context lost)
Tactical 2D High-Resolution Render
       ↓ (Network error / broken URL)
Static Weapon Silhouette Frame
```

- **`isWebGLAvailable()`**: Evaluates context creation safely. If false, immediately renders `<SceneError reason="webgl-disabled" />`.
- **`IntersectionObserver`**: Pauses canvas rendering and auto-rotation when the component scrolls out of the viewport, eliminating idle GPU waste while reading weapon statistics or lore.
- **`prefers-reduced-motion`**: When detected, auto-rotation is disabled by default and transitions are instantaneous.

---

## 4. How to Add a New 3D Entity

To integrate another entity (e.g. an Agent portrait, tactical map layer, or accessory), use `WeaponInspectionViewer`:

```tsx
import { WeaponInspectionViewer } from "@/components/3d/weapon-inspection-viewer";

<WeaponInspectionViewer
  weaponImageUrl={entity.displayIcon}
  weaponName={entity.displayName}
  subtitle="AGENT CODEX // TACTICAL INSPECTION"
  rarity="SPECIALIST"
  badgeLabel="INSPECT VIEW"
  aspectRatio="16/9"
  className="w-full"
/>
```

### For Custom 3D Stages:
Create a dedicated stage component under `src/components/3d/` (e.g., `map-tactical-stage.tsx`) reusing `SceneControlsOverlay`, `TheaterModal`, `SceneLoader`, and `SceneError`.

---

## 5. Performance Budget & Resource Cleanup

- **Canvas DPR**: Restricted to `[1, 1.5]` to avoid 3x/4x mobile retina rendering bottlenecks.
- **Resource Disposal**: Geometries and materials instantiated in `useMemo` are explicitly disposed during `useEffect` cleanup.
- **Zero Memory Leaks**: No uncontrolled `requestAnimationFrame` loops; frame scheduling is handled by `@react-three/fiber`'s reactive loop.
