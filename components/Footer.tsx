import type { FooterContent, NavContent } from '@/types/content'

export default function Footer({ content, nav }: { content: FooterContent; nav: NavContent }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-content px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-display text-lg font-semibold text-ink">
            {nav.initials}
            <span className="text-accent-500">.</span>
          </p>
          <p className="font-mono text-xs text-ink-soft">{content.tagline}</p>
          <a
            href="#top"
            className="font-mono text-xs text-ink-soft transition-colors hover:text-accent-300"
          >
            {content.backToTopLabel} ↑
          </a>
        </div>
        <p className="mt-6 border-t border-line pt-6 font-mono text-xs text-ink-soft">
          © {year} {content.text}
        </p>
      </div>
    </footer>
  )
}
