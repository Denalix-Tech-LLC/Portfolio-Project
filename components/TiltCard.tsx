'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'

/**
 * TiltCard — subtle 3D cursor tilt with an accent glare. Fine pointers only;
 * inert under prefers-reduced-motion.
 */
export default function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotionSafe()
  const [fine, setFine] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
  }, [])

  const active = !reduced && fine

  const onMove = (e: React.PointerEvent) => {
    const el = innerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const max = 5
    el.style.transform = `rotateX(${(-(py - 0.5) * 2 * max).toFixed(2)}deg) rotateY(${((px - 0.5) * 2 * max).toFixed(2)}deg) translateZ(10px)`
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = innerRef.current
    if (el) el.style.transform = ''
  }

  return (
    <div style={active ? { perspective: '1000px' } : undefined} className="h-full">
      <div
        ref={innerRef}
        className={`group relative h-full transition-transform duration-200 ${className}`}
        style={active ? { transformStyle: 'preserve-3d' } : undefined}
        onPointerMove={active ? onMove : undefined}
        onPointerLeave={active ? onLeave : undefined}
      >
        {active && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(18rem 18rem at var(--gx, 50%) var(--gy, 50%), rgb(var(--c-accent-500) / 0.12), transparent 60%)',
            }}
          />
        )}
        {children}
      </div>
    </div>
  )
}
