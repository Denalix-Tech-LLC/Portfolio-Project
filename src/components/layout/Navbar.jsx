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
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)
  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scrollspy — highlight the section currently in the middle of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = (id) =>
    `font-mono text-sm transition-colors hover:text-accent-300 focus-visible:text-accent-300 ${
      active === id ? 'text-accent-300' : 'text-ink-muted'
    }`

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
                  <a
                    href={`#${item.id}`}
                    className={linkClass(item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                  >
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

      {/* Reading progress — thin accent bar along the header's bottom edge. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-accent-600 via-accent-500 to-accent-300"
        style={{ transform: `scaleX(${progress})` }}
      />

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <Container>
            <ul role="list" className="flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={close}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`block rounded-md px-2 py-3 font-mono text-base hover:bg-surface2 ${
                      active === item.id ? 'text-accent-300' : 'text-ink'
                    }`}
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
