'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { REBUILT_STREDISKA } from '@/data/rebuiltStrediska'

/**
 * The full enquiry form for the rebuilt Lomy page.
 *
 * Restores the old /prihlaska-svp registration's fields (minus dátum odchodu
 * and PSČ, dropped as noise, and with alternatívne stredisko now optional
 * rather than required), laid out in the current card's input style rather
 * than the old form's plain blue-bordered boxes.
 *
 * Selects use the custom Dropdown below instead of a native <select>: the
 * native control renders differently per browser/OS (small and flipped
 * upward in desktop Chrome, a bottom sheet on iOS) and can get clipped
 * inside the popup's scroll container. Dropdown portals its panel to
 * <body> and positions itself from the trigger's own bounding rect, so it
 * always renders on top, un-clipped, flipping above the trigger only when
 * there isn't room below.
 *
 * One component, three placements: inline in section 7, inside the hero's popup,
 * and on the /prihlaska-svp/horsky-hotel-lomy page where a clicked date arrives
 * as ?termin=. Submissions go to /api/contact-svp, the endpoint the site already
 * uses (and already expects this exact field set), so these land in the same
 * inbox as every other enquiry.
 */

const inputBase =
  'w-full rounded-[10px] border-2 border-[#E6E8E6] bg-white px-4 py-3 text-[17px] text-[#1F2320] outline-none transition-colors duration-200 placeholder:text-[#8A908A] focus:border-bombovo-blue disabled:opacity-60'

const labelBase = 'block text-[15px] font-semibold text-[#1F2320]'

/** Every rebuilt stredisko's display name, for the "alternatívne stredisko" list. */
const ALL_STREDISKA_NAMES = Object.values(REBUILT_STREDISKA).map((c) => c.hero.name)

type Option = { value: string; label: string }

/**
 * Custom select: a styled trigger button plus a panel portaled to <body>,
 * positioned from the trigger's bounding rect (fixed, recomputed on scroll/
 * resize so it tracks correctly even inside the popup's own scroll area,
 * and flips above the trigger when the viewport doesn't have room below).
 */
function Dropdown({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  error,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: Option[]
  placeholder: string
  disabled?: boolean
  error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; openUp: boolean } | null>(
    null,
  )
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  const updatePosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const PANEL_MAX = 260
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < PANEL_MAX && rect.top > spaceBelow
    setCoords({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      openUp,
    })
  }, [])

  useEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center justify-between gap-2 text-left ${inputBase} ${
          error ? 'border-bombovo-red' : ''
        } ${disabled ? '' : 'cursor-pointer'}`}
      >
        <span className={selected ? '' : 'text-[#8A908A]'}>{selected ? selected.label : placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 shrink-0 text-[#8A908A] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {mounted &&
        open &&
        coords &&
        ReactDOM.createPortal(
          <div
            ref={panelRef}
            role="listbox"
            aria-labelledby={id}
            style={{
              position: 'fixed',
              top: coords.openUp ? undefined : coords.top,
              bottom: coords.openUp ? window.innerHeight - coords.top : undefined,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[300] max-h-64 overflow-y-auto rounded-[12px] bg-white p-1.5 shadow-[0_16px_36px_-12px_rgba(8,7,8,0.32)] ring-1 ring-[#DDE0DD]"
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-[8px] px-3.5 py-2.5 text-left text-[16px] transition-colors duration-150 ${
                  o.value === value
                    ? 'bg-[#EAF1FB] font-semibold text-bombovo-blue'
                    : 'text-[#1F2320] hover:bg-[#F4F5F4]'
                }`}
              >
                {o.label}
                {o.value === value && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m5 12.5 4.6 4.5L19 7.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

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
    datumPrichodu: initialTerm,
    veduciPobytu: '',
    nazovSkoly: '',
    adresa: '',
    mesto: '',
    telefon: '',
    email: '',
    alternativneStredisko: '',
    vekZiakov: '',
    pocetZiakov: '',
    pocetPedagogov: '',
    zdravotnik: '',
    animacny: '',
    bombovyBalicek: '',
    poznamka: '',
  })

  const altStrediskaOptions: Option[] = ALL_STREDISKA_NAMES.filter((n) => n !== strediskoName).map((n) => ({
    value: n,
    label: n,
  }))

  const set =
    (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }))

  const setValue = (k: keyof typeof values) => (val: string) => setValues((v) => ({ ...v, [k]: val }))

  const validate = () => {
    const next: Record<string, string> = {}
    if (!values.datumPrichodu.trim()) next.datumPrichodu = 'Uveďte dátum príchodu.'
    if (!values.veduciPobytu.trim()) next.veduciPobytu = 'Vyplňte meno vedúcej/vedúceho pobytu.'
    if (!values.nazovSkoly.trim()) next.nazovSkoly = 'Vyplňte názov školy.'
    if (!values.adresa.trim()) next.adresa = 'Vyplňte adresu.'
    if (!values.mesto.trim()) next.mesto = 'Vyplňte mesto.'
    if (!values.telefon.trim()) next.telefon = 'Vyplňte telefón.'
    if (!values.email.trim()) next.email = 'Vyplňte e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = 'Skontrolujte formát e-mailu.'
    if (!values.vekZiakov) next.vekZiakov = 'Vyberte vek žiakov.'
    if (!values.pocetZiakov.trim()) next.pocetZiakov = 'Uveďte počet žiakov.'
    if (!values.pocetPedagogov.trim()) next.pocetPedagogov = 'Uveďte počet pedagógov.'
    if (!values.zdravotnik) next.zdravotnik = 'Vyberte zdravotníka.'
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
          datumPrichodu: values.datumPrichodu,
          veduciPobytu: values.veduciPobytu,
          nazovSkoly: values.nazovSkoly,
          adresa: values.adresa,
          mesto: values.mesto,
          telefon: values.telefon,
          email: values.email,
          alternativneStredisko: values.alternativneStredisko || 'neuvedené',
          vekZiakov: values.vekZiakov,
          pocetZiakov: values.pocetZiakov,
          pocetPedagogov: values.pocetPedagogov,
          zdravotnik: values.zdravotnik,
          animacnyProgram: values.animacny || 'neuvedené',
          bombovyBalicek: values.bombovyBalicek || 'neuvedené',
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
        <label htmlFor="lomy-prichod" className={labelBase}>
          Dátum príchodu *
        </label>
        {/* Arrives pre-filled when a date row was clicked; still editable. */}
        <input
          id="lomy-prichod"
          value={values.datumPrichodu}
          onChange={set('datumPrichodu')}
          disabled={status === 'sending'}
          placeholder="napr. máj 2027 alebo DD.MM.RRRR"
          className={`mt-2 ${inputBase} ${errors.datumPrichodu ? 'border-bombovo-red' : ''}`}
        />
        {errors.datumPrichodu && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.datumPrichodu}</p>
        )}
      </div>

      <div>
        <label htmlFor="lomy-veduci" className={labelBase}>
          Meno, priezvisko, titul vedúcej/vedúceho pobytu *
        </label>
        <input
          id="lomy-veduci"
          value={values.veduciPobytu}
          onChange={set('veduciPobytu')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.veduciPobytu ? 'border-bombovo-red' : ''}`}
        />
        {errors.veduciPobytu && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.veduciPobytu}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label htmlFor="lomy-skola" className={labelBase}>
          Názov školy / organizácie *
        </label>
        <input
          id="lomy-skola"
          value={values.nazovSkoly}
          onChange={set('nazovSkoly')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.nazovSkoly ? 'border-bombovo-red' : ''}`}
        />
        {errors.nazovSkoly && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.nazovSkoly}</p>
        )}
      </div>

      <div>
        <label htmlFor="lomy-adresa" className={labelBase}>
          Adresa *
        </label>
        <input
          id="lomy-adresa"
          value={values.adresa}
          onChange={set('adresa')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.adresa ? 'border-bombovo-red' : ''}`}
        />
        {errors.adresa && <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.adresa}</p>}
      </div>

      <div>
        <label htmlFor="lomy-mesto" className={labelBase}>
          Mesto *
        </label>
        <input
          id="lomy-mesto"
          value={values.mesto}
          onChange={set('mesto')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.mesto ? 'border-bombovo-red' : ''}`}
        />
        {errors.mesto && <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.mesto}</p>}
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
        <label htmlFor="lomy-stredisko" className={labelBase}>
          Škola v prírode/stredisko
        </label>
        <input
          id="lomy-stredisko"
          value={strediskoName}
          readOnly
          className={`mt-2 ${inputBase} cursor-not-allowed bg-[#F4F5F4] text-[#5A605A]`}
        />
      </div>

      <div>
        <span id="lomy-alt-label" className={labelBase}>
          Alternatívne stredisko
        </span>
        <div className="mt-2">
          <Dropdown
            id="lomy-alt-label"
            value={values.alternativneStredisko}
            onChange={setValue('alternativneStredisko')}
            options={altStrediskaOptions}
            placeholder="Nepovinné"
            disabled={status === 'sending'}
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <span id="lomy-vek-label" className={labelBase}>
          Vek žiakov/študentov *
        </span>
        <div className="mt-2">
          <Dropdown
            id="lomy-vek-label"
            value={values.vekZiakov}
            onChange={setValue('vekZiakov')}
            options={[
              { value: 'MŠ', label: 'MŠ' },
              { value: '1. stupeň ZŠ', label: '1. stupeň ZŠ' },
              { value: '2. stupeň ZŠ', label: '2. stupeň ZŠ' },
            ]}
            placeholder="Vyberte vek žiakov"
            disabled={status === 'sending'}
            error={!!errors.vekZiakov}
          />
        </div>
        {errors.vekZiakov && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.vekZiakov}</p>
        )}
      </div>

      <div>
        <label htmlFor="lomy-poc-ziakov" className={labelBase}>
          Počet žiakov/študentov *
        </label>
        <input
          id="lomy-poc-ziakov"
          inputMode="numeric"
          value={values.pocetZiakov}
          onChange={set('pocetZiakov')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.pocetZiakov ? 'border-bombovo-red' : ''}`}
        />
        {errors.pocetZiakov && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.pocetZiakov}</p>
        )}
      </div>

      <div>
        <label htmlFor="lomy-poc-pedagogov" className={labelBase}>
          Počet pedagógov *
        </label>
        <input
          id="lomy-poc-pedagogov"
          inputMode="numeric"
          value={values.pocetPedagogov}
          onChange={set('pocetPedagogov')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.pocetPedagogov ? 'border-bombovo-red' : ''}`}
        />
        {errors.pocetPedagogov && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.pocetPedagogov}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <span id="lomy-zdravotnik-label" className={labelBase}>
          Zdravotník *
        </span>
        <div className="mt-2">
          <Dropdown
            id="lomy-zdravotnik-label"
            value={values.zdravotnik}
            onChange={setValue('zdravotnik')}
            options={[
              { value: 'Vlastný zdravotník', label: 'Vlastný zdravotník' },
              { value: 'Zdravotník z CK', label: 'Zdravotník z CK' },
            ]}
            placeholder="Vyberte zdravotníka"
            disabled={status === 'sending'}
            error={!!errors.zdravotnik}
          />
        </div>
        {errors.zdravotnik && (
          <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.zdravotnik}</p>
        )}
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
        <span className={labelBase}>Bombový balíček</span>
        <div className="mt-3 flex gap-6">
          {['Áno', 'Nie'].map((opt) => (
            <label
              key={opt}
              className="inline-flex cursor-pointer items-center gap-2.5 text-[17px] text-[#1F2320]"
            >
              <input
                type="radio"
                name="lomy-balicek"
                value={opt}
                checked={values.bombovyBalicek === opt}
                onChange={set('bombovyBalicek')}
                disabled={status === 'sending'}
                className="h-[18px] w-[18px] accent-bombovo-blue"
              />
              {opt}
            </label>
          ))}
        </div>
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
            Ponuku sa nepodarilo odoslať. Skúste to prosím znova, alebo nám napíšte na
            bombovo@bombovo.sk.
          </p>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-full border-2 border-white bg-bombovo-red px-8 py-3.5 text-[17px] font-bold text-white transition-transform duration-150 ease-out active:translate-y-px disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bombovo-blue"
          >
            {status === 'sending' ? 'Odosielam…' : 'ODOSLAŤ PONUKU'}
          </button>
        </div>
      </div>
    </form>
  )
}
