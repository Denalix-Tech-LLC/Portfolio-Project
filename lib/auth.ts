import { createHash, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE = 'pk_admin_token'

/** sha256 of the admin password — stored in an httpOnly cookie as the session token. */
export function tokenFor(password: string): string {
  return createHash('sha256').update(`portfolio-admin::${password}`).digest('hex')
}

export function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return null
  return tokenFor(pw)
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export function isAuthorized(cookieValue: string | undefined): boolean {
  const expected = expectedToken()
  if (!expected || !cookieValue) return false
  return safeEqual(cookieValue, expected)
}
