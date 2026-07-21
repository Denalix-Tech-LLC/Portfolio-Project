import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Experience from '../components/sections/Experience'
import Education from '../components/sections/Education'
import Contact from '../components/sections/Contact'

/** Home — single-page composition of all sections. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </>
  )
}
