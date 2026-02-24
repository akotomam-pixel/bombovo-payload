'use client'

import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

interface Camp {
  id: string
  name: string
}

interface Props {
  headline: string
  namePlaceholder: string
  campDefaultLabel: string
  nextLabel: string
  camps: Camp[]
  onNext: (name: string, camp: string) => void
}

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

export default function StepNameCamp({
  namePlaceholder,
  campDefaultLabel,
  nextLabel,
  camps,
  onNext,
}: Props) {
  const [name, setName] = useState('')
  const [camp, setCamp] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!name.trim()) {
      setError('Prosím zadaj svoje meno.')
      return
    }
    setError('')
    onNext(name.trim(), camp || campDefaultLabel)
  }

  const selectedLabel = camp || campDefaultLabel

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Name section */}
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
          placeholder={namePlaceholder}
          className="border-2 border-bombovo-blue rounded-xl px-4 py-3 w-full focus:outline-none text-bombovo-dark"
        />
        {error && <p className="text-bombovo-red text-sm">{error}</p>}
      </div>

      {/* Camp section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-bombovo-dark leading-tight pb-2">
          <span className="relative inline-block">
            Krok 2: Vyber si ktorý tábor chceš vyhrať
            <WavyUnderline />
          </span>
        </h2>

        {/* Custom dropdown */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className={`w-full px-6 py-4 rounded-xl flex items-center justify-between transition-all duration-200 border-2 ${
              dropdownOpen
                ? 'bg-[#D5E3F0] border-bombovo-blue'
                : 'bg-[#E8EFF5] border-transparent hover:bg-[#D5E3F0]'
            }`}
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

      {/* Yellow CTA button */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150 mt-1"
      >
        {nextLabel}
      </button>
    </div>
  )
}
