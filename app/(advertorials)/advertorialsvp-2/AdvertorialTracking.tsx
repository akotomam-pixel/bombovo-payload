'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function AdvertorialTracking({
  advertorial,
  destination,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  fbclid,
}: {
  advertorial: string
  destination: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  fbclid: string
}) {
  useEffect(() => {
    // Super property: attached to every later event from this browser (incl. the
    // Lagáň landing page funnel), so PostHog can filter the funnel by advertorial.
    posthog.register({ from_advertorial: advertorial })
    posthog.capture('advertorial_viewed', {
      advertorial,
      destination,
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
    const handleClick = (e: Event) => {
      const cta_position = (e.currentTarget as HTMLElement).dataset.advertorialCta || 'unknown'
      posthog.capture('advertorial_clicked', { advertorial, destination, cta_position })
    }
    links.forEach((link) => link.addEventListener('click', handleClick))
    return () => links.forEach((link) => link.removeEventListener('click', handleClick))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Always shows today's date next to the byline.
  useEffect(() => {
    const el = document.getElementById('byline-date')
    if (!el) return
    const months = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra']
    const d = new Date()
    el.textContent = `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`
  }, [])

  // Reveals the sticky bottom CTA bar once the reader scrolls past #scroll-trigger.
  useEffect(() => {
    const trigger = document.getElementById('scroll-trigger')
    const bar = document.getElementById('sticky-cta')
    if (!trigger || !bar) return
    let shown = false
    const onScroll = () => {
      const rect = trigger.getBoundingClientRect()
      if (!shown && rect.top < 0) {
        bar.classList.add('visible')
        shown = true
      } else if (shown && rect.top >= 0) {
        bar.classList.remove('visible')
        shown = false
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
