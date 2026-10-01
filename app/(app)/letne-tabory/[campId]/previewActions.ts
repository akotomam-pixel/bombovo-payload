'use server'

import { cookies } from 'next/headers'
import { PREVIEW_COOKIE, PREVIEW_PASSWORD } from '@/lib/campPreviewGate'

export async function unlockCampPreview(password: string): Promise<boolean> {
  if (password.trim() !== PREVIEW_PASSWORD) return false

  const cookieStore = await cookies()
  cookieStore.set(PREVIEW_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/letne-tabory',
    maxAge: 60 * 60 * 24 * 30,
  })
  return true
}
