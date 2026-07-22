import { promises as fs } from 'fs'
import path from 'path'
import type { SiteContent } from '@/types/content'

export const CONTENT_PATH = path.join(process.cwd(), 'content', 'site-content.json')

/**
 * Read the content JSON fresh from disk on every call. Pages using this must
 * export `dynamic = "force-dynamic"` so admin edits appear without a rebuild.
 */
export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, 'utf-8')
  return JSON.parse(raw) as SiteContent
}
