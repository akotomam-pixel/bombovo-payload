'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FiChevronDown } from 'react-icons/fi'

interface Camp {
  id: string
  name: string
}

interface Props {
  photoUrl: string | null
  camps: Camp[]
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function WavyUnderline() {
  return (
    <svg
      className="absolute left-0 -bottom-2 w-full"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      style={{ height: '10px' }}
    >
      <path
        d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
        stroke="#DF2935"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── Photo panel (reused in both mobile and desktop) ───────────────────────────
function PhotoPanel({ photoUrl, className }: { photoUrl: string | null; className?: string }) {
  return (
    <div className={`relative ${className ?? ''}`}>
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt="Vyhraj tábor zadarmo"
          fill
          className="object-cover"
          unoptimized={photoUrl.startsWith('http')}
          priority
        />
      ) : (
        <div className="w-full h-full bg-bombovo-blue flex items-center justify-center">
          <span className="text-7xl">🎁</span>
        </div>
      )}
    </div>
  )
}

// ── Step 0 ────────────────────────────────────────────────────────────────────
function StepYesNo({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-bombovo-dark text-center leading-tight pb-3">
        <span className="relative inline-block">
          Chceš vyhrať tábor zadarmo?
          <WavyUnderline />
        </span>
      </h1>
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onYes}
          className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150"
        >
          Áno, chcem vyhrať!
        </button>
        <button
          onClick={onNo}
          className="w-full py-4 px-6 bg-white border-2 border-bombovo-dark text-bombovo-dark font-normal text-base rounded-xl hover:bg-bombovo-gray transition-all duration-150"
        >
          Nie, ďakujem
        </button>
      </div>
    </div>
  )
}

// ── Step 0 declined ───────────────────────────────────────────────────────────
function StepDeclined() {
  return (
    <div className="flex flex-col items-center gap-4 w-full text-center">
      <div className="text-5xl">👋</div>
      <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark leading-tight">
        Žiadny problém!
      </h2>
      <p className="text-bombovo-dark/70 text-base max-w-sm">
        Ak si to rozmyslíš, vždy sa môžeš vrátiť. Dúfame, že ťa uvidíme na niektorom z našich táborov!
      </p>
    </div>
  )
}

// ── Step 1 ────────────────────────────────────────────────────────────────────
function StepNameCamp({
  camps,
  onNext,
}: {
  camps: Camp[]
  onNext: (name: string, camp: string) => void
}) {
  const [name, setName] = useState('')
  const [camp, setCamp] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [error, setError] = useState('')

  const campDefaultLabel = 'Akýkoľvek Tábor'
  const selectedLabel = camp || campDefaultLabel

  function handleSubmit() {
    if (!name.trim()) {
      setError('Prosím zadaj svoje meno.')
      return
    }
    setError('')
    onNext(name.trim(), camp || campDefaultLabel)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Name */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-bombovo-dark leading-tight pb-2">
          <span className="relative inline-block">
            Krok 1: Zadaj svoje meno
            <WavyUnderline />
          </span>
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tvoje meno"
          className="border-2 border-bombovo-blue rounded-xl px-4 py-3 w-full focus:outline-none text-bombovo-dark"
        />
        {error && <p className="text-bombovo-red text-sm">{error}</p>}
      </div>

      {/* Camp */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-bombovo-dark leading-tight pb-2">
          <span className="relative inline-block">
            Krok 2: Vyber si ktorý tábor chceš vyhrať
            <WavyUnderline />
          </span>
        </h2>
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-full px-6 py-4 rounded-xl flex items-center justify-between transition-all duration-200 border-2 bg-[#D5E3F0] border-bombovo-blue hover:brightness-95"
          >
            <span className="font-medium text-bombovo-dark text-base">{selectedLabel}</span>
            <FiChevronDown
              className={`transition-transform duration-200 flex-shrink-0 ml-4 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto">
              <button
                type="button"
                onClick={() => { setCamp(''); setDropdownOpen(false) }}
                className={`w-full px-4 py-3 text-left hover:bg-[#D5E3F0] transition-colors duration-150 ${
                  camp === '' ? 'bg-[#E8EFF5] font-semibold' : ''
                }`}
              >
                {campDefaultLabel}
              </button>
              {camps.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setCamp(c.name); setDropdownOpen(false) }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#D5E3F0] transition-colors duration-150 ${
                    camp === c.name ? 'bg-[#E8EFF5] font-semibold' : ''
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150 mt-1"
      >
        Ďalej
      </button>
    </div>
  )
}

// ── Step 2 ────────────────────────────────────────────────────────────────────
function StepEmail({
  name,
  selectedCamp,
  onSuccess,
  onBack,
}: {
  name: string
  selectedCamp: string
  onSuccess: () => void
  onBack: () => void
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    const trimmed = email.trim()
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setError('Prosím zadaj platný email.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/giveaway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, name, selectedCamp, source: 'landing-page' }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Nastala chyba. Skúste to prosím znova.')
      } else {
        onSuccess()
      }
    } catch {
      setError('Nastala chyba. Skúste to prosím znova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark text-center leading-tight pb-2 whitespace-nowrap">
        <span className="relative inline-block">
          Zadaj svoj email a si v hre!
          <svg
            className="absolute left-0 -bottom-2 w-full"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            style={{ height: '10px' }}
          >
            <path
              d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
              stroke="#DF2935"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h2>
      <div className="flex flex-col gap-3 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="tvoj@email.sk"
          className="border-2 border-bombovo-blue rounded-xl px-4 py-3 w-full focus:outline-none text-bombovo-dark"
          disabled={loading}
        />
        {error && <p className="text-bombovo-red text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150 mt-1 disabled:opacity-60"
        >
          {loading ? 'Odosielam…' : 'Prihlásiť sa do súťaže'}
        </button>
        <button
          onClick={onBack}
          disabled={loading}
          className="text-sm text-bombovo-blue underline text-center hover:text-bombovo-dark transition-colors disabled:opacity-60"
        >
          Späť
        </button>
      </div>
    </div>
  )
}

// ── Step 3 ────────────────────────────────────────────────────────────────────
function StepSuccess() {
  return (
    <div className="flex flex-col items-center gap-4 w-full text-center">
      <div className="text-6xl">🎉</div>
      <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark leading-tight pb-2">
        <span className="relative inline-block">
          Si v hre o tábor zadarmo!
          <svg
            className="absolute left-0 -bottom-2 w-full"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            style={{ height: '10px' }}
          >
            <path
              d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
              stroke="#DF2935"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h2>
      <p className="text-bombovo-dark/50 font-medium text-base leading-relaxed">
        Sleduj svoj email — víťaza oznámime pred letom. Veľa šťastia! 🤞
      </p>
    </div>
  )
}

// ── Slide variants ────────────────────────────────────────────────────────────
const variants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SutazClient({ photoUrl, camps }: Props) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [declined, setDeclined] = useState(false)
  const [entryName, setEntryName] = useState('')
  const [entryCamp, setEntryCamp] = useState('')

  function goTo(next: number, direction: number) {
    setDir(direction)
    setStep(next)
  }

  const formContent = (
    <AnimatePresence mode="wait" initial={false} custom={dir}>
      <motion.div
        key={declined ? 'declined' : step}
        custom={dir}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="w-full"
      >
        {declined ? (
          <StepDeclined />
        ) : step === 0 ? (
          <StepYesNo
            onYes={() => goTo(1, 1)}
            onNo={() => setDeclined(true)}
          />
        ) : step === 1 ? (
          <StepNameCamp
            camps={camps}
            onNext={(name, camp) => {
              setEntryName(name)
              setEntryCamp(camp)
              goTo(2, 1)
            }}
          />
        ) : step === 2 ? (
          <StepEmail
            name={entryName}
            selectedCamp={entryCamp}
            onSuccess={() => goTo(3, 1)}
            onBack={() => goTo(1, -1)}
          />
        ) : (
          <StepSuccess />
        )}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <>
      {/* ── MOBILE: form top 50%, photo bottom 50% ── */}
      <div className="md:hidden flex flex-col" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="flex-1 bg-bombovo-gray flex flex-col justify-center items-center px-6 py-10 overflow-visible">
          {formContent}
        </div>
        <PhotoPanel photoUrl={photoUrl} className="h-64 flex-shrink-0" />
      </div>

      {/* ── DESKTOP: side by side ── */}
      <div className="hidden md:flex" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <PhotoPanel photoUrl={photoUrl} className="w-1/2 flex-shrink-0" />
        <div className="flex-1 bg-bombovo-gray flex items-center justify-center px-14 py-10 overflow-hidden">
          <div className="w-full max-w-md">
            {formContent}
          </div>
        </div>
      </div>
    </>
  )
}
