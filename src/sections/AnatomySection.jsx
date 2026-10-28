import { ANATOMY } from '../content'
import { registerAnchor } from '../three/anchors'

/** 02 — pinned: the exploded view, with callouts tracked to 3D anchors. */
export function AnatomySection({ webgl }) {
  return (
    <section id="anatomy" className="chapter" aria-labelledby="anatomy-title" tabIndex={-1}>
      <div className="chapter__inner">
        <header className="chapter__head" data-anim="head">
          <p className="chapter__meta label">
            <span className="bracket">02</span><span className="rule" aria-hidden="true" />Anatomy
          </p>
          <h2 id="anatomy-title" className="display display--h2">
            {ANATOMY.heading.map((l) => <span className="ln" key={l}>{l}</span>)}
          </h2>
          <p className="body-copy">{ANATOMY.body}</p>
        </header>

        <div className="chapter__foot">
          <dl className="anatomy__stats" data-anim="fade">
            {ANATOMY.stats.map(([v, k]) => (
              <div key={k}>
                <dt>{v}</dt>
                <dd className="label">{k}</dd>
              </div>
            ))}
          </dl>
          <p className="label anatomy__note" data-anim="fade">{ANATOMY.note}</p>
        </div>
      </div>

      {/* Same information as the callouts, for assistive tech */}
      <ul className="sr-only">
        {ANATOMY.callouts.map((c) => <li key={c.id}>{c.label}: {c.detail}</li>)}
      </ul>

      {webgl && (
        <div className="callouts" data-anim="callouts" aria-hidden="true">
          {ANATOMY.callouts.map((c) => (
            <div key={c.id} className={`callout callout--${c.side}`} ref={(el) => registerAnchor(c.id, el)}>
              <span className="callout__dot" />
              <span className="callout__line" />
              <span className="callout__text">
                <span className="label label--ink">{c.label}</span>
                <span className="label">{c.detail}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
