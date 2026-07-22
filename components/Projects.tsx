'use client'

import { useRef, useState } from 'react'
import type { ProjectsContent, ProjectItem } from '@/types/content'
import Section from './Section'
import Reveal from './Reveal'
import TiltCard from './TiltCard'
import ProjectModal from './ProjectModal'
import PlaceholderArt from './PlaceholderArt'
import SmartImage from './SmartImage'
import { ArrowRightIcon } from './icons'

export default function Projects({ content }: { content: ProjectsContent }) {
  const [openProject, setOpenProject] = useState<ProjectItem | null>(null)
  const invokerRef = useRef<HTMLElement | null>(null)

  const open = (project: ProjectItem, invoker: HTMLElement) => {
    invokerRef.current = invoker
    setOpenProject(project)
  }

  return (
    <Section id="projects" eyebrow={content.eyebrow} heading={content.heading}>
      <Reveal delay={60}>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">{content.blurb}</p>
      </Reveal>

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((project, i) => (
          <li key={project.id} className="h-full">
            <Reveal delay={(i % 3) * 80} className="h-full">
              <TiltCard>
                <button
                  type="button"
                  onClick={(e) => open(project, e.currentTarget)}
                  className="panel flex h-full w-full flex-col overflow-hidden text-left transition-colors hover:border-accent-500/40 focus-visible:outline-none focus-visible:shadow-focus"
                >
                  <div className="aspect-[2/1] w-full border-b border-line">
                    {project.image ? (
                      <SmartImage src={project.image} alt={project.imageAlt} className="h-full w-full" />
                    ) : (
                      <PlaceholderArt motif={project.motif} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-muted">{project.tagline}</p>
                    <ul aria-hidden="true" className="mt-auto flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-md border border-line bg-surface2/70 px-2 py-0.5 font-mono text-[11px] text-ink-soft"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-accent-300">
                      {content.openLabel}
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>

      {openProject && (
        <ProjectModal
          project={openProject}
          content={content}
          returnFocusTo={invokerRef.current}
          onClose={() => setOpenProject(null)}
        />
      )}
    </Section>
  )
}
