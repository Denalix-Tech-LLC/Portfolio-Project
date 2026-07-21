import Container from './Container'

/**
 * Section — a semantic <section> landmark with consistent vertical rhythm.
 * Pass `labelledby` (the id of the section heading) for screen readers.
 */
export default function Section({ id, labelledby, className = '', children }) {
  return (
    <section id={id} aria-labelledby={labelledby} className={`scroll-mt-20 py-section ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

/** Eyebrow — a small mono label (with a leading marker) above a heading. */
export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`mb-4 flex items-center gap-2 font-mono text-sm text-accent-400 ${className}`}>
      <span aria-hidden="true" className="text-accent-500">{'//'}</span>
      {children}
    </p>
  )
}
