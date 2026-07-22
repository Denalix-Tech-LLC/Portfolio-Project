import type { Config } from 'tailwindcss'

// Colors are CSS variables holding RGB channels (see app/globals.css) so
// Tailwind opacity modifiers keep working: bg-accent-500/20, text-ink/70 …
const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './scene/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: withOpacity('--c-bg'),
        surface: withOpacity('--c-surface'),
        surface2: withOpacity('--c-surface-2'),
        ink: {
          DEFAULT: withOpacity('--c-ink'),
          muted: withOpacity('--c-ink-muted'),
          soft: withOpacity('--c-ink-soft'),
        },
        line: withOpacity('--c-line'),
        accent: {
          200: withOpacity('--c-accent-200'),
          300: withOpacity('--c-accent-300'),
          400: withOpacity('--c-accent-400'),
          500: withOpacity('--c-accent-500'),
          600: withOpacity('--c-accent-600'),
          700: withOpacity('--c-accent-700'),
          DEFAULT: withOpacity('--c-accent-500'),
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '75rem',
      },
      boxShadow: {
        card: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 10px 30px -12px rgb(0 0 0 / 0.6)',
        glow: '0 0 0 1px rgb(var(--c-accent-500) / 0.35), 0 12px 40px -12px rgb(var(--c-accent-500) / 0.35)',
        focus: '0 0 0 3px rgb(var(--c-accent-500) / 0.55)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        'dash-flow': {
          to: { strokeDashoffset: '-24' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'pulse-dot': 'pulse-dot 2.4s ease-in-out infinite',
        'dash-flow': 'dash-flow 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
