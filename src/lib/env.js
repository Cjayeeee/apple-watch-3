/** Environment / capability helpers. Evaluated once on the client. */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

/** Rough device tier used to pick DPR caps and effect budgets. */
export function deviceTier() {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 768
  const cores = navigator.hardwareConcurrency || 4
  if ((coarse && small) || cores <= 4) return 'low'
  return 'high'
}

export const isMobileLayout = () => window.matchMedia('(max-width: 767px)').matches
