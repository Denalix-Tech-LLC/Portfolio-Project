# Prasanna Kumar — Portfolio

A fast, accessible, single-page developer portfolio built with **React + Vite + Tailwind CSS**.
Dark **bento-grid** design with subtle AI-themed motion. All content lives in `src/data/`.

## Quick start

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the build locally
```

Requires Node 18+ (developed on Node 24).

## Design & style

- **Style: Bento grid** (chosen from the morphism/layout options) — modular tiles suit a dense
  technical résumé and read as modern/AI-forward. Dark "engineer" theme.
- **One accent — "Signal" violet** (`#8B5CF6`), shipped as a scale. Buttons use `accent-600` +
  white text (~5.7:1); links/labels use `accent-300/400` on the dark bg (~7:1). All AA.
- **Type:** `Space Grotesk` (display) + `Manrope` (body) + `JetBrains Mono` (code/labels) —
  self-hosted via `@fontsource-variable` (no runtime Google request).
- **Tokens:** colors are CSS variables (RGB channels) in `src/index.css`; spacing/radii/shadows
  in `tailwind.config.js`.

## Creative animation (all reduced-motion aware)

- **Neural-network canvas** in the hero — drifting nodes + edges that link to each other and to
  your cursor. Node count is capped, DPR-limited, pauses when the tab is hidden, and renders a
  single static frame under `prefers-reduced-motion`.
- **Role typewriter** cycling job titles (screen readers get the full static list).
- **Cursor-tilt bento cards** with an accent glare (fine pointers only).
- **Count-up stats** that animate in when scrolled into view.

## Project structure

```
src/
├── main.jsx            # entry (fonts + app)
├── App.jsx / index.css # shell + design tokens & base a11y styles
├── data/               # ← YOU EDIT THESE
│   ├── profile.js      #   identity, roles, summary, stats, skills, contact
│   ├── experience.js   #   work history (timeline)
│   └── education.js    #   degrees + certifications
├── hooks/              # useInView, usePrefersReducedMotion, useTypewriter
├── components/
│   ├── layout/         # Navbar, Footer, Layout (skip link + landmarks)
│   ├── sections/       # Hero, About, Skills, Experience, Education, Contact
│   └── ui/             # BentoCard, NeuralCanvas, Typewriter, CountUp, Button, Chip, …
└── pages/Home.jsx      # section composition
```

## Make it yours

Edit only the files in **`src/data/`**:

- **`profile.js`** — name, roles (the typewriter list), location, availability, email/phone,
  social URLs, hero copy, hero `stats`, summary, and `skillGroups`.
  > Update the **LinkedIn** and **GitHub** URLs — the GitHub one is a placeholder.
- **`experience.js`** — each entry is a timeline card (`current: true` shows the live dot).
- **`education.js`** — degrees and certifications (add a `href` to make a cert a link).

Then swap `public/favicon.svg` and `public/og-image.svg` (a PNG/JPG works best for OG),
and update the `<title>`/meta in `index.html`. To recolor, edit the `--c-accent-*` channels
in `src/index.css`.

## Deploy

Static output (`dist/`) — deploy to **Vercel** (preset: Vite) or **Netlify** (build
`npm run build`, publish `dist`), or any static host. `vercel.json`, `netlify.toml`, and
`public/_redirects` are included.

## Quality

- Semantic landmarks, one `<h1>`, ordered headings, skip link, `role="list"` where Preflight
  strips list semantics, 44px touch targets, visible focus rings, WCAG AA contrast (verified).
- Verified: no horizontal overflow at 375 / 768 / 1280 px, no console errors, ~56 KB gzipped JS.
