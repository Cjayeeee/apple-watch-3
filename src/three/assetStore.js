import { useSyncExternalStore } from 'react'

export const MODEL_URL = '/models/watch-ultra.glb'

/**
 * Loads the watch with *real* byte progress: the GLB is streamed with fetch()
 * (Content-Length is known), then parsed in one go. Progress shown in the
 * preloader is therefore measured, never simulated.
 */
let state = { status: 'idle', loaded: 0, total: 0, gltf: null, error: null }
const listeners = new Set()
const set = (patch) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

export const assetStore = {
  subscribe: (l) => (listeners.add(l), () => listeners.delete(l)),
  get: () => state,
}

export function useAsset() {
  return useSyncExternalStore(assetStore.subscribe, assetStore.get)
}

let started = false
export async function loadWatch({ timeoutMs = 30000 } = {}) {
  if (started) return
  started = true
  set({ status: 'loading' })
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    // three's loaders are fetched in parallel with the model (separate chunk)
    const loaders = Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/libs/meshopt_decoder.module.js'),
    ])
    const res = await fetch(MODEL_URL, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`Model request failed (${res.status})`)
    const total = Number(res.headers.get('content-length')) || 0
    set({ total })

    let buffer
    if (res.body) {
      // Collect chunks rather than pre-allocating: if the server gzips the GLB,
      // Content-Length is the compressed size and decoded bytes exceed it.
      const reader = res.body.getReader()
      const chunks = []
      let loaded = 0
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        loaded += value.length
        set({ loaded: total ? Math.min(loaded, total) : loaded })
      }
      const bytes = new Uint8Array(loaded)
      let offset = 0
      for (const c of chunks) { bytes.set(c, offset); offset += c.length }
      buffer = bytes.buffer
      set({ loaded: loaded, total: Math.max(total, loaded) })
    } else {
      buffer = await res.arrayBuffer()
      set({ loaded: buffer.byteLength, total: buffer.byteLength })
    }

    const [{ GLTFLoader }, { MeshoptDecoder }] = await loaders
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    const gltf = await loader.parseAsync(buffer, '/models/')
    set({ status: 'ready', gltf })
  } catch (error) {
    console.error('[watch] model failed to load:', error)
    set({ status: 'error', error })
  } finally {
    clearTimeout(timer)
  }
}

/** Used when WebGL is unavailable: skip the download entirely. */
export function markUnavailable() {
  set({ status: 'unsupported' })
}
