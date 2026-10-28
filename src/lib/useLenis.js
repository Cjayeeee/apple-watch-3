import { useEffect } from 'react'
import { createLenis, destroyLenis } from './lenis'

/** Mounts the singleton Lenis instance for the lifetime of the app. */
export function useLenis({ enabled, reducedMotion }) {
  useEffect(() => {
    if (!enabled) return
    createLenis({ reducedMotion })
    return () => destroyLenis()
  }, [enabled, reducedMotion])
}
