/**
 * DOM ↔ 3D bridge for the anatomy callouts. The frame loop projects 3D
 * anchor points to screen space and writes CSS transforms straight onto
 * these registered elements (no React state involved).
 */
export const anchorEls = new Map()

export function registerAnchor(id, el) {
  if (el) anchorEls.set(id, el)
  else anchorEls.delete(id)
}
