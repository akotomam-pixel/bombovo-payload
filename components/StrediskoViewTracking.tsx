'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function StrediskoViewTracking({
  strediskoSlug,
  strediskoName,
}: {
  strediskoSlug: string
  strediskoName: string
}) {
  useEffect(() => {
    posthog.capture('stredisko_viewed', { stredisko_slug: strediskoSlug, stredisko_name: strediskoName })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
