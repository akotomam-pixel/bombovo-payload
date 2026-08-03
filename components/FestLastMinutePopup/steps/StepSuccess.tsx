'use client'

import { useState } from 'react'
import Link from 'next/link'

// The 9-day term (15.–23.8.2026, 449€, Horský hotel Lomy) — registrationId 1118
// in Payload's camps_dates table. The static data/camps/fest-animator-fest.ts
// file lists this term under the wrong id (5); the CTA must point at the real one.
const CTA_REGISTRATION_ID = '1118'

interface Props {
  headline: string
  body: string
  discountCode: string
  onClose: () => void
}

export default function StepSuccess({ headline, body, discountCode, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(discountCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — ignore, code is still visible to read/select manually
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full text-center">
      <div className="text-6xl">🎉</div>

      <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark leading-tight pb-2">
        <span className="relative inline-block">
          {headline}
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

      <p className="text-bombovo-dark/50 font-medium text-base leading-relaxed">{body}</p>

      <button
        type="button"
        onClick={handleCopy}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 bg-bombovo-yellow/20 border-2 border-dashed border-bombovo-blue rounded-xl hover:bg-bombovo-yellow/30 transition-all duration-150"
      >
        <span className="text-xl md:text-2xl font-bold tracking-wide text-bombovo-dark">
          {discountCode}
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold text-bombovo-blue">
          {copied ? (
            'Skopírované ✓'
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>
              Kopírovať
            </>
          )}
        </span>
      </button>

      <Link href={`/prihlaska/${CTA_REGISTRATION_ID}`} className="w-full" onClick={onClose}>
        <button className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150">
          Prihlásiť sa na tábor
        </button>
      </Link>
    </div>
  )
}
