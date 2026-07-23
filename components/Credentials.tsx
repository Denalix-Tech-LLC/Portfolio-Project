import type { CredentialsContent } from '@/types/content'
import Section from './Section'
import Reveal from './Reveal'
import { ExternalIcon } from './icons'

export default function Credentials({ content }: { content: CredentialsContent }) {
  return (
    <Section id="credentials" eyebrow={content.eyebrow} heading={content.heading}>
      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Education */}
        <Reveal className="lg:col-span-3">
          <div className="panel flex h-full flex-col p-6">
            <h3 className="font-mono text-sm text-ink-soft">{content.educationHeading}</h3>
            <ul className="mt-6 space-y-6">
              {content.education.map((ed) => (
                <li key={ed.id} className="border-l-2 border-accent-500/40 pl-4">
                  <p className="text-lg font-semibold text-ink">{ed.degree}</p>
                  <p className="text-ink-muted">{ed.school}</p>
                  <p className="mt-1 font-mono text-xs text-ink-soft">
                    {ed.period} · {ed.location}
                  </p>
                </li>
              ))}
            </ul>

            {/* Focus areas — fills the column and adds scannable keywords. */}
            <div className="mt-8 border-t border-line pt-6">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                {content.focusHeading}
              </h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {content.focusAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-md border border-line bg-surface2/70 px-2.5 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-accent-500/40 hover:text-accent-300"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* Writing/blog card. */}
            <div className="mt-auto pt-6">
              <div className="rounded-xl border border-line bg-surface2/40 p-4 transition-colors hover:border-accent-500/40">
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-400">
                  {content.blogHeading}
                </h4>
                <p className="mt-2 text-sm text-ink-muted">{content.blogText}</p>
                <a
                  href={content.blogHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 font-mono text-sm text-accent-300 transition-colors hover:text-accent-200"
                >
                  {content.blogLinkLabel}
                  <ExternalIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Certifications */}
        <Reveal delay={80} className="lg:col-span-2">
          <div className="panel h-full p-6">
            <h3 className="flex items-center justify-between font-mono text-sm text-ink-soft">
              {content.certificationsHeading}
              <span className="rounded-md bg-accent-500/15 px-2 py-0.5 text-accent-300">
                {content.certifications.length}
              </span>
            </h3>
            <ul className="mt-4 space-y-1">
              {content.certifications.map((cert) => (
                <li key={cert.id} className="flex items-start gap-2 px-1 py-1.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-500"
                  />
                  <span className="text-ink-muted">
                    {cert.name}
                    <span className="text-ink-soft"> — {cert.issuer}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
