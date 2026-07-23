'use client'

/**
 * /admin — tabbed content editor for a non-technical owner.
 *
 * Hard requirements implemented here:
 * - Save is re-entrancy-guarded (button AND Ctrl+S disabled while in flight).
 * - A 401 on save shows a re-login overlay WITHOUT unmounting the editor or
 *   reloading content — unsaved edits stay, and Export is offered.
 * - List rows use <details>; row controls are siblings of <summary>, never
 *   nested inside it (nested-interactive a11y violation).
 * - Underscore-prefixed keys (_comment) are preserved on save (the whole
 *   document round-trips; we never strip unknown keys).
 * - On Vercel the FS is read-only: the save error explains Export instead.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  SiteContent,
  ProjectItem,
  ExperienceItem,
  SkillGroup,
  ProjectMotif,
} from '@/types/content'

const MOTIFS: ProjectMotif[] = ['chatbot', 'api', 'automation', 'network', 'bank', 'ai']
const TABS = [
  'Meta',
  'Nav',
  'Hero',
  'About',
  'Experience',
  'Projects',
  'Skills',
  'Credentials',
  'Contact',
  'Footer',
] as const
type Tab = (typeof TABS)[number]

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`

/* ---------- small form primitives ---------- */

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  const cls =
    'w-full rounded-md border border-line bg-surface2/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus-visible:outline-none focus-visible:shadow-focus'
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      <input
        type="number"
        step="any"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-line bg-surface2/60 px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:shadow-focus"
      />
    </label>
  )
}

function CheckboxField({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
      <span className="text-sm text-ink">{label}</span>
    </label>
  )
}

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const copy = [...items]
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
    onChange(copy)
  }
  return (
    <div>
      <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea
              value={item}
              rows={item.length > 80 ? 3 : 1}
              onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
              className="w-full rounded-md border border-line bg-surface2/60 px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:shadow-focus"
            />
            <RowControls
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
              onRemove={() => onChange(items.filter((_, j) => j !== i))}
              upDisabled={i === 0}
              downDisabled={i === items.length - 1}
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ''])} className={addBtn}>
        + Add
      </button>
    </div>
  )
}

const iconBtn =
  'flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:border-accent-500/50 hover:text-accent-300 disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink-muted'
const addBtn =
  'mt-2 rounded-md border border-dashed border-line px-3 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:border-accent-500/50 hover:text-accent-300'

function RowControls({
  onUp,
  onDown,
  onRemove,
  upDisabled,
  downDisabled,
}: {
  onUp: () => void
  onDown: () => void
  onRemove: () => void
  upDisabled: boolean
  downDisabled: boolean
}) {
  return (
    <div className="flex flex-none gap-1">
      <button type="button" onClick={onUp} disabled={upDisabled} aria-label="Move up" className={iconBtn}>
        ↑
      </button>
      <button type="button" onClick={onDown} disabled={downDisabled} aria-label="Move down" className={iconBtn}>
        ↓
      </button>
      <button type="button" onClick={onRemove} aria-label="Remove" className={iconBtn}>
        ✕
      </button>
    </div>
  )
}

/** Collapsible list item — controls are SIBLINGS of <summary>, never inside it. */
function ItemCard({
  title,
  controls,
  children,
}: {
  title: string
  controls: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <details className="rounded-lg border border-line bg-surface/60">
      <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-ink">
        {title || '(untitled)'}
      </summary>
      <div className="flex justify-end border-t border-line px-4 pt-3">{controls}</div>
      <div className="space-y-3 px-4 pb-4 pt-2">{children}</div>
    </details>
  )
}

/* ---------- the editor ---------- */

type AuthState = 'checking' | 'login' | 'ready'

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>('checking')
  const [data, setData] = useState<SiteContent | null>(null)
  const [tab, setTab] = useState<Tab>('Hero')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState('')
  const [relogin, setRelogin] = useState(false)
  const savingRef = useRef(false)
  const dataRef = useRef<SiteContent | null>(null)
  dataRef.current = data

  const loadContent = useCallback(async () => {
    const res = await fetch('/api/admin/content')
    if (res.status === 401) {
      setAuth('login')
      return
    }
    const json = (await res.json()) as SiteContent
    setData(json)
    setAuth('ready')
  }, [])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  const patch = useCallback((mutate: (draft: SiteContent) => void) => {
    setData((prev) => {
      if (!prev) return prev
      const copy = structuredClone(prev)
      mutate(copy)
      return copy
    })
    setDirty(true)
    setStatus('')
  }, [])

  const doLogin = async (afterLogin?: () => void) => {
    setLoginError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({ error: 'Login failed.' }))
      setLoginError(json.error ?? 'Login failed.')
      return
    }
    setPassword('')
    if (afterLogin) {
      afterLogin()
    } else {
      await loadContent()
    }
  }

  const save = useCallback(async () => {
    // Re-entrancy guard: covers both the button and the Ctrl+S shortcut.
    if (savingRef.current || !dataRef.current) return
    savingRef.current = true
    setSaving(true)
    setStatus('')
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataRef.current),
      })
      if (res.status === 401) {
        // Session expired: keep the editor and its unsaved edits mounted.
        setRelogin(true)
        return
      }
      const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string }
      if (!res.ok) {
        setStatus(json.error ?? 'Save failed.')
        return
      }
      setDirty(false)
      // Read-only hosts save via a GitHub commit — surface the server's
      // "redeploying" note instead of a bare "Saved".
      setStatus(json.message ?? 'Saved. Changes are live.')
    } catch (err) {
      setStatus(`Save failed: ${String(err)}`)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }, [])

  // Ctrl/Cmd+S — guarded by the same in-flight flag.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (auth === 'ready' && !relogin) save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [auth, relogin, save])

  const exportJson = () => {
    if (!dataRef.current) return
    const blob = new Blob([JSON.stringify(dataRef.current, null, 2) + '\n'], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuth('login')
    setData(null)
  }

  /* ---------- render ---------- */

  if (auth === 'checking') {
    return <div className="grid min-h-screen place-items-center text-ink-muted">Loading…</div>
  }

  if (auth === 'login') {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            doLogin()
          }}
          className="panel w-full max-w-sm space-y-4 p-6"
        >
          <h1 className="text-xl font-semibold text-ink">Content Editor</h1>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-ink-soft">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full rounded-md border border-line bg-surface2/60 px-3 py-2 text-ink focus-visible:outline-none focus-visible:shadow-focus"
            />
          </label>
          {loginError && <p className="text-sm text-red-400">{loginError}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-accent-600 px-5 py-2.5 font-semibold text-white hover:bg-accent-700"
          >
            Sign in
          </button>
        </form>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen pb-32">
      {/* Session-expired overlay — editor stays mounted, edits preserved. */}
      {relogin && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-bg/85 p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              doLogin(() => {
                setRelogin(false)
                setStatus('Signed in again — your edits are still here. Save again.')
              })
            }}
            className="panel w-full max-w-sm space-y-4 p-6"
          >
            <h2 className="text-lg font-semibold text-ink">Session expired</h2>
            <p className="text-sm text-ink-muted">
              Your unsaved edits are safe. Sign in again to save them — or export a backup now.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="Password"
              className="w-full rounded-md border border-line bg-surface2/60 px-3 py-2 text-ink focus-visible:outline-none focus-visible:shadow-focus"
            />
            {loginError && <p className="text-sm text-red-400">{loginError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-full bg-accent-600 px-4 py-2 font-semibold text-white hover:bg-accent-700"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={exportJson}
                className="flex-1 rounded-full border border-line px-4 py-2 text-ink-muted hover:text-accent-300"
              >
                Export JSON
              </button>
            </div>
          </form>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="font-display text-lg font-semibold text-ink">
            Content Editor
            {dirty && <span className="ml-2 font-mono text-xs text-accent-300">● unsaved</span>}
          </h1>
          <div className="flex items-center gap-2">
            <span aria-live="polite" className="mr-2 max-w-xs text-xs text-ink-muted">
              {status}
            </span>
            <button
              type="button"
              onClick={exportJson}
              className="rounded-full border border-line px-4 py-2 font-mono text-xs text-ink-muted hover:text-accent-300"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-accent-600 px-5 py-2 font-semibold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-line px-4 py-2 font-mono text-xs text-ink-muted hover:text-accent-300"
            >
              Log out
            </button>
          </div>
        </div>
        <nav aria-label="Editor sections" className="mx-auto max-w-5xl overflow-x-auto px-4 pb-2">
          <div role="tablist" className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                  tab === t ? 'bg-accent-600 text-white' : 'text-ink-muted hover:text-accent-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        {tab === 'Meta' && (
          <div className="space-y-4">
            <Field label="Site title (browser tab)" value={data.meta.siteTitle} onChange={(v) => patch((d) => void (d.meta.siteTitle = v))} />
            <Field label="Search / social description" textarea value={data.meta.description} onChange={(v) => patch((d) => void (d.meta.description = v))} />
          </div>
        )}

        {tab === 'Nav' && (
          <div className="space-y-4">
            <Field label="Logo text" value={data.nav.logoText} onChange={(v) => patch((d) => void (d.nav.logoText = v))} />
            <Field label="Initials (footer mark)" value={data.nav.initials} onChange={(v) => patch((d) => void (d.nav.initials = v))} />
            <Field label="Skip-link label (a11y)" value={data.nav.skipLinkLabel} onChange={(v) => patch((d) => void (d.nav.skipLinkLabel = v))} />
            <Field label="CTA label" value={data.nav.ctaLabel} onChange={(v) => patch((d) => void (d.nav.ctaLabel = v))} />
            <Field label="CTA link" value={data.nav.ctaHref} onChange={(v) => patch((d) => void (d.nav.ctaHref = v))} />
            <Field label="Mobile menu open label" value={data.nav.menuOpenLabel} onChange={(v) => patch((d) => void (d.nav.menuOpenLabel = v))} />
            <Field label="Mobile menu close label" value={data.nav.menuCloseLabel} onChange={(v) => patch((d) => void (d.nav.menuCloseLabel = v))} />
            <div className="space-y-2">
              <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">Links</span>
              {data.nav.links.map((link, i) => (
                <ItemCard
                  key={link.id}
                  title={link.label}
                  controls={
                    <RowControls
                      onUp={() => patch((d) => { const a = d.nav.links; if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]] })}
                      onDown={() => patch((d) => { const a = d.nav.links; if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]] })}
                      onRemove={() => patch((d) => void d.nav.links.splice(i, 1))}
                      upDisabled={i === 0}
                      downDisabled={i === data.nav.links.length - 1}
                    />
                  }
                >
                  <Field label="Label" value={link.label} onChange={(v) => patch((d) => void (d.nav.links[i].label = v))} />
                  <Field label="Href (#section)" value={link.href} onChange={(v) => patch((d) => void (d.nav.links[i].href = v))} />
                </ItemCard>
              ))}
              <button type="button" className={addBtn} onClick={() => patch((d) => void d.nav.links.push({ id: newId('nav'), label: 'New link', href: '#' }))}>
                + Add link
              </button>
            </div>
          </div>
        )}

        {tab === 'Hero' && (
          <div className="space-y-4">
            <Field label="Availability badge" value={data.hero.availability} onChange={(v) => patch((d) => void (d.hero.availability = v))} />
            <Field label="Greeting" value={data.hero.greeting} onChange={(v) => patch((d) => void (d.hero.greeting = v))} />
            <Field label="Name" value={data.hero.name} onChange={(v) => patch((d) => void (d.hero.name = v))} />
            <Field label="Title line" value={data.hero.title} onChange={(v) => patch((d) => void (d.hero.title = v))} />
            <Field label="Subtitle" textarea value={data.hero.subtitle} onChange={(v) => patch((d) => void (d.hero.subtitle = v))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Primary CTA label" value={data.hero.ctaPrimaryLabel} onChange={(v) => patch((d) => void (d.hero.ctaPrimaryLabel = v))} />
              <Field label="Primary CTA link" value={data.hero.ctaPrimaryHref} onChange={(v) => patch((d) => void (d.hero.ctaPrimaryHref = v))} />
              <Field label="Secondary CTA label" value={data.hero.ctaSecondaryLabel} onChange={(v) => patch((d) => void (d.hero.ctaSecondaryLabel = v))} />
              <Field label="Secondary CTA link" value={data.hero.ctaSecondaryHref} onChange={(v) => patch((d) => void (d.hero.ctaSecondaryHref = v))} />
              <Field label="Résumé button label" value={data.hero.resumeLabel} onChange={(v) => patch((d) => void (d.hero.resumeLabel = v))} />
              <Field label="Résumé file path (under /public)" value={data.hero.resumeFile} onChange={(v) => patch((d) => void (d.hero.resumeFile = v))} />
            </div>
            <Field label="Scroll hint label" value={data.hero.scrollHintLabel} onChange={(v) => patch((d) => void (d.hero.scrollHintLabel = v))} />
          </div>
        )}

        {tab === 'About' && (
          <div className="space-y-4">
            <Field label="Eyebrow" value={data.about.eyebrow} onChange={(v) => patch((d) => void (d.about.eyebrow = v))} />
            <Field label="Heading" value={data.about.heading} onChange={(v) => patch((d) => void (d.about.heading = v))} />
            <StringListEditor label="Paragraphs" items={data.about.paragraphs} onChange={(items) => patch((d) => void (d.about.paragraphs = items))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Photo path (under /public, empty = placeholder)" value={data.about.photo} onChange={(v) => patch((d) => void (d.about.photo = v))} />
              <Field label="Photo alt text" value={data.about.photoAlt} onChange={(v) => patch((d) => void (d.about.photoAlt = v))} />
            </div>
            <div className="space-y-2">
              <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">Stats</span>
              {data.about.stats.map((stat, i) => (
                <ItemCard
                  key={stat.id}
                  title={stat.label}
                  controls={
                    <RowControls
                      onUp={() => patch((d) => { const a = d.about.stats; if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]] })}
                      onDown={() => patch((d) => { const a = d.about.stats; if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]] })}
                      onRemove={() => patch((d) => void d.about.stats.splice(i, 1))}
                      upDisabled={i === 0}
                      downDisabled={i === data.about.stats.length - 1}
                    />
                  }
                >
                  <div className="grid grid-cols-3 gap-3">
                    <NumberField label="Value" value={stat.value} onChange={(v) => patch((d) => void (d.about.stats[i].value = v))} />
                    <NumberField label="Decimals" value={stat.decimals} onChange={(v) => patch((d) => void (d.about.stats[i].decimals = v))} />
                    <Field label="Suffix (+, %)" value={stat.suffix} onChange={(v) => patch((d) => void (d.about.stats[i].suffix = v))} />
                  </div>
                  <Field label="Label" value={stat.label} onChange={(v) => patch((d) => void (d.about.stats[i].label = v))} />
                </ItemCard>
              ))}
              <button type="button" className={addBtn} onClick={() => patch((d) => void d.about.stats.push({ id: newId('stat'), value: 0, decimals: 0, suffix: '', label: 'New stat' }))}>
                + Add stat
              </button>
            </div>
            <Field label="Chips heading" value={data.about.chipsLabel} onChange={(v) => patch((d) => void (d.about.chipsLabel = v))} />
            <StringListEditor label="Highlight chips" items={data.about.chips} onChange={(items) => patch((d) => void (d.about.chips = items))} />
          </div>
        )}

        {tab === 'Experience' && (
          <div className="space-y-4">
            <Field label="Eyebrow" value={data.experience.eyebrow} onChange={(v) => patch((d) => void (d.experience.eyebrow = v))} />
            <Field label="Heading" value={data.experience.heading} onChange={(v) => patch((d) => void (d.experience.heading = v))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="'Current' badge text" value={data.experience.currentBadge} onChange={(v) => patch((d) => void (d.experience.currentBadge = v))} />
              <Field label="Stack row label" value={data.experience.stackLabel} onChange={(v) => patch((d) => void (d.experience.stackLabel = v))} />
            </div>
            {data.experience.items.map((job: ExperienceItem, i) => (
              <ItemCard
                key={job.id}
                title={`${job.role} — ${job.company}`}
                controls={
                  <RowControls
                    onUp={() => patch((d) => { const a = d.experience.items; if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]] })}
                    onDown={() => patch((d) => { const a = d.experience.items; if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]] })}
                    onRemove={() => patch((d) => void d.experience.items.splice(i, 1))}
                    upDisabled={i === 0}
                    downDisabled={i === data.experience.items.length - 1}
                  />
                }
              >
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Role" value={job.role} onChange={(v) => patch((d) => void (d.experience.items[i].role = v))} />
                  <Field label="Company" value={job.company} onChange={(v) => patch((d) => void (d.experience.items[i].company = v))} />
                  <Field label="Period" value={job.period} onChange={(v) => patch((d) => void (d.experience.items[i].period = v))} />
                  <Field label="Location" value={job.location} onChange={(v) => patch((d) => void (d.experience.items[i].location = v))} />
                </div>
                <CheckboxField label="Current role (shows live badge)" value={job.current} onChange={(v) => patch((d) => void (d.experience.items[i].current = v))} />
                <StringListEditor label="Bullet points" items={job.points} onChange={(items) => patch((d) => void (d.experience.items[i].points = items))} />
                <StringListEditor label="Stack" items={job.stack} onChange={(items) => patch((d) => void (d.experience.items[i].stack = items))} />
              </ItemCard>
            ))}
            <button
              type="button"
              className={addBtn}
              onClick={() => patch((d) => void d.experience.items.push({ id: newId('exp'), role: 'Role', company: 'Company', period: '', location: '', current: false, points: [], stack: [] }))}
            >
              + Add job
            </button>
          </div>
        )}

        {tab === 'Projects' && (
          <div className="space-y-4">
            <Field label="Eyebrow" value={data.projects.eyebrow} onChange={(v) => patch((d) => void (d.projects.eyebrow = v))} />
            <Field label="Heading" value={data.projects.heading} onChange={(v) => patch((d) => void (d.projects.heading = v))} />
            <Field label="Blurb" textarea value={data.projects.blurb} onChange={(v) => patch((d) => void (d.projects.blurb = v))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Card open label" value={data.projects.openLabel} onChange={(v) => patch((d) => void (d.projects.openLabel = v))} />
              <Field label="Modal close label" value={data.projects.modalCloseLabel} onChange={(v) => patch((d) => void (d.projects.modalCloseLabel = v))} />
              <Field label="Modal details heading" value={data.projects.modalDetailsHeading} onChange={(v) => patch((d) => void (d.projects.modalDetailsHeading = v))} />
              <Field label="Modal stack heading" value={data.projects.modalStackHeading} onChange={(v) => patch((d) => void (d.projects.modalStackHeading = v))} />
            </div>
            {data.projects.items.map((p: ProjectItem, i) => (
              <ItemCard
                key={p.id}
                title={p.title}
                controls={
                  <RowControls
                    onUp={() => patch((d) => { const a = d.projects.items; if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]] })}
                    onDown={() => patch((d) => { const a = d.projects.items; if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]] })}
                    onRemove={() => patch((d) => void d.projects.items.splice(i, 1))}
                    upDisabled={i === 0}
                    downDisabled={i === data.projects.items.length - 1}
                  />
                }
              >
                <Field label="Title" value={p.title} onChange={(v) => patch((d) => void (d.projects.items[i].title = v))} />
                <Field label="Tagline" textarea value={p.tagline} onChange={(v) => patch((d) => void (d.projects.items[i].tagline = v))} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Image path (empty = themed placeholder)" value={p.image} onChange={(v) => patch((d) => void (d.projects.items[i].image = v))} />
                  <Field label="Image alt text" value={p.imageAlt} onChange={(v) => patch((d) => void (d.projects.items[i].imageAlt = v))} />
                </div>
                <label className="block">
                  <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-ink-soft">
                    Placeholder motif (used when image is empty)
                  </span>
                  <select
                    value={p.motif}
                    onChange={(e) => patch((d) => void (d.projects.items[i].motif = e.target.value as ProjectMotif))}
                    className="w-full rounded-md border border-line bg-surface2/60 px-3 py-2 text-sm text-ink"
                  >
                    {MOTIFS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <StringListEditor label="Tags" items={p.tags} onChange={(items) => patch((d) => void (d.projects.items[i].tags = items))} />
                <StringListEditor label="Details (modal bullet points)" items={p.details} onChange={(items) => patch((d) => void (d.projects.items[i].details = items))} />
              </ItemCard>
            ))}
            <button
              type="button"
              className={addBtn}
              onClick={() => patch((d) => void d.projects.items.push({ id: newId('proj'), title: 'New project', tagline: '', image: '', imageAlt: '', motif: 'ai', tags: [], details: [] }))}
            >
              + Add project
            </button>
          </div>
        )}

        {tab === 'Skills' && (
          <div className="space-y-4">
            <Field label="Eyebrow" value={data.skills.eyebrow} onChange={(v) => patch((d) => void (d.skills.eyebrow = v))} />
            <Field label="Heading" value={data.skills.heading} onChange={(v) => patch((d) => void (d.skills.heading = v))} />
            {data.skills.groups.map((group: SkillGroup, gi) => (
              <ItemCard
                key={group.id}
                title={group.title}
                controls={
                  <RowControls
                    onUp={() => patch((d) => { const a = d.skills.groups; if (gi > 0) [a[gi - 1], a[gi]] = [a[gi], a[gi - 1]] })}
                    onDown={() => patch((d) => { const a = d.skills.groups; if (gi < a.length - 1) [a[gi + 1], a[gi]] = [a[gi], a[gi + 1]] })}
                    onRemove={() => patch((d) => void d.skills.groups.splice(gi, 1))}
                    upDisabled={gi === 0}
                    downDisabled={gi === data.skills.groups.length - 1}
                  />
                }
              >
                <Field label="Group title" value={group.title} onChange={(v) => patch((d) => void (d.skills.groups[gi].title = v))} />
                {group.items.map((skill, si) => (
                  <div key={skill.id} className="flex items-end gap-2">
                    <div className="flex-1">
                      <Field label="Skill" value={skill.name} onChange={(v) => patch((d) => void (d.skills.groups[gi].items[si].name = v))} />
                    </div>
                    <div className="w-28">
                      <NumberField label="Level %" value={skill.level} onChange={(v) => patch((d) => void (d.skills.groups[gi].items[si].level = v))} />
                    </div>
                    <RowControls
                      onUp={() => patch((d) => { const a = d.skills.groups[gi].items; if (si > 0) [a[si - 1], a[si]] = [a[si], a[si - 1]] })}
                      onDown={() => patch((d) => { const a = d.skills.groups[gi].items; if (si < a.length - 1) [a[si + 1], a[si]] = [a[si], a[si + 1]] })}
                      onRemove={() => patch((d) => void d.skills.groups[gi].items.splice(si, 1))}
                      upDisabled={si === 0}
                      downDisabled={si === group.items.length - 1}
                    />
                  </div>
                ))}
                <button type="button" className={addBtn} onClick={() => patch((d) => void d.skills.groups[gi].items.push({ id: newId('sk'), name: 'New skill', level: 50 }))}>
                  + Add skill
                </button>
              </ItemCard>
            ))}
            <button type="button" className={addBtn} onClick={() => patch((d) => void d.skills.groups.push({ id: newId('sg'), title: 'New group', items: [] }))}>
              + Add group
            </button>
          </div>
        )}

        {tab === 'Credentials' && (
          <div className="space-y-4">
            <Field label="Eyebrow" value={data.credentials.eyebrow} onChange={(v) => patch((d) => void (d.credentials.eyebrow = v))} />
            <Field label="Heading" value={data.credentials.heading} onChange={(v) => patch((d) => void (d.credentials.heading = v))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Education column heading" value={data.credentials.educationHeading} onChange={(v) => patch((d) => void (d.credentials.educationHeading = v))} />
              <Field label="Certifications column heading" value={data.credentials.certificationsHeading} onChange={(v) => patch((d) => void (d.credentials.certificationsHeading = v))} />
            </div>
            <Field label="Focus-areas heading" value={data.credentials.focusHeading} onChange={(v) => patch((d) => void (d.credentials.focusHeading = v))} />
            <StringListEditor label="Focus areas" items={data.credentials.focusAreas} onChange={(items) => patch((d) => void (d.credentials.focusAreas = items))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Blog card heading" value={data.credentials.blogHeading} onChange={(v) => patch((d) => void (d.credentials.blogHeading = v))} />
              <Field label="Blog link label" value={data.credentials.blogLinkLabel} onChange={(v) => patch((d) => void (d.credentials.blogLinkLabel = v))} />
            </div>
            <Field label="Blog card text" textarea value={data.credentials.blogText} onChange={(v) => patch((d) => void (d.credentials.blogText = v))} />
            <Field label="Blog URL" value={data.credentials.blogHref} onChange={(v) => patch((d) => void (d.credentials.blogHref = v))} />
            <div className="space-y-2">
              <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">Education</span>
              {data.credentials.education.map((ed, i) => (
                <ItemCard
                  key={ed.id}
                  title={ed.degree}
                  controls={
                    <RowControls
                      onUp={() => patch((d) => { const a = d.credentials.education; if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]] })}
                      onDown={() => patch((d) => { const a = d.credentials.education; if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]] })}
                      onRemove={() => patch((d) => void d.credentials.education.splice(i, 1))}
                      upDisabled={i === 0}
                      downDisabled={i === data.credentials.education.length - 1}
                    />
                  }
                >
                  <Field label="Degree" value={ed.degree} onChange={(v) => patch((d) => void (d.credentials.education[i].degree = v))} />
                  <Field label="School" value={ed.school} onChange={(v) => patch((d) => void (d.credentials.education[i].school = v))} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Period" value={ed.period} onChange={(v) => patch((d) => void (d.credentials.education[i].period = v))} />
                    <Field label="Location" value={ed.location} onChange={(v) => patch((d) => void (d.credentials.education[i].location = v))} />
                  </div>
                </ItemCard>
              ))}
              <button type="button" className={addBtn} onClick={() => patch((d) => void d.credentials.education.push({ id: newId('edu'), degree: 'Degree', school: '', period: '', location: '' }))}>
                + Add degree
              </button>
            </div>
            <div className="space-y-2">
              <span className="block font-mono text-xs uppercase tracking-wider text-ink-soft">Certifications</span>
              {data.credentials.certifications.map((cert, i) => (
                <div key={cert.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label="Name" value={cert.name} onChange={(v) => patch((d) => void (d.credentials.certifications[i].name = v))} />
                  </div>
                  <div className="w-44">
                    <Field label="Issuer" value={cert.issuer} onChange={(v) => patch((d) => void (d.credentials.certifications[i].issuer = v))} />
                  </div>
                  <RowControls
                    onUp={() => patch((d) => { const a = d.credentials.certifications; if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]] })}
                    onDown={() => patch((d) => { const a = d.credentials.certifications; if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]] })}
                    onRemove={() => patch((d) => void d.credentials.certifications.splice(i, 1))}
                    upDisabled={i === 0}
                    downDisabled={i === data.credentials.certifications.length - 1}
                  />
                </div>
              ))}
              <button type="button" className={addBtn} onClick={() => patch((d) => void d.credentials.certifications.push({ id: newId('cert'), name: 'New certification', issuer: '' }))}>
                + Add certification
              </button>
            </div>
          </div>
        )}

        {tab === 'Contact' && (
          <div className="space-y-4">
            <Field label="Eyebrow" value={data.contact.eyebrow} onChange={(v) => patch((d) => void (d.contact.eyebrow = v))} />
            <Field label="Heading" value={data.contact.heading} onChange={(v) => patch((d) => void (d.contact.heading = v))} />
            <Field label="Blurb" textarea value={data.contact.blurb} onChange={(v) => patch((d) => void (d.contact.blurb = v))} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Copy button label" value={data.contact.copyLabel} onChange={(v) => patch((d) => void (d.contact.copyLabel = v))} />
              <Field label="Copied label" value={data.contact.copiedLabel} onChange={(v) => patch((d) => void (d.contact.copiedLabel = v))} />
              <Field label="Screen-reader announcement suffix" value={data.contact.copyAnnouncement} onChange={(v) => patch((d) => void (d.contact.copyAnnouncement = v))} />
              <Field label="Open-link label (LinkedIn card)" value={data.contact.openLabel} onChange={(v) => patch((d) => void (d.contact.openLabel = v))} />
            </div>
            {data.contact.cards.map((card, i) => (
              <ItemCard
                key={card.id}
                title={card.label}
                controls={
                  <RowControls
                    onUp={() => patch((d) => { const a = d.contact.cards; if (i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]] })}
                    onDown={() => patch((d) => { const a = d.contact.cards; if (i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]] })}
                    onRemove={() => patch((d) => void d.contact.cards.splice(i, 1))}
                    upDisabled={i === 0}
                    downDisabled={i === data.contact.cards.length - 1}
                  />
                }
              >
                <Field label="Label" value={card.label} onChange={(v) => patch((d) => void (d.contact.cards[i].label = v))} />
                <Field label="Value (what Copy copies)" value={card.value} onChange={(v) => patch((d) => void (d.contact.cards[i].value = v))} />
                <Field label="Display text (empty = show the value)" value={card.display} onChange={(v) => patch((d) => void (d.contact.cards[i].display = v))} />
                <Field label="Link (mailto:/tel:/https:// — empty = no link)" value={card.href} onChange={(v) => patch((d) => void (d.contact.cards[i].href = v))} />
              </ItemCard>
            ))}
            <button type="button" className={addBtn} onClick={() => patch((d) => void d.contact.cards.push({ id: newId('contact'), label: 'New card', value: '', display: '', href: '' }))}>
              + Add card
            </button>
          </div>
        )}

        {tab === 'Footer' && (
          <div className="space-y-4">
            <Field label="Copyright text (year is added automatically)" value={data.footer.text} onChange={(v) => patch((d) => void (d.footer.text = v))} />
            <Field label="Tagline" value={data.footer.tagline} onChange={(v) => patch((d) => void (d.footer.tagline = v))} />
            <Field label="Back-to-top label" value={data.footer.backToTopLabel} onChange={(v) => patch((d) => void (d.footer.backToTopLabel = v))} />
          </div>
        )}
      </main>
    </div>
  )
}
