import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import { rig, input } from './rig'
import { makeShots } from './shots'

/**
 * The animation system. Everything that moves is built here, in page order:
 *
 *   intro  — one-off timeline: watch resolves from halftone into the hero shot
 *   scroll — per-chapter ScrollTriggers. Each chapter owns a contiguous scroll
 *            range and tweens the rig with explicit fromTo(shotA → shotB), so
 *            scrubbing in either direction is deterministic.
 *
 * gsap.matchMedia rebuilds the whole thing for mobile / desktop / reduced
 * motion and reverts everything (tweens, ScrollTriggers, SplitText) on change
 * or unmount — this also makes it StrictMode-safe.
 */

let introPlayed = false

const SHOT_EASE = 'power2.inOut'

/** fromTo between two shots, never rendering early (see header note). */
function shot(tl, from, to, at = 0, duration = 1, ease = SHOT_EASE) {
  return tl.fromTo(rig, { ...from }, { ...to, duration, ease, immediateRender: false }, at)
}

function scrub(trigger, extra = {}) {
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger, scrub: 0.9, invalidateOnRefresh: false, ...extra },
  })
}

function splitReveal(el, { trigger, start = 'top 70%', delay = 0 } = {}) {
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 105,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out',
        delay,
        scrollTrigger: trigger ? { trigger, start, toggleActions: 'play none none reverse' } : undefined,
      }),
  })
}

/* ------------------------------------------------------------------------ */

function buildIntro(S) {
  const lenis = getLenis()
  const atTop = window.scrollY < 4
  if (introPlayed || !atTop) {
    gsap.set(rig, { reveal: 1 })
    return
  }
  introPlayed = true
  lenis?.stop()

  const chars = gsap.utils.toArray('[data-anim="wordmark"] .char')
  const title = document.querySelector('[data-anim="hero-title"]')
  const split = SplitText.create(title, { type: 'lines', mask: 'lines' })

  gsap.set(rig, { ...S.intro, reveal: 0 })
  const tl = gsap.timeline({
    onComplete: () => {
      lenis?.start()
      split.revert()
    },
  })
  tl.to(rig, { ...S.hero, duration: 2.8, ease: 'expo.out' }, 0)
    .to(rig, { reveal: 1, duration: 2.2, ease: 'power2.inOut' }, 0.35)
    .from('[data-anim="nav"]', { yPercent: -100, duration: 1, ease: 'expo.out' }, 0.2)
    .from('[data-anim="hero-info"] > div', { opacity: 0, y: -10, duration: 0.8, stagger: 0.07 }, 0.45)
    .from(chars, { yPercent: 104, duration: 1.5, stagger: 0.06, ease: 'expo.out' }, 0.15)
    .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.09, ease: 'expo.out' }, 0.55)
    .from('[data-anim="hero-eyebrow"]', { opacity: 0, x: -12, duration: 0.8 }, 0.9)
    .from('[data-anim="hero-card"]', { opacity: 0, y: 24, duration: 1.1 }, 1.0)
    .from('[data-anim="hero-foot"] > *', { opacity: 0, duration: 0.8, stagger: 0.1 }, 1.2)
  return tl
}

/* ------------------------------------------------------------------------ */

function buildScroll(S, mobile) {
  const len = (screens) => `+=${Math.round(screens * (mobile ? 0.72 : 1) * 100)}%`

  // ── hero → 01 ───────────────────────────────────────────────────────────
  shot(scrub('#object', { start: 'top bottom', end: 'top top' }), S.hero, S.objFront)
  scrub('#top', { start: 'top top', end: 'bottom top' })
    .to('[data-anim="wordmark"]', { yPercent: 35, ease: 'none' }, 0)
    .to('.hero__body, [data-anim="hero-info"]', { yPercent: -18, opacity: 0, ease: 'power1.in' }, 0)

  // ── 01 object (pinned) ──────────────────────────────────────────────────
  {
    const steps = gsap.utils.toArray('#object .step')
    const tl = scrub('#object', { start: 'top top', end: len(3.2), pin: true, anticipatePin: 1 })
    shot(tl, S.objFront, S.objCrown, 0, 1)
    shot(tl, S.objCrown, S.objBack, 1, 1)
    shot(tl, S.objBack, S.objAction, 2, 1)
    tl.fromTo('[data-anim="progress"]', { scaleY: 0 }, { scaleY: 1, duration: 3 }, 0)
    tl.set(steps.slice(1), { autoAlpha: 0, y: 24 }, 0)
    steps.forEach((step, i) => {
      if (i === 0) return
      const at = i - 0.45
      tl.to(steps[i - 1], { autoAlpha: 0, y: -24, duration: 0.25, ease: 'power2.in' }, at)
      tl.fromTo(step, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, at + 0.22)
    })
    tl.to({}, { duration: 0.4 }, 3) // brief hold on the last step
  }

  // ── 01 → 02 ─────────────────────────────────────────────────────────────
  shot(scrub('#anatomy', { start: 'top bottom', end: 'top top' }), S.objAction, S.anatomy)

  // ── 02 anatomy (pinned) ─────────────────────────────────────────────────
  {
    const callouts = '[data-anim="callouts"]'
    const tl = scrub('#anatomy', { start: 'top top', end: len(3.4), pin: true, anticipatePin: 1 })
    shot(tl, S.anatomy, S.anatomyX, 0, 1.3, 'power3.inOut')
    tl.fromTo([rig], { callouts: 0 }, { callouts: 1, duration: 0.3, immediateRender: false }, 1.0)
    tl.fromTo(callouts, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 1.0)
    shot(tl, S.anatomyX, S.anatomyY, 1.3, 1.1, 'none')
    tl.to(callouts, { opacity: 0, duration: 0.25 }, 2.3)
    tl.to(rig, { callouts: 0, duration: 0.25 }, 2.3)
    shot(tl, S.anatomyY, S.anatomyEnd, 2.4, 1.1, 'power3.inOut')
  }

  // ── 02 → 03 ─────────────────────────────────────────────────────────────
  shot(scrub('#display', { start: 'top bottom', end: 'top top' }), S.anatomyEnd, S.display)

  // ── 03 display (pinned) ─────────────────────────────────────────────────
  {
    const nits = document.querySelector('[data-anim="nits"]')
    const counter = { v: 1 }
    const tl = scrub('#display', { start: 'top top', end: len(2.2), pin: true, anticipatePin: 1 })
    shot(tl, S.display, S.displayLit, 0, 2, 'power2.in')
    tl.fromTo(
      counter,
      { v: 1 },
      {
        v: 3000,
        duration: 2,
        ease: 'power3.in',
        immediateRender: false,
        onUpdate: () => { nits.textContent = String(Math.round(counter.v)).padStart(4, '0') },
      },
      0,
    )
    tl.to({}, { duration: 0.3 }, 2)
  }

  // ── 03 → 04 ─────────────────────────────────────────────────────────────
  shot(scrub('#finish', { start: 'top bottom', end: 'top top' }), S.displayLit, S.orbitA)

  // ── 04 finish (pinned) ──────────────────────────────────────────────────
  {
    const swatches = gsap.utils.toArray('[data-swatch]')
    const tl = scrub('#finish', {
      start: 'top top',
      end: len(2.6),
      pin: true,
      anticipatePin: 1,
      onUpdate: () => {
        const black = rig.finish > 0.5
        swatches[0]?.classList.toggle('is-active', !black)
        swatches[1]?.classList.toggle('is-active', black)
      },
    })
    shot(tl, S.orbitA, S.orbitB, 0, 3, 'power1.inOut')
    tl.fromTo([rig], { finish: 0 }, { finish: 1, duration: 1.1, ease: 'power2.inOut', immediateRender: false }, 0.9)
    tl.fromTo('[data-anim="finish-meter"]', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power2.inOut', immediateRender: false }, 0.9)
  }

  // ── 04 → closing (the opaque specs sheet slides over the canvas) ────────
  shot(scrub('#specs', { start: 'top bottom', endTrigger: '#closing', end: 'top top' }), S.orbitB, S.closing)

  // ── closing → footer: the watch dissolves back into dots ────────────────
  {
    const tl = scrub('#footer', { start: 'top bottom', end: 'top 20%' })
    shot(tl, S.closing, S.outro, 0, 1, 'power1.in')
    tl.fromTo([rig], { reveal: 1 }, { reveal: 0, duration: 1, ease: 'power1.in', immediateRender: false }, 0)
    tl.fromTo('[data-anim="footer-mark"]', { yPercent: 60 }, { yPercent: 12, duration: 1, immediateRender: false }, 0)
  }

  // reset any user rotation when leaving the closing stage
  ScrollTrigger.create({
    trigger: '#closing',
    start: 'top bottom',
    end: 'bottom top',
    onLeave: resetDrag,
    onLeaveBack: resetDrag,
  })
}

function resetDrag() {
  gsap.to(input, { dragY: 0, dragX: 0, duration: 1, ease: 'power3.out', overwrite: true })
}

/* ------------------------------------------------------------------------ */

function buildTextReveals() {
  // chapter headings (pinned chapters: trigger before the pin engages)
  gsap.utils.toArray('[data-anim="head"] h2, [data-anim="split"]').forEach((el) => {
    splitReveal(el, { trigger: el.closest('section'), start: 'top 65%' })
  })
  gsap.utils.toArray('[data-anim="head"] .chapter__meta, [data-anim="head"] .body-copy, [data-anim="fade"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 16,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top 60%', toggleActions: 'play none none reverse' },
    })
  })
  gsap.utils.toArray('[data-anim="spec"]').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: (i % 4) * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    })
  })
}

function buildMarquee() {
  const track = document.querySelector('[data-anim="marquee"] .marquee__track')
  if (!track) return
  const loop = gsap.to(track, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 })
  let dir = 1
  ScrollTrigger.create({
    trigger: '[data-anim="marquee"]',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity()
      if (Math.abs(v) > 5) dir = v < 0 ? -1 : 1
      const boost = 1 + Math.min(Math.abs(v) / 350, 5)
      gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true })
      gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: 'power2.out' })
    },
  })
}

function bindPointer() {
  if (!window.matchMedia('(pointer: fine)').matches) return () => {}
  const onMove = (e) => {
    input.px = (e.clientX / window.innerWidth) * 2 - 1
    input.py = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  return () => window.removeEventListener('pointermove', onMove)
}

/* ------------------------------------------------------------------------ */
/* Reduced motion: no pinning, no scrubbing. Each chapter shows one static
   composition, switched instantly as it becomes the active chapter.        */

function buildReduced(S) {
  document.documentElement.classList.add('reduced')
  gsap.set(rig, { ...S.hero, reveal: 1, idle: 0 })
  const nits = document.querySelector('[data-anim="nits"]')
  if (nits) nits.textContent = '3000'
  const map = [
    ['#top', S.hero],
    ['#object', S.objCrown],
    ['#anatomy', { ...S.anatomyX }],
    ['#display', S.displayLit],
    ['#finish', S.orbitA],
    ['#closing', S.closing],
  ]
  map.forEach(([trigger, state]) => {
    ScrollTrigger.create({
      trigger,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => self.isActive && gsap.set(rig, { ...state, idle: 0 }),
    })
  })
  return () => document.documentElement.classList.remove('reduced')
}

/* ------------------------------------------------------------------------ */

export function useChoreography({ enabled }) {
  useLayoutEffect(() => {
    if (!enabled) return
    const mm = gsap.matchMedia()
    mm.add(
      {
        mobile: '(max-width: 767px)',
        desktop: '(min-width: 768px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { mobile, reduce } = ctx.conditions
        const S = makeShots(mobile)
        if (reduce) return buildReduced(S)

        buildIntro(S)
        buildScroll(S, mobile)
        buildTextReveals()
        buildMarquee()
        const unbind = bindPointer()
        ScrollTrigger.refresh()
        return unbind
      },
    )
    const onFonts = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(onFonts)
    return () => mm.revert()
  }, [enabled])
}
