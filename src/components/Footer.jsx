import { LEGAL, NAV, SITE, STACK } from '../content'
import { scrollToTarget } from '../lib/lenis'

export function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer__grid">
        <div>
          <h4 className="label label--ink">{SITE.name} — {SITE.subtitle}</h4>
          <p className="footer__legal">{LEGAL}</p>
        </div>
        <div>
          <h4 className="label">Chapters</h4>
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); scrollToTarget(`#${n.id}`) }}>
                  {n.index} {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="label">Built with</h4>
          <ul>{STACK.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div>
          <h4 className="label">Credits</h4>
          <ul>
            {SITE.author && <li>Design & development — {SITE.author}</li>}
            <li>3D model — supplied Ultra 3 glTF</li>
            <li>Type — Big Shoulders Display, JetBrains Mono</li>
          </ul>
        </div>
      </div>
      <div className="footer__mark" aria-hidden="true" data-anim="footer-mark">Field study</div>
      <div className="footer__bar">
        <span className="label">© {SITE.year} · Portfolio study</span>
        <span className="label">Not affiliated with Apple Inc.</span>
      </div>
    </footer>
  )
}
