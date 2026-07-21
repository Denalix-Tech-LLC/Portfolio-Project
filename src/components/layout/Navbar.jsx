import { useEffect, useState } from 'react'
import { profile } from '../../data/profile'
import Container from '../ui/Container'
import Button from '../ui/Button'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
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
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass =
    'font-mono text-sm text-ink-muted transition-colors hover:text-accent-300 focus-visible:text-accent-300'

  return (
    <header
      className={`sticky top-0 z-50 bg-bg/70 backdrop-blur-md transition-shadow ${
        scrolled ? 'border-b border-line shadow-card' : 'border-b border-transparent'
      }`}
    >
      <Container>
        <nav aria-label="Primary" className="flex h-16 items-center justify-between gap-4">
          <a href="#top" onClick={close} className="font-display text-lg font-semibold tracking-tight text-ink">
            {profile.shortName}
            <span className="text-accent-500">.</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <ul role="list" className="flex items-center gap-7">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button href={`mailto:${profile.email}`} size="sm">
              Get in touch
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </nav>
      </Container>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <Container>
            <ul role="list" className="flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={close}
                    className="block rounded-md px-2 py-3 font-mono text-base text-ink hover:bg-surface2"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Button href={`mailto:${profile.email}`} className="w-full" onClick={close}>
                  Get in touch
                </Button>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  )
}
