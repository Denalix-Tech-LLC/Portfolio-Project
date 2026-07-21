import { useState } from 'react'
import { profile } from '../../data/profile'
import Section, { Eyebrow } from '../ui/Section'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import SocialIcon from '../ui/SocialIcon'
import WireCube from '../ui/WireCube'

export default function Contact() {
  const { contact, email, phone, socials } = profile
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  }

  return (
    <Section id="contact" labelledby="contact-heading">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/70 p-8 shadow-card backdrop-blur-sm sm:p-12 lg:p-16">
          {/* Accent glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
          />
          {/* Counter-spinning 3D cube over the glow. */}
          <div className="pointer-events-none absolute right-10 top-10 hidden animate-float md:block" aria-hidden="true">
            <WireCube size={72} reverse duration="34s" className="opacity-60" />
          </div>

          <div className="relative">
            <Eyebrow>contact</Eyebrow>
            <h2 id="contact-heading" className="h2-rule max-w-2xl text-4xl font-semibold sm:text-5xl">
              {contact.heading}
            </h2>
            <p className="mt-5 max-w-prose text-lg text-ink-muted">{contact.blurb}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={`mailto:${email}`}>{email}</Button>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface/60 px-6 py-3 font-semibold text-ink transition-colors hover:border-accent-500/50 focus-visible:outline-none focus-visible:shadow-focus"
              >
                {copied ? 'Copied ✓' : 'Copy email'}
              </button>
              <span aria-live="polite" className="sr-only">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </div>

            <p className="mt-6 font-mono text-sm text-ink-muted">
              <span className="text-accent-400">tel</span> ·{' '}
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-accent-300">
                {phone}
              </a>
            </p>

            <ul role="list" className="mt-8 flex flex-wrap items-center gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={s.label + (s.href.startsWith('http') ? ' (opens in a new tab)' : '')}
                    className="inline-flex items-center justify-center rounded-full border border-line bg-surface/60 px-6 py-3 text-ink transition-all duration-200 ease-smooth hover:border-accent-500/50 hover:text-accent-300 hover:-translate-y-0.5"
                  >
                    <SocialIcon label={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
