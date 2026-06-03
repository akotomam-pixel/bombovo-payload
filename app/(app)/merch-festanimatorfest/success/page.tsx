'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function SuccessContent() {
  const params = useSearchParams()
  const orderId = params.get('id') ?? '—'
  const delivery = params.get('delivery') ?? 'camp'

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">

      {/* Checkmark */}
      <div className="w-20 h-20 bg-bombovo-blue rounded-full flex items-center justify-center mx-auto mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-bombovo-dark mb-3">Objednávka prijatá!</h1>

      <div className="inline-block px-5 py-2 bg-bombovo-yellow border-2 border-bombovo-dark rounded-full mb-6">
        <span className="font-bold text-bombovo-dark text-lg">#{orderId}</span>
      </div>

      <p className="text-gray-600 leading-relaxed mb-8">
        Skontroluj email — poslali sme ti QR kód na platbu.
        Máš <strong>72 hodín</strong> na zaplatenie.
      </p>

      {delivery === 'camp' && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-8 text-sm text-gray-700">
          <p>🏕️ Tvoj hoodie si vyzdvihneš priamo na <strong>FEST tábore</strong> od animátorov. Tešíme sa na teba!</p>
        </div>
      )}

      <Link
        href="/"
        className="inline-block px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold rounded-full hover:bg-yellow-400 active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-dark focus-visible:ring-offset-2"
      >
        Späť na bombovo.sk
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <Suspense fallback={<div className="py-32 text-center text-gray-400">Načítavam…</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
