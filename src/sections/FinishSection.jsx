import { FINISH } from '../content'

/** 04 — pinned: an orbit while the titanium shifts natural → black. */
export function FinishSection() {
  return (
    <section id="finish" className="chapter" aria-labelledby="finish-title" tabIndex={-1}>
      <div className="chapter__inner">
        <header className="chapter__head finish__head" data-anim="head">
          <p className="chapter__meta label">
            Finish<span className="rule" aria-hidden="true" /><span className="bracket">04</span>
          </p>
          <h2 id="finish-title" className="display display--h2">
            {FINISH.heading.map((l) => <span className="ln" key={l}>{l}</span>)}
          </h2>
          <p className="body-copy">{FINISH.body}</p>
        </header>

        <div className="chapter__foot" style={{ justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-end' }}>
            <ul className="swatches" aria-label="Finishes">
              {FINISH.options.map((o, i) => (
                <li key={o.id} className={`swatch${i === 0 ? ' is-active' : ''}`} data-swatch={o.id}>
                  <span className={`swatch__chip swatch__chip--${o.id}`} aria-hidden="true" />
                  <span>
                    <span className="label label--ink" style={{ display: 'block' }}>{o.label} titanium</span>
                    <span className="label">{o.weight}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="finish__meter" aria-hidden="true"><i data-anim="finish-meter" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
