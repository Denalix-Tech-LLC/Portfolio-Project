import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * CountUp — animates a number from 0 to `value` when it scrolls into view
 * (once). Reduced-motion users see the final value immediately.
 */
export default function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1400,
  className = '',
}) {
  const [ref, inView] = useInView({ once: true })
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(value)
      return
    }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(value * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {Number(display).toFixed(decimals)}
      {suffix}
    </span>
  )
}
