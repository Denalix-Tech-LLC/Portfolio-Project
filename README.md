# Prasanna Kumar — Portfolio (v3)

Modern animated portfolio with an **AI-themed hero** — a lightweight canvas
neural network: drifting nodes with a depth field, edges that link to each
other and to your cursor (no WebGL library, ~zero bundle cost).

**Stack:** Next.js 15 (App Router, TypeScript strict) · framer-motion 12 ·
Tailwind CSS 3.

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

**Save works on every host.** Locally, Save writes the file directly
(atomically). On read-only hosts like Vercel, Save automatically falls back to
**committing the JSON to this GitHub repo** — the host redeploys and the change
is live in a minute or two (the editor tells you so). Each save shows up in the
repo history as a commit, which doubles as an audit log and an undo mechanism
(`git revert`). **Export JSON** remains as a manual backup path.

### One-time setup for saving on Vercel

1. Create a **fine-grained personal access token**: GitHub → Settings →
   **Developer settings → Personal access tokens → Fine-grained tokens →
   Generate new token**.
   - **Resource owner:** the account/organization that owns this repo (for an
     org repo pick the org — the org must allow fine-grained PATs; if it
     doesn't, a classic token with `repo` scope works as a fallback).
   - **Repository access:** *Only select repositories* → this repo only.
   - **Permissions:** *Contents → Read and write*. Nothing else.
2. In Vercel → Project → **Settings → Environment Variables** (Production),
   add:
   - `GITHUB_TOKEN` — the token you just created
   - `GITHUB_REPO` — `Denalix-Tech-LLC/Portfolio-Project`
   - `GITHUB_BRANCH` — only if your deploy branch isn't `main`
3. **Redeploy once** — environment variables only apply to deployments created
   after they're added.

Images: put files in `public/` and reference them like `/prasanna.png`. An
empty `image` on a project renders a unique themed SVG placeholder instead
(choose the `motif`). The résumé download serves `public/resume.pdf`.

## Design & accessibility

- Dark engineer theme, **"Sky" light-blue accent** (#0EA5E9), AA contrast.
- Canvas neural-network hero: node count area-scaled and capped, DPR capped
  at 2, pauses when the tab is hidden, cursor parallax + link-to-cursor.
- **Reduced motion respected everywhere** — the hero renders one static frame, counters
  show final values, bars render full, reveals are static. framer-motion is
  JS-driven, so this is gated via a hydration-safe hook
  (`lib/useReducedMotionSafe.ts`), not just CSS.
- Accessible project modal: focus trap, Esc/backdrop close, focus restore,
  body scroll lock, keyboard-scrollable content.
- No contact form — copy-to-clipboard info cards with aria-live announcements.

## Deploy (Vercel)

Push to `main` — Vercel auto-builds (`vercel.json` pins the Next.js preset).
Set the **`ADMIN_PASSWORD`** environment variable in Vercel project settings.
