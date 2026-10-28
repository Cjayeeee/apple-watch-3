import { useLayoutEffect, useRef } from 'react'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { HERO, SITE } from '../content'
import { scrollToTarget } from '../lib/lenis'
import { Clock } from '../components/Clock'

/** Fit the wordmark to the container width (bounded by viewport height). */
function useFitWordmark(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const text = el.querySelector('.wordmark__text')
    const aside = el.querySelector('.wordmark__aside')
    const fit = () => {
      text.style.fontSize = '100px'
      const natural = text.scrollWidth
      const style = getComputedStyle(el)
      const avail = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - aside.offsetWidth - 12
      const byWidth = (avail / natural) * 100
      const byHeight = (window.innerHeight * 0.27) / 0.74
      text.style.fontSize = `${Math.min(byWidth, byHeight)}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [ref])
}

export function HeroSection() {
  const mark = useRef(null)
  useFitWordmark(mark)

  return (
    <section id="top" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero__info layer-front" data-anim="hero-info">
        {HERO.info.map(([k, v]) => (
          <div key={k}>
            <span className="label">{k}</span>
            <span className="label val">{v}</span>
          </div>
        ))}
        <div>
          <span className="label">Local time</span>
          <span className="label val"><Clock seconds /></span>
        </div>
      </div>

      <div className="hero__body layer-front">
        <div className="hero__copy">
          <p className="hero__eyebrow label" data-anim="hero-eyebrow">
            <span className="dot dot--accent" aria-hidden="true" />
            <span className="bracket">00</span> · {HERO.eyebrow}
          </p>
          <h1 id="hero-title" className="display display--h1" data-anim="hero-title">
            {HERO.headline.map((l) => (
              <span className="ln" key={l}>{l}</span>
            ))}
          </h1>
        </div>
        <div className="hero__card" data-anim="hero-card">
          <p>{HERO.intro}</p>
          <div className="hero__actions">
            <button className="btn" onClick={() => scrollToTarget('#anatomy')}>Take it apart</button>
            <button className="btn btn--solid" onClick={() => scrollToTarget('#specs')}>
              Specs <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div ref={mark} className="wordmark layer-back" aria-hidden="true" data-anim="wordmark">
        <div className="wordmark__text">
          {'ULTRA'.split('').map((c, i) => (
            <span className="char" key={i}>{c}</span>
          ))}
          <span className="char" style={{ color: 'var(--accent)' }}>3</span>
        </div>
        <div className="wordmark__aside">Field study</div>
      </div>

      <div className="hero__foot" data-anim="hero-foot">
        <span className="label">Apple Watch Ultra 3 — a {SITE.subtitle.toLowerCase()} — {SITE.year}</span>
        <a href="#object" className="label label--ink scroll-cue" onClick={(e) => { e.preventDefault(); scrollToTarget('#object') }}>
          Scroll <span className="scroll-cue__bar" aria-hidden="true" /> <ArrowDown size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
