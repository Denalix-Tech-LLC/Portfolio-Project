/**
 * Typed shape of content/site-content.json — the single source of every
 * visible string on the site. Fields prefixed with `_` are documentation
 * for editors and are preserved (never rendered).
 */

export interface NavLink {
  id: string
  label: string
  href: string
}

export interface NavContent {
  _comment?: string
  initials: string
  logoText: string
  skipLinkLabel: string
  links: NavLink[]
  ctaLabel: string
  ctaHref: string
  menuOpenLabel: string
  menuCloseLabel: string
}

export interface HeroContent {
  _comment?: string
  availability: string
  greeting: string
  name: string
  title: string
  subtitle: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
  resumeLabel: string
  resumeFile: string
  scrollHintLabel: string
}

export interface Stat {
  id: string
  value: number
  decimals: number
  suffix: string
  label: string
}

export interface AboutContent {
  _comment?: string
  heading: string
  eyebrow: string
  paragraphs: string[]
  photo: string
  photoAlt: string
  stats: Stat[]
  chipsLabel: string
  chips: string[]
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  location: string
  current: boolean
  points: string[]
  stack: string[]
}

export interface ExperienceContent {
  _comment?: string
  heading: string
  eyebrow: string
  currentBadge: string
  stackLabel: string
  items: ExperienceItem[]
}

export type ProjectMotif =
  | 'chatbot'
  | 'api'
  | 'automation'
  | 'network'
  | 'bank'
  | 'ai'

export interface ProjectItem {
  id: string
  title: string
  tagline: string
  /** Path under /public. Empty string → unique SVG placeholder (motif). */
  image: string
  imageAlt: string
  motif: ProjectMotif
  tags: string[]
  details: string[]
}

export interface ProjectsContent {
  _comment?: string
  heading: string
  eyebrow: string
  blurb: string
  openLabel: string
  modalCloseLabel: string
  modalDetailsHeading: string
  modalStackHeading: string
  items: ProjectItem[]
}

export interface SkillItem {
  id: string
  name: string
  /** 0–100 proficiency for the animated bar. */
  level: number
}

export interface SkillGroup {
  id: string
  title: string
  items: SkillItem[]
}

export interface SkillsContent {
  _comment?: string
  heading: string
  eyebrow: string
  groups: SkillGroup[]
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
}

export interface EducationItem {
  id: string
  degree: string
  school: string
  period: string
  location: string
}

export interface CredentialsContent {
  _comment?: string
  heading: string
  eyebrow: string
  educationHeading: string
  certificationsHeading: string
  education: EducationItem[]
  certifications: CertificationItem[]
}

export interface ContactCard {
  id: string
  label: string
  value: string
  /** Optional link target (mailto:, tel:, https://). Empty = not a link. */
  href: string
}

export interface ContactContent {
  _comment?: string
  heading: string
  eyebrow: string
  blurb: string
  copyLabel: string
  copiedLabel: string
  copyAnnouncement: string
  cards: ContactCard[]
}

export interface FooterContent {
  _comment?: string
  text: string
  tagline: string
  backToTopLabel: string
}

export interface MetaContent {
  _comment?: string
  siteTitle: string
  description: string
}

export interface SiteContent {
  _comment?: string
  meta: MetaContent
  nav: NavContent
  hero: HeroContent
  about: AboutContent
  experience: ExperienceContent
  projects: ProjectsContent
  skills: SkillsContent
  credentials: CredentialsContent
  contact: ContactContent
  footer: FooterContent
}
