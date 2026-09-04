'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function AdvertorialTracking({
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  fbclid,
}: {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  fbclid: string
}) {
  useEffect(() => {
    posthog.capture('advertorial_viewed', {
      advertorial: 'advertorialsvp-1',
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      fbclid,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[data-advertorial-cta]')
    const handleClick = () => posthog.capture('advertorial_clicked', { advertorial: 'advertorialsvp-1' })
    links.forEach((link) => link.addEventListener('click', handleClick))
    return () => links.forEach((link) => link.removeEventListener('click', handleClick))
  }, [])

  return null
}
