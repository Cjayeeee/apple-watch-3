/**
 * All copy in one place. Every product figure below is taken from Apple's
 * published Apple Watch Ultra 3 technical specifications (49 mm, 2025).
 * This is an unofficial design study — see LEGAL.
 */
export const SITE = {
  name: 'ULTRA/3',
  subtitle: 'Field Study',
  // Set your name here to credit yourself in the footer (hidden when empty).
  author: '',
  year: 2026,
}

export const NAV = [
  { id: 'object', index: '01', label: 'Object' },
  { id: 'anatomy', index: '02', label: 'Anatomy' },
  { id: 'display', index: '03', label: 'Display' },
  { id: 'finish', index: '04', label: 'Finish' },
  { id: 'specs', index: '05', label: 'Specs' },
]

export const HERO = {
  eyebrow: 'Unofficial design study',
  headline: ['Forged', 'for the', 'unmapped'],
  intro:
    'A scroll-driven study of the Apple Watch Ultra 3 — titanium, sapphire and a single orange button, rendered live in WebGL from the source model.',
  info: [
    ['Apple Watch', 'Ultra 3 · 49 mm'],
    ['Case', 'Natural titanium'],
    ['Study', 'WebGL · GSAP · Lenis'],
  ],
}

export const MARQUEE = ['Dive', 'Climb', 'Navigate', 'Endure', 'Return']

export const OBJECT_STEPS = [
  {
    kicker: 'Case',
    title: '49 × 44 × 12 mm',
    body: 'A titanium case weighing 61.6 g in the natural finish. The flat sapphire crystal sits inside a raised titanium edge.',
  },
  {
    kicker: 'Digital Crown',
    title: 'Knurled, guarded',
    body: 'The Digital Crown delivers haptic feedback, set between a protective guard and the side button.',
  },
  {
    kicker: 'Back',
    title: 'Ceramic + sapphire',
    body: 'The back is ceramic, protected by sapphire crystal, housing the third‑generation optical heart sensor and the electrical heart sensor.',
  },
  {
    kicker: 'Action button',
    title: 'International orange',
    body: 'A customisable Action button on the opposite flank — including Precision Start for runs.',
  },
]

export const ANATOMY = {
  heading: ['Taken', 'apart.'],
  body: 'Each component below is a separate mesh in the supplied model. Scroll to separate the stack along its depth axis, then let it settle back together.',
  stats: [
    ['67', 'meshes'],
    ['113k', 'triangles'],
    ['14', 'part groups'],
  ],
  note: 'Illustrative exploded view of the 3D model — not a manufacturer teardown.',
  callouts: [
    { id: 'display', label: 'Display', detail: 'Flat sapphire · LTPO3 OLED', side: 'left' },
    { id: 'crown', label: 'Digital Crown', detail: 'Haptic feedback', side: 'right' },
    { id: 'action', label: 'Action button', detail: 'Customisable', side: 'left' },
    { id: 'sensor', label: 'Sensor array', detail: 'Optical + electrical heart', side: 'right' },
    { id: 'band', label: 'Band + hook', detail: 'Titanium hook', side: 'right' },
  ],
}

export const DISPLAY = {
  heading: ['One nit', 'to three', 'thousand'],
  body: 'An Always-On Retina LTPO3 OLED under flat sapphire, from 1 nit in the dark to 3,000 nits peak in full sun.',
  facts: [
    ['Resolution', '422 × 514 px'],
    ['Peak', '3,000 nits'],
    ['Minimum', '1 nit'],
  ],
  note: 'The face shown is an original study, not watchOS.',
}

export const FINISH = {
  heading: ['Two', 'titaniums'],
  options: [
    { id: 'natural', label: 'Natural', weight: '61.6 g' },
    { id: 'black', label: 'Black', weight: '61.8 g' },
  ],
  body: 'The same case in two finishes. Scroll to orbit the watch as the titanium shifts from natural to black.',
}

export const SPECS = [
  { label: 'Case', value: '49 mm', detail: 'Titanium · 49 × 44 × 12 mm' },
  { label: 'Weight', value: '61.6 g', detail: 'Natural · 61.8 g black' },
  { label: 'Display', value: '3,000 nits', detail: 'LTPO3 OLED · down to 1 nit' },
  { label: 'Battery', value: '42 h', detail: 'Up to 72 h in Low Power Mode' },
  { label: 'Water', value: '100 m', detail: 'ISO 22810:2010 · EN13319 to 40 m' },
  { label: 'Altitude', value: '9,000 m', detail: 'Operating range –500 m to 9,000 m' },
  { label: 'GPS', value: 'L1 + L5', detail: 'Precision dual-frequency' },
  { label: 'Satellite', value: 'SOS', detail: 'Emergency SOS + Find My via satellite' },
]

export const CLOSING = {
  heading: ['The long', 'way round.'],
  body: 'Drag to turn it over. Switch the finish. Then scroll on.',
}

export const LEGAL =
  'Unofficial portfolio study. Not affiliated with, endorsed by or sponsored by Apple Inc. Apple Watch and Apple Watch Ultra are trademarks of Apple Inc. Specifications as published by Apple for Apple Watch Ultra 3; features and availability vary by region.'

export const STACK = ['React 19', 'Vite', 'Three.js', 'React Three Fiber', 'Drei', 'GSAP + ScrollTrigger', 'SplitText', 'Lenis']
