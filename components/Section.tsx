import Reveal from './Reveal'

/** Section — landmark with heading pattern shared by every page section. */
export default function Section({
  id,
  eyebrow,
  heading,
  children,
  className = '',
}: {
  id: string
  eyebrow: string
  heading: string
  children: React.ReactNode
  className?: string
}) {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-20 py-24 sm:py-28 ${className}`}
    >
      <div className="mx-auto w-full max-w-content px-6 sm:px-8 lg:px-12">
        <Reveal>
          <p className="mb-4 flex items-center gap-2 font-mono text-sm text-accent-400">
            <span aria-hidden="true" className="text-accent-500">
              {'//'}
            </span>
            {eyebrow}
          </p>
          <h2 id={headingId} className="max-w-3xl text-4xl font-semibold sm:text-5xl">
            {heading}
          </h2>
        </Reveal>
        {children}
      </div>
    </section>
  )
}
