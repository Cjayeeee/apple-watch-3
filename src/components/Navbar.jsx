import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV, SITE } from '../content'
import { scrollToTarget } from '../lib/lenis'
import { ScrollTrigger } from '../lib/gsap'
import { Clock } from './Clock'

export function Navbar({ ready }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)

  // highlight the chapter currently on screen
  useEffect(() => {
    if (!ready) return
    const triggers = NAV.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && setActive(id),
        onLeaveBack: () => id === NAV[0].id && setActive(null),
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [ready])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(`#${id}`)
    // move focus for keyboard / screen-reader users
    document.getElementById(id)?.focus({ preventScroll: true })
  }

  return (
    <>
      <header className="nav" data-anim="nav">
        <a href="#top" className="nav__brand" onClick={(e) => go(e, 'top')} aria-label={`${SITE.name} ${SITE.subtitle}, back to top`}>
          {SITE.name} <span>{SITE.subtitle}</span>
        </a>
        <nav className="nav__center" aria-label="Chapters">
          <ul className="nav__links">
            {NAV.slice(0, 2).map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => go(e, n.id)} aria-current={active === n.id}>
                  <span className="label"><span className="idx">{n.index}</span>{n.label}</span>
                </a>
              </li>
            ))}
            <li aria-hidden="true"><span className="nav__mark">U3</span></li>
            {NAV.slice(2, 4).map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => go(e, n.id)} aria-current={active === n.id}>
                  <span className="label"><span className="idx">{n.index}</span>{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav__right">
          <span className="label nav__tag">Unofficial</span>
          <span className="label">Local <span className="label--ink"><Clock /></span></span>
          <button className="btn nav__menu" aria-expanded={open} aria-controls="nav-drawer" onClick={() => setOpen((o) => !o)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </header>
      {open && (
        <nav id="nav-drawer" className="nav__drawer" aria-label="Chapters">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => go(e, n.id)}>
              <span className="display display--h3">{n.label}</span>
              <span className="label">{n.index}</span>
            </a>
          ))}
        </nav>
      )}
    </>
  )
}
