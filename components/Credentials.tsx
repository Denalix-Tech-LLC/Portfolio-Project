import type { CredentialsContent } from '@/types/content'
import Section from './Section'
import Reveal from './Reveal'

export default function Credentials({ content }: { content: CredentialsContent }) {
  return (
    <Section id="credentials" eyebrow={content.eyebrow} heading={content.heading}>
      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Education */}
        <Reveal className="lg:col-span-3">
          <div className="panel h-full p-6">
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
