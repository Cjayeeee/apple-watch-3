import { MARQUEE } from '../content'

/** Velocity-reactive marquee; motion is attached in animation/choreography.js */
export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee" aria-hidden="true" data-anim="marquee">
      <div className="marquee__track">
        {[0, 1].map((half) => (
          <div key={half} style={{ display: 'flex' }}>
            {items.map((w, i) => (
              <span className="marquee__item" key={`${half}-${i}`}>
                <span className="marquee__word">{w}</span>
                <span className="marquee__sep" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
