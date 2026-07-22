import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { ADMIN_COOKIE, isAuthorized } from '@/lib/auth'
import { CONTENT_PATH } from '@/lib/content'

export async function GET(req: NextRequest) {
  if (!isAuthorized(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const raw = await fs.readFile(CONTENT_PATH, 'utf-8')
  return new NextResponse(raw, { headers: { 'Content-Type': 'application/json' } })
}
