/** @type {import('tailwindcss').Config} */

// Design tokens live here (theme) and in src/index.css (CSS variables).
// Colors are wired to CSS variables holding *RGB channels* (e.g. "139 92 246")
// so Tailwind opacity utilities keep working: bg-accent-500/20, text-ink/70, etc.
const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1.5' }],
      sm: ['0.875rem', { lineHeight: '1.55' }],
      base: ['1rem', { lineHeight: '1.65' }],
      lg: ['1.125rem', { lineHeight: '1.6' }],
      xl: ['1.25rem', { lineHeight: '1.5' }],
      '2xl': ['1.5rem', { lineHeight: '1.3' }],
      '3xl': ['1.875rem', { lineHeight: '1.2' }],
      '4xl': ['2.25rem', { lineHeight: '1.12' }],
      '5xl': ['clamp(2.5rem, 6vw, 3.5rem)', { lineHeight: '1.03', letterSpacing: '-0.02em' }],
      '6xl': ['clamp(3rem, 9vw, 5rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
      '7xl': ['clamp(3.5rem, 11vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
    },
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
        display: ['"Space Grotesk Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        section: 'clamp(4rem, 9vw, 7rem)',
      },
      maxWidth: {
        content: '75rem',
        prose: '42rem',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
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
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(70px, -50px) scale(1.15)' },
          '66%': { transform: 'translate(-50px, 40px) scale(0.92)' },
        },
        'scroll-dot': {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateY(40px)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        shimmer: 'shimmer 8s linear infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        'scroll-dot': 'scroll-dot 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
