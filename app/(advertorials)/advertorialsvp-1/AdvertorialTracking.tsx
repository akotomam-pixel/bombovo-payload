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
