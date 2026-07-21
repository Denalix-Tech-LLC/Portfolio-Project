import { profile } from '../../data/profile'
import Container from '../ui/Container'
import Button from '../ui/Button'
import Reveal from '../ui/Reveal'
import Typewriter from '../ui/Typewriter'
import CountUp from '../ui/CountUp'
import NeuralCanvas from '../ui/NeuralCanvas'
import WireCube from '../ui/WireCube'
import SocialIcon from '../ui/SocialIcon'
import BentoCard from '../ui/BentoCard'

export default function Hero() {
  const { hero, roles, stats, availability, socials, shortName } = profile

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Animated neural-network background (decorative, reduced-motion aware). */}
      <NeuralCanvas />
      {/* Fade the canvas into the page at the bottom. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      {/* 3D wireframe cube with orbiting satellites — hero's right edge. */}
      <div
        className="pointer-events-none absolute right-[6%] top-[20%] hidden animate-float lg:block"
        aria-hidden="true"
      >
        <div className="relative flex h-60 w-60 items-center justify-center">
          <span className="orbit inset-0" style={{ animationDuration: '16s' }}>
            <span className="orbit-dot" />
          </span>
          <span className="orbit inset-7" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
            <span className="orbit-dot" />
          </span>
          <WireCube size={104} className="opacity-80" />
        </div>
      </div>

      {/* Aurora — slow drifting glow blobs behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[12%] top-[22%] h-80 w-80 animate-aurora rounded-full bg-accent-600/15 blur-3xl" />
        <div
          className="absolute bottom-[18%] right-[16%] h-72 w-72 animate-aurora rounded-full bg-accent-500/10 blur-3xl"
          style={{ animationDelay: '-9s' }}
        />
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
            <span className="text-gradient animate-shimmer">{shortName}</span>
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
              <BentoCard key={stat.label} bodyClassName="!p-4">
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
              </BentoCard>
            ))}
          </dl>
        </Reveal>

        {/* Scroll hint — a dot travels down a hairline toward the next section. */}
        <div className="mt-12 hidden justify-center sm:flex">
          <a
            href="#about"
            aria-label="Scroll to the about section"
            className="group flex flex-col items-center gap-2 text-ink-soft transition-colors hover:text-accent-300"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll</span>
            <span className="relative h-10 w-px overflow-hidden bg-line">
              <span className="absolute left-0 top-0 h-3 w-px animate-scroll-dot bg-accent-400" />
            </span>
          </a>
        </div>
      </Container>
    </section>
  )
}
