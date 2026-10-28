import { OBJECT_STEPS } from '../content'

/** 01 — pinned: the watch turns through each face of the case. */
export function ObjectSection() {
  const total = String(OBJECT_STEPS.length).padStart(2, '0')
  return (
    <section id="object" className="chapter" aria-labelledby="object-title" tabIndex={-1}>
      <div className="chapter__inner">
        <header className="chapter__head" data-anim="head">
          <p className="chapter__meta label">
            <span className="bracket">01</span><span className="rule" aria-hidden="true" />The object
          </p>
          <h2 id="object-title" className="display display--h2">
            <span className="ln">A case</span>
            <span className="ln">study in</span>
            <span className="ln">titanium</span>
          </h2>
        </header>

        <ol className="steps" aria-label="Case details">
          {OBJECT_STEPS.map((s, i) => (
            <li className="step" key={s.title} data-step={i}>
              <p className="step__index label">
                <b>{String(i + 1).padStart(2, '0')}</b> / {total} · {s.kicker}
              </p>
              <h3>{s.title}</h3>
              <p className="body-copy">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="progress" aria-hidden="true">
        <span className="label">01</span>
        <div className="progress__track"><div className="progress__fill" data-anim="progress" /></div>
        <span className="label">{total}</span>
      </div>
    </section>
  )
}
