import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { rig, input } from '../animation/rig'
import { setupWatch, applyExplode } from './setupWatch'
import { createMaterials } from './materials'
import { createWatchFace } from './watchFace'
import { halftoneUniforms } from './halftone'
import { anchorEls } from './anchors'

const v = new THREE.Vector3()

// Setup mutates the scene graph (re-parenting), so it must run exactly once
// per glTF — StrictMode may call useMemo factories twice.
const cache = new WeakMap()
function prepare(gltf) {
  if (!cache.has(gltf)) {
    const face = createWatchFace()
    const materials = createMaterials(face.texture)
    const watch = setupWatch(gltf, materials)
    cache.set(gltf, { watch, materials, face })
  }
  return cache.get(gltf)
}

/**
 * The supplied Apple Watch Ultra 3 model, wrapped non-destructively and
 * driven every frame by the shared rig.
 */
export function WatchModel({ gltf, reducedMotion }) {
  const group = useRef()
  const { size, viewport } = useThree()

  const { watch, materials, face } = useMemo(() => prepare(gltf), [gltf])

  // Start the face clock while mounted; free GPU resources on unmount.
  // (Both are idempotent, so React StrictMode's mount→unmount→mount is safe.)
  useEffect(() => {
    face.start()
    return () => {
      face.stop()
      materials.dispose()
      face.texture.dispose()
    }
  }, [materials, face])

  useEffect(() => {
    const dpr = viewport.dpr
    halftoneUniforms.uRes.value = [size.width * dpr, size.height * dpr]
    halftoneUniforms.uDot.value = Math.round((size.width < 768 ? 6 : 7) * dpr)
  }, [size, viewport.dpr])

  const damped = useRef({ px: 0, py: 0, dragY: 0, dragX: 0, explode: -1, finish: -1 })

  const last = useRef(0)

  useFrame(({ camera }) => {
    const g = group.current
    if (!g) return
    if (import.meta.env.DEV) window.__watchGroup = g
    const d = damped.current
    // Own timer (seconds) — independent of how the R3F clock is advanced, so
    // the idle float can never be fed a mis-scaled time and jitter.
    const now = performance.now() / 1000
    const dt = last.current ? Math.min(Math.max(now - last.current, 0), 0.1) : 0
    last.current = now
    const k = 1 - Math.pow(0.002, dt) // frame-rate independent damping
    const motion = reducedMotion ? 0 : rig.idle
    d.px += (input.px * motion - d.px) * k * 0.6
    d.py += (input.py * motion - d.py) * k * 0.6
    d.dragY += (input.dragY - d.dragY) * k
    d.dragX += (input.dragX - d.dragX) * k

    const t = now
    const float = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.018 * rig.idle

    g.position.set(rig.mx, rig.my + float, rig.mz)
    g.rotation.set(
      rig.rx + d.py * 0.12 + d.dragX,
      rig.ry + d.px * 0.22 + d.dragY,
      rig.rz + (reducedMotion ? 0 : Math.sin(t * 0.6) * 0.012 * rig.idle),
    )
    g.scale.setScalar(rig.s)

    if (d.explode !== rig.explode) {
      applyExplode(watch.parts, rig.explode)
      d.explode = rig.explode
    }
    if (d.finish !== rig.finish) {
      materials.setFinish(rig.finish)
      d.finish = rig.finish
    }
    materials.display.emissiveIntensity = rig.screen
    halftoneUniforms.uReveal.value = rig.reveal

    // anatomy callouts: project 3D anchors → screen, write transforms directly
    if (rig.callouts > 0.001) {
      g.updateMatrixWorld()
      for (const [id, a] of Object.entries(watch.anchors)) {
        const el = anchorEls.get(id)
        if (!el) continue
        v.copy(a.point).addScaledVector(a.offset, rig.explode).applyMatrix4(g.matrixWorld).project(camera)
        const x = (v.x * 0.5 + 0.5) * size.width
        const y = (-v.y * 0.5 + 0.5) * size.height
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      }
    }
  })

  return (
    <group ref={group}>
      <primitive object={watch.root} />
    </group>
  )
}
