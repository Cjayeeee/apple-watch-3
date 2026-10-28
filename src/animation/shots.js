/**
 * Camera "shots" — named compositions the choreography moves between.
 * Units: the watch case is normalised to 1.0 tall (49 mm), centred at the origin.
 *
 * Each shot only lists what it sets; `shot(name)` merges with BASE so every
 * transition tweens a complete, deterministic state (scrubbing backwards
 * always lands on exactly the same frame).
 */
const BASE = {
  mx: 0, my: 0, mz: 0, rx: 0, ry: 0, rz: 0, s: 1,
  cx: 0, cy: 0, cz: 4.4, tx: 0, ty: 0, tz: 0, fov: 30,
  explode: 0, screen: 0.35, env: 0, key: 1, idle: 0,
}

const DESKTOP = {
  intro: { mx: 0.14, my: -0.3, rx: 0.9, ry: -2.6, rz: 0.4, s: 0.82, cz: 5.6, env: -1.2, idle: 0 },
  hero: { mx: 0.14, my: 0.06, rx: 0.2, ry: -0.62, rz: 0.12, env: 0, idle: 1 },

  // 01 — object: a full turn that visits each side of the case
  objFront: { mx: 0.45, rx: 0.06, ry: -0.18, cz: 4.0, env: 0.5 },
  objCrown: { mx: 0.4, rx: 0.12, ry: -1.42, rz: 0.04, cz: 3.9, env: 1.1 },
  objBack: { mx: 0.45, my: -0.12, rx: 0.12, ry: -3.0, cz: 5.3, env: 1.9, screen: 0.1 },
  objAction: { mx: 0.4, rx: 0.1, ry: -4.6, rz: -0.04, cz: 3.9, env: 2.6 },

  // 02 — anatomy: three-quarter view so the explode axis (front ↔ back) reads
  anatomy: { mx: 0.15, my: 0.02, rx: 0.32, ry: -0.95, rz: 0.08, cz: 4.9, env: 3.2 },
  anatomyX: { mx: 0.2, my: 0.02, rx: 0.3, ry: -0.82, rz: 0.06, cz: 5.6, env: 3.3, explode: 1 },
  anatomyY: { mx: 0.2, my: 0.02, rx: 0.26, ry: -0.62, rz: 0.04, cz: 5.5, env: 3.5, explode: 1 },
  anatomyEnd: { mx: 0.3, rx: 0.12, ry: -0.3, rz: 0, cz: 4.2, env: 3.6 },

  // 03 — display: straight-on macro
  display: { mx: 0.62, rx: 0, ry: -0.12, rz: 0, cz: 2.5, tx: 0.3, screen: 0.05, env: 3.6, key: 0.55 },
  displayLit: { mx: 0.62, ry: -0.04, cz: 2.25, tx: 0.42, screen: 1.5, env: 3.9, key: 0.55 },

  // 04 — finish: slow orbit while titanium changes
  orbitA: { mx: -0.55, rx: 0.28, ry: 0.55, rz: -0.06, cz: 4.3, env: 4.2 },
  orbitB: { mx: -0.55, rx: 0.12, ry: 0.55 - Math.PI * 1.25, rz: 0.06, cz: 4.5, env: 5.4 },

  // 05 — closing: back to a hero-like stance, centred
  closing: { mx: 0, my: 0.12, rx: 0.16, ry: -0.42, rz: 0.06, cz: 4.2, env: 6.2, idle: 1 },
  outro: { mx: 0, my: 0.6, rx: 0.4, ry: -0.9, rz: 0.06, s: 0.9, cz: 4.8, env: 6.6, idle: 0 },
}

// Phones / portrait: watch sits in the upper half, copy below it.
const MOBILE_OVERRIDES = {
  intro: { mx: 0, my: 0.2 },
  hero: { mx: 0, my: 0.32, tx: 0, ty: 0 },
  objFront: { mx: 0, my: 0.32 },
  objCrown: { mx: -0.32, my: 0.34, cz: 4.8 },
  objBack: { mx: 0, my: 0.34, cz: 5.6 },
  objAction: { mx: 0.32, my: 0.34, cz: 4.8 },
  anatomy: { mx: 0, my: 0.36, cz: 5.2 },
  anatomyX: { mx: -0.25, my: 0.3, cz: 7.4 },
  anatomyY: { mx: -0.25, my: 0.3, cz: 7.4 },
  anatomyEnd: { mx: 0, my: 0.3 },
  display: { mx: 0, my: 0.3, tx: 0, ty: 0.3, cz: 2.8 },
  displayLit: { mx: 0, my: 0.3, tx: 0, ty: 0.3, cz: 2.6 },
  orbitA: { mx: -0.3, my: 0.3, cz: 5.4 },
  orbitB: { mx: 0.1, my: 0.3, cz: 5.6 },
  closing: { mx: 0, my: -0.12, cz: 4.8 },
  outro: { mx: 0, my: 0.5 },
}

export function makeShots(mobile) {
  const out = {}
  for (const [name, s] of Object.entries(DESKTOP)) {
    out[name] = { ...BASE, ...s, ...(mobile ? MOBILE_OVERRIDES[name] : null) }
  }
  return out
}
