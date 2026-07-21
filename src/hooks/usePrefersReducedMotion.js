import { useEffect, useState } from 'react'

/**
 * usePrefersReducedMotion — reactive boolean for the OS "reduce motion" setting.
 * All decorative animations gate on this so we never move things for users who
 * asked us not to.
 */
export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
