/** Small shared clock: one interval feeding any number of subscribers. */
const subs = new Set()
let id = null

export function subscribeClock(fn) {
  subs.add(fn)
  fn(new Date())
  if (!id) id = setInterval(() => { const d = new Date(); subs.forEach((s) => s(d)) }, 1000)
  return () => {
    subs.delete(fn)
    if (!subs.size) { clearInterval(id); id = null }
  }
}

export const pad = (n) => String(n).padStart(2, '0')
