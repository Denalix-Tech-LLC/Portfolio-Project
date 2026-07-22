# Content schema — `content/site-content.json`

Every visible string on the site lives in this one file. Edit it at **`/admin`**
(recommended) or by hand. Keys starting with `_` (like `_comment`) are notes for
editors — they are preserved on save and never shown on the site.

TypeScript types: [`types/content.ts`](../types/content.ts).

## Sections

| Key | Renders as |
|---|---|
| `meta` | Browser-tab title + search/social description |
| `nav` | Sticky navbar (logo, links, CTA, mobile menu labels) |
| `hero` | Full-screen 3D hero (badge, greeting, name, title, subtitle, 2 CTAs, résumé download, scroll hint) |
| `about` | Photo, bio paragraphs, animated stat counters, highlight chips |
| `experience` | Timeline of jobs (`current: true` shows the live badge) |
| `projects` | Card grid + detail modal. `image: ""` → a themed SVG placeholder is drawn (pick `motif`: `chatbot`, `api`, `automation`, `network`, `bank`, `ai`). `details[]` is the full story in the modal |
| `skills` | Grouped proficiency bars — `level` is 0–100 |
| `credentials` | Education + certifications columns |
| `contact` | Info cards with one-click copy (`href` empty = plain text card) |
| `footer` | Copyright (year auto-added), tagline, back-to-top |

## Rules of thumb

- **Never remove a key** — set it to `""` (or `[]`) instead. The site expects every field.
- List items each carry a stable `id` — the admin manages these automatically.
- `photo`, `image`, `resumeFile` are paths under `public/` (e.g. `/prasanna.png`).
  Drop the file into `public/` first, then reference it.

## Copy-paste example: adding a project

```json
{
  "id": "proj-my-new-thing",
  "title": "My New Thing",
  "tagline": "One-sentence hook shown on the card.",
  "image": "",
  "imageAlt": "",
  "motif": "ai",
  "tags": ["Python", "FastAPI"],
  "details": [
    "First bullet shown in the detail modal.",
    "Second bullet — include the full resume-level detail here."
  ]
}
```

Append it to `projects.items`, save, done.
