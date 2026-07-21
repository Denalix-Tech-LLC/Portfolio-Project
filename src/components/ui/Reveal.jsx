import { useInView } from '../../hooks/useInView'

/**
 * Reveal — wraps children in a scroll-triggered fade/slide-in.
 * Purely presentational: the .reveal CSS (in index.css) handles the transition
 * and disables itself under prefers-reduced-motion, so this is safe by default.
 *
 * @param {number} delay  optional stagger in ms (for lists of cards).
 * @param {string} as     element/tag to render (default 'div').
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      data-visible={inView}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
