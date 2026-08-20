'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import LomyEnquiryForm from '@/components/LomyEnquiryForm'

/**
 * Popup holding the enquiry form, opened by the hero's "Získať cenovú ponuku".
 *
 * Same interaction as the termíny dialog — portal to body, backdrop click,
 * Escape, focus trap, scroll lock — so the two behave identically. It carries no
 * date: this button is not tied to one.
 */
export default function PonukaModal({
  heading,
  open,
  onClose,
  strediskoName,
}: {
  heading: string
  open: boolean
  onClose: () => void
  strediskoName: string
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (open) {
      setVisible(true)
      return
    }
    const t = setTimeout(() => setVisible(false), 200)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [open])

  useEffect(() => {
    if (open) requestAnimationFrame(() => closeRef.current?.focus())
  }, [open])

  const stop = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  if (!mounted || (!open && !visible)) return null

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
    >
      <div
        onClick={onClose}
        aria-hidden
        className={`absolute inset-0 bg-[#080708]/65 backdrop-blur-[3px] transition-opacity duration-200 ease-out ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={panelRef}
        onClick={stop}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[18px] bg-white shadow-[0_30px_80px_-24px_rgba(8,7,8,0.5)] transition-[opacity,transform] duration-200 ease-out sm:max-h-[88vh] sm:max-w-[760px] sm:rounded-[18px] ${
          open ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-3 opacity-0 sm:translate-y-0 sm:scale-[0.97]'
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 bg-bombovo-gray px-6 py-5 sm:px-8">
          <h2
            className="text-[24px] leading-tight text-bombovo-dark sm:text-[28px] font-bold"
            style={{ fontFamily: 'var(--font-subhead), "Comic Sans MS", cursive' }}
          >
            {heading}
          </h2>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Zavrieť"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-bombovo-dark transition-[background-color,transform] duration-150 ease-out hover:bg-white active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-8">
          <LomyEnquiryForm strediskoName={strediskoName} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
