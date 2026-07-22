'use client'

import { useEffect, useRef } from 'react'
import type { ProjectItem, ProjectsContent } from '@/types/content'
import PlaceholderArt from './PlaceholderArt'
import SmartImage from './SmartImage'
import { CloseIcon } from './icons'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * ProjectModal — accessible dialog:
 * - focus moves to the close button on open, returns to the invoker on close
 * - Tab/Shift+Tab wrap inside the dialog; Esc and backdrop click close it
 * - body scroll locked while open
 * - scrollable region is keyboard-focusable (Safari needs tabIndex=0)
 */
export default function ProjectModal({
  project,
  content,
  onClose,
  returnFocusTo,
}: {
  project: ProjectItem
  content: ProjectsContent
  onClose: () => void
  returnFocusTo: HTMLElement | null
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = returnFocusTo
    closeRef.current?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previous?.focus()
    }
  }, [onClose, returnFocusTo])

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="presentation"
    >
      {/* Backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg/80 backdrop-blur-sm" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${project.id}`}
        className="panel relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h3 id={`modal-title-${project.id}`} className="text-2xl font-semibold text-ink">
              {project.title}
            </h3>
            <p className="mt-1 text-ink-muted">{project.tagline}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={content.modalCloseLabel}
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-accent-500/50 hover:text-accent-300"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable content — tabIndex so Safari keyboards can scroll it. */}
        <div tabIndex={0} className="overflow-y-auto p-5">
          <div className="overflow-hidden rounded-xl border border-line">
            {project.image ? (
              <SmartImage src={project.image} alt={project.imageAlt} className="aspect-[2/1] w-full" />
            ) : (
              <div className="aspect-[2/1] w-full">
                <PlaceholderArt motif={project.motif} />
              </div>
            )}
          </div>

          <h4 className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-accent-400">
            {content.modalDetailsHeading}
          </h4>
          <ul className="mt-3 space-y-2.5">
            {project.details.map((point, i) => (
              <li key={i} className="flex gap-3 text-ink-muted">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <h4 className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-accent-400">
            {content.modalStackHeading}
          </h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-line bg-surface2/70 px-2.5 py-1 font-mono text-xs text-ink-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
