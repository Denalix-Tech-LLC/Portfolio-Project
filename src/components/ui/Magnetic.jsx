import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Magnetic — children gently follow the cursor while hovered and spring
 * back on leave (the classic 21st.dev / ReactBits "Magnet" effect).
 * Fine pointers only; inert under prefers-reduced-motion.
 */
export default function Magnetic({ children, strength = 0.2, className = '' }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [fine, setFine] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
  }, [])

  const active = !reduced && fine

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) * strength
    const dy = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
  }
  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }

  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-200 ease-smooth will-change-transform ${className}`}
      onPointerMove={active ? onMove : undefined}
      onPointerLeave={active ? onLeave : undefined}
    >
      {children}
    </div>
  )
}
