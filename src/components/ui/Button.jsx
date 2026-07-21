/**
 * Button — renders an <a> when given `href` (external links are hardened),
 * otherwise a real <button>. Variants: primary (accent fill), secondary
 * (outline), ghost (text only).
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'transition-all duration-200 ease-smooth focus-visible:outline-none ' +
  'focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-60'

const sizes = {
  md: 'px-6 py-3 text-base',
  sm: 'px-4 py-2 text-sm',
}

const variants = {
  primary: 'bg-accent-600 text-white hover:bg-accent-500 shadow-glow hover:-translate-y-0.5 active:translate-y-0',
  secondary: 'border border-line bg-surface/60 text-ink hover:border-accent-500/50 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-ink-muted hover:text-ink',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  ...rest
}) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if (href) {
    const isExternal = /^https?:\/\//.test(href)
    const externalProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
