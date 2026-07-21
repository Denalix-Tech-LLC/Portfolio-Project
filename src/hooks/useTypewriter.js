import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * useTypewriter — types a word out, pauses, deletes it, moves to the next, loops.
 * Under prefers-reduced-motion it returns the first word statically (no motion).
 * Returns the current visible substring.
 */
export function useTypewriter(words, { typeSpeed = 85, deleteSpeed = 40, pause = 1500 } = {}) {
  const reduced = usePrefersReducedMotion()
  const [text, setText] = useState(words[0] ?? '')

  useEffect(() => {
    if (reduced) {
      setText(words[0] ?? '')
      return
    }

    let wordIndex = 0
    let charIndex = words[0]?.length ?? 0
    let deleting = false
    let timer

    const tick = () => {
      const word = words[wordIndex]
      charIndex += deleting ? -1 : 1
      setText(word.slice(0, charIndex))

      let delay = deleting ? deleteSpeed : typeSpeed
      if (!deleting && charIndex === word.length) {
        delay = pause // full word → hold before deleting
        deleting = true
      } else if (deleting && charIndex === 0) {
        deleting = false
        wordIndex = (wordIndex + 1) % words.length
        delay = typeSpeed * 3 // brief gap before the next word
      }
      timer = setTimeout(tick, delay)
    }

    timer = setTimeout(tick, pause)
    return () => clearTimeout(timer)
  }, [words, typeSpeed, deleteSpeed, pause, reduced])

  return text
}
