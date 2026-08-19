'use client'

import { forwardRef, useState } from 'react'
import type { LomyForm } from '@/data/lomy/types'

/**
 * Enquiry form under the dates list, inside the same dialog.
 *
 * It is not a booking: clicking a date fills the termín field and brings the
 * person here, and the copy says as much. Submissions go to /api/contact-svp,
 * the endpoint the existing školy-v-prírode registration already uses, so these
 * land in the same inbox as every other enquiry rather than somewhere new.
 */

const inputBase =
  'w-full rounded-[10px] border-2 border-[#E6E8E6] bg-white px-4 py-3 text-[14.5px] text-bombovo-dark outline-none transition-colors duration-200 placeholder:text-[#A2A8A2] focus:border-bombovo-blue disabled:opacity-60'

const labelBase = 'block text-[13px] font-semibold text-bombovo-dark'

type Status = 'idle' | 'sending' | 'sent' | 'error'

interface Props {
  content: LomyForm
  /** Pre-filled when the person clicked a specific date row. */
  selectedTerm: string
  onTermChange: (value: string) => void
}

/* eslint-disable react/display-name */
const TerminyForm = forwardRef<HTMLDivElement, Props>(function TerminyForm(
  { content, selectedTerm, onTermChange },
  ref,
) {
  const { labels } = content
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [values, setValues] = useState({
    skola: '',
    pocetDeti: '',
    animacny: '',
    email: '',
    telefon: '',
    poznamka: '',
  })

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const next: Record<string, string> = {}
    if (!values.skola.trim()) next.skola = 'Vyplňte názov školy.'
    if (!values.pocetDeti.trim()) next.pocetDeti = 'Uveďte približný počet detí.'
    if (!values.telefon.trim()) next.telefon = 'Vyplňte telefón.'
    if (!values.email.trim()) next.email = 'Vyplňte e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = 'Skontrolujte formát e-mailu.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    try {
      // Same endpoint as the existing SVP registration, so enquiries from this
      // page arrive alongside the others. Its required fields are stredisko,
      // telefon and email; the rest map onto what it already renders.
      const res = await fetch('/api/contact-svp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stredisko: 'Horský hotel Lomy',
          nazovSkoly: values.skola,
          pocetZiakov: values.pocetDeti,
          datumPrichodu: selectedTerm,
          telefon: values.telefon,
          email: values.email,
          animacnyProgram: values.animacny || 'neuvedené',
          poznamka: values.poznamka,
        }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div ref={ref} className="border-t border-[#EAECEA] bg-[#FBFCFB] px-6 py-10 text-center md:px-9">
        <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E8F3EA]">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#2A7038]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 12.5 4.6 4.5L19 7.5" />
          </svg>
        </span>
        <p className="mt-4 text-[18px] font-bold text-bombovo-dark">{content.successTitle}</p>
        <p className="mt-1.5 text-[14px] text-[#5C625C]">{content.successBody}</p>
      </div>
    )
  }

  return (
    <div ref={ref} className="border-t border-[#EAECEA] bg-[#FBFCFB] px-6 py-8 md:px-9 md:py-10">
      <h3 className="text-[20px] font-bold text-bombovo-dark md:text-[24px]">{content.title}</h3>
      <p className="mt-1.5 max-w-[62ch] text-[14px] leading-[1.6] text-[#5C625C]">{content.intro}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="lomy-skola" className={labelBase}>
            {labels.skola} *
          </label>
          <input
            id="lomy-skola"
            value={values.skola}
            onChange={set('skola')}
            disabled={status === 'sending'}
            className={`mt-1.5 ${inputBase} ${errors.skola ? 'border-bombovo-red' : ''}`}
          />
          {errors.skola && <p className="mt-1 text-[12px] text-bombovo-red">{errors.skola}</p>}
        </div>

        <div>
          <label htmlFor="lomy-pocet" className={labelBase}>
            {labels.pocetDeti} *
          </label>
          <input
            id="lomy-pocet"
            inputMode="numeric"
            value={values.pocetDeti}
            onChange={set('pocetDeti')}
            disabled={status === 'sending'}
            className={`mt-1.5 ${inputBase} ${errors.pocetDeti ? 'border-bombovo-red' : ''}`}
          />
          {errors.pocetDeti && <p className="mt-1 text-[12px] text-bombovo-red">{errors.pocetDeti}</p>}
        </div>

        <div>
          <label htmlFor="lomy-termin" className={labelBase}>
            {labels.termin}
          </label>
          {/* Filled in when a date row is clicked, still editable by hand. */}
          <input
            id="lomy-termin"
            value={selectedTerm}
            onChange={(e) => onTermChange(e.target.value)}
            disabled={status === 'sending'}
            placeholder="napr. máj 2027"
            className={`mt-1.5 ${inputBase}`}
          />
        </div>

        <div>
          <span className={labelBase}>{labels.animacny}</span>
          <div className="mt-2.5 flex gap-5">
            {['Áno', 'Nie'].map((opt) => (
              <label key={opt} className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-bombovo-dark">
                <input
                  type="radio"
                  name="lomy-animacny"
                  value={opt}
                  checked={values.animacny === opt}
                  onChange={set('animacny')}
                  disabled={status === 'sending'}
                  className="h-4 w-4 accent-bombovo-blue"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="lomy-email" className={labelBase}>
            {labels.email} *
          </label>
          <input
            id="lomy-email"
            type="email"
            value={values.email}
            onChange={set('email')}
            disabled={status === 'sending'}
            className={`mt-1.5 ${inputBase} ${errors.email ? 'border-bombovo-red' : ''}`}
          />
          {errors.email && <p className="mt-1 text-[12px] text-bombovo-red">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="lomy-telefon" className={labelBase}>
            {labels.telefon} *
          </label>
          <input
            id="lomy-telefon"
            type="tel"
            value={values.telefon}
            onChange={set('telefon')}
            disabled={status === 'sending'}
            className={`mt-1.5 ${inputBase} ${errors.telefon ? 'border-bombovo-red' : ''}`}
          />
          {errors.telefon && <p className="mt-1 text-[12px] text-bombovo-red">{errors.telefon}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="lomy-poznamka" className={labelBase}>
            {labels.poznamka}
          </label>
          <textarea
            id="lomy-poznamka"
            rows={3}
            value={values.poznamka}
            onChange={set('poznamka')}
            disabled={status === 'sending'}
            className={`mt-1.5 resize-y ${inputBase}`}
          />
        </div>

        <div className="md:col-span-2">
          {status === 'error' && (
            <p className="mb-3 rounded-[8px] bg-[#FDECEE] px-4 py-3 text-[13px] text-bombovo-red">
              Dopyt sa nepodarilo odoslať. Skúste to prosím znova, alebo nám napíšte na
              bombovo@bombovo.sk.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-full border-2 border-white bg-bombovo-red px-8 py-3.5 text-[15px] font-bold text-white transition-transform duration-150 ease-out active:translate-y-px disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
          >
            {status === 'sending' ? 'Odosielam…' : content.submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
})

export default TerminyForm
