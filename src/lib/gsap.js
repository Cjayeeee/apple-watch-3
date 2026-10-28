import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Pinned sections + mobile browser chrome resizing = jumpy refreshes. Ignore those.
ScrollTrigger.config({ ignoreMobileResize: true })
gsap.defaults({ ease: 'power3.out' })

export { gsap, ScrollTrigger, SplitText }
