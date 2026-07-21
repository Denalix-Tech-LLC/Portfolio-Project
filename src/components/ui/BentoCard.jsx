import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * BentoCard — the core tile of the bento grid. On fine pointers it does a
 * subtle 3D tilt toward the cursor with a soft accent glare. Tilt is disabled
 * for touch devices and prefers-reduced-motion. `className` sizes the grid item
 * (col/row spans); the inner element carries the `.bento` surface.
 */
export default function BentoCard({
  as: Tag = 'div',
  className = '',
  bodyClassName = '',
  tilt = true,
  children,
  ...rest
}) {
  const innerRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [fine, setFine] = useState(false)

  useEffect(() => {
    setFine(window.matchMedia('(pointer: fine)').matches)
  }, [])

  const active = tilt && !reduced && fine

  const onMove = (e) => {
    const el = innerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const max = 5 // degrees — subtle on purpose
    // translateZ lifts the card toward the viewer (real 3D pop — the grid
    // wrapper supplies perspective), on top of the cursor tilt.
    el.style.transform = `rotateX(${-(py - 0.5) * 2 * max}deg) rotateY(${(px - 0.5) * 2 * max}deg) translateZ(14px)`
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = innerRef.current
    if (el) el.style.transform = ''
  }

  return (
    <Tag className={className} style={active ? { perspective: '1000px' } : undefined}>
      <div
        ref={innerRef}
        className={`bento group/bento h-full transition-transform duration-200 ease-smooth ${bodyClassName}`}
        style={active ? { transformStyle: 'preserve-3d' } : undefined}
        onPointerMove={active ? onMove : undefined}
        onPointerLeave={active ? onLeave : undefined}
        {...rest}
      >
        {active && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background:
                'radial-gradient(18rem 18rem at var(--gx, 50%) var(--gy, 50%), rgb(var(--c-accent-500) / 0.12), transparent 60%)',
            }}
          />
        )}
        {active && (
          /* Spotlight border — a glowing 1px ring segment tracks the cursor
             (masked so only the rim shows, ReactBits "Spotlight Card"). */
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              padding: '1px',
              background:
                'radial-gradient(14rem circle at var(--gx, 50%) var(--gy, 50%), rgb(var(--c-accent-400) / 0.6), transparent 70%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
        {children}
      </div>
    </Tag>
  )
}
