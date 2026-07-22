import type { Metadata } from 'next'
import { Space_Grotesk, Manrope, JetBrains_Mono } from 'next/font/google'
import { getContent } from '@/lib/content'
import './globals.css'

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent()
  return {
    metadataBase: new URL('https://prasannakumar.denalixtech.com'),
    title: content.meta.siteTitle,
    description: content.meta.description,
    icons: { icon: '/favicon.svg' },
    openGraph: {
      title: content.meta.siteTitle,
      description: content.meta.description,
      images: ['/og-image.svg'],
      type: 'website',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
