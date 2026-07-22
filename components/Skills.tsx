'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { SkillsContent, SkillItem } from '@/types/content'
import { useReducedMotionSafe } from '@/lib/useReducedMotionSafe'
import Section from './Section'
import Reveal from './Reveal'

function SkillBar({ skill }: { skill: SkillItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const reduced = useReducedMotionSafe()
  const width = `${Math.max(0, Math.min(100, skill.level))}%`

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink">{skill.name}</span>
        <span className="font-mono text-xs text-ink-soft">{skill.level}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={skill.name}
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-surface2"
      >
        {reduced ? (
          <div className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400" style={{ width }} />
        ) : (
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400"
            initial={{ width: 0 }}
            animate={inView ? { width } : { width: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </div>
    </div>
  )
}

export default function Skills({ content }: { content: SkillsContent }) {
  return (
    <Section id="skills" eyebrow={content.eyebrow} heading={content.heading}>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {content.groups.map((group, i) => (
          <Reveal key={group.id} delay={(i % 2) * 80}>
            <div className="panel h-full p-6">
              <h3 className="font-mono text-sm text-ink">{group.title}</h3>
              <div className="mt-5 space-y-4">
                {group.items.map((skill) => (
                  <SkillBar key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
