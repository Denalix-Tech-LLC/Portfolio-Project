import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * BlurText — words un-blur and rise one after another (ReactBits-style
 * "Blur Text"), CSS-only per word. Screen readers get the plain string;
 * reduced-motion users get static text.
 *
 * @param {string} text     the sentence to animate
 * @param {number} stagger  per-word delay in ms
 * @param {number} delay    initial delay in ms before the first word
 */
export default function BlurText({ text, stagger = 35, delay = 150, className = '' }) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span aria-hidden="true" key={`${word}-${i}`}>
          <span
            className="blur-word"
            style={{ animationDelay: `${delay + i * stagger}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}
