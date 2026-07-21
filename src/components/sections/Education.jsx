import { education, certifications } from '../../data/education'
import Section, { Eyebrow } from '../ui/Section'
import Reveal from '../ui/Reveal'
import BentoCard from '../ui/BentoCard'

export default function Education() {
  return (
    <Section id="education" labelledby="education-heading">
      <Reveal>
        <Eyebrow>education &amp; certifications</Eyebrow>
        <h2 id="education-heading" className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          Foundations & credentials.
        </h2>
      </Reveal>

      <Reveal delay={80} className="mt-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Education */}
          <BentoCard className="lg:col-span-3" bodyClassName="flex flex-col gap-6">
            <h3 className="font-mono text-sm text-ink-soft">education</h3>
            <ul role="list" className="space-y-6">
              {education.map((ed) => (
                <li key={ed.school} className="border-l-2 border-accent-500/40 pl-4">
                  <p className="text-lg font-semibold text-ink">{ed.degree}</p>
                  <p className="text-ink-muted">{ed.school}</p>
                  <p className="mt-1 font-mono text-xs text-ink-soft">
                    {ed.period} · {ed.location}
                  </p>
                </li>
              ))}
            </ul>
          </BentoCard>

          {/* Certifications */}
          <BentoCard className="lg:col-span-2" bodyClassName="flex flex-col gap-4">
            <h3 className="flex items-center justify-between font-mono text-sm text-ink-soft">
              certifications
              <span className="rounded-md bg-accent-500/15 px-2 py-0.5 text-accent-300">
                {certifications.length}
              </span>
            </h3>
            <ul role="list" className="space-y-1">
              {certifications.map((cert) => (
                <li key={cert.name}>
                  {cert.href ? (
                    <a
                      href={cert.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 rounded-md px-2 py-1.5 text-ink-muted transition-colors hover:bg-surface2 hover:text-accent-300"
                    >
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                      {cert.name}
                    </a>
                  ) : (
                    <span className="flex items-start gap-2 px-2 py-1.5 text-ink-muted">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                      {cert.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </BentoCard>
        </div>
      </Reveal>
    </Section>
  )
}
