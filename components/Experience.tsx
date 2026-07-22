import type { ExperienceContent } from '@/types/content'
import Section from './Section'
import Reveal from './Reveal'

export default function Experience({ content }: { content: ExperienceContent }) {
  return (
    <Section id="experience" eyebrow={content.eyebrow} heading={content.heading}>
      <ol className="relative mt-14 space-y-6 pl-6 sm:pl-8">
        {/* Timeline rail */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-accent-500/60 via-line to-transparent"
        />
        {content.items.map((job, i) => (
          <li key={job.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[calc(1.5rem+5px)] top-7 h-2.5 w-2.5 rounded-full bg-accent-500 sm:-left-[calc(2rem+5px)]"
            >
              {job.current && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75 motion-reduce:animate-none" />
              )}
            </span>

            <Reveal delay={(i % 2) * 70}>
              <article className="panel flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-ink">
                      {job.role}
                      {job.current && (
                        <span className="rounded-full border border-accent-500/40 bg-accent-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-300">
                          {content.currentBadge}
                        </span>
                      )}
                    </h3>
                    <p className="text-accent-300">{job.company}</p>
                  </div>
                  <div className="font-mono text-xs text-ink-soft sm:text-right">
                    <p className="text-ink-muted">{job.period}</p>
                    <p>{job.location}</p>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {job.points.map((point, j) => (
                    <li key={j} className="flex gap-3 text-ink-muted">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-500"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <p className="font-mono text-xs leading-loose text-ink-soft">
                  <span className="uppercase tracking-[0.2em] text-accent-400">
                    {content.stackLabel}
                  </span>
                  <span aria-hidden="true" className="mx-2">
                    —
                  </span>
                  {job.stack.join(' · ')}
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
