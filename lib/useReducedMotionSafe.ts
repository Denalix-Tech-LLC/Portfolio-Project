'use client'

import { useEffect, useState } from 'react'

/**
 * Hydration-safe prefers-reduced-motion.
 *
 * framer-motion's useReducedMotion() is null on the server and true on the
 * first client render, so branching markup on it breaks React hydration.
 * This hook returns `false` on the server AND on the first client render,
 * then tracks the media query — safe to branch markup on everywhere.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}
