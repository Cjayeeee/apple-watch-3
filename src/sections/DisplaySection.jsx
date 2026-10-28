import { DISPLAY } from '../content'

/** 03 — pinned: macro on the face while brightness climbs 1 → 3,000 nits. */
export function DisplaySection() {
  return (
    <section id="display" className="chapter" aria-labelledby="display-title" tabIndex={-1}>
      <div className="chapter__inner">
        <header className="chapter__head" data-anim="head">
          <p className="chapter__meta label">
            <span className="bracket">03</span><span className="rule" aria-hidden="true" />The display
          </p>
          <h2 id="display-title" className="display display--h2">
            {DISPLAY.heading.map((l) => <span className="ln" key={l}>{l}</span>)}
          </h2>
          <p className="body-copy">{DISPLAY.body}</p>
        </header>

        <div className="chapter__foot">
          <div>
            <p className="nits" aria-label="Brightness: from 1 to 3,000 nits">
              <span className="nits__value" data-anim="nits" aria-hidden="true">0001</span>
              <span className="label nits__unit" aria-hidden="true">nits</span>
            </p>
            <dl className="facts" data-anim="fade">
              {DISPLAY.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="label">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="label anatomy__note" data-anim="fade">{DISPLAY.note}</p>
        </div>
      </div>
    </section>
  )
}
