'use client'

import { useState } from 'react'

/**
 * The simple enquiry form for the rebuilt Lomy page.
 *
 * Seven fields and nothing else — deliberately the low-friction alternative to
 * the long /prihlaska-svp registration, which teachers were not completing.
 *
 * One component, three placements: inline in section 7, inside the hero's popup,
 * and on the /prihlaska-svp/horsky-hotel-lomy page where a clicked date arrives
 * as ?termin=. Submissions go to /api/contact-svp, the endpoint the site already
 * uses, so these land in the same inbox as every other enquiry.
 */

const inputBase =
  'w-full rounded-[10px] border-2 border-[#E6E8E6] bg-white px-4 py-3 text-[17px] text-[#1F2320] outline-none transition-colors duration-200 placeholder:text-[#8A908A] focus:border-bombovo-blue disabled:opacity-60'

const labelBase = 'block text-[15px] font-semibold text-[#1F2320]'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function LomyEnquiryForm({
  initialTerm = '',
  strediskoName = 'Horský hotel Lomy',
  className = '',
}: {
  initialTerm?: string
  strediskoName?: string
  className?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [values, setValues] = useState({
    skola: '',
    pocetDeti: '',
    termin: initialTerm,
    animacny: '',
    email: '',
    telefon: '',
    poznamka: '',
  })

  const set =
    (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
      const res = await fetch('/api/contact-svp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stredisko: strediskoName,
          nazovSkoly: values.skola,
          pocetZiakov: values.pocetDeti,
          datumPrichodu: values.termin,
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
      <div className={`rounded-[12px] bg-[#E8F3EA] px-6 py-10 text-center ${className}`}>
        <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#2A7038]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 12.5 4.6 4.5L19 7.5" />
          </svg>
        </span>
        <p className="mt-4 text-[19px] font-bold text-[#1F2320]">
          Ďakujeme, ozveme sa vám čo najskôr.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={`grid gap-5 md:grid-cols-2 ${className}`}>
      <div>
        <label htmlFor="lomy-skola" className={labelBase}>
          Meno školy *
        </label>
        <input
          id="lomy-skola"
          value={values.skola}
          onChange={set('skola')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.skola ? 'border-bombovo-red' : ''}`}
        />
        {errors.skola && <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.skola}</p>}
      </div>

      <div>
        <label htmlFor="lomy-pocet" className={labelBase}>
          Počet detí (približne) *
        </label>
        <input
          id="lomy-pocet"
          inputMode="numeric"
          value={values.pocetDeti}
          onChange={set('pocetDeti')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.pocetDeti ? 'border-bombovo-red' : ''}`}
        />
        {errors.pocetDeti && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.pocetDeti}</p>
        )}
      </div>

      <div>
        <label htmlFor="lomy-termin" className={labelBase}>
          Preferovaný mesiac/termín
        </label>
        {/* Arrives pre-filled when a date row was clicked; still editable. */}
        <input
          id="lomy-termin"
          value={values.termin}
          onChange={set('termin')}
          disabled={status === 'sending'}
          placeholder="napr. máj 2027"
          className={`mt-2 ${inputBase}`}
        />
      </div>

      <div>
        <span className={labelBase}>Máte záujem o animačný program?</span>
        <div className="mt-3 flex gap-6">
          {['Áno', 'Nie'].map((opt) => (
            <label
              key={opt}
              className="inline-flex cursor-pointer items-center gap-2.5 text-[17px] text-[#1F2320]"
            >
              <input
                type="radio"
                name="lomy-animacny"
                value={opt}
                checked={values.animacny === opt}
                onChange={set('animacny')}
                disabled={status === 'sending'}
                className="h-[18px] w-[18px] accent-bombovo-blue"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="lomy-email" className={labelBase}>
          E-mail *
        </label>
        <input
          id="lomy-email"
          type="email"
          value={values.email}
          onChange={set('email')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.email ? 'border-bombovo-red' : ''}`}
        />
        {errors.email && <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="lomy-telefon" className={labelBase}>
          Telefón *
        </label>
        <input
          id="lomy-telefon"
          type="tel"
          value={values.telefon}
          onChange={set('telefon')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.telefon ? 'border-bombovo-red' : ''}`}
        />
        {errors.telefon && <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.telefon}</p>}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="lomy-poznamka" className={labelBase}>
          Poznámka
        </label>
        <textarea
          id="lomy-poznamka"
          rows={3}
          value={values.poznamka}
          onChange={set('poznamka')}
          disabled={status === 'sending'}
          className={`mt-2 resize-y ${inputBase}`}
        />
      </div>

      <div className="md:col-span-2">
        {status === 'error' && (
          <p className="mb-4 rounded-[8px] bg-[#FDECEE] px-4 py-3 text-[16px] text-bombovo-red">
            Dopyt sa nepodarilo odoslať. Skúste to prosím znova, alebo nám napíšte na
            bombovo@bombovo.sk.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-full border-2 border-white bg-bombovo-red px-8 py-3.5 text-[17px] font-bold text-white transition-transform duration-150 ease-out active:translate-y-px disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
        >
          {status === 'sending' ? 'Odosielam…' : 'ODOSLAŤ DOPYT'}
        </button>
      </div>
    </form>
  )
}
