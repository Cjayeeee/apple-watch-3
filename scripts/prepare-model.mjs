/**
 * prepare-model.mjs
 * Non-destructive asset pipeline for the supplied Apple Watch Ultra 3 glTF.
 *
 * The source file ships 67 meshes all called "obj" with 67 identical
 * untextured white-metal materials. This script:
 *   1. reads the source (never modifies it),
 *   2. gives every mesh node a semantic name (display, case, crown, band…)
 *      so the runtime can assign physically-plausible materials per part,
 *   3. removes the embedded Octane camera node,
 *   4. dedupes the identical materials, then meshopt-compresses geometry,
 *   5. writes public/models/watch-ultra.glb.
 *
 * Usage: node scripts/prepare-model.mjs [path/to/source.gltf]
 */
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions'
import { dedup, prune, reorder, quantize, weld, unpartition } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer'
import path from 'node:path'
import fs from 'node:fs'

const SRC = process.argv[2] ?? path.resolve('assets/Apple+Watch+Ultra+3.gltf')
const OUT = path.resolve('public/models/watch-ultra.glb')

// Part map derived from isolating each of the 67 meshes in a debug render.
const PARTS = {
  display: [23],
  bezel: [5, 6, 24],
  gasket: [8, 9],
  speaker: [10, 11],
  crown: [16, 17, 18, 19, 20, 21, 22],
  sideButton: [62, 63],
  actionButton: [60, 61],
  sensor: [30, 31, 32, 33, 34, 35, 36, 37, 39, 41, 25, 26],
  engraving: [27],
  backplate: [28, 38],
  band: [55, 56],
  hook: [54, 64, 65, 66],
  lug: [0, 1, 14, 15, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
  // everything else is the titanium case
}
const partOf = (i) => Object.entries(PARTS).find(([, ids]) => ids.includes(i))?.[0] ?? 'case'

await MeshoptEncoder.ready
await MeshoptDecoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
  'meshopt.decoder': MeshoptDecoder,
})

const doc = await io.read(SRC)
const root = doc.getRoot()
const meshes = root.listMeshes()

meshes.forEach((mesh, i) => {
  const part = partOf(i)
  mesh.setName(`${part}_${i}`)
  // one named material per part so the runtime can look them up
  mesh.listPrimitives().forEach((prim) => prim.getMaterial()?.setName(part))
})
root.listNodes().forEach((node) => {
  if (node.getCamera()) node.dispose()
  else if (node.getMesh()) node.setName(node.getMesh().getName())
})
root.listNodes().find((n) => n.getName() === 'obj' && !n.getMesh())?.setName('WatchRoot')
root.listCameras().forEach((c) => c.dispose())

// Collapse 67 identical materials into one per part (dedup keys on name too).
await doc.transform(
  unpartition(),
  dedup({ keepUniqueNames: true }),
  prune({ keepLeaves: false, keepAttributes: true }),
  weld(),
  reorder({ encoder: MeshoptEncoder }),
  quantize(),
)
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({
  method: EXTMeshoptCompression.EncoderMethod.FILTER,
})

fs.mkdirSync(path.dirname(OUT), { recursive: true })
await io.write(OUT, doc)
const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0) + ' KB'
console.log(`source ${kb(SRC)} -> ${path.relative(process.cwd(), OUT)} ${kb(OUT)}`)
console.log(`meshes ${meshes.length}, materials ${root.listMaterials().length}`)
