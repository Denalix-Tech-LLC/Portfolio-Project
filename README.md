# Prasanna Kumar — Portfolio (v3)

Modern animated portfolio with an **AI-themed 3D hero** — a neural network of
glowing nodes with signals flowing along its synapses, built purely from
primitive geometries (no external 3D assets).

**Stack:** Next.js 15 (App Router, TypeScript strict) · React Three Fiber 9 ·
framer-motion 12 · Tailwind CSS 3.

## Run

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
npm run typecheck            # tsc --noEmit
npm run build                # production build (stop the dev server first)
```

Requires Node 18+.

## Edit content — no code, no rebuild

Every visible string lives in **`content/site-content.json`** (typed by
`types/content.ts`, documented in [`content/SCHEMA.md`](content/SCHEMA.md)).
The page reads it per-request, so saves show up on refresh — no rebuild.

Open **`/admin`**, sign in with `ADMIN_PASSWORD`, edit in the tabbed form, hit
**Save** (or Ctrl+S). Lists support add / remove / move up / move down.
**Export JSON** downloads your current edits as a file.

> **On Vercel the filesystem is read-only**, so Save is disabled by design
> there — the error message says so. Workflow for production edits: edit
> locally and push, or use **Export JSON** and replace
> `content/site-content.json` in the repo.

Images: put files in `public/` and reference them like `/prasanna.png`. An
empty `image` on a project renders a unique themed SVG placeholder instead
(choose the `motif`). The résumé download serves `public/resume.pdf`.

## Design & accessibility

- Dark engineer theme, **"Sky" light-blue accent** (#0EA5E9), AA contrast.
- 3D hero renders on desktop fine-pointer devices; mobile and loading states
  get an animated SVG neural net. Mouse parallax on desktop.
- **Reduced motion respected everywhere** — the 3D scene freezes, counters
  show final values, bars render full, reveals are static. framer-motion is
  JS-driven, so this is gated via a hydration-safe hook
  (`lib/useReducedMotionSafe.ts`), not just CSS.
- Accessible project modal: focus trap, Esc/backdrop close, focus restore,
  body scroll lock, keyboard-scrollable content.
- No contact form — copy-to-clipboard info cards with aria-live announcements.

## Deploy (Vercel)

Push to `main` — Vercel auto-builds (`vercel.json` pins the Next.js preset).
Set the **`ADMIN_PASSWORD`** environment variable in Vercel project settings.
