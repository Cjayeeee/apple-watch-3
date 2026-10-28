/**
 * The rig is the single source of truth for everything the 3D scene shows.
 *
 * GSAP timelines (intro + scroll choreography) tween these plain numbers.
 * The R3F frame loop reads them and applies them to the camera, model,
 * materials and lights. Nothing here ever goes through React state, so
 * scrolling never triggers a React re-render.
 */
export const rig = {
  // model transform (display frame: face → +Z, 12 o'clock → +Y, crown → +X)
  mx: 0, my: 0, mz: 0,
  rx: 0, ry: 0, rz: 0,
  s: 1,
  // camera position + look-at target
  cx: 0, cy: 0, cz: 4.4,
  tx: 0, ty: 0, tz: 0,
  fov: 30,
  // look
  reveal: 0, // 0 = halftone dot-matrix, 1 = photoreal
  explode: 0, // 0 = assembled, 1 = exploded anatomy
  screen: 0.35, // display emissive intensity
  finish: 0, // 0 = natural titanium, 1 = black titanium
  env: 0, // environment (reflection) rotation, radians
  key: 1, // key light intensity multiplier
  idle: 1, // weight for idle float + pointer parallax
  callouts: 0, // anatomy callout visibility (mirrors DOM opacity)
}

/** User input that is layered on top of the rig (damped in the frame loop). */
export const input = {
  px: 0, py: 0, // pointer, -1..1
  dragY: 0, // accumulated drag rotation (closing section)
  dragX: 0,
  dragging: false,
}

export const RIG_KEYS = Object.keys(rig)
