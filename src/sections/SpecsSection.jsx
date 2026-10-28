import { SPECS } from '../content'

/** 05 — an opaque data interlude that slides over the canvas. */
export function SpecsSection() {
  return (
    <section id="specs" className="specs" aria-labelledby="specs-title" tabIndex={-1}>
      <div className="shell">
        <div className="specs__head">
          <h2 id="specs-title" className="display display--h2" data-anim="split">
            <span className="ln">The numbers,</span>
            <span className="ln">unanimated.</span>
          </h2>
          <p className="body-copy" data-anim="fade">
            Everything the choreography hints at, stated plainly. <strong>Apple Watch Ultra 3</strong>, 49 mm.
          </p>
        </div>
        <dl className="specs__grid">
          {SPECS.map((s, i) => (
            <div className="spec" key={s.label} data-anim="spec">
              <dt className="label"><span className="idx">{String(i + 1).padStart(2, '0')}</span>{s.label}</dt>
              <dd>
                <span className="spec__value" style={{ display: 'block' }}>{s.value}</span>
                <span className="spec__detail">{s.detail}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="label specs__source">Source: Apple Watch Ultra 3 technical specifications published by Apple. Features vary by region.</p>
      </div>
    </section>
  )
}
