import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Layout — the shared page frame: skip link → sticky nav → <main> landmark →
 * footer. Routed pages render as children inside <main>.
 */
export default function Layout({ children }) {
  return (
    <>
      {/* Keyboard users can jump straight past the nav to content. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
