import type { AboutContent } from '@/types/content'
import Section from './Section'
import Reveal from './Reveal'
import StatCounter from './StatCounter'
import SmartImage from './SmartImage'

export default function About({ content }: { content: AboutContent }) {
  return (
    <Section id="about" eyebrow={content.eyebrow} heading={content.heading}>
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Photo */}
        <Reveal className="lg:row-span-2">
          <div className="panel h-full overflow-hidden">
            {content.photo ? (
              <SmartImage
                src={content.photo}
                alt={content.photoAlt}
                className="aspect-[4/5] h-full w-full lg:aspect-auto"
              />
            ) : (
              // Stylized placeholder when no photo is set.
              <div
                aria-hidden="true"
                className="flex aspect-[4/5] h-full w-full items-center justify-center bg-gradient-to-br from-surface2 to-surface lg:aspect-auto"
              >
                <span className="font-display text-7xl font-bold text-accent-500/40">
                  {content.photoAlt.slice(0, 1) || '?'}
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {/* Bio */}
        <Reveal delay={80} className="lg:col-span-2">
          <div className="panel flex h-full flex-col justify-center gap-5 p-7">
            {content.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-muted">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Stats + chips */}
        <Reveal delay={140} className="lg:col-span-2">
          <div className="grid h-full grid-cols-2 gap-4 sm:grid-cols-4">
            {content.stats.map((stat) => (
              <div key={stat.id} className="panel flex flex-col justify-center p-4">
                <StatCounter stat={stat} />
                <span className="mt-1 block text-sm text-ink-muted">{stat.label}</span>
              </div>
            ))}
            <div className="panel col-span-2 flex flex-col gap-3 p-5 sm:col-span-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                {content.chipsLabel}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {content.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-md border border-line bg-surface2/70 px-2.5 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-accent-500/40 hover:text-accent-300"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
