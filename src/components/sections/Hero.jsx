import { profile } from '../../data/profile'
import Container from '../ui/Container'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import Typewriter from '../ui/Typewriter'
import CountUp from '../ui/CountUp'
import NeuralCanvas from '../ui/NeuralCanvas'
import WireCube from '../ui/WireCube'
import SocialIcon from '../ui/SocialIcon'

export default function Hero() {
  const { hero, roles, stats, availability, socials, shortName } = profile

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Animated neural-network background (decorative, reduced-motion aware). */}
      <NeuralCanvas />
      {/* Fade the canvas into the page at the bottom. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      {/* 3D wireframe cube — floats gently at the hero's right edge. */}
      <div className="pointer-events-none absolute right-[9%] top-[24%] hidden animate-float lg:block" aria-hidden="true">
        <WireCube size={116} className="opacity-80" />
      </div>

      <Container className="relative z-10 flex min-h-[88vh] flex-col justify-center py-20">
        <Reveal className="max-w-4xl">
          {/* Availability status */}
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-ink-muted backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
            </span>
            {availability}
          </p>

          <h1 className="text-6xl font-semibold sm:text-7xl">
            <span className="text-gradient">{shortName}</span>
          </h1>

          {/* Role rotator */}
          <p className="mt-4 font-mono text-xl text-ink-muted sm:text-2xl">
            <span aria-hidden="true" className="text-accent-500">{'> '}</span>
            <Typewriter words={roles} className="text-accent-300" />
          </p>

          <p className="mt-7 max-w-2xl text-lg text-ink-muted sm:text-xl">{hero.subhead}</p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <Button href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </Button>
            </div>
            <ul role="list" className="flex items-center gap-2 sm:ml-2">
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
        </Reveal>

        {/* Count-up stats */}
        <Reveal delay={120} className="mt-16">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-line bg-surface/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-accent-500/40"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                    className="font-display text-3xl font-semibold text-ink sm:text-4xl"
                  />
                  <span className="mt-1 block text-sm text-ink-muted">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  )
}
