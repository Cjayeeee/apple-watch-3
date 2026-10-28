import { useEffect, useRef, useState } from 'react'
import { useAsset } from '../three/assetStore'
import { gsap } from '../lib/gsap'
import { SITE } from '../content'

const DOTS = 40
const fmtKB = (b) => (b / 1024 / 1024).toFixed(2) + ' MB'

// Weighting of the real loading stages (sums to 1).
const W = { model: 0.7, fonts: 0.1, compile: 0.2 }
// The displayed number may never sweep 0→100 faster than this (seconds).
const MIN_SWEEP = 1.4

/**
 * Progress is *measured* across every stage that actually blocks the reveal:
 * model bytes streamed, webfonts loaded, shaders compiled. The displayed
 * number eases toward that measured value (never ahead of it), so a cached /
 * local load counts up quickly instead of appearing already at 100.
 */
export function Preloader({ sceneReady, onExitStart, onExit }) {
  const asset = useAsset()
  const root = useRef(null)
  const [fontsReady, setFontsReady] = useState(false)
  const exited = useRef(false)

  useEffect(() => {
    let alive = true
    const done = () => alive && setFontsReady(true)
    // never wait more than 2.5 s for fonts
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]).then(done)
    return () => { alive = false }
  }, [])

  const failed = asset.status === 'error' || asset.status === 'unsupported'
  const modelP = asset.status === 'ready' ? 1 : asset.total ? asset.loaded / asset.total : 0
  const real = failed
    ? 100
    : Math.round((modelP * W.model + (fontsReady ? W.fonts : 0) + (sceneReady ? W.compile : 0)) * 100)

  // displayed value chases the measured one
  const [shown, setShown] = useState(0)
  const proxy = useRef({ v: 0 })
  useEffect(() => {
    const p = proxy.current
    const tween = gsap.to(p, {
      v: real,
      duration: Math.max(0.2, ((real - p.v) / 100) * MIN_SWEEP),
      ease: 'power1.out',
      overwrite: true,
      onUpdate: () => setShown(Math.round(p.v)),
    })
    return () => tween.kill()
  }, [real])

  const pct = shown
  const canExit = fontsReady && (failed || (asset.status === 'ready' && sceneReady && shown >= 100))

  useEffect(() => {
    if (!canExit || exited.current) return
    exited.current = true
    const tl = gsap.timeline({ delay: failed ? 1.4 : 0.15, onComplete: () => onExit?.() })
    tl.call(() => onExitStart?.())
      .to(root.current.querySelectorAll('[data-pl]'), { opacity: 0, y: -12, duration: 0.5, stagger: 0.04, ease: 'power2.in' })
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.15')
  }, [canExit, failed, onExit, onExitStart])

  const lit = Math.round((pct / 100) * DOTS)
  let status = fontsReady ? 'Loading model' : 'Loading model + type'
  if (asset.status === 'ready') status = sceneReady ? 'Ready' : 'Compiling shaders'
  if (asset.status === 'error') status = 'Model unavailable — continuing without 3D'
  if (asset.status === 'unsupported') status = 'WebGL unavailable — static presentation'

  return (
    <div ref={root} className="preloader" role="status" aria-live="polite" aria-label={`${status} ${pct}%`} style={{ clipPath: 'inset(0 0 0% 0)' }}>
      <div className="preloader__top">
        <span className="label label--ink" data-pl>{SITE.name} · {SITE.subtitle}</span>
        <span className="label" data-pl>{asset.total ? `${fmtKB(asset.loaded)} / ${fmtKB(asset.total)}` : '—'}</span>
      </div>
      <div className="preloader__center">
        <div className="preloader__count" data-pl aria-hidden="true">
          <span>{String(pct).padStart(3, '0').slice(0, 3 - String(pct).length)}</span>{pct}
        </div>
      </div>
      <div className="preloader__bottom">
        <span className="label" data-pl>{status}</span>
        <div className="preloader__dots" data-pl aria-hidden="true">
          {Array.from({ length: DOTS }, (_, i) => (
            <i key={i} className={i < lit - 1 ? 'on' : i === lit - 1 ? 'edge' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}
