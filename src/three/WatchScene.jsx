import { useEffect, useState } from 'react'
import { Canvas, advance, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../lib/gsap'
import { rig } from '../animation/rig'
import { WatchModel } from './WatchModel'
import { SceneLighting } from './SceneLighting'

/**
 * Camera rig: positions the camera from the shared rig, and widens the
 * framing on portrait / narrow viewports so the watch never crops.
 */
function CameraRig() {
  const { camera, size } = useThree()
  useFrame(() => {
    const aspect = size.width / size.height
    const fit = Math.max(1, Math.pow(1.25 / aspect, 0.62))
    camera.position.set(rig.cx, rig.cy, rig.cz * fit)
    camera.lookAt(rig.tx, rig.ty, rig.tz)
    if (camera.fov !== rig.fov) {
      camera.fov = rig.fov
      camera.updateProjectionMatrix()
    }
  })
  return null
}

/** Compile every shader up-front so the intro never hitches. */
function Precompile({ onReady }) {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    let alive = true
    const done = () => alive && onReady?.()
    // wait one tick so the model + environment are in the scene graph
    const id = requestAnimationFrame(() => {
      ;(gl.compileAsync ? gl.compileAsync(scene, camera) : Promise.resolve(gl.compile(scene, camera))).then(done, done)
    })
    return () => { alive = false; cancelAnimationFrame(id) }
  }, [gl, scene, camera, onReady])
  return null
}

/** One RAF for everything: GSAP's ticker drives Lenis (lib/lenis) and R3F. */
function useTickerFrameloop() {
  useEffect(() => {
    const render = (time) => advance(time * 1000)
    gsap.ticker.add(render)
    return () => gsap.ticker.remove(render)
  }, [])
}

export default function WatchScene({ gltf, tier, reducedMotion, onContextLost, onReady }) {
  const maxDpr = tier === 'low' ? 1.5 : 1.75
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio || 1, maxDpr))
  useTickerFrameloop()

  return (
    <Canvas
      className="scene-canvas"
      frameloop="never"
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 30, near: 0.05, far: 60, position: [0, 0, 4.4] }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onContextLost?.()
        })
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <CameraRig />
      <SceneLighting />
      <WatchModel gltf={gltf} reducedMotion={reducedMotion} />
      <Precompile onReady={onReady} />
    </Canvas>
  )
}
