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
            className={`text-[2.2rem] leading-none transition-transform duration-100 hover:scale-110 focus-visible:outline-2 focus-visible:outline-bombovo-blue ${
              star <= active ? 'text-bombovo-yellow' : 'text-gray-200'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {active > 0 && <p className="mt-1 text-sm font-medium text-gray-400">{STAR_HINTS[active]}</p>}
    </div>
  )
}

const fieldBoxClass =
  'w-full rounded-2xl border-2 border-bombovo-gray bg-white px-5 py-4 text-base text-bombovo-dark placeholder:text-bombovo-dark/40 outline-none transition-colors duration-150 focus:border-bombovo-blue'

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-bombovo-dark">
      {children}
      {optional && <span className="ml-1 font-normal text-bombovo-dark/50">(nepovinné)</span>}
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
    <div className="min-h-screen bg-white">
      {/* Logo — fixed corner mark */}
      <div className="fixed right-4 top-4 z-50 h-16 w-16">
        <Image src="/images/hat1.jpg" alt="Bombovo Logo" width={64} height={64} priority className="h-full w-full object-contain" />
      </div>

      <main className="mx-auto flex max-w-md flex-col items-center px-5 pb-16 pt-16 text-center">
        {/* Headline block */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: easeOut }}>
          <h1 className="text-[28px] font-extrabold leading-tight text-bombovo-dark md:text-[34px]">
            Zisti, ako si <span className="text-bombovo-blue">3X zvýšiš šance</span> na výhru{' '}
            <span className="text-bombovo-blue">BOMBOVO mikiny</span>.
          </h1>
          <p className="mt-3 text-base text-bombovo-dark/60">Pozri si video nižšie.</p>
        </motion.div>

        {/* VSL video, 9:16 */}
        <motion.div
          className="mt-6 w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
        >
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-2xl shadow-lg">
            <video
              controls
              playsInline
              poster="https://placehold.co/720x1280/3772FF/ffffff?text=BOMBOVO+VSL"
              className="h-full w-full object-cover"
            >
              {/* TODO: swap in the real VSL file once it's produced, e.g. <source src="/videos/mikina-vsl.mp4" type="video/mp4" /> */}
            </video>
          </div>
        </motion.div>

        {/* Second headline, directly above the form */}
        <h2 className="mt-10 text-2xl font-bold leading-snug text-bombovo-dark">
          Napíš nám o tvojom tábore a zvýš si šancu na výhru mikiny.
        </h2>

        {submitted ? (
          <div className="mt-8 w-full rounded-2xl bg-bombovo-gray/50 px-6 py-10">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-4 text-xl font-bold text-bombovo-dark">Ďakujeme za tvoj príbeh!</h3>
            <p className="mt-2 text-base leading-[1.7] text-bombovo-dark/70">
              Tvoja odpoveď bola úspešne zaznamenaná a tvoje šance na výhru BOMBOVO mikiny sú teraz 3X vyššie.
              Držíme palce!
            </p>
          </div>
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
                  className={`${fieldBoxClass} flex items-center justify-between text-left ${taborDropdownOpen ? 'border-bombovo-blue' : ''}`}
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
              <span className="relative mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 border-bombovo-gray bg-white">
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
              <span className="text-sm leading-[1.6] text-bombovo-dark/80">
                Súhlasím, že toto meno a odpoveď môžu byť použité ako recenzia na webe Bombovo (za seba alebo svoje
                dieťa).
              </span>
            </label>

            {error && <p className="text-sm text-bombovo-red">{error}</p>}

            <button
              type="submit"
              disabled={!isValid || loading}
              className="mt-1 w-full rounded-2xl border-2 border-bombovo-dark bg-bombovo-yellow px-6 py-4 text-lg font-bold text-bombovo-dark shadow-md transition-transform duration-150 hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bombovo-blue/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
            >
              {loading ? 'Odosielam…' : 'Odoslať príbeh'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
