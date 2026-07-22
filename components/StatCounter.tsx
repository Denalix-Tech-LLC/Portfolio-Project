'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import type { Stat } from '@/types/content'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'

/** StatCounter — counts up when scrolled into view; final value under reduced motion. */
export default function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const reduced = useReducedMotionSafe()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(stat.value)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 1400
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(stat.value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(stat.value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, stat.value])

  return (
    <span ref={ref} className="font-display text-3xl font-semibold text-ink sm:text-4xl">
      {display.toFixed(stat.decimals)}
      {stat.suffix}
    </span>
  )
}
