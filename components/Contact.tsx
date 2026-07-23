'use client'

import { useState } from 'react'
import type { ContactContent } from '@/types/content'
import Section from './Section'
import Reveal from './Reveal'
import { CopyIcon, CheckIcon, ExternalIcon, LinkedInIcon, MailIcon, PhoneIcon } from './icons'

/** Contact — info cards with one-click copy. No contact form by design. */
export default function Contact({ content }: { content: ContactContent }) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const copy = async (id: string, label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedId(id)
      setAnnouncement(`${label} ${content.copyAnnouncement}`)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      /* clipboard blocked — the link/value is still visible */
    }
  }

  return (
    <Section id="contact" eyebrow={content.eyebrow} heading={content.heading}>
      <Reveal delay={60}>
        <p className="mt-5 max-w-2xl text-lg text-ink-muted">{content.blurb}</p>
      </Reveal>

      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.cards.map((card, i) => {
          const copied = copiedId === card.id
          const isLinkedIn = card.href.includes('linkedin.com')
          const LeadIcon = isLinkedIn
            ? LinkedInIcon
            : card.href.startsWith('mailto:')
              ? MailIcon
              : card.href.startsWith('tel:')
                ? PhoneIcon
                : null
          const shown = card.display || card.value
          const actionPill =
            'mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-xs text-ink-muted transition-colors hover:border-accent-500/50 hover:text-accent-300 focus-visible:outline-none focus-visible:shadow-focus'

          return (
            <li key={card.id} className="h-full">
              <Reveal delay={(i % 3) * 80} className="h-full">
                {/* Every card has the same anatomy — label, icon + value,
                    action pill — so the row stays perfectly even. */}
                <div className="panel flex h-full flex-col gap-3 p-5 transition-colors hover:border-accent-500/40">
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                    {card.label}
                  </h3>
                  <div className="mb-2 flex items-center gap-2.5">
                    {LeadIcon && <LeadIcon className="h-5 w-5 flex-none text-accent-400" />}
                    {card.href ? (
                      <a
                        href={card.href}
                        target={card.href.startsWith('http') ? '_blank' : undefined}
                        rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="break-all text-lg font-semibold text-ink transition-colors hover:text-accent-300"
                      >
                        {shown}
                      </a>
                    ) : (
                      <p className="break-all text-lg font-semibold text-ink">{shown}</p>
                    )}
                  </div>
                  {isLinkedIn ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={actionPill}
                    >
                      <ExternalIcon className="h-3.5 w-3.5" />
                      {content.openLabel}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => copy(card.id, card.label, card.value)}
                      className={actionPill}
                    >
                      {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
                      {copied ? content.copiedLabel : content.copyLabel}
                    </button>
                  )}
                </div>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
