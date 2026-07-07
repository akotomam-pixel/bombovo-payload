'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiChevronDown, FiCheck } from 'react-icons/fi'

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
      className="mt-8 w-full rounded-2xl border-2 border-bombovo-gray bg-white px-6 py-8 text-left leading-relaxed text-bombovo-dark sm:px-8"
      style={typewriter}
    >
      <p>
        Od: Uliho
        <br />
        (lepšieho animátora ako baran)
      </p>
      <p className="mt-4">
        Z: Horského hotela Lomy
        <br />
        Streda, 8:37 ráno
      </p>

      <p className="mt-6">Najdrahší festák, počúvaj…</p>

      <p className="mt-4">
        Možno vieš, že sme tento rok pred letom predávali naše úžasné BOMBOVO mikiny.
      </p>

      <p className="mt-4">
        A veľa festákov nám písalo, že sú drahé a nemôžu si ich kúpiť, aj keď veľmi chceli. Mne to bolo úprimne ľúto
        a s cenou sme reálne nemohli ísť nižšie.
      </p>

      <p className="mt-4">
        Tak ma napadlo, že poprosím vedenie a skúsim vybaviť mikiny zadarmo, ktoré by sme vám rozdali. No keď som s
        tým prišiel za Paťou, tak ma rovno vysmiala, že &quot;to vôbec&quot;... no potom, ako som ju presviedčal
        ďalšie dve hodiny, mi povedala, že &quot;okej, 10 mikín vieme rozdať&quot;.
      </p>

      <p className="mt-4">
        A tu nastal ten problém. Ako mám rozdať 10 mikín, keď vás je tento rok zase rekordný počet?
      </p>

      <p className="mt-4">
        Preto sme sa rozhodli dať mikinu len tým, ktorí ju naozaj chcú, a neurobiť len tak obyčajnú súťaž (to je
        príliš lame).
      </p>

      <p className="mt-4">
        Nájdeš tu pár otázok o tvojom zážitku z nášho FEST Animátor Festu. Chceme od teba, aby si úprimne odpovedal
        na tieto otázky a povedal nám reálne, čo si myslíš.
      </p>

      <p className="mt-4">
        Ja, Baran a Laco si potom tieto odpovede prečítame a vyberieme 10 víťazov, ktorí mikinu dostanú. Takže ti
        musím povedať, že táto správa bude zaznamenaná na našej stránke ako recenzia, takže píš veci s rozumom 😉.
      </p>

      <p className="mt-4">Napíš nám svoj úprimný názor svojimi slovami a máš šancu vyhrať FEST mikinu zadarmo.</p>

      <p className="mt-4">
        Takže ak chceš ešte využiť poslednú šancu na to získať FEST mikinu zadarmo, tak vyplň formulár nižšie. Ak
        nie, tak nemusíš, je to na tebe.
      </p>

      <p className="mt-6">
        Tvoj najlepší animátor,
        <br />
        Uli
      </p>
    </section>
  )
}

export default function SutazMikinaVslFestClient() {
  const [meno, setMeno] = useState('')
  const [priezvisko, setPriezvisko] = useState('')
  const [velkost, setVelkost] = useState('')
  const [velkostDropdownOpen, setVelkostDropdownOpen] = useState(false)
  const [hodnotenie, setHodnotenie] = useState(0)
  const [odpoved1, setOdpoved1] = useState('')
  const [odpoved2, setOdpoved2] = useState('')
  const [odpoved3, setOdpoved3] = useState('')
  const [odpoved4, setOdpoved4] = useState('')
  const [suhlas, setSuhlas] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const isValid = useMemo(() => {
    return (
      meno.trim().length > 0 &&
      priezvisko.trim().length > 0 &&
      velkost.trim().length > 0 &&
      hodnotenie > 0 &&
      odpoved1.trim().length > 0 &&
      odpoved2.trim().length > 0 &&
      suhlas
    )
  }, [meno, priezvisko, velkost, hodnotenie, odpoved1, odpoved2, suhlas])

  async function handleSubmit() {
    if (!isValid || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/sutazmikinavslfest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meno: meno.trim(),
          priezvisko: priezvisko.trim(),
          velkost,
          hodnotenie,
          odpoved1: odpoved1.trim(),
          odpoved2: odpoved2.trim(),
          odpoved3: odpoved3.trim(),
          odpoved4: odpoved4.trim(),
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
            Napíš nám úprimne, aký bol tvoj FEST Animátor Fest, a zapoj sa do súťaže o mikinu.
          </h1>
        </motion.div>

        {/* Letter section — Gary Halbert style direct-response letter */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
        >
          <LetterSection />
        </motion.div>

        {submitted ? (
          <div className="mt-8 w-full rounded-2xl bg-bombovo-gray/50 px-6 py-10">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-4 text-xl font-bold text-bombovo-dark">Ďakujeme za úprimnú odpoveď!</h3>
            <p className="mt-2 text-base leading-[1.7] text-bombovo-dark/70">
              Tvoja odpoveď bola úspešne zaznamenaná. Držíme palce v žrebovaní o FEST mikinu!
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
              <FieldLabel>Koľko hviezdičiek by si dal/dala FESTu?</FieldLabel>
              <StarRatingInput value={hodnotenie} onChange={setHodnotenie} />
            </div>

            <div>
              <FieldLabel>Ako by si popísal svoj zážitok z FESTu?</FieldLabel>
              <textarea
                value={odpoved1}
                onChange={(e) => setOdpoved1(e.target.value)}
                rows={4}
                className={`${fieldBoxClass} resize-none`}
              />
            </div>

            <div>
              <FieldLabel>Čo si najviac zapamätáš z tvojho tohtoročného tábora?</FieldLabel>
              <textarea
                value={odpoved2}
                onChange={(e) => setOdpoved2(e.target.value)}
                rows={4}
                className={`${fieldBoxClass} resize-none`}
              />
            </div>

            <div>
              <FieldLabel optional>Ako by si svojimi slovami odporučil tábor kamarátovi?</FieldLabel>
              <textarea
                value={odpoved3}
                onChange={(e) => setOdpoved3(e.target.value)}
                rows={4}
                className={`${fieldBoxClass} resize-none`}
              />
            </div>

            <div>
              <FieldLabel optional>Chcel by si dodať niečo, čo ťa najviac zaujalo?</FieldLabel>
              <textarea
                value={odpoved4}
                onChange={(e) => setOdpoved4(e.target.value)}
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
                Súhlasím, že moja odpoveď môže byť zverejnená na webovej stránke ako recenzia.
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
