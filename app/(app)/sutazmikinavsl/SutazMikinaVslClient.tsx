'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiChevronDown, FiCheck } from 'react-icons/fi'

interface Camp {
  id: string
  name: string
}

interface Props {
  camps: Camp[]
}

const easeOut = [0.16, 1, 0.3, 1] as const

const STAR_HINTS: Record<number, string> = {
  1: 'Mohlo byť lepšie',
  2: 'Ujde to',
  3: 'Dobre',
  4: 'Výborne',
  5: 'Fantastické!',
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  return (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} hviezdičiek`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className={`text-[2.2rem] leading-none transition-transform duration-100 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:rounded-md ${
              star <= active ? 'text-bombovo-yellow' : 'text-white/30'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {active > 0 && <p className="mt-1 text-sm font-medium text-white/70">{STAR_HINTS[active]}</p>}
    </div>
  )
}

function GrainOverlay() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.05] mix-blend-overlay"
      aria-hidden="true"
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}

function TripleBadge() {
  return (
    <div className="relative z-10 mx-auto -mb-7 flex h-20 w-20 -rotate-6 flex-col items-center justify-center rounded-full border-[3px] border-dashed border-bombovo-dark/60 bg-bombovo-yellow shadow-[0_10px_28px_-6px_rgba(8,7,8,0.55)]">
      <span className="text-2xl font-black leading-none text-bombovo-dark">×3</span>
      <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-bombovo-dark/70">šance</span>
    </div>
  )
}

const fieldBoxClass =
  'w-full rounded-2xl bg-white px-5 py-4 text-base text-bombovo-dark placeholder:text-bombovo-dark/40 outline-none shadow-[0_10px_30px_-12px_rgba(8,7,8,0.45)] ring-2 ring-transparent transition-colors duration-150 focus:ring-bombovo-yellow'

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-white">
      {children}
      {optional && <span className="ml-1 font-normal text-white/60">(nepovinné)</span>}
    </label>
  )
}

export default function SutazMikinaVslClient({ camps }: Props) {
  const searchParams = useSearchParams()
  const kod = searchParams.get('kod') ?? ''

  const [meno, setMeno] = useState('')
  const [priezvisko, setPriezvisko] = useState('')
  const [tabor, setTabor] = useState('')
  const [taborDropdownOpen, setTaborDropdownOpen] = useState(false)
  const [hodnotenie, setHodnotenie] = useState(0)
  const [odpoved1, setOdpoved1] = useState('')
  const [odpoved2, setOdpoved2] = useState('')
  const [odpoved3, setOdpoved3] = useState('')
  const [suhlas, setSuhlas] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const taborDefaultLabel = 'Vyber svoj tábor'

  const isValid = useMemo(() => {
    return (
      meno.trim().length > 0 &&
      priezvisko.trim().length > 0 &&
      tabor.trim().length > 0 &&
      hodnotenie > 0 &&
      odpoved1.trim().length > 0 &&
      odpoved2.trim().length > 0 &&
      suhlas
    )
  }, [meno, priezvisko, tabor, hodnotenie, odpoved1, odpoved2, suhlas])

  async function handleSubmit() {
    if (!isValid || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/sutazmikinavsl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kod,
          meno: meno.trim(),
          priezvisko: priezvisko.trim(),
          tabor,
          hodnotenie,
          odpoved1: odpoved1.trim(),
          odpoved2: odpoved2.trim(),
          odpoved3: odpoved3.trim(),
          suhlas,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Nastala chyba. Skúste to prosím znova.')
      } else {
        setSubmitted(true)
      }
    } catch {
      setError('Nastala chyba. Skúste to prosím znova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bombovo-blue">
      {/* Layered depth: radial glows + grain, purely decorative */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(120% 60% at 100% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 55%), radial-gradient(120% 70% at 0% 100%, rgba(8,7,8,0.30) 0%, rgba(8,7,8,0) 60%)',
        }}
      />
      <GrainOverlay />

      {/* Logo — fixed corner mark */}
      <div className="fixed right-4 top-4 z-50 h-14 w-14 overflow-hidden rounded-full ring-2 ring-white/70 shadow-[0_6px_20px_-4px_rgba(8,7,8,0.5)]">
        <Image src="/images/hat1.jpg" alt="Bombovo Logo" width={64} height={64} priority className="h-full w-full object-cover" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-md flex-col items-center px-5 pb-16 pt-24 text-center">
        {/* Headline block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <h1 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-white">
            Zisti, ako si 3X zvýšiš šance na výhru{' '}
            <span className="font-amatic text-5xl leading-none">BOMBOVO mikiny</span>.
          </h1>
          <p className="mt-4 text-base leading-[1.7] text-white/80">Pozri si video nižšie.</p>
        </motion.div>

        {/* Signature patch badge, overlapping the video card */}
        <motion.div
          className="mt-10 w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
        >
          <TripleBadge />

          {/* VSL video, 9:16 */}
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-[28px] bg-bombovo-dark shadow-[0_24px_48px_-16px_rgba(8,7,8,0.6)] ring-4 ring-white/15">
            <video
              controls
              playsInline
              poster="https://placehold.co/720x1280/2a4fc4/ffffff?text=BOMBOVO+VSL"
              className="h-full w-full object-cover"
            >
              {/* TODO: swap in the real VSL file once it's produced, e.g. <source src="/videos/mikina-vsl.mp4" type="video/mp4" /> */}
            </video>
          </div>
        </motion.div>

        {/* Second headline, directly above the form */}
        <motion.h2
          className="mt-12 text-2xl font-bold leading-snug tracking-[-0.02em] text-white"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          Napíš nám o tvojom tábore a zvýš si šancu na výhru mikiny.
        </motion.h2>

        {submitted ? (
          <motion.div
            className="mt-8 w-full rounded-2xl bg-white/10 px-6 py-10 shadow-[0_10px_30px_-12px_rgba(8,7,8,0.45)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <div className="text-5xl">🎉</div>
            <h3 className="mt-4 text-xl font-bold text-white">Ďakujeme za tvoj príbeh!</h3>
            <p className="mt-2 text-base leading-[1.7] text-white/80">
              Tvoja odpoveď bola úspešne zaznamenaná a tvoje šance na výhru BOMBOVO mikiny sú teraz 3X vyššie.
              Držíme palce!
            </p>
          </motion.div>
        ) : (
          <form
            className="mt-8 flex w-full flex-col gap-5 text-left"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <input type="hidden" name="kod" value={kod} readOnly />

            <div>
              <FieldLabel>Meno</FieldLabel>
              <input
                type="text"
                value={meno}
                onChange={(e) => setMeno(e.target.value)}
                placeholder="Tvoje meno"
                className={fieldBoxClass}
              />
            </div>

            <div>
              <FieldLabel>Priezvisko</FieldLabel>
              <input
                type="text"
                value={priezvisko}
                onChange={(e) => setPriezvisko(e.target.value)}
                placeholder="Tvoje priezvisko"
                className={fieldBoxClass}
              />
            </div>

            <div>
              <FieldLabel>Na akom tábore si sa tento rok zúčastnil?</FieldLabel>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setTaborDropdownOpen((o) => !o)}
                  className={`${fieldBoxClass} flex items-center justify-between text-left ${taborDropdownOpen ? 'ring-bombovo-yellow' : ''}`}
                >
                  <span className={tabor ? '' : 'text-bombovo-dark/40'}>{tabor || taborDefaultLabel}</span>
                  <FiChevronDown
                    className={`ml-4 flex-shrink-0 transition-transform duration-200 ${taborDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {taborDropdownOpen && (
                  <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
                    {camps.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setTabor(c.name)
                          setTaborDropdownOpen(false)
                        }}
                        className={`w-full px-5 py-3 text-left transition-colors duration-150 hover:bg-bombovo-gray ${
                          tabor === c.name ? 'bg-bombovo-gray font-semibold' : ''
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <FieldLabel>Celkové hodnotenie</FieldLabel>
              <StarRatingInput value={hodnotenie} onChange={setHodnotenie} />
            </div>

            <div>
              <FieldLabel>Opíš, ako sa ti na tábore páčilo.</FieldLabel>
              <textarea
                value={odpoved1}
                onChange={(e) => setOdpoved1(e.target.value)}
                rows={4}
                className={`${fieldBoxClass} resize-none`}
              />
            </div>

            <div>
              <FieldLabel>Aký jeden moment z tábora si budeš pamätať najdlhšie?</FieldLabel>
              <textarea
                value={odpoved2}
                onChange={(e) => setOdpoved2(e.target.value)}
                rows={4}
                className={`${fieldBoxClass} resize-none`}
              />
            </div>

            <div>
              <FieldLabel optional>Čo by si povedal kamarátovi, ktorý na tábore ešte nebol?</FieldLabel>
              <textarea
                value={odpoved3}
                onChange={(e) => setOdpoved3(e.target.value)}
                rows={4}
                className={`${fieldBoxClass} resize-none`}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3">
              <span className="relative mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white shadow-[0_4px_12px_-4px_rgba(8,7,8,0.4)]">
                <input
                  type="checkbox"
                  checked={suhlas}
                  onChange={(e) => setSuhlas(e.target.checked)}
                  className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md"
                />
                <FiCheck
                  className={`pointer-events-none h-4 w-4 text-bombovo-blue transition-opacity duration-150 ${suhlas ? 'opacity-100' : 'opacity-0'}`}
                />
              </span>
              <span className="text-sm leading-[1.6] text-white/90">
                Súhlasím, že toto meno a odpoveď môžu byť použité ako príbeh na webe Bombovo (za seba alebo svoje
                dieťa).
              </span>
            </label>

            {error && <p className="text-sm text-bombovo-yellow">{error}</p>}

            <button
              type="submit"
              disabled={!isValid || loading}
              className="mt-1 w-full rounded-2xl border-2 border-bombovo-dark bg-bombovo-yellow px-6 py-4 text-lg font-bold text-bombovo-dark shadow-[0_14px_30px_-10px_rgba(8,7,8,0.55)] transition-transform duration-150 hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
            >
              {loading ? 'Odosielam…' : 'Odoslať príbeh'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
