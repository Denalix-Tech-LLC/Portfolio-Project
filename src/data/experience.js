/* =============================================================
   EXPERIENCE  —  EDIT ME
   Each entry renders as a card in the Experience timeline.
   `current: true` shows the live "now" indicator.
   ============================================================= */

export const experience = [
  {
    company: 'Denalix Tech LLC',
    role: 'Product Engineer',
    period: 'June 2025 — Present',
    location: 'Cleveland, USA',
    current: true,
    stack: ['Python', 'REST APIs', 'Generative AI', 'Product', 'CI/CD', 'Azure'],
    highlights: [
      'Own product features end to end — from talking to users and shaping the roadmap to writing full-stack code, shipping to production, and supporting customers directly.',
      'Translate customer pain points and business requirements into working software, making independent design and UX decisions to build experiences that solve real problems.',
      'Build and ship production Python services and REST APIs, embedding Generative AI / LLM capabilities into the product to automate workflows and unlock new features.',
      'Prioritize against the product roadmap, estimate technical effort, write clear technical specs, and keep quality high through code review and automated testing in CI/CD.',
      'Measure success by customer impact over lines of code — iterating fast on user feedback and rebuilding when the data points to a better solution.',
    ],
  },
  {
    company: 'Phenom People',
    role: 'Product Development Engineer',
    period: 'Jan 2022 — Aug 2023',
    location: 'Hyderabad, India',
    stack: ['Python', 'Sanic', 'REST', 'MongoDB', 'SQL', 'Jenkins', 'Karate'],
    highlights: [
      'Engineered complex automation workflows in Python (Sanic) to streamline HR operations — automated interview scheduling and candidate pre-screening logic.',
      'Built and optimized RESTful APIs (GET / PATCH / DELETE) for dynamic system configuration, cutting manual intervention by implementation teams by 40%.',
      'Designed an API automation framework with Karate, reducing manual QA effort by 50% and accelerating the deployment lifecycle.',
      'Integrated multi-channel interfaces (MS Teams, WhatsApp, SMS, Web) with event-driven architectures for seamless data flow across systems.',
      'Enforced code quality via PyTest, Pylint, and SonarLint on Git/GitHub with Jenkins CI/CD; led OOP-based "internal gig" business logic and its integrity constraints.',
    ],
  },
  {
    company: 'Achala IT Solutions',
    role: 'Associate Software Engineer',
    period: 'Apr 2021 — Dec 2021',
    location: 'Hyderabad, India',
    stack: ['Python', 'REST', 'SQL', 'OOP', 'Postman'],
    highlights: [
      'Contributed to the end-to-end SDLC of high-availability banking production systems, holding to strict security and performance standards.',
      'Developed robust RESTful APIs in Python for seamless data exchange with third-party banking modules.',
      'Built automated background schedulers for high-volume batch processing and system monitoring (Spring Boot-style patterns).',
      'Optimized complex queries and relational data models for integrity and responsiveness under heavy load; profiled and tuned critical features with Postman and debugging tools.',
    ],
  },
]
