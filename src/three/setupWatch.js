import * as THREE from 'three'

/**
 * Non-destructive normalisation of the supplied glTF.
 *
 * Source orientation: the display faces local +Y with 12 o'clock at −Z, and
 * the asset applies a +55° X rotation on top. We wrap (never edit) the scene:
 *   orient → rotates +35° about X so the face points at +Z, 12 o'clock at +Y
 *   norm   → recentres the watch *head* at the origin and scales the 49 mm
 *            case to exactly 1.0 unit tall.
 * All choreography then works in this clean "display frame".
 */

// Exploded-view offsets, in display-frame units (case height = 1).
const EXPLODE = {
  display: [0, 0, 0.62],
  bezel: [0, 0, 0.38],
  gasket: [0, 0, 0.5],
  crown: [0.55, 0, 0.05],
  sideButton: [0.42, 0, 0],
  actionButton: [-0.5, 0, 0],
  sensor: [0, 0, -0.78],
  engraving: [0, 0, -0.78],
  backplate: [0, 0, -0.42],
  band: [0, 0, -0.95],
  hook: [0, -0.15, -1.15],
  speaker: [-0.18, 0, 0],
}
const LUG_SPLIT = 0.32 // lug bars move up/down away from the case

const HEAD_EXCLUDE = new Set(['band', 'hook'])

export function setupWatch(gltf, materials) {
  const scene = gltf.scene
  const orient = new THREE.Group()
  orient.name = 'Orient'
  orient.rotation.x = THREE.MathUtils.degToRad(35)
  orient.add(scene)

  const norm = new THREE.Group()
  norm.name = 'Normalise'
  norm.add(orient)

  const meshes = []
  scene.traverse((o) => {
    if (!o.isMesh) return
    const part = o.name.split('_')[0]
    o.userData.part = part
    o.material = materials.byPart[part] ?? materials.byPart.case
    o.frustumCulled = true
    meshes.push(o)
  })

  // centre + scale on the watch head
  norm.updateMatrixWorld(true)
  const head = new THREE.Box3()
  meshes.filter((m) => !HEAD_EXCLUDE.has(m.userData.part)).forEach((m) => head.expandByObject(m))
  const center = head.getCenter(new THREE.Vector3())
  const size = head.getSize(new THREE.Vector3())
  const caseHeight = size.y * 0.86 // head box includes lug bars; 0.86 ≈ case-only height
  orient.position.copy(center).multiplyScalar(-1)
  norm.scale.setScalar(1 / caseHeight)
  norm.updateMatrixWorld(true)

  // explode vectors expressed in each mesh's parent space
  const parts = meshes.map((mesh) => {
    const part = mesh.userData.part
    const box = new THREE.Box3().setFromObject(mesh)
    const c = box.getCenter(new THREE.Vector3())
    let v = EXPLODE[part] ? new THREE.Vector3(...EXPLODE[part]) : new THREE.Vector3()
    if (part === 'lug') v = new THREE.Vector3(0, Math.sign(c.y) * LUG_SPLIT, Math.sign(c.y) * -0.1)
    const parentInv = new THREE.Matrix3().setFromMatrix4(mesh.parent.matrixWorld).invert()
    const local = v.clone().applyMatrix3(parentInv)
    return { mesh, part, origin: mesh.position.clone(), local, world: v, center: c }
  })

  // callout anchors (display-frame points + the explode vector they ride on)
  const anchorOf = (part, nudge = [0, 0, 0]) => {
    const list = parts.filter((p) => p.part === part)
    const b = new THREE.Box3()
    list.forEach((p) => b.expandByObject(p.mesh))
    return { point: b.getCenter(new THREE.Vector3()).add(new THREE.Vector3(...nudge)), offset: list[0]?.world.clone() ?? new THREE.Vector3() }
  }
  const anchors = {
    display: anchorOf('display', [-0.18, 0.2, 0]),
    crown: anchorOf('crown', [0.05, 0, 0]),
    action: anchorOf('actionButton'),
    sensor: anchorOf('sensor'),
    band: anchorOf('band', [0, -0.55, 0.2]),
  }

  return { root: norm, parts, anchors, caseHeight }
}

/** Apply explode amount (0..1) — cheap: a handful of vector adds per frame. */
export function applyExplode(parts, t, prev) {
  if (t === prev) return
  for (const p of parts) {
    if (p.local.lengthSq() === 0) continue
    p.mesh.position.copy(p.origin).addScaledVector(p.local, t)
  }
}
