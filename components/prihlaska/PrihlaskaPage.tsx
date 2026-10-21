'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  PiArrowDownBold,
  PiArrowLeftBold,
  PiCaretDownBold,
  PiCheckBold,
  PiCopyBold,
  PiSealCheckDuotone,
  PiXCircleBold,
} from 'react-icons/pi'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  EMPTY_DATA,
  IBAN,
  MIESTO,
  PRIHLASKA,
  VZDELANIE_OPTIONS,
  paymentNote,
  validatePrihlaska,
  type PrihlaskaConfig,
  type PrihlaskaData,
  type PrihlaskaRole,
} from '@/lib/prihlaska/config'

/*
  Shared layout for /prihlaska-animator and /prihlaska-zdravotnik. Same visual
  language as /pridaj-sa-do-timu: Poppins body, Comic Neue sub-headings, the
  tilted role-coloured word box from the hero, and red = animátor,
  yellow = zdravotník throughout.
*/

/** Sub-headings across the newer pages are set in this face (Comic Neue). */
const SUBHEAD = 'var(--font-subhead), "Comic Sans MS", cursive'

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3772FF]'

const ROLE_STYLE: Record<
  PrihlaskaRole,
  { accent: string; onAccent: string; tint: string; soft: string; button: string }
> = {
  animator: {
    accent: '#DF2935',
    onAccent: '#FFFFFF',
    tint: '#FCDDDF',
    soft: '#FEF1F1',
    button:
      'bg-[#DF2935] text-white shadow-[0_3px_0_0_#A81B24,0_10px_22px_-10px_rgba(223,41,53,0.7)] ' +
      'hover:bg-[#CC2430] hover:shadow-[0_3px_0_0_#A81B24,0_16px_28px_-12px_rgba(223,41,53,0.8)] ' +
      'active:translate-y-[3px] active:shadow-[0_0_0_0_#A81B24,0_6px_14px_-10px_rgba(223,41,53,0.65)]',
  },
  zdravotnik: {
    accent: '#FDCA40',
    onAccent: '#080708',
    tint: '#FEF1CC',
    soft: '#FFF8E3',
    button:
      'bg-[#FDCA40] text-bombovo-dark shadow-[0_3px_0_0_#C99A16,0_10px_22px_-10px_rgba(201,154,22,0.75)] ' +
      'hover:bg-[#F5BD1F] hover:shadow-[0_3px_0_0_#C99A16,0_16px_28px_-12px_rgba(201,154,22,0.85)] ' +
      'active:translate-y-[3px] active:shadow-[0_0_0_0_#C99A16,0_6px_14px_-10px_rgba(201,154,22,0.7)]',
  },
}

const inputBase =
  'mt-2 w-full rounded-[12px] border-2 bg-white px-4 py-3 text-[16px] text-[#1F2320] outline-none ' +
  'transition-[border-color,box-shadow] duration-150 placeholder:text-[#9AA09A] ' +
  'hover:border-[#C9CEC9] focus:border-[#3772FF] focus:shadow-[0_0_0_4px_rgba(55,114,255,0.14)] disabled:opacity-60'

const ERROR_ORDER: (keyof PrihlaskaData)[] = [
  'termin',
  'titul',
  'meno',
  'priezvisko',
  'datumNarodenia',
  'adresa',
  'psc',
  'mesto',
  'telefon',
  'email',
  'vzdelanie',
  'strava',
  'gdpr',
]

/* ─── Small building blocks ─────────────────────────────────────────────── */

/** Shows `[DOPLNIŤ…]` markers highlighted so missing copy is easy to spot. */
function WithMarkers({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <mark key={i} className="rounded-[4px] bg-[#3772FF]/12 px-1 font-semibold text-[#2A55C0]">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

function SectionHeading({ n, children, accent, onAccent }: { n: number; children: ReactNode; accent: string; onAccent: string }) {
  return (
    <h2 className="flex items-center gap-3 text-[22px] font-bold leading-tight text-bombovo-dark md:text-[24px]" style={{ fontFamily: SUBHEAD }}>
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-[15px] font-bold"
        style={{ backgroundColor: accent, color: onAccent }}
      >
        {n}
      </span>
      {children}
    </h2>
  )
}

type FieldProps = {
  id: string
  label: string
  optional?: boolean
  error?: string
  hint?: string
  className?: string
  children: (a11y: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; className: string }) => ReactNode
}

/** Label + control + inline error. The control is rendered by the caller with the wiring passed in. */
function Field({ id, label, optional, error, hint, className = '', children }: FieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[15px] font-semibold text-[#1F2320]">
        {label}
        {optional && <span className="ml-1.5 font-normal text-[#8A908A]">(nepovinné)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[13.5px] leading-[1.5] text-[#6B716B]">
          {hint}
        </p>
      )}
      {children({
        id,
        'aria-invalid': !!error,
        'aria-describedby': describedBy,
        className: `${inputBase} ${error ? 'border-[#DF2935]' : 'border-[#E1E4E1]'}`,
      })}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[14px] font-medium text-[#C21F2B]">
          {error}
        </p>
      )}
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <PiCaretDownBold
      aria-hidden
      className={`h-5 w-5 shrink-0 text-bombovo-dark transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
        open ? 'rotate-180' : ''
      }`}
    />
  )
}

/** Copies text and shows "Skopírované ✓" for 2 seconds. */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Skopírované' : `Kopírovať ${label}`}
      className={
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-bombovo-dark bg-white px-3.5 py-1.5 text-[14px] font-semibold text-bombovo-dark ' +
        'transition-[transform,background-color] duration-150 hover:bg-[#F3F4F3] active:scale-[0.96] ' +
        FOCUS
      }
    >
      {copied ? (
        'Skopírované ✓'
      ) : (
        <>
          <PiCopyBold aria-hidden className="h-4 w-4" /> Kopírovať
        </>
      )}
    </button>
  )
}

/* ─── Success state ─────────────────────────────────────────────────────── */

function Success({ role, data }: { role: PrihlaskaRole; data: PrihlaskaData }) {
  const cfg = PRIHLASKA[role]
  const style = ROLE_STYLE[role]
  const headingRef = useRef<HTMLHeadingElement>(null)
  const note = paymentNote(data)

  useEffect(() => {
    headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="text-center sm:text-left">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-28 md:scroll-mt-40 text-[clamp(1.9rem,4.5vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] text-bombovo-dark outline-none"
      >
        Si prihlásený/á! 🎉
      </h2>
      <p className="mt-3 text-[17px] leading-[1.7] text-[#1F2320]">
        Poslali sme ti email so všetkými údajmi. Pozri aj priečinok Spam/Promo.
      </p>

      <div className="mt-7 rounded-[20px] p-5 text-left sm:p-6" style={{ backgroundColor: style.soft }}>
        <p className="text-[20px] font-bold text-bombovo-dark" style={{ fontFamily: SUBHEAD }}>
          Platba za školenie
        </p>
        <dl className="mt-4 divide-y divide-[#080708]/10">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[15px] text-[#6B716B]">Suma</dt>
            <dd className="text-[19px] font-bold text-bombovo-dark">{cfg.fee} €</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
            <div>
              <dt className="text-[15px] text-[#6B716B]">IBAN</dt>
              <dd className="mt-0.5 font-mono text-[16px] font-semibold tracking-[0.02em] text-bombovo-dark">{IBAN}</dd>
            </div>
            <CopyButton value={IBAN.replace(/\s/g, '')} label="IBAN" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
            <div>
              <dt className="text-[15px] text-[#6B716B]">Poznámka k platbe</dt>
              <dd className="mt-0.5 text-[16px] font-semibold text-bombovo-dark">{note}</dd>
            </div>
            <CopyButton value={note} label="poznámku k platbe" />
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[15px] text-[#6B716B]">Splatnosť</dt>
            <dd className="text-[16px] font-semibold text-bombovo-dark">do 14 dní</dd>
          </div>
        </dl>
      </div>

      <p className="mt-7 text-[22px] font-bold text-bombovo-dark" style={{ fontFamily: SUBHEAD }}>
        Tešíme sa na teba na Lomoch!
      </p>
    </div>
  )
}

/* ─── The form ──────────────────────────────────────────────────────────── */

function PrihlaskaForm({ role, onSuccess }: { role: PrihlaskaRole; onSuccess: (d: PrihlaskaData) => void }) {
  const cfg = PRIHLASKA[role]
  const style = ROLE_STYLE[role]
  const uid = useId()
  const fid = (k: string) => `${uid}-${k}`

  const [data, setData] = useState<PrihlaskaData>(() => ({
    ...EMPTY_DATA,
    termin: cfg.terminy.length === 1 ? cfg.terminy[0] : '',
  }))
  const [touched, setTouched] = useState<Partial<Record<keyof PrihlaskaData, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [serverError, setServerError] = useState('')

  const allErrors = validatePrihlaska(role, data)
  const err = (k: keyof PrihlaskaData) => (submitted || touched[k] ? allErrors[k] : undefined)

  const set = <K extends keyof PrihlaskaData>(k: K, v: PrihlaskaData[K]) => setData((d) => ({ ...d, [k]: v }))
  const blur = (k: keyof PrihlaskaData) => () => setTouched((t) => ({ ...t, [k]: true }))
  const text = (k: keyof PrihlaskaData) => ({
    name: k,
    value: data[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(k, e.target.value),
    onBlur: blur(k),
    disabled: sending,
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setServerError('')
    const first = ERROR_ORDER.find((k) => allErrors[k])
    if (first) {
      const el =
        first === 'termin'
          ? document.querySelector<HTMLInputElement>(`input[name="${uid}-termin"]`)
          : document.getElementById(fid(first))
      el?.focus()
      return
    }
    setSending(true)
    try {
      const res = await fetch(`/api/contact-${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(String(res.status))
      onSuccess(data)
    } catch {
      setServerError('Prihlášku sa nepodarilo odoslať. Skús to znova alebo nám napíš na bombovo@bombovo.sk.')
      setSending(false)
    }
  }

  const terminError = err('termin')

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* ── A: training date ── */}
      <fieldset aria-describedby={terminError ? fid('termin-err') : undefined}>
        <legend className="w-full">
          <SectionHeading n={1} accent={style.accent} onAccent={style.onAccent}>
            Vyber si termín školenia
          </SectionHeading>
        </legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {cfg.terminy.map((t) => {
            const checked = data.termin === t
            return (
              <label key={t} className="group relative block cursor-pointer">
                <input
                  type="radio"
                  name={`${uid}-termin`}
                  value={t}
                  checked={checked}
                  disabled={sending}
                  onChange={() => set('termin', t)}
                  className="peer sr-only"
                />
                <span
                  className={
                    'flex h-full flex-col gap-1 rounded-[16px] border-2 p-4 pr-11 transition-[border-color,background-color,transform] duration-150 ' +
                    'group-hover:border-[#C9CEC9] group-active:scale-[0.98] motion-reduce:transition-none ' +
                    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#3772FF] ' +
                    (checked ? '' : terminError ? 'border-[#DF2935] bg-white' : 'border-[#E1E4E1] bg-white')
                  }
                  style={checked ? { borderColor: style.accent, backgroundColor: style.soft } : undefined}
                >
                  <span className="text-[17px] font-bold leading-snug text-bombovo-dark">
                    <WithMarkers text={t} />
                  </span>
                  <span className="text-[14px] text-[#6B716B]">{MIESTO}</span>
                </span>
                {/* Check mark in the corner */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3.5 top-3.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-[background-color,border-color] duration-150"
                  style={{
                    borderColor: checked ? style.accent : '#C9CEC9',
                    backgroundColor: checked ? style.accent : '#FFFFFF',
                    color: style.onAccent,
                  }}
                >
                  {checked && <PiCheckBold className="h-3.5 w-3.5" />}
                </span>
              </label>
            )
          })}
        </div>
        {terminError && (
          <p id={fid('termin-err')} className="mt-2 text-[14px] font-medium text-[#C21F2B]">
            {terminError}
          </p>
        )}
      </fieldset>

      {/* ── B: details ── */}
      <div className="mt-10 border-t border-[#E6E8E6] pt-8">
        <SectionHeading n={2} accent={style.accent} onAccent={style.onAccent}>
          Tvoje údaje
        </SectionHeading>

        <div className="mt-6 grid gap-5 sm:grid-cols-[110px_1fr_1fr]">
          <Field id={fid('titul')} label="Titul" optional error={err('titul')}>
            {(a) => <input {...a} {...text('titul')} type="text" placeholder="Bc." autoComplete="honorific-prefix" />}
          </Field>
          <Field id={fid('meno')} label="Meno" error={err('meno')}>
            {(a) => <input {...a} {...text('meno')} type="text" placeholder="Lucia" autoComplete="given-name" />}
          </Field>
          <Field id={fid('priezvisko')} label="Priezvisko" error={err('priezvisko')}>
            {(a) => <input {...a} {...text('priezvisko')} type="text" placeholder="Nováková" autoComplete="family-name" />}
          </Field>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field id={fid('datumNarodenia')} label="Dátum narodenia" error={err('datumNarodenia')}>
            {(a) => (
              <input
                {...a}
                {...text('datumNarodenia')}
                type="date"
                min="1940-01-01"
                max={new Date().toISOString().slice(0, 10)}
                autoComplete="bday"
                className={`${a.className} min-h-[54px] appearance-none ${data.datumNarodenia ? '' : 'text-[#9AA09A]'}`}
              />
            )}
          </Field>
        </div>

        <div className="mt-5 grid gap-5">
          <Field id={fid('adresa')} label="Adresa" hint="Ulica a číslo" error={err('adresa')}>
            {(a) => <input {...a} {...text('adresa')} type="text" placeholder="Hlavná 12" autoComplete="street-address" />}
          </Field>
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,130px)_1fr] gap-5">
          <Field id={fid('psc')} label="PSČ" error={err('psc')}>
            {(a) => <input {...a} {...text('psc')} type="text" inputMode="numeric" placeholder="971 01" autoComplete="postal-code" />}
          </Field>
          <Field id={fid('mesto')} label="Mesto" error={err('mesto')}>
            {(a) => <input {...a} {...text('mesto')} type="text" placeholder="Prievidza" autoComplete="address-level2" />}
          </Field>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field id={fid('telefon')} label="Telefón" error={err('telefon')}>
            {(a) => <input {...a} {...text('telefon')} type="tel" placeholder="0900 123 456" autoComplete="tel" />}
          </Field>
          <Field id={fid('email')} label="Email" error={err('email')}>
            {(a) => <input {...a} {...text('email')} type="email" placeholder="lucia.novakova@gmail.com" autoComplete="email" />}
          </Field>
        </div>

        {role === 'zdravotnik' && (
          <div className="mt-5">
            <Field id={fid('vzdelanie')} label="Vzdelanie / odbornosť" error={err('vzdelanie')}>
              {(a) => (
                <div className="relative">
                  <select {...a} {...text('vzdelanie')} className={`${a.className} appearance-none pr-11 ${data.vzdelanie ? '' : 'text-[#9AA09A]'}`}>
                    <option value="" disabled>
                      Vyber zo zoznamu
                    </option>
                    {VZDELANIE_OPTIONS.map((o) => (
                      <option key={o} value={o} className="text-[#1F2320]">
                        {o}
                      </option>
                    ))}
                  </select>
                  <PiCaretDownBold aria-hidden className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-[#6B716B]" />
                </div>
              )}
            </Field>
          </div>
        )}

        <div className="mt-5">
          <Field
            id={fid('strava')}
            label="Intolerancie / alergie na jedlo"
            optional
            error={err('strava')}
          >
            {(a) => <textarea {...a} {...text('strava')} rows={3} placeholder="napr. bezlepková strava, alergia na orechy" className={`${a.className} resize-y`} />}
          </Field>
        </div>

        {/* GDPR */}
        <div className="mt-7">
          <label className="group flex cursor-pointer items-start gap-3">
            <input
              id={fid('gdpr')}
              type="checkbox"
              checked={data.gdpr}
              disabled={sending}
              onChange={(e) => set('gdpr', e.target.checked)}
              onBlur={blur('gdpr')}
              aria-invalid={!!err('gdpr')}
              aria-describedby={err('gdpr') ? fid('gdpr-err') : undefined}
              className={`mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-[5px] ${FOCUS}`}
              style={{ accentColor: style.accent === '#FDCA40' ? '#080708' : style.accent }}
            />
            <span className="text-[14px] leading-[1.6] text-[#3A403A]">
              Označením súhlasím s administratívnym spracovaním mojich uvedených osobných údajov pre účely výberového konania. Tieto údaje poskytujú len pre Bombovo CK a nebudú poskytnuté iným osobám a subjektom.{' '}
              <Link href="/gdpr" target="_blank" className={`font-semibold text-[#2A55C0] underline underline-offset-2 hover:text-[#3772FF] ${FOCUS}`}>
                Ochrana osobných údajov
              </Link>
            </span>
          </label>
          {err('gdpr') && (
            <p id={fid('gdpr-err')} className="mt-1.5 pl-8 text-[14px] font-medium text-[#C21F2B]">
              {err('gdpr')}
            </p>
          )}
        </div>
      </div>

      {/* Price, right where the decision is made */}
      <div className="mt-8 rounded-[16px] px-5 py-4" style={{ backgroundColor: style.soft }}>
        <p className="text-[18px] font-bold text-bombovo-dark">Poplatok za školenie: {cfg.fee} €</p>
        <p className="mt-1 text-[14px] leading-[1.6] text-[#3A403A]">{cfg.feeNote}</p>
      </div>

      {serverError && (
        <p role="alert" className="mt-5 rounded-[12px] border-2 border-[#DF2935] bg-[#FEF1F1] px-4 py-3 text-[15px] font-medium text-[#8E1520]">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className={
          'mt-6 inline-flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-[9px] px-8 py-3.5 text-[17px] font-bold tracking-[0.02em] ' +
          'transition-[background-color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none disabled:cursor-wait disabled:opacity-80 sm:w-auto sm:min-w-[280px] ' +
          `${style.button} ${FOCUS}`
        }
      >
        {sending && (
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 animate-spin" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {sending ? 'Odosielam…' : 'Odoslať prihlášku'}
      </button>
    </form>
  )
}

/* ─── Right column ──────────────────────────────────────────────────────── */

function NextSteps({ role }: { role: PrihlaskaRole }) {
  const cfg = PRIHLASKA[role]
  const steps = [
    'Príde ti email s potvrdením a platobnými údajmi.',
    `Do 14 dní uhradíš poplatok za školenie (${cfg.fee} €).`,
    'Cca 2 týždne pred školením ti pošleme všetky informácie.',
  ]
  return (
    <div className="rounded-[24px] p-6 sm:p-7" style={{ backgroundColor: ROLE_STYLE[role].tint }}>
      <h2 className="text-[22px] font-bold leading-tight text-bombovo-dark md:text-[24px]" style={{ fontFamily: SUBHEAD }}>
        Čo sa stane po odoslaní
      </h2>
      <ol className="mt-5 flex flex-col gap-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3.5">
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bombovo-dark text-[15px] font-bold text-white"
            >
              {i + 1}
            </span>
            <span className="pt-1 text-[16px] leading-[1.55] text-[#1F2320]">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function DobreVediet({ role }: { role: PrihlaskaRole }) {
  const [open, setOpen] = useState(-1)
  const uid = useId()
  return (
    <div className="mt-6">
      <h2 className="text-[22px] font-bold leading-tight text-bombovo-dark md:text-[24px]" style={{ fontFamily: SUBHEAD }}>
        Dobré vedieť
      </h2>
      <ul className="mt-3 overflow-hidden rounded-[16px] bg-white ring-1 ring-[#E1E4E1]">
        {PRIHLASKA[role].dobreVediet.map((item, i) => {
          const isOpen = open === i
          return (
            <li key={item.q} className={i > 0 ? 'border-t border-[#E6E8E6]' : ''}>
              <button
                id={`${uid}-q${i}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${uid}-a${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={`flex w-full items-center gap-3 px-5 py-4 text-left transition-[background-color] duration-150 hover:bg-[#F6F7F6] active:bg-[#EEF0EE] ${FOCUS} focus-visible:outline-offset-[-2px]`}
              >
                <span className="flex-1 text-[16px] font-semibold leading-snug text-bombovo-dark">{item.q}</span>
                <Chevron open={isOpen} />
              </button>
              <div
                id={`${uid}-a${i}`}
                role="region"
                aria-labelledby={`${uid}-q${i}`}
                inert={!isOpen ? true : undefined}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-[15px] leading-[1.7] text-[#1F2320]">
                    <WithMarkers text={item.a} />
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─── Who may apply ─────────────────────────────────────────────────────── */
/*
  Many people apply who don't qualify (under-18s, non-medics), so the
  conditions sit in the header, before anything else is asked: a white card
  with a heavy border in the role colour, the conditions as ticked chips, and
  who is excluded underneath.
*/
function Requirement({ req, role }: { req: NonNullable<PrihlaskaConfig['requirement']>; role: PrihlaskaRole }) {
  const s = ROLE_STYLE[role]
  return (
    <div
      className="mt-6 max-w-3xl rounded-[20px] border-[3px] bg-white p-5 shadow-[0_18px_40px_-28px_rgba(8,7,8,0.35)] sm:p-6"
      style={{ borderColor: s.accent }}
    >
      <p className="flex items-start gap-3 text-[18px] font-bold leading-snug text-bombovo-dark sm:text-[20px]">
        <PiSealCheckDuotone aria-hidden className="mt-[-2px] h-8 w-8 shrink-0" />
        {req.title}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {req.allowed.map((a) => (
          <li
            key={a}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[15px] font-semibold text-bombovo-dark"
            style={{ backgroundColor: role === 'zdravotnik' ? s.accent : s.tint }}
          >
            <PiCheckBold aria-hidden className="h-4 w-4" />
            {a}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-start gap-2.5 text-[14.5px] leading-[1.6] text-[#3A403A]">
        <PiXCircleBold aria-hidden className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#C21F2B]" />
        {req.notAllowed}
      </p>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PrihlaskaPage({ role }: { role: PrihlaskaRole }) {
  const cfg = PRIHLASKA[role]
  const style = ROLE_STYLE[role]
  const [sent, setSent] = useState<PrihlaskaData | null>(null)
  const [, word] = cfg.title.split(' ')

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* ─── Short header ─── */}
      <section className="bg-bombovo-gray">
        <div className="mx-auto max-w-6xl px-4 pb-9 pt-6 sm:px-6 md:pb-12 md:pt-9 lg:px-8 lg:pb-28">
          <Link
            href="/pridaj-sa-do-timu"
            className={`group inline-flex items-center gap-2 rounded-[6px] text-[15px] font-medium text-[#3A403A] hover:text-bombovo-dark ${FOCUS}`}
          >
            <PiArrowLeftBold aria-hidden className="h-4 w-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span className="underline-offset-4 group-hover:underline">Späť na Pridaj sa do tímu</span>
          </Link>

          <h1 className="mt-5 text-[clamp(2.1rem,5vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.035em] text-bombovo-dark md:mt-6">
            Prihláška{' '}
            {/* Same tilted word box as the /pridaj-sa-do-timu hero, in the role's colour. */}
            <span
              className="inline-block origin-left -rotate-[1.5deg] rounded-[12px] px-[0.3em] pb-[0.1em] pt-[0.02em] font-bold tracking-[-0.01em]"
              style={{ backgroundColor: style.accent, color: style.onAccent, fontFamily: SUBHEAD }}
            >
              {word}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.7] text-[#1F2320] md:text-[18px]">{cfg.intro}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {cfg.chips.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[15px] font-medium text-[#1F2320] ring-1 ring-[#DDE0DD]"
              >
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: style.accent }} />
                {c}
              </li>
            ))}
          </ul>

          {cfg.requirement && <Requirement req={cfg.requirement} role={role} />}

          {/* Phones: the form sits last, so this jumps straight to it. */}
          <a
            href="#prihlaska"
            onClick={(e) => {
              e.preventDefault()
              const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              document.getElementById('prihlaska')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
            }}
            className={
              'mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-[9px] px-6 py-3.5 text-[17px] font-bold tracking-[0.02em] ' +
              'transition-[background-color,box-shadow,transform] duration-150 ease-out motion-reduce:transition-none sm:w-auto lg:hidden ' +
              `${style.button} ${FOCUS}`
            }
          >
            Vyplniť prihlášku
            <PiArrowDownBold aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ─── Form + side column ─── */}
      {/* Desktop: form left, steps right. Phones: steps → Dobré vedieť → form last. */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-12 lg:gap-10 lg:px-8">
          <div
            id="prihlaska"
            className="order-2 scroll-mt-24 rounded-[24px] bg-white p-5 ring-1 ring-[#E1E4E1] shadow-[0_1px_2px_rgba(8,7,8,0.04),0_28px_56px_-36px_rgba(8,7,8,0.35)] sm:p-8 md:scroll-mt-36 lg:order-1 lg:col-span-7 lg:-mt-20 lg:p-10"
          >
            {sent ? <Success role={role} data={sent} /> : <PrihlaskaForm role={role} onSuccess={setSent} />}
          </div>

          <aside className="order-1 lg:sticky lg:top-40 lg:order-2 lg:col-span-5">
            <NextSteps role={role} />
            <DobreVediet role={role} />
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}
