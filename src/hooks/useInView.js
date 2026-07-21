import { useEffect, useRef, useState } from 'react'

/**
 * useInView — tiny IntersectionObserver hook powering the scroll-reveal
 * animations, so we don't ship a whole animation library for a fade-in.
 *
 * Returns [ref, isInView]. Robustness notes:
 *  • If an element is already in the viewport at mount, we reveal it right away
 *    via a rect check — we don't wait for the observer's initial callback, which
 *    some engines defer (that delay can otherwise flash hidden content).
 *  • A one-shot scroll fallback guarantees content is never left permanently
 *    hidden if the observer misbehaves.
 *  • Missing IntersectionObserver or reduced-motion → visible immediately.
 */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reveal = () => setInView(true)

    // Graceful fallback: show immediately if the API is missing.
    if (typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }

    const isInViewport = () => {
      const r = node.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      return r.top < vh * 0.9 && r.bottom > 0
    }

    // Reveal on mount if already visible — no dependence on the initial IO callback.
    if (isInViewport()) {
      reveal()
      if (once) return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(node)

    // Safety net: reveal on first scroll into view even if the observer is quiet.
    const onScroll = () => {
      if (isInViewport()) {
        reveal()
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
