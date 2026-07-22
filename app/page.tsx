import { getContent } from '@/lib/content'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Credentials from '@/components/Credentials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

// Content is read from disk on every request so /admin edits appear
// immediately without a rebuild.
export const dynamic = 'force-dynamic'

export default async function Home() {
  const content = await getContent()

  return (
    <>
      <a href="#main" className="skip-link">
        {content.nav.skipLinkLabel}
      </a>
      <Navbar content={content.nav} />
      <main id="main" tabIndex={-1}>
        <Hero content={content.hero} />
        <About content={content.about} />
        <Experience content={content.experience} />
        <Projects content={content.projects} />
        <Skills content={content.skills} />
        <Credentials content={content.credentials} />
        <Contact content={content.contact} />
      </main>
      <Footer content={content.footer} nav={content.nav} />
    </>
  )
}
