import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { ADMIN_COOKIE, isAuthorized } from '@/lib/auth'
import { CONTENT_PATH } from '@/lib/content'

const CONTENT_REPO_PATH = 'content/site-content.json'
const READ_ONLY_CODES = new Set(['EROFS', 'EACCES', 'EPERM'])

// Serialize concurrent saves: each request chains onto the previous write.
let writeChain: Promise<unknown> = Promise.resolve()

class GitHubSaveError extends Error {}

/**
 * Fallback for read-only hosts (Vercel): commit the JSON to the repo via the
 * GitHub Contents API. The connected host redeploys on push, and the site
 * reads the file per-request, so the commit becomes live content in ~1 min.
 * The token never leaves the server.
 */
async function saveToGitHub(serialized: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'

  if (!token || !repo) {
    throw new GitHubSaveError(
      'This host has a read-only filesystem and the GitHub fallback is not configured. ' +
        'Set GITHUB_TOKEN and GITHUB_REPO (and optionally GITHUB_BRANCH) in the host environment ' +
        'variables and redeploy — or use "Export JSON" and update the repo manually.',
    )
  }

  const url = `https://api.github.com/repos/${repo}/contents/${CONTENT_REPO_PATH}`
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-admin-editor',
  }

  // Current file sha is required to update; a 404 means we create it fresh.
  const getRes = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, {
    headers,
    cache: 'no-store',
  })
  let sha: string | undefined
  if (getRes.ok) {
    const info = (await getRes.json()) as { sha?: string }
    sha = info.sha
  } else if (getRes.status !== 404) {
    const detail = await getRes.text().catch(() => '')
    throw new GitHubSaveError(
      `GitHub rejected the read (${getRes.status}). Check that GITHUB_TOKEN has Contents read/write ` +
        `access to ${repo} and that GITHUB_REPO/GITHUB_BRANCH are correct. ${detail.slice(0, 200)}`,
    )
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: 'Update site content via admin editor',
      content: Buffer.from(serialized, 'utf-8').toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    }),
  })

  if (!putRes.ok) {
    const detail = (await putRes.json().catch(() => ({}))) as { message?: string }
    throw new GitHubSaveError(
      `GitHub rejected the commit (${putRes.status}${detail.message ? `: ${detail.message}` : ''}). ` +
        'Check the token permissions (Contents → Read and write) and repo/branch settings.',
    )
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  // Minimal shape guard — the admin always posts the full document.
  if (
    typeof body !== 'object' ||
    body === null ||
    !('meta' in body) ||
    !('hero' in body) ||
    !('nav' in body)
  ) {
    return NextResponse.json({ error: 'Payload does not look like site content.' }, { status: 400 })
  }

  const serialized = JSON.stringify(body, null, 2) + '\n'

  const doWrite = async () => {
    // Atomic local write: temp file in the same directory, then rename —
    // readers never see truncated JSON.
    const tmp = `${CONTENT_PATH}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tmp, serialized, 'utf-8')
    await fs.rename(tmp, CONTENT_PATH)
  }

  const attempt = writeChain.then(doWrite, doWrite)
  writeChain = attempt.catch(() => {})

  try {
    await attempt
    return NextResponse.json({ ok: true, mode: 'file' })
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (!code || !READ_ONLY_CODES.has(code)) {
      return NextResponse.json({ error: `Save failed: ${String(err)}` }, { status: 500 })
    }

    // Read-only filesystem → commit back to the repo instead.
    try {
      await saveToGitHub(serialized)
      return NextResponse.json({
        ok: true,
        mode: 'github',
        message: 'Saved to GitHub — the host is redeploying; changes go live in a minute or two.',
      })
    } catch (ghErr) {
      const msg =
        ghErr instanceof GitHubSaveError ? ghErr.message : `GitHub save failed: ${String(ghErr)}`
      return NextResponse.json({ error: msg }, { status: 500 })
    }
  }
}
