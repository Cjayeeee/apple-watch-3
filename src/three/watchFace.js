import * as THREE from 'three'
import { subscribeClock, pad } from '../lib/clock'

/**
 * An original, clearly stylised watch face (not a watchOS face) drawn to a
 * canvas and mapped onto the display mesh's 0–1 UVs. It echoes the site's
 * dot-matrix identity: a ring of 60 dots marks the seconds.
 */
const W = 512
const H = 624 // display mesh aspect is ~0.82

export function createWatchFace() {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.flipY = false // glTF UV convention

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const draw = (d) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, W, H)
    const cx = W / 2
    const cy = H / 2
    const sec = d.getSeconds()

    // seconds ring — 60 dots on a rounded-rect path
    const rx = 214
    const ry = 270
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2 - Math.PI / 2
      // superellipse so the ring follows the squircle display
      const c = Math.cos(a)
      const s = Math.sin(a)
      const n = 4
      const x = cx + rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / n)
      const y = cy + ry * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)
      const major = i % 5 === 0
      const passed = i <= sec
      ctx.beginPath()
      ctx.arc(x, y, i === sec ? 7 : major ? 4.2 : 2.6, 0, Math.PI * 2)
      ctx.fillStyle = i === sec ? '#ff5a1f' : passed ? '#f2efe8' : '#3a3936'
      ctx.fill()
    }

    // time, stacked
    ctx.fillStyle = '#f2efe8'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.font = '800 190px "Big Shoulders Display", "Arial Narrow", sans-serif'
    ctx.fillText(pad(d.getHours()), cx, cy - 8)
    ctx.fillStyle = '#ff5a1f'
    ctx.fillText(pad(d.getMinutes()), cx, cy + 168)

    ctx.fillStyle = '#9b978f'
    ctx.font = '500 22px "JetBrains Mono", monospace'
    ctx.fillText(`${days[d.getDay()]} ${pad(d.getDate())}`, cx, 132)
    ctx.font = '500 16px "JetBrains Mono", monospace'
    ctx.fillText('FIELD · STUDY', cx, H - 98)
    texture.needsUpdate = true
  }

  let last = new Date()
  let unsub = null
  draw(last)
  // redraw once webfonts are in so the canvas uses the right glyphs
  document.fonts?.ready.then(() => draw(last))

  return {
    texture,
    start() {
      if (!unsub) unsub = subscribeClock((d) => { last = d; draw(d) })
    },
    stop() {
      unsub?.()
      unsub = null
    },
  }
}
