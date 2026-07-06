'use client'

import { useState, useEffect } from 'react'

const KEY = 'recenzie_unlocked'
const CORRECT = 'Bell15*7'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(KEY) === '1') setUnlocked(true)
    setReady(true)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === CORRECT) {
      localStorage.setItem(KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (!ready) return null

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-screen bg-bombovo-gray flex items-center justify-center px-4">
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="font-bold text-xl text-[#080708]">Prístup len s heslom</h1>
          <p className="text-gray-500 text-sm mt-1">Táto stránka je chránená heslom.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Zadajte heslo"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            autoFocus
            className="border-2 border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:border-[#3772FF] text-[#080708] bg-white mb-3"
          />
          {error && (
            <p className="text-[#DF2935] text-sm mb-3 text-center font-medium">Nesprávne heslo. Skúste znova.</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold rounded-full py-3 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150"
          >
            Vstúpiť
          </button>
        </form>
      </div>
    </div>
  )
}
