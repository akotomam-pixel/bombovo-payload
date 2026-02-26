'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert('Prosím, súhlaste so spracovaním osobných údajov.')
      return
    }
    console.log('Newsletter signup:', email)
    alert('Ďakujeme za prihlásenie!')
    setEmail('')
    setAgreedToTerms(false)
  }

  return (
    <div className="bg-bombovo-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Prihláste sa na náš newsletter. A zistajte špeciálne ceny!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Zadajte váš e-mail"
              required
              className="flex-1 px-6 py-3 rounded-full bg-white text-bombovo-dark text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-gray-200 hover:bg-bombovo-yellow text-bombovo-dark font-medium transition-all duration-300 text-sm md:text-base"
            >
              Potvrdiť
            </button>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="newsletter-terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 flex-shrink-0 cursor-pointer"
              required
            />
            <label htmlFor="newsletter-terms" className="text-white text-xs md:text-sm">
              Súhlasím so{' '}
              <Link href="/gdpr" className="underline hover:opacity-80">
                spracovaním osobných údajov
              </Link>
            </label>
          </div>
        </form>
      </div>
    </div>
  )
}
