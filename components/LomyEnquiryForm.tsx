'use client'

import { useState } from 'react'

/**
 * The full enquiry form for the rebuilt Lomy page.
 *
 * Restores every field the old /prihlaska-svp registration asked for, except
 * "alternatívne stredisko" (dropped — see conversation), laid out in the
 * current card's input style rather than the old form's plain blue-bordered
 * boxes.
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
    datumOdchodu: '',
    veduciPobytu: '',
    nazovSkoly: '',
    adresa: '',
    psc: '',
    mesto: '',
    telefon: '',
    email: '',
    vekZiakov: '',
    pocetZiakov: '',
    pocetPedagogov: '',
    zdravotnik: '',
    animacny: '',
    bombovyBalicek: '',
    poznamka: '',
  })

  const set =
    (k: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }))

  const validate = () => {
    const next: Record<string, string> = {}
    if (!values.datumPrichodu.trim()) next.datumPrichodu = 'Uveďte dátum príchodu.'
    if (!values.veduciPobytu.trim()) next.veduciPobytu = 'Vyplňte meno vedúcej/vedúceho pobytu.'
    if (!values.nazovSkoly.trim()) next.nazovSkoly = 'Vyplňte názov školy.'
    if (!values.adresa.trim()) next.adresa = 'Vyplňte adresu.'
    if (!values.psc.trim()) next.psc = 'Vyplňte PSČ.'
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
          datumOdchodu: values.datumOdchodu,
          veduciPobytu: values.veduciPobytu,
          nazovSkoly: values.nazovSkoly,
          adresa: values.adresa,
          psc: values.psc,
          mesto: values.mesto,
          telefon: values.telefon,
          email: values.email,
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
        <label htmlFor="lomy-odchod" className={labelBase}>
          Dátum odchodu
        </label>
        <input
          id="lomy-odchod"
          value={values.datumOdchodu}
          onChange={set('datumOdchodu')}
          disabled={status === 'sending'}
          placeholder="DD.MM.RRRR"
          className={`mt-2 ${inputBase}`}
        />
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

      <div>
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:col-span-2">
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
          <label htmlFor="lomy-psc" className={labelBase}>
            PSČ *
          </label>
          <input
            id="lomy-psc"
            value={values.psc}
            onChange={set('psc')}
            disabled={status === 'sending'}
            className={`mt-2 ${inputBase} ${errors.psc ? 'border-bombovo-red' : ''}`}
          />
          {errors.psc && <p className="mt-1.5 text-[14px] text-bombovo-red">{errors.psc}</p>}
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

      <div className="md:col-span-2">
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

      <div className="md:col-span-2">
        <label htmlFor="lomy-vek" className={labelBase}>
          Vek žiakov/študentov *
        </label>
        <select
          id="lomy-vek"
          value={values.vekZiakov}
          onChange={set('vekZiakov')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.vekZiakov ? 'border-bombovo-red' : ''}`}
        >
          <option value="">Vyberte vek žiakov</option>
          <option value="MŠ">MŠ</option>
          <option value="1. stupeň ZŠ">1. stupeň ZŠ</option>
          <option value="2. stupeň ZŠ">2. stupeň ZŠ</option>
        </select>
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
        <label htmlFor="lomy-zdravotnik" className={labelBase}>
          Zdravotník *
        </label>
        <select
          id="lomy-zdravotnik"
          value={values.zdravotnik}
          onChange={set('zdravotnik')}
          disabled={status === 'sending'}
          className={`mt-2 ${inputBase} ${errors.zdravotnik ? 'border-bombovo-red' : ''}`}
        >
          <option value="">Vyberte zdravotníka</option>
          <option value="Vlastný zdravotník">Vlastný zdravotník</option>
          <option value="Zdravotník z CK">Zdravotník z CK</option>
        </select>
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
