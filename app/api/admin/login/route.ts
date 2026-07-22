import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, expectedToken, tokenFor, safeEqual } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const expected = expectedToken()
  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured on the server.' },
      { status: 500 },
    )
  }

  let password = ''
  try {
    const body = await req.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!password || !safeEqual(tokenFor(password), expected)) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  })
  return res
}
