'use client'

import { useState } from 'react'

interface Props {
  headline: string
  namePlaceholder: string
  nextLabel: string
  onNext: (name: string) => void
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

export default function StepName({ headline, namePlaceholder, nextLabel, onNext }: Props) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!name.trim()) {
      setError('Prosím zadaj svoje meno.')
      return
    }
    setError('')
    onNext(name.trim())
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-bombovo-dark leading-tight pb-2">
          <span className="relative inline-block">
            {headline}
            <WavyUnderline />
          </span>
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={namePlaceholder}
          className="border-2 border-bombovo-blue rounded-xl px-4 py-3 w-full focus:outline-none text-bombovo-dark"
        />
        {error && <p className="text-bombovo-red text-sm">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150 mt-1"
      >
        {nextLabel}
      </button>
    </div>
  )
}
