'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  })

  // ?internal=1 marks this browser as our own traffic; register() persists it
  // so every later event carries is_internal. ?internal=0 clears it.
  const internal = new URLSearchParams(window.location.search).get('internal')
  if (internal === '1') posthog.register({ is_internal: true })
  else if (internal === '0') posthog.unregister('is_internal')
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}
