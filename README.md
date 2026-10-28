# ULTRA/3 — Field Study

An unofficial, scroll-driven WebGL study of the Apple Watch Ultra 3, built for a frontend portfolio.
React 19 · Vite · Three.js · React Three Fiber · Drei · GSAP + ScrollTrigger + SplitText · Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
```

The site loads `public/models/watch-ultra.glb`, which is generated from your original
`assets/Apple+Watch+Ultra+3.gltf`. If you replace the source model, regenerate it:

```bash
npm run prepare:model
```

## How it fits together

| Concern | Where |
| --- | --- |
| Asset pipeline (part naming, meshopt compression, source untouched) | `scripts/prepare-model.mjs` |
| Byte-accurate model loading + status store | `src/three/assetStore.js` |
| Canvas, single RAF loop, shader precompile, adaptive DPR | `src/three/WatchScene.jsx` |
| Orientation/normalisation wrapper, explode vectors, callout anchors | `src/three/setupWatch.js` |
| Per-part PBR materials, titanium finish switch | `src/three/materials.js` |
| Halftone → photoreal reveal shader | `src/three/halftone.js` |
| Original canvas watch face (live clock) | `src/three/watchFace.js` |
| Lightformer studio environment | `src/three/SceneLighting.jsx` |
| Shared animation state (the "rig") | `src/animation/rig.js` |
| Camera/model compositions per chapter | `src/animation/shots.js` |
| Intro + every ScrollTrigger timeline, reduced-motion variant | `src/animation/choreography.js` |
| Lenis singleton driven by GSAP's ticker | `src/lib/lenis.js` |
| Copy and verified specs | `src/content.js` |

**One loop.** GSAP's ticker drives Lenis (`lenis.raf`), ScrollTrigger and the R3F canvas
(`frameloop="never"` + `advance()`), so there is a single `requestAnimationFrame`.

**No React state per frame.** Timelines tween plain numbers on `rig`; `useFrame` reads them and
writes to the camera, model, materials and uniforms. Callout labels are positioned by writing
CSS transforms directly.

**Deterministic scrubbing.** Each chapter owns a contiguous scroll range and tweens
`fromTo(shotA → shotB)` with `immediateRender: false`, so scrolling backwards always lands on the
same frame. `gsap.matchMedia` rebuilds everything for mobile, desktop and reduced motion.

## Credits & notes

- Set your name in `SITE.author` (`src/content.js`) to credit yourself in the footer.
- Unofficial study, not affiliated with Apple Inc. Specs are Apple's published Ultra 3 figures.
