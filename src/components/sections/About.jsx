import { profile } from '../../data/profile'
import { experience } from '../../data/experience'
import Section, { Eyebrow } from '../ui/Section'
import Reveal from '../ui/Reveal'
import BentoCard from '../ui/BentoCard'
import Chip from '../ui/Chip'

export default function About() {
  const { summary, location } = profile
  const current = experience.find((e) => e.current) || experience[0]

  return (
    <Section id="about" labelledby="about-heading">
      <Reveal>
        <Eyebrow>about</Eyebrow>
        <h2 id="about-heading" className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          Product Engineer who ships — from user to production.
        </h2>
      </Reveal>

      <Reveal delay={80} className="mt-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Portrait */}
          <BentoCard className="lg:row-span-2" tilt={false} bodyClassName="!p-0 overflow-hidden">
            <img
              src="/prasanna.png"
              alt="Prasanna Kumar Reddy Peram"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] h-full w-full object-cover object-top lg:aspect-auto"
            />
          </BentoCard>

          {/* Bio */}
          <BentoCard className="lg:col-span-2" bodyClassName="flex flex-col justify-center gap-4">
            <p className="text-lg text-ink-muted">{summary}</p>
          </BentoCard>

          {/* Currently */}
          <BentoCard bodyClassName="relative flex flex-col gap-3 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl"
            />
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-soft">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              currently
            </span>
            <div>
              <p className="text-lg font-semibold leading-snug text-ink">{current.role}</p>
              <p className="text-accent-300">{current.company}</p>
            </div>
            <ul role="list" className="flex flex-wrap gap-2">
              {current.stack.slice(0, 4).map((tech) => (
                <li key={tech}>
                  <Chip>{tech}</Chip>
                </li>
              ))}
            </ul>
            <p className="mt-auto flex items-center gap-2 border-t border-line pt-3 font-mono text-xs text-ink-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-accent-400">
                <rect x="3" y="4.5" width="18" height="17" rx="2" />
                <path d="M3 9.5h18M8 2.5v4M16 2.5v4" strokeLinecap="round" />
              </svg>
              {current.period}
            </p>
          </BentoCard>

          {/* Location */}
          <BentoCard bodyClassName="relative flex flex-col gap-3 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-accent-500/10 blur-3xl"
            />
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="text-accent-400">
                <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              based in
            </span>
            <div>
              <p className="text-lg font-semibold text-ink">{location}</p>
              <p className="mt-1 font-mono text-xs text-ink-soft">EST · UTC−5</p>
            </div>
            <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 font-mono text-xs text-accent-300">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              Open to remote &amp; on-site (US)
            </span>
          </BentoCard>

          {/* Terminal */}
          <BentoCard className="lg:col-span-3" tilt={false} bodyClassName="!p-0 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line bg-surface2/60 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-xs text-ink-soft">prasanna@portfolio ~ %</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-ink-muted">
              <code>
                <span className="text-accent-400">$</span> whoami{'\n'}
                Product Engineer · Python · GenAI · REST · 3.5+ yrs{'\n'}
                <span className="text-accent-400">$</span> cat focus.txt{'\n'}
                product ownership · REST APIs · Generative AI · CI/CD · shipping to prod{'\n'}
                <span className="text-accent-400">$</span> uptime{'\n'}
                shipping since 2021 — user → roadmap → production, end to end
                <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent-400" />
              </code>
            </pre>
          </BentoCard>
        </div>
      </Reveal>
    </Section>
  )
}
