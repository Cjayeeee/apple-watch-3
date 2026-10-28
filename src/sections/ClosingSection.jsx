import { useEffect, useRef, useState } from 'react'
import { ArrowUp, RotateCcw, RotateCw } from 'lucide-react'
import { CLOSING, FINISH } from '../content'
import { gsap } from '../lib/gsap'
import { rig, input } from '../animation/rig'
import { scrollToTarget } from '../lib/lenis'

/** 06 — closing statement + direct manipulation (drag / keys / buttons). */
export function ClosingSection({ webgl }) {
  const surface = useRef(null)
  const [finish, setFinish] = useState('natural')

  useEffect(() => {
    const el = surface.current
    if (!el) return
    let lastX = 0
    let lastY = 0
    let vx = 0
    let inertia = null
    const down = (e) => {
      input.dragging = true
      lastX = e.clientX
      lastY = e.clientY
      vx = 0
      inertia?.kill()
      el.setPointerCapture(e.pointerId)
    }
    const move = (e) => {
      if (!input.dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      vx = dx
      input.dragY += dx * 0.009
      input.dragX = gsap.utils.clamp(-0.5, 0.5, input.dragX + dy * 0.004)
    }
    const up = () => {
      if (!input.dragging) return
      input.dragging = false
      inertia = gsap.to(input, { dragY: input.dragY + vx * 0.06, dragX: 0, duration: 1.4, ease: 'power3.out' })
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      inertia?.kill()
    }
  }, [])

  const turn = (dir) => gsap.to(input, { dragY: input.dragY + dir * (Math.PI / 4), duration: 0.9, ease: 'power3.inOut' })
  const pick = (id) => {
    setFinish(id)
    gsap.to(rig, { finish: id === 'black' ? 1 : 0, duration: 1.1, ease: 'power2.inOut' })
  }

  return (
    <section id="closing" className="closing" aria-labelledby="closing-title" tabIndex={-1}>
      <div className="closing__stage">
        <p className="label closing__label" data-anim="fade"><span className="bracket">06</span> · Fin</p>
        <h2 id="closing-title" className="display closing__heading" data-anim="split">
          {CLOSING.heading.map((l) => <span className="ln" key={l}>{l}</span>)}
        </h2>
        <div className="closing__controls">
          <p className="body-copy" data-anim="fade">{CLOSING.body}</p>
          <div className="toggle" role="group" aria-label="Titanium finish" data-anim="fade">
            {FINISH.options.map((o) => (
              <button key={o.id} className="btn" aria-pressed={finish === o.id} onClick={() => pick(o.id)} disabled={!webgl}>
                {o.label}
              </button>
            ))}
          </div>
          <button className="btn" onClick={() => scrollToTarget('#top')} data-anim="fade">
            Back to top <ArrowUp aria-hidden="true" />
          </button>
        </div>

        {webgl && (
          <>
            <div ref={surface} className="drag-surface" aria-hidden="true" />
            <div className="drag-hint" role="group" aria-label="Rotate the watch">
              <button onClick={() => turn(-1)} aria-label="Rotate left"><RotateCcw size={16} aria-hidden="true" /></button>
              <span className="label">Drag to rotate</span>
              <button onClick={() => turn(1)} aria-label="Rotate right"><RotateCw size={16} aria-hidden="true" /></button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
