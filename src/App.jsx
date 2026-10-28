import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { detectWebGL, deviceTier, prefersReducedMotion } from './lib/env'
import { useLenis } from './lib/useLenis'
import { useChoreography } from './animation/choreography'
import { loadWatch, markUnavailable, useAsset } from './three/assetStore'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { Marquee } from './components/Marquee'
import { Footer } from './components/Footer'
import { Fallback } from './components/Fallback'
import { HeroSection } from './sections/HeroSection'
import { ObjectSection } from './sections/ObjectSection'
import { AnatomySection } from './sections/AnatomySection'
import { DisplaySection } from './sections/DisplaySection'
import { FinishSection } from './sections/FinishSection'
import { SpecsSection } from './sections/SpecsSection'
import { ClosingSection } from './sections/ClosingSection'

// three.js + R3F live in their own chunk; the preloader paints without them.
const WatchScene = lazy(() => import('./three/WatchScene'))

export default function App() {
  const env = useMemo(
    () => ({ webgl: detectWebGL(), reduced: prefersReducedMotion(), tier: deviceTier() }),
    [],
  )
  const asset = useAsset()
  const [sceneReady, setSceneReady] = useState(false)
  const [contextLost, setContextLost] = useState(false)
  const [phase, setPhase] = useState('loading') // loading → reveal → done

  useEffect(() => {
    if (env.webgl) loadWatch()
    else markUnavailable()
  }, [env.webgl])

  useLenis({ enabled: true, reducedMotion: env.reduced })
  useChoreography({ enabled: phase !== 'loading' })

  const has3D = env.webgl && asset.status === 'ready' && !contextLost
  const fallbackReason =
    !env.webgl ? 'unsupported' : asset.status === 'error' || contextLost ? 'error' : null

  const onSceneReady = useCallback(() => setSceneReady(true), [])
  const onExitStart = useCallback(() => setPhase('reveal'), [])
  const onExitDone = useCallback(() => setPhase('done'), [])
  const onContextLost = useCallback(() => setContextLost(true), [])

  return (
    <>
      <a href="#object" className="skip-link">Skip to content</a>

      {has3D && (
        <div className="scene-layer">
          <Suspense fallback={null}>
            <WatchScene
              gltf={asset.gltf}
              tier={env.tier}
              reducedMotion={env.reduced}
              onReady={onSceneReady}
              onContextLost={onContextLost}
            />
          </Suspense>
        </div>
      )}
      {fallbackReason && phase !== 'loading' && <Fallback reason={fallbackReason} />}

      <Navbar ready={phase !== 'loading'} />

      <main id="main">
        <HeroSection />
        <Marquee />
        <ObjectSection />
        <AnatomySection webgl={has3D} />
        <DisplaySection />
        <FinishSection />
        <SpecsSection />
        <ClosingSection webgl={has3D} />
      </main>
      <Footer />

      {phase !== 'done' && (
        <Preloader sceneReady={sceneReady} onExitStart={onExitStart} onExit={onExitDone} />
      )}
    </>
  )
}
