import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * NeuralCanvas — a lightweight animated "neural network": drifting nodes with
 * edges that light up between nearby nodes, plus edges to the cursor. It nods to
 * the AI/ML theme without a heavy library.
 *
 * Performance & accessibility guards:
 *  • node count scales with area but is hard-capped;
 *  • DPR capped at 2; ResizeObserver keeps it crisp;
 *  • the rAF loop pauses when the tab is hidden;
 *  • prefers-reduced-motion → a single static frame, no animation loop;
 *  • aria-hidden + pointer-events:none — purely decorative.
 */
export default function NeuralCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement

    // Read the accent color from the theme token so the canvas stays on-brand.
    const accent = (
      getComputedStyle(document.documentElement).getPropertyValue('--c-accent-500') || '139 92 246'
    ).trim()

    let width = 0
    let height = 0
    let dpr = 1
    let nodes = []
    let raf = null
    const pointer = { x: -9999, y: -9999, active: false }
    const LINK_DIST = 130

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Scale node count to area, capped for performance.
      const target = Math.min(Math.floor((width * height) / 16000), 72)
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Edges between nearby nodes.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgb(${accent} / ${0.18 * (1 - dist / LINK_DIST)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        // Edge to the cursor (interactive highlight).
        if (pointer.active) {
          const dist = Math.hypot(a.x - pointer.x, a.y - pointer.y)
          if (dist < LINK_DIST * 1.6) {
            ctx.strokeStyle = `rgb(${accent} / ${0.5 * (1 - dist / (LINK_DIST * 1.6))})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      // Nodes.
      for (const n of nodes) {
        ctx.fillStyle = `rgb(${accent} / 0.85)`
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
      pointer.x = pointer.y = -9999
    }
    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf)
        raf = null
      } else if (!reduced && !raf) {
        raf = requestAnimationFrame(step)
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    if (reduced) {
      draw() // one static frame, no loop
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
