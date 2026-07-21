import { useTypewriter } from '../../hooks/useTypewriter'

/**
 * Typewriter — animated role rotator with a blinking caret.
 * The animated text is aria-hidden (it would spam a screen reader as it types);
 * a visually-hidden static list conveys all roles to assistive tech instead.
 */
export default function Typewriter({ words, className = '' }) {
  const text = useTypewriter(words)

  return (
    <span className={className}>
      <span aria-hidden="true">
        {text}
        <span className="ml-0.5 inline-block w-[2px] -translate-y-[2px] animate-blink bg-accent-400 align-middle" style={{ height: '1em' }} />
      </span>
      <span className="sr-only">{words.join(', ')}</span>
    </span>
  )
}
