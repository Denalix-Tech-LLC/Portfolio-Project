'use client'

import { useEffect, useState } from 'react'
import type { NavContent } from '@/types/content'
import { MenuIcon, CloseIcon } from './icons'

export default function Navbar({ content }: { content: NavContent }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors ${
        scrolled ? 'border-b border-line bg-bg/80' : 'border-b border-transparent bg-bg/40'
      }`}
    >
      <div className="mx-auto w-full max-w-content px-6 sm:px-8 lg:px-12">
        <nav aria-label="Primary" className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            onClick={close}
            className="font-display text-lg font-semibold tracking-tight text-ink"
          >
            {content.logoText}
            <span className="text-accent-500">.</span>
          </a>

          {/* Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-7">
              {content.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="font-mono text-sm text-ink-muted transition-colors hover:text-accent-300 focus-visible:text-accent-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={content.ctaHref}
              className="rounded-full bg-accent-600 px-5 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-accent-700"
            >
              {content.ctaLabel}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? content.menuCloseLabel : content.menuOpenLabel}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto w-full max-w-content px-6 sm:px-8">
            <ul className="flex flex-col gap-1 py-4">
              {content.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={close}
                    className="block rounded-md px-2 py-3 font-mono text-base text-ink hover:bg-surface2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={content.ctaHref}
                  onClick={close}
                  className="block rounded-full bg-accent-600 px-5 py-3 text-center font-semibold text-white"
                >
                  {content.ctaLabel}
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
