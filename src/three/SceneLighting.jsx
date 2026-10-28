import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { rig } from '../animation/rig'

/**
 * Studio lighting built entirely from local Lightformers (no HDRI download).
 * The environment is baked once (frames={1}); the choreography rotates it
 * via scene.environmentRotation so reflections sweep across the titanium
 * as you scroll, at zero extra render cost.
 */
export function SceneLighting() {
  const key = useRef()
  const rim = useRef()

  useFrame(({ scene }) => {
    scene.environmentRotation.y = rig.env
    if (key.current) key.current.intensity = 2.4 * rig.key
    if (rim.current) rim.current.intensity = 3.2 * (0.6 + rig.key * 0.4)
  })

  return (
    <>
      <ambientLight intensity={0.08} />
      {/* key: defines the silhouette from upper right */}
      <directionalLight ref={key} position={[3.5, 4, 5]} intensity={2.4} color="#fff6ea" />
      {/* rim: cool back light that separates the case from the black void */}
      <directionalLight ref={rim} position={[-4, 2.5, -5]} intensity={3.2} color="#cfe0ff" />
      {/* fill: low, from below-left so the strap doesn't fall to pure black */}
      <directionalLight position={[-3, -2, 3]} intensity={0.35} color="#ffffff" />

      <Environment resolution={256} frames={1} environmentIntensity={0.9}>
        <color attach="background" args={['#050505']} />
        {/* large overhead softbox */}
        <Lightformer form="rect" intensity={2.2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        {/* tall strip lights — the long highlights on the case flanks */}
        <Lightformer form="rect" intensity={5} position={[-5, 0.5, 1.5]} rotation-y={Math.PI / 2} scale={[0.6, 9, 1]} />
        <Lightformer form="rect" intensity={3.5} position={[5, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[0.6, 9, 1]} />
        {/* warm kicker */}
        <Lightformer form="rect" intensity={1.4} color="#ffd9b8" position={[2, -3, 4]} scale={[4, 1, 1]} />
        {/* thin ring behind for crisp edge reflections on the bezel */}
        <Lightformer form="ring" intensity={2.5} position={[0, 1, -6]} scale={3} />
      </Environment>
    </>
  )
}
