'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

/**
 * "Sledovať dostupnosť" — button + modal shown on a sold-out termín row.
 * Stredisko and termín are already known from which row's button was
 * clicked, so the modal only ever asks for the teacher's own contact details.
 *
 * The modal headline/subheadline are final, approved copy. Everything else
 * marked TEMP below is still placeholder — Matej is writing that wording
 * separately. Swap those three constants when it lands; nothing else needs
 * to change.
 */
const TEMP_BUTTON_LABEL = 'Sledovať dostupnosť'
const MODAL_HEADLINE = 'Máte záujem o tento termín?'
const MODAL_SUBHEADLINE = 'Vyplňte svoje údaje a my vám dáme vedieť, keď sa termín uvoľní.'
const TEMP_SUBMIT_LABEL = 'Odoslať'
const TEMP_CONFIRMATION = 'Ďakujeme, ozveme sa vám.'

const inputBase =
  'w-full rounded-[10px] border-2 border-[#E6E8E6] bg-white px-4 py-3 text-[16px] text-[#1F2320] outline-none transition-colors duration-200 placeholder:text-[#8A908A] focus:border-bombovo-blue disabled:opacity-60'

const labelBase = 'block text-[14px] font-semibold text-[#1F2320]'

/** Splits "Ján Novák" into { meno: "Ján", priezvisko: "Novák" } — the last word is the surname. */
function splitName(full: string): { meno: string; priezvisko: string } {
  const parts = full.trim().split(/\s+/)
  if (parts.length === 1) return { meno: parts[0], priezvisko: '' }
  return { meno: parts.slice(0, -1).join(' '), priezvisko: parts[parts.length - 1] }
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

function WaitlistDialog({
  strediskoId,
  terminLabel,
  onClose,
}: {
  strediskoId: string | number
  terminLabel: string
  onClose: () => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [telefon, setTelefon] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => closeRef.current?.focus())
  }, [])

  const stop = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!fullName.trim()) next.fullName = 'Vyplňte meno a priezvisko.'
    if (!email.trim()) next.email = 'Vyplňte e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = 'Skontrolujte formát e-mailu.'
    if (!telefon.trim()) next.telefon = 'Vyplňte telefónne číslo.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    const { meno, priezvisko } = splitName(fullName)
    try {
      const res = await fetch('/api/waitlist-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meno,
          priezvisko,
          email: email.trim(),
          telefon: telefon.trim(),
          strediskoId,
          termin: terminLabel,
        }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={MODAL_HEADLINE}
    >
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-[#080708]/65 backdrop-blur-[3px]" />

      <div
        ref={panelRef}
        onClick={stop}
        className="relative flex max-h-[92vh] w-full flex-col overflow-y-auto rounded-t-[18px] bg-white p-6 shadow-[0_30px_80px_-24px_rgba(8,7,8,0.5)] sm:max-w-[440px] sm:rounded-[18px] sm:p-7"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Zavrieť"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F5F4] text-bombovo-dark transition-colors duration-150 hover:bg-[#E6E8E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden>
            <path d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E8F3EA]">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#2A7038]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m5 12.5 4.6 4.5L19 7.5" />
              </svg>
            </span>
            <p className="mt-4 text-[18px] font-bold text-bombovo-dark">{TEMP_CONFIRMATION}</p>
          </div>
        ) : (
          <>
            <h2 className="pr-8 text-[21px] font-bold leading-snug tracking-[-0.01em] text-bombovo-dark">
              {MODAL_HEADLINE}
            </h2>
            <p className="mt-1.5 pr-8 text-[17px] font-bold leading-snug text-bombovo-dark">{MODAL_SUBHEADLINE}</p>
            <p className="mt-2 text-[14px] text-[#6B716B]">{terminLabel}</p>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <label htmlFor="waitlist-name" className={labelBase}>
                  Meno a priezvisko
                </label>
                <input
                  id="waitlist-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={status === 'sending'}
                  className={`mt-1.5 ${inputBase} ${errors.fullName ? 'border-bombovo-red' : ''}`}
                />
                {errors.fullName && <p className="mt-1 text-[13px] text-bombovo-red">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="waitlist-email" className={labelBase}>
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'sending'}
                  className={`mt-1.5 ${inputBase} ${errors.email ? 'border-bombovo-red' : ''}`}
                />
                {errors.email && <p className="mt-1 text-[13px] text-bombovo-red">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="waitlist-telefon" className={labelBase}>
                  Telefónne číslo
                </label>
                <input
                  id="waitlist-telefon"
                  type="tel"
                  value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  disabled={status === 'sending'}
                  className={`mt-1.5 ${inputBase} ${errors.telefon ? 'border-bombovo-red' : ''}`}
                />
                {errors.telefon && <p className="mt-1 text-[13px] text-bombovo-red">{errors.telefon}</p>}
              </div>

              {status === 'error' && (
                <p className="rounded-[8px] bg-[#FDECEE] px-4 py-3 text-[14px] text-bombovo-red">
                  Nepodarilo sa odoslať. Skúste to prosím znova.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full border-2 border-white bg-bombovo-red px-6 py-3 text-[16px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(180,20,20,0.45)] transition-transform duration-150 ease-out active:translate-y-px disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
              >
                {status === 'sending' ? 'Odosielam…' : TEMP_SUBMIT_LABEL}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

/** Bell glyph for the trigger button — a watch/notify affordance next to the label. */
function BellIcon({ compact }: { compact: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={compact ? 'h-3.5 w-3.5 shrink-0' : 'h-[18px] w-[18px] shrink-0'}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export default function WaitlistWidget({
  strediskoId,
  terminLabel,
  compact = false,
  /** 'outline' (default) is the original blue-outline pill. 'solid' is a filled brand-blue button sized to match the site's other primary CTA pills (e.g. TerminyModal's REZERVOVAŤ) — used where a sold-out row's status badge was removed and this became the row's one action. */
  variant = 'outline',
  className = '',
}: {
  /** The stredisko's Payload document id — every rebuilt-architecture stredisko still has one, used only for photos, matched by slug. */
  strediskoId: string | number
  /** Exact date-range text as shown on the row, e.g. "13.04.2026 - 17.04.2026". Carried silently; never shown as a field in the modal. */
  terminLabel: string
  compact?: boolean
  variant?: 'outline' | 'solid'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const shape = compact
    ? 'shrink-0 rounded-full border-2 px-3.5 py-1.5 text-center text-[12px] font-bold'
    : 'shrink-0 rounded-full border-2 px-6 py-3 text-center text-[17px] font-bold'

  const colors =
    variant === 'solid'
      ? 'border-white bg-bombovo-blue text-white'
      : 'border-bombovo-blue bg-white text-bombovo-blue transition-colors duration-150 ease-out hover:bg-bombovo-blue hover:text-white'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${shape} ${colors} inline-flex items-center justify-center gap-1.5 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue ${className}`}
      >
        <BellIcon compact={compact} />
        {TEMP_BUTTON_LABEL}
      </button>

      {mounted && open && (
        <WaitlistDialog strediskoId={strediskoId} terminLabel={terminLabel} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
