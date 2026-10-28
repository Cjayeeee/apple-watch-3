import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

/**
 * Single Lenis instance for the whole app, driven by GSAP's ticker so that
 * Lenis, ScrollTrigger, GSAP tweens and the WebGL render all share ONE
 * requestAnimationFrame loop (see three/WatchScene.jsx for the render hook).
 */
let lenis = null
let tick = null

export function createLenis({ reducedMotion }) {
  if (lenis) return lenis
  lenis = new Lenis({
    lerp: reducedMotion ? 1 : 0.095,
    smoothWheel: !reducedMotion,
    // Native touch scrolling on phones/tablets: momentum stays native, Lenis just reports.
    syncTouch: false,
    anchors: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroyLenis() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
  tick = null
}

export const getLenis = () => lenis

/** Programmatic navigation that works with or without Lenis. */
export function scrollToTarget(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis && !opts.immediate) {
    lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts })
  } else {
    el.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth' })
  }
}
