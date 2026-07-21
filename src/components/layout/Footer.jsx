import { profile } from '../../data/profile'
import Container from '../ui/Container'
import SocialIcon from '../ui/SocialIcon'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <Container className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-ink">
              {profile.shortName}
              <span className="text-accent-500">.</span>
            </p>
            <p className="mt-2 text-sm text-ink-muted">{profile.roles[0]} · {profile.location}</p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-sm text-ink transition-colors hover:text-accent-300"
            >
              {profile.email}
            </a>
            <ul role="list" className="flex items-center gap-3">
              {profile.socials.map((s) => (
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

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 font-mono text-xs text-ink-soft sm:flex-row sm:items-center">
          <p>© {year} {profile.name}</p>
          <a href="#top" className="transition-colors hover:text-accent-300">
            back to top ↑
          </a>
        </div>
      </Container>
    </footer>
  )
}
