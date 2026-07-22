import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { ADMIN_COOKIE, isAuthorized } from '@/lib/auth'
import { CONTENT_PATH } from '@/lib/content'

// Serialize concurrent saves: each request chains onto the previous write.
let writeChain: Promise<unknown> = Promise.resolve()

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
    // Atomic write: temp file in the same directory, then rename.
    const tmp = `${CONTENT_PATH}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tmp, serialized, 'utf-8')
    await fs.rename(tmp, CONTENT_PATH)
  }

  const attempt = writeChain.then(doWrite, doWrite)
  writeChain = attempt.catch(() => {})

  try {
    await attempt
    return NextResponse.json({ ok: true })
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code === 'EROFS' || code === 'EACCES' || code === 'EPERM') {
      return NextResponse.json(
        {
          error:
            'The filesystem is read-only (this is expected on Vercel). Use "Export JSON", replace content/site-content.json in the repo, and push to deploy the change.',
        },
        { status: 500 },
      )
    }
    return NextResponse.json({ error: `Save failed: ${String(err)}` }, { status: 500 })
  }
}
