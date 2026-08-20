'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Bar that follows the scroll once the hero's own price card is out of view.
 *
 * It carries no specific date on purpose — "Termíny" as a label, the standing
 * price, and one action — so it stays true whichever dates are still open. The
 * behaviour is borrowed (appear on scroll, stay fixed, compact horizontal row);
 * the styling is this page's own.
 *
 * It replaces the hero's mobile action bar rather than sitting beside it: two
 * fixed bars at the bottom of a phone screen would stack on each other.
 */
export default function StickyBar({
  label,
  cta,
  price,
  discounted,
  unit,
  href,
}: {
  label: string
  cta: string
  price: string
  discounted: string
  unit: string
  href: string
}) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // Appears once the page has scrolled past roughly the hero.
    const onScroll = () => setShown(window.scrollY > 620)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E8E6] bg-white/95 backdrop-blur-md transition-transform duration-300 ease-out ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <span className="hidden shrink-0 text-[13px] font-bold uppercase tracking-[0.12em] text-[#5C625C] sm:block">
            {label}
          </span>

          <span aria-hidden className="hidden h-8 w-px shrink-0 bg-[#E6E8E6] sm:block" />

          <p className="flex min-w-0 items-baseline gap-2">
            <span className="text-[14px] font-medium text-[#9AA09A] line-through decoration-bombovo-red tabular-nums sm:text-[15px]">
              {price}
            </span>
            <span className="text-[20px] font-black leading-none text-bombovo-dark tabular-nums sm:text-[23px]">
              {discounted}
            </span>
            <span className="whitespace-nowrap text-[13px] text-[#5C625C]">{unit}</span>
          </p>
        </div>

        <Link
          href={href}
          className="shrink-0 rounded-full border-2 border-white bg-bombovo-red px-5 py-2.5 text-center text-[13px] font-bold text-white transition-transform duration-150 ease-out active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue sm:px-7 sm:py-3 sm:text-[14px]"
        >
          {cta}
        </Link>
      </div>
    </div>
  )
}
