'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import type { HeroContent } from '@/types/content'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'
import HeroFallback from './HeroFallback'
import { ArrowRightIcon, DownloadIcon, ChevronDownIcon } from './icons'

// The 3D scene is client-only and lazy: mobile and slow connections get the
// animated SVG fallback instead (also shown while the chunk loads).
const NeuralScene = dynamic(() => import('@/scene/NeuralScene'), {
  ssr: false,
  loading: () => <HeroFallback />,
})

export default function Hero({ content }: { content: HeroContent }) {
  const reduced = useReducedMotionSafe()
  const [show3D, setShow3D] = useState(false)

  useEffect(() => {
    // Render WebGL only on larger screens with a fine pointer.
    const mql = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const update = () => setShow3D(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  const entrance = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background: 3D neural net on desktop, animated SVG otherwise. */}
      <div className="absolute inset-0" aria-hidden="true">
        {show3D ? <NeuralScene /> : <HeroFallback />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-content flex-1 flex-col justify-center px-6 py-24 sm:px-8 lg:px-12">
        <motion.p
          {...entrance(0)}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-ink-muted backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
          {content.availability}
        </motion.p>

        <motion.p {...entrance(0.08)} className="font-mono text-lg text-accent-300">
          {content.greeting}
        </motion.p>

        <motion.h1
          {...entrance(0.16)}
          className="mt-2 text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="text-gradient">{content.name}</span>
        </motion.h1>

        <motion.p {...entrance(0.24)} className="mt-4 font-mono text-xl text-ink-muted sm:text-2xl">
          <span aria-hidden="true" className="text-accent-500">
            {'> '}
          </span>
          {content.title}
        </motion.p>

        <motion.p {...entrance(0.32)} className="mt-7 max-w-2xl text-lg text-ink-muted sm:text-xl">
          {content.subtitle}
        </motion.p>

        <motion.div {...entrance(0.4)} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={content.ctaPrimaryHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent-600 px-7 py-3.5 font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-accent-700"
          >
            {content.ctaPrimaryLabel}
            <ArrowRightIcon />
          </a>
          <a
            href={content.ctaSecondaryHref}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-7 py-3.5 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-accent-500/50 hover:text-accent-300"
          >
            {content.ctaSecondaryLabel}
          </a>
          <a
            href={content.resumeFile}
            download
            className="inline-flex items-center gap-2 px-2 py-3 font-mono text-sm text-ink-muted underline-offset-4 transition-colors hover:text-accent-300 hover:underline"
          >
            <DownloadIcon />
            {content.resumeLabel}
          </a>
        </motion.div>
      </div>

      <div className="relative z-10 flex justify-center pb-8">
        <a
          href="#about"
          className="flex flex-col items-center gap-1 font-mono text-xs uppercase tracking-[0.25em] text-ink-soft transition-colors hover:text-accent-300"
        >
          {content.scrollHintLabel}
          <ChevronDownIcon className="h-4 w-4 animate-bounce motion-reduce:animate-none" />
        </a>
      </div>
    </section>
  )
}
