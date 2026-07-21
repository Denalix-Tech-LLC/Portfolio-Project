/** Chip — a small mono pill for tech/skills, styled for the dark theme. */
export default function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-line bg-surface2/70 px-2.5 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-accent-500/40 hover:text-accent-300 ${className}`}
    >
      {children}
    </span>
  )
}
