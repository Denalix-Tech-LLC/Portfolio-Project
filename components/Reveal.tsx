'use client'

import { motion } from 'framer-motion'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'

/**
 * Reveal — scroll-triggered fade/slide-in via framer-motion.
 * Under prefers-reduced-motion it renders a plain static div (CSS media
 * queries do NOT stop framer's JS-driven animations, so we gate in JS with
 * the hydration-safe hook).
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotionSafe()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.65, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
