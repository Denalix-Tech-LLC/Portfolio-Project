import { profile } from '../../data/profile'
import Section, { Eyebrow } from '../ui/Section'
import Reveal from '../ui/Reveal'
import BentoCard from '../ui/BentoCard'
import Chip from '../ui/Chip'

export default function Skills() {
  const { skillGroups } = profile

  return (
    <Section id="skills" labelledby="skills-heading">
      <Reveal>
        <Eyebrow>skills</Eyebrow>
        <h2 id="skills-heading" className="max-w-3xl text-4xl font-semibold sm:text-5xl">
          The stack I build with.
        </h2>
      </Reveal>

      <ul role="list" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => {
          const highlight = group.title === 'Product Engineering'
          return (
            <Reveal as="li" key={group.title} delay={(i % 3) * 80}>
              <BentoCard
                className="h-full"
                bodyClassName={highlight ? 'border-accent-500/40 bg-accent-500/[0.06]' : ''}
              >
                <h3 className="flex items-center gap-2 font-mono text-sm text-ink">
                  {highlight && <span aria-hidden="true" className="text-accent-400">★</span>}
                  {group.title}
                </h3>
                <ul role="list" className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </BentoCard>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
