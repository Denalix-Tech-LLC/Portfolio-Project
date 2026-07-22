'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'

/**
 * NeuralCanvas — the lightweight animated neural network from the previous
 * site: drifting nodes with a depth field (z drives size, speed, brightness
 * and a slight cursor parallax), edges between nearby nodes and to the cursor.
 *
 * Performance & accessibility guards:
 *  • node count scales with area but is hard-capped;
 *  • DPR capped at 2; ResizeObserver keeps it crisp;
 *  • the rAF loop pauses when the tab is hidden;
 *  • prefers-reduced-motion → a single static frame, no animation loop;
 *  • aria-hidden + pointer-events:none — purely decorative.
 */
export default function NeuralCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotionSafe()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement
    if (!ctx || !parent) return

    // Read the accent color from the theme token so the canvas stays on-brand.
    const accent = (
      getComputedStyle(document.documentElement).getPropertyValue('--c-accent-500') ||
      '14 165 233'
    ).trim()

    interface Node {
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
    }

    let width = 0
    let height = 0
    let dpr = 1
    let nodes: Node[] = []
    let raf: number | null = null
    const pointer = { x: -9999, y: -9999, active: false }
    const LINK_DIST = 130
    const PARALLAX = 0.05

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
        z: 0.25 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.002,
      }))
    }

    // Projected position: the cursor shifts near nodes more than far ones.
    const px = (n: Node) =>
      n.x + (pointer.active ? (pointer.x - width / 2) * (n.z - 0.6) * PARALLAX : 0)
    const py = (n: Node) =>
      n.y + (pointer.active ? (pointer.y - height / 2) * (n.z - 0.6) * PARALLAX : 0)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        const ax = px(a)
        const ay = py(a)
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const bx = px(b)
          const by = py(b)
          const dist = Math.hypot(ax - bx, ay - by)
          if (dist < LINK_DIST) {
            const depth = (a.z + b.z) / 2
            ctx.strokeStyle = `rgb(${accent} / ${0.22 * (1 - dist / LINK_DIST) * depth})`
            ctx.lineWidth = 0.5 + depth * 0.7
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.stroke()
          }
        }
        // Edge to the cursor (interactive highlight).
        if (pointer.active) {
          const dist = Math.hypot(ax - pointer.x, ay - pointer.y)
          if (dist < LINK_DIST * 1.6) {
            ctx.strokeStyle = `rgb(${accent} / ${0.5 * (1 - dist / (LINK_DIST * 1.6)) * a.z})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }

      // Nodes — nearer = bigger and brighter.
      for (const n of nodes) {
        ctx.fillStyle = `rgb(${accent} / ${0.3 + 0.6 * n.z})`
        ctx.beginPath()
        ctx.arc(px(n), py(n), 0.7 + 1.5 * n.z, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const n of nodes) {
        // Nearer nodes drift faster — cheap motion parallax.
        n.x += n.vx * (0.5 + n.z)
        n.y += n.vy * (0.5 + n.z)
        n.z += n.vz
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        if (n.z < 0.25 || n.z > 1) n.vz *= -1
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    const onMove = (e: PointerEvent) => {
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
