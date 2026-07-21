/* =============================================================
   PROFILE & SITE COPY  —  EDIT ME
   Everything personal lives here. (Experience → ./experience.js,
   education/certs → ./education.js)
   ============================================================= */

export const profile = {
  name: 'Prasanna Kumar Reddy Peram',
  shortName: 'Prasanna Kumar',
  initials: 'PK',

  // Roles cycle through the hero typewriter.
  roles: ['Product Engineer', 'Full-Stack Product Dev', 'Backend Engineer', 'AI / ML Engineer'],

  location: 'Cleveland, Ohio · USA',
  availability: 'Open to Product Engineering roles',

  // Contact — pulled from the resume.
  email: 'peramprasannakumar@gmail.com',
  phone: '+1 (216) 314-8720',
  // NOTE: update these URLs with your real profiles.
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prasanna-kumar-peram-mscs-633339139/' },
    { label: 'Email', href: 'mailto:peramprasannakumar@gmail.com' },
  ],

  hero: {
    headline: 'I build products end to end — from user problem to production.',
    subhead:
      'Product Engineer with 3.5+ years shipping production software end to end — turning user problems into Python services, REST APIs, and Generative-AI features that customers actually use.',
    primaryCta: { label: 'View experience', href: '#experience' },
    secondaryCta: { label: 'Get in touch', href: '#contact' },
  },

  // Animated count-up stats for the hero bento.
  stats: [
    { value: 3.5, decimals: 1, suffix: '+', label: 'Years shipping products' },
    { value: 3, suffix: '', label: 'Companies shipped for' },
    { value: 40, suffix: '%', label: 'Manual ops cut for customers' },
    { value: 50, suffix: '%', label: 'QA effort automated away' },
  ],

  summary:
    'Product Engineer who owns features end to end — from talking to users and shaping the roadmap to writing production Python, designing REST APIs, and embedding Generative AI into the product. 3.5+ years shipping software across product, HR-tech, and banking teams, grounded in Object-Oriented design, CI/CD (Jenkins, GitHub), and SQL performance tuning. I measure success by customer impact over lines of code — making independent design and UX calls, iterating fast on feedback, and rebuilding when the data points to a better solution.',

  // Skill groups (from the resume). Rename/reorder freely.
  skillGroups: [
    {
      title: 'Product Engineering',
      items: [
        'End-to-End Ownership',
        'Product Roadmapping',
        'User Research',
        'Requirements Gathering',
        'Technical Specs',
        'UX Decisions',
        'Rapid Iteration',
        'Customer Support',
      ],
    },
    {
      title: 'Languages & Databases',
      items: ['Python', 'Java', 'Bash', 'C', 'SQL', 'MongoDB'],
    },
    {
      title: 'Cloud & AI',
      items: ['Generative AI', 'Claude Code', 'Cowork', 'Codex', 'Fable', 'ChatGPT', 'Copilot'],
    },
    {
      title: 'Development',
      items: ['OOP', 'REST API Design', 'Microservices', 'Event-driven'],
    },
    {
      title: 'Testing & Quality',
      items: ['PyTest', 'Karate', 'Unit Testing', 'Pylint', 'SonarLint', 'A/B Testing'],
    },
    {
      title: 'Systems & Infra',
      items: ['Linux (Expert)', 'Ubuntu', 'HPC Resource Mgmt'],
    },
    {
      title: 'Tools & Workflow',
      items: ['Git', 'Jenkins (CI/CD)', 'Jira', 'Postman', 'Confluence', 'Agile / Scrum'],
    },
  ],

  contact: {
    heading: 'Let’s build something that scales.',
    blurb:
      'I’m open to Product Engineering roles — owning features end to end, from users to production. The fastest way to reach me is email — I read everything.',
  },
}
