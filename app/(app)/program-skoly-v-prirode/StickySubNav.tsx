'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Section-jump sub-nav, appearing once the picker has scrolled out of view.
 *
 * Behaviour is borrowed from the stredisko page's StickyBar (appear past a
 * scroll threshold, fixed, slide-in transition) — here at the top of the
 * viewport and carrying navigation instead of price and a CTA. The active
 * section is tracked with IntersectionObserver so the current pill stays
 * legible while scrolling, not just a static row of links.
 *
 * On mobile the row is simply left to scroll horizontally rather than
 * collapsing into a dropdown or accordion — hiding the destinations behind
 * an extra tap works against the whole point of a fast section jump.
 */
export default function StickySubNav({
  items,
}: {
  items: { id: string; label: string }[]
}) {
  const [shown, setShown] = useState(false)
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 560)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const sectionIds = useRef(items.map((i) => i.id))
  useEffect(() => {
    const sections = sectionIds.current
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
          setActive(topMost.target.id)
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b border-[#E6E8E6] bg-white/95 backdrop-blur-md transition-transform duration-300 ease-out ${
        shown ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav
        aria-label="Skoč na program pre váš ročník"
        className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:justify-center sm:px-6 lg:px-8"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`shrink-0 whitespace-nowrap rounded-full border-2 px-4 py-2 text-[14px] font-bold transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue ${
              active === item.id
                ? 'border-bombovo-dark bg-bombovo-yellow text-bombovo-dark'
                : 'border-[#E6E8E6] bg-white text-[#3A403A] hover:border-bombovo-dark'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
