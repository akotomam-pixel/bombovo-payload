'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { unlockCampPreview } from './previewActions'

interface Props {
  campName: string
  heroImage?: string
}

export default function CampPreviewGate({ campName, heroImage }: Props) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const ok = await unlockCampPreview(password)
      if (ok) {
        router.refresh()
      } else {
        setError(true)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />

      <main className="relative flex-grow flex items-center justify-center overflow-hidden bg-bombovo-dark px-4 py-24">
        {/* The camp's own hero photo, pushed far back — a glimpse of what's behind the gate */}
        {heroImage && (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-[2px] scale-105"
              style={{ backgroundImage: `url(/_next/image?url=${encodeURIComponent(heroImage)}&w=1200&q=60)` }}
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-bombovo-dark via-bombovo-dark/70 to-bombovo-dark/40" />
          </>
        )}

        <div className="relative w-full max-w-md text-center">
          <p className="font-amatic text-4xl md:text-5xl font-bold text-bombovo-yellow mb-2">
            {campName}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-[-0.03em] mb-6">
            Pripravujeme
          </h1>
          <p className="text-base text-white/75 leading-[1.7] mb-10">
            Táto stránka ešte nie je zverejnená. Ak máš heslo, zadaj ho nižšie.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="preview-password" className="sr-only">Heslo</label>
            <input
              id="preview-password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Heslo"
              aria-invalid={error}
              aria-describedby={error ? 'preview-password-error' : undefined}
              className={`w-full rounded-2xl border-[3px] bg-white px-5 py-4 text-lg text-bombovo-dark placeholder:text-gray-400 outline-none focus-visible:ring-4 focus-visible:ring-bombovo-yellow/50 ${
                error ? 'border-bombovo-red' : 'border-bombovo-yellow'
              }`}
            />
            {error && (
              <p id="preview-password-error" role="alert" className="text-left text-sm font-semibold text-bombovo-red">
                Nesprávne heslo. Skús to znova.
              </p>
            )}
            <button
              type="submit"
              disabled={isPending || password.length === 0}
              className="rounded-2xl bg-bombovo-yellow px-8 py-4 text-lg font-bold text-bombovo-dark shadow-[0_10px_30px_-10px_rgba(253,202,64,0.55)] transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isPending ? 'Overujem…' : 'Otvoriť stránku'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
