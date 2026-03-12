'use client'

import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_CAMP = 'Akýkoľvek Tábor'

interface CampItem {
  camp?: { name: string } | null
  isVisible?: boolean
}

interface GiveawaySectionProps {
  headline: string
  subHeadline: string
  giveawayCamps: CampItem[]
}

export default function GiveawaySection({ headline, subHeadline, giveawayCamps }: GiveawaySectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [camp, setCamp] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const selectedCampLabel = camp || DEFAULT_CAMP

  // Filter visible camps from Payload
  const visibleCamps = giveawayCamps
    .filter(item => item.isVisible !== false && item.camp?.name)
    .map(item => item.camp!)

  async function handleSubmit() {
    const newErrors: { name?: string; email?: string } = {}
    if (!name.trim()) newErrors.name = 'Meno je povinné.'
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) newErrors.email = 'Zadaj platný email.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/giveaway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          selectedCamp: camp || DEFAULT_CAMP,
          source: 'homepage',
        }),
      })
      const data = await res.json()
      if (res.ok && !data.error) {
        setSubmitted(true)
      } else {
        setErrors({ email: data.error || 'Nastala chyba. Skúste to znova.' })
      }
    } catch {
      setErrors({ email: 'Nastala chyba. Skúste to znova.' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-3">
            Si v hre o tábor zadarmo!
          </h2>
          <p className="text-bombovo-dark/60 text-base">
            Sleduj svoj email — víťaza oznámime pred letom. Veľa šťastia! 🤞
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-3 text-center">
          <span className="relative inline-block pb-3">
            {headline}
            <svg
              className="absolute left-0 -bottom-1 w-full"
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

        {/* Subtext */}
        <p className="text-bombovo-dark/70 text-base md:text-lg text-center mb-10">
          {subHeadline}
        </p>

        {/* Row 1: Name + Camp */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          {/* Name */}
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meno"
              className="w-full px-4 py-3 border-2 border-bombovo-dark rounded-xl text-bombovo-dark placeholder:text-bombovo-dark/40 focus:outline-none focus:border-bombovo-blue"
            />
            {errors.name && <p className="text-bombovo-red text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Camp dropdown */}
          <div className="flex-1 relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-full px-4 py-3 border-2 border-bombovo-dark rounded-xl text-bombovo-dark flex items-center justify-between focus:outline-none focus:border-bombovo-blue"
            >
              <span className={camp ? 'text-bombovo-dark' : 'text-bombovo-dark/40'}>
                {selectedCampLabel}
              </span>
              <FiChevronDown className={`transition-transform duration-200 flex-shrink-0 ml-2 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-xl border-2 border-bombovo-dark max-h-64 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setCamp(''); setDropdownOpen(false) }}
                  className={`w-full px-4 py-3 text-left hover:bg-bombovo-gray transition-colors text-sm ${camp === '' ? 'font-semibold' : ''}`}
                >
                  {DEFAULT_CAMP}
                </button>
                {visibleCamps.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setCamp(c.name); setDropdownOpen(false) }}
                    className={`w-full px-4 py-3 text-left hover:bg-bombovo-gray transition-colors text-sm ${camp === c.name ? 'font-semibold' : ''}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Email"
            className="w-full px-4 py-3 border-2 border-bombovo-dark rounded-xl text-bombovo-dark placeholder:text-bombovo-dark/40 focus:outline-none focus:border-bombovo-blue"
            disabled={loading}
          />
          {errors.email && <p className="text-bombovo-red text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Row 3: CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150 disabled:opacity-60"
        >
          {loading ? 'Odosielam…' : 'Zapoj Ma Do Súťaže'}
        </button>
      </div>
    </section>
  )
}
