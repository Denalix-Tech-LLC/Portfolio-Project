import { experience } from '../../data/experience'
import Section, { Eyebrow } from '../ui/Section'
import Reveal from '../ui/Reveal'
import BentoCard from '../ui/BentoCard'
import Chip from '../ui/Chip'

export default function Experience() {
  return (
    <Section id="experience" labelledby="experience-heading">
      <Reveal>
        <Eyebrow>experience</Eyebrow>
        <h2 id="experience-heading" className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          Where I’ve shipped.
        </h2>
      </Reveal>

      <ol role="list" className="relative mt-12 space-y-5 pl-6 sm:pl-8">
        {/* Timeline — violet fading into the page instead of a flat border. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-accent-500/60 via-line to-transparent"
        />
        {experience.map((job, i) => (
          <li key={`${job.company}-${job.role}`} className="relative">
            {/* Timeline marker */}
            <span
              aria-hidden="true"
              className="absolute -left-[calc(1.5rem+5px)] top-6 h-2.5 w-2.5 rounded-full sm:-left-[calc(2rem+5px)]"
              style={{ background: 'rgb(var(--c-accent-500))' }}
            >
              {job.current && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              )}
            </span>

            <Reveal delay={(i % 2) * 60}>
              <BentoCard bodyClassName="flex flex-col gap-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{job.role}</h3>
                    <p className="text-accent-300">{job.company}</p>
                  </div>
                  <div className="font-mono text-xs text-ink-soft sm:text-right">
                    <p className="text-ink-muted">{job.period}</p>
                    <p>{job.location}</p>
                  </div>
                </div>

                <ul role="list" className="flex flex-wrap gap-2">
                  {job.stack.map((tech) => (
                    <li key={tech}>
                      <Chip>{tech}</Chip>
                    </li>
                  ))}
                </ul>

                <ul role="list" className="space-y-2.5">
                  {job.highlights.map((point, j) => (
                    <li key={j} className="flex gap-3 text-ink-muted">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </BentoCard>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
