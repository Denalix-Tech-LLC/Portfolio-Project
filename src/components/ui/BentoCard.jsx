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
    el.style.transform = `rotateX(${-(py - 0.5) * 2 * max}deg) rotateY(${(px - 0.5) * 2 * max}deg)`
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
        {children}
      </div>
    </Tag>
  )
}
