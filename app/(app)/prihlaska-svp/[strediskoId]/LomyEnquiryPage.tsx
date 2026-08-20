'use client'

import Link from 'next/link'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LomyEnquiryForm from '@/components/LomyEnquiryForm'

/**
 * The Lomy enquiry page, rendered at /prihlaska-svp/horsky-hotel-lomy in place
 * of the long registration form.
 *
 * It exists so a clicked date row has somewhere to land with its date carried
 * over; the form itself is the same component the page section and the hero
 * popup render.
 */
export default function LomyEnquiryPage({ initialTerm }: { initialTerm: string }) {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      <section className="bg-bombovo-gray">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Link
            href="/skoly-v-prirode/horsky-hotel-lomy"
            className="inline-flex items-center gap-2 text-[16px] font-medium text-[#3A403A] transition-colors duration-150 hover:text-bombovo-dark"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H6M11 6l-6 6 6 6" />
            </svg>
            Späť na Horský hotel Lomy
          </Link>

          <h1
            className="mt-5 text-[clamp(1.7rem,4vw,2.4rem)] leading-[1.1] text-bombovo-dark font-bold"
            style={{ fontFamily: 'var(--font-subhead), "Comic Sans MS", cursive' }}
          >
            Získať cenovú ponuku
          </h1>

          {initialTerm && (
            <p className="mt-3 inline-flex rounded-[8px] bg-white px-4 py-2 text-[17px] text-[#1F2320] ring-1 ring-[#DDE0DD]">
              Vybraný termín: <span className="ml-1.5 font-bold">{initialTerm}</span>
            </p>
          )}

          <div className="mt-7 rounded-[14px] bg-white p-6 shadow-[0_1px_2px_rgba(8,7,8,0.04),0_16px_36px_-26px_rgba(8,7,8,0.28)] ring-1 ring-[#DDE0DD] sm:p-8">
            <LomyEnquiryForm initialTerm={initialTerm} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
