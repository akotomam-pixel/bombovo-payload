'use client'

import { useState } from 'react'

interface Props {
  headline: string
  emailPlaceholder: string
  submitLabel: string
  name: string
  selectedCamp: string
  onSuccess: () => void
  onBack: () => void
}

export default function StepEmail({
  emailPlaceholder,
  submitLabel,
  name,
  selectedCamp,
  onSuccess,
  onBack,
}: Props) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Prosím zadaj platný email.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/giveaway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, name, selectedCamp, source: 'popup' }),
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
          placeholder={emailPlaceholder}
          className="border-2 border-bombovo-blue rounded-xl px-4 py-3 w-full focus:outline-none text-bombovo-dark"
          disabled={loading}
        />
        {error && <p className="text-bombovo-red text-sm">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150 mt-1 disabled:opacity-60"
        >
          {loading ? 'Odosielam…' : submitLabel}
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
