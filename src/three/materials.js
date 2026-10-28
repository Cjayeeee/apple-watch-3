import * as THREE from 'three'
import { applyHalftone } from './halftone'

/**
 * Physically-plausible materials per part. The source asset ships 67 identical
 * untextured white-metal materials, so finishes are authored here and mapped
 * to the semantic part names produced by scripts/prepare-model.mjs.
 */
export const FINISHES = {
  natural: { color: new THREE.Color('#bdb7ac'), roughness: 0.3 },
  black: { color: new THREE.Color('#2b2a2b'), roughness: 0.38 },
}

export function createMaterials(screenTexture) {
  const titanium = new THREE.MeshPhysicalMaterial({
    name: 'titanium',
    color: FINISHES.natural.color.clone(),
    metalness: 1,
    roughness: FINISHES.natural.roughness,
    clearcoat: 0.12,
    clearcoatRoughness: 0.4,
  })
  const titaniumSatin = titanium.clone()
  titaniumSatin.name = 'titanium-satin'
  titaniumSatin.roughness = 0.42

  const display = new THREE.MeshPhysicalMaterial({
    name: 'display',
    color: '#020203',
    metalness: 0,
    roughness: 0.06,
    clearcoat: 0.35,
    clearcoatRoughness: 0.06,
    emissive: '#ffffff',
    emissiveMap: screenTexture,
    emissiveIntensity: 0.35,
    envMapIntensity: 0.35, // keep the crystal reflective without washing out the face
  })
  const glassEdge = new THREE.MeshPhysicalMaterial({
    name: 'glass-edge', color: '#08090a', metalness: 0.2, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05,
  })
  const blackCeramic = new THREE.MeshPhysicalMaterial({
    name: 'ceramic', color: '#0b0b0c', metalness: 0, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08,
  })
  const rubber = new THREE.MeshPhysicalMaterial({
    name: 'band', color: '#1d1d1f', metalness: 0, roughness: 0.72, sheen: 0.4, sheenRoughness: 0.6, sheenColor: '#3a3a3c',
  })
  const gasket = new THREE.MeshStandardMaterial({ name: 'gasket', color: '#0e0e0f', roughness: 0.65 })
  const orange = new THREE.MeshPhysicalMaterial({
    name: 'action', color: '#ff4d12', metalness: 0.15, roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.25,
  })
  const engraving = new THREE.MeshStandardMaterial({ name: 'engraving', color: '#7c7a76', metalness: 0.4, roughness: 0.5 })

  const byPart = {
    case: titanium,
    bezel: titanium,
    crown: titanium,
    sideButton: titanium,
    backplate: titaniumSatin,
    hook: titaniumSatin,
    lug: titaniumSatin,
    display,
    gasket: glassEdge,
    speaker: gasket,
    sensor: blackCeramic,
    engraving,
    actionButton: orange,
    band: rubber,
  }
  const all = [...new Set(Object.values(byPart))]
  all.forEach(applyHalftone)

  return {
    byPart,
    all,
    titanium: [titanium, titaniumSatin],
    display,
    setFinish(t) {
      titanium.color.lerpColors(FINISHES.natural.color, FINISHES.black.color, t)
      titanium.roughness = THREE.MathUtils.lerp(FINISHES.natural.roughness, FINISHES.black.roughness, t)
      titaniumSatin.color.copy(titanium.color)
      titaniumSatin.roughness = titanium.roughness + 0.12
    },
    dispose() { all.forEach((m) => m.dispose()) },
  }
}
