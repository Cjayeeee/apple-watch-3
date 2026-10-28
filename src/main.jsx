import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/big-shoulders-display/100'
import '@fontsource/big-shoulders-display/200'
import '@fontsource/big-shoulders-display/300'
import '@fontsource/big-shoulders-display/800'
import '@fontsource/big-shoulders-display/900'
import '@fontsource/jetbrains-mono/400'
import '@fontsource/jetbrains-mono/500'
import './styles/base.css'
import './styles/sections.css'
import App from './App.jsx'

// Experiences with pinned scroll choreography should always start at the top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Dev-only handle for automated visual checks (stripped from production builds).
if (import.meta.env.DEV) {
  Promise.all([import('./lib/gsap'), import('./animation/rig'), import('./lib/lenis')]).then(([g, r, l]) => {
    window.__debug = { gsap: g.gsap, ScrollTrigger: g.ScrollTrigger, rig: r.rig, getLenis: l.getLenis }
  })
}
