'use client'

import { useState, useMemo } from 'react'
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

const VELKOSTI = ['S', 'M', 'L', 'XL'] as const

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

const typewriter = { fontFamily: "'Courier New', Courier, monospace" }

function LetterSection() {
  return (
    <section
      className="mt-8 w-full rounded-2xl border-2 border-bombovo-gray bg-white px-6 py-8 text-left leading-relaxed text-bombovo-dark shadow-[0_24px_50px_-28px_rgba(8,7,8,0.35)] sm:px-8 md:-rotate-[0.35deg] md:px-16 md:py-14 md:text-[17px] md:leading-[1.85]"
      style={typewriter}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
        <p>
          Od: Uliho
          <br />
          (tvojho animátora)
        </p>
        <p className="md:text-right">
          Z: Horského hotela Lomy
          <br />
          9:12 ráno
        </p>
      </div>

      <p className="mt-6">Ahoj kamarát,</p>

      <p className="mt-4">
        Chceš 3X väčšiu šancu na výhru BOMBOVO mikiny? Tak poď, poviem ti presne, ako na to.
      </p>

      <p className="mt-4">
        Ako si sa už mohol dočítať na našom plagátiku, túto mikinu bolo doteraz skoro nemožné dostať.
      </p>

      <p className="mt-4">
        Dostali ju len animátori, ktorí boli dosť dobrí na to, aby si to zaslúžili. Niektorí museli animovať aj 3
        roky. A niektorí ju nezískali nikdy.
      </p>

      <p className="mt-4">
        Preto keď ti poviem, že vyhrať túto mikinu bude niečo výnimočné, tak to je naozaj pravda. Ak vyhráš, budeš
        jedným z 10 detí, ktoré túto mikinu budú vlastniť.
      </p>

      <p className="mt-4">Takže bez zbytočných rečí ti poviem, ako si môžeš svoju šancu zvýšiť.</p>

      <p className="mt-4">
        Nižšie nájdeš pár otázok, ktoré sme si pre teba pripravili. Jediné, čo musíš spraviť, je odpovedať na ne
        úprimne.
      </p>

      <p className="mt-4">
        Môžeš tam napísať, čo všetko si na tábore zažil. Môžeš napísať, čo sa ti páčilo. Ale pokojne napíš aj to, čo
        sa ti nepáčilo. Všetko je vítané.
      </p>

      <p className="mt-4">Niektoré otázky sú povinné, niektoré nie, tak si to len sleduj.</p>

      <p className="mt-4">Akonáhle stlačíš odoslať a úprimne odpovieš, máš 3-krát väčšiu šancu na výhru.</p>

      <p className="mt-4">
        Robíme to takto preto, lebo chceme túto mikinu dať tým, ktorí ju naozaj chcú, pretože sa im u nás páčilo.
      </p>

      <p className="mt-4">
        Žrebovanie prebehne na konci leta, hneď po našom poslednom tábore, kedy vyberieme 10 výhercov. Ak vyhráš,
        napíšeme e-mail tvojim rodičom, aby nám poslali tvoje číslo (veľkosť), aby sme ti mohli mikinu spraviť presne
        na mieru.
      </p>

      <p className="mt-4">
        Musím ti ale povedať, že tvoja odpoveď bude zaznamenaná na našej stránke ako recenzia. Takže pokiaľ nechceš,
        aby tvoje slová boli zverejnené, tak nemusíš odpovedať. Šancu na výhru budeš mať aj tak.
      </p>

      <p className="mt-4">Tak poď, rolluj dole a napíš nám.</p>

      <p className="mt-4">Dúfam, že si z nášho tábora odišiel s čo najviac zážitkami. Uvidíme sa aj o rok.</p>

      <p className="mt-6">
        Tvoj animátor,
        <br />
        Uli
      </p>
    </section>
  )
}

export default function SutazMikinaVslClient({ camps }: Props) {
  const [meno, setMeno] = useState('')
  const [priezvisko, setPriezvisko] = useState('')
  const [tabor, setTabor] = useState('')
  const [taborDropdownOpen, setTaborDropdownOpen] = useState(false)
  const [velkost, setVelkost] = useState('')
  const [velkostDropdownOpen, setVelkostDropdownOpen] = useState(false)
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
      velkost.trim().length > 0 &&
      hodnotenie > 0 &&
      odpoved1.trim().length > 0 &&
      odpoved2.trim().length > 0 &&
      suhlas
    )
  }, [meno, priezvisko, tabor, velkost, hodnotenie, odpoved1, odpoved2, suhlas])

  async function handleSubmit() {
    if (!isValid || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/sutazmikinavsl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meno: meno.trim(),
          priezvisko: priezvisko.trim(),
          tabor,
          velkost,
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
      <div className="fixed right-3 top-3 z-50 h-11 w-11 md:right-4 md:top-4 md:h-16 md:w-16">
        <Image src="/images/hat1.jpg" alt="Bombovo Logo" width={64} height={64} priority className="h-full w-full object-contain" />
      </div>

      <main className="mx-auto flex w-full flex-col items-center px-5 pb-16 pt-24 text-center md:pt-16">
        {/* Headline block */}
        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <h1 className="text-[28px] font-extrabold leading-tight text-bombovo-dark md:text-[34px]">
            Zisti, ako si 3X zvýšiš šance na výhru BOMBOVO mikiny.
          </h1>
        </motion.div>

        {/* Letter section — Gary Halbert style direct-response letter */}
        <motion.div
          className="mx-auto w-full max-w-md md:max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
        >
          <LetterSection />
        </motion.div>

        {/* Second headline, directly above the form */}
        <h2 className="mx-auto mt-10 max-w-md text-2xl font-bold leading-snug text-bombovo-dark">
          Napíš nám o tvojom tábore a zvýš si šancu na výhru mikiny.
        </h2>

        {submitted ? (
          <div className="mx-auto mt-8 w-full max-w-md rounded-2xl bg-bombovo-gray/50 px-6 py-10">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-4 text-xl font-bold text-bombovo-dark">Ďakujeme za tvoj príbeh!</h3>
            <p className="mt-2 text-base leading-[1.7] text-bombovo-dark/70">
              Tvoja odpoveď bola úspešne zaznamenaná a tvoje šance na výhru BOMBOVO mikiny sú teraz 3X vyššie.
              Držíme palce!
            </p>
          </div>
        ) : (
          <form
            className="mx-auto mt-8 flex w-full max-w-md flex-col gap-5 text-left"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
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
              <FieldLabel>Akú veľkosť mikiny chceš vyhrať?</FieldLabel>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setVelkostDropdownOpen((o) => !o)}
                  className={`${fieldBoxClass} flex items-center justify-between text-left ${velkostDropdownOpen ? 'border-bombovo-blue' : ''}`}
                >
                  <span className={velkost ? '' : 'text-bombovo-dark/40'}>{velkost || 'Vyber veľkosť'}</span>
                  <FiChevronDown
                    className={`ml-4 flex-shrink-0 transition-transform duration-200 ${velkostDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {velkostDropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    {VELKOSTI.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          setVelkost(v)
                          setVelkostDropdownOpen(false)
                        }}
                        className={`w-full px-5 py-3 text-left transition-colors duration-150 hover:bg-bombovo-gray ${
                          velkost === v ? 'bg-bombovo-gray font-semibold' : ''
                        }`}
                      >
                        {v}
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
