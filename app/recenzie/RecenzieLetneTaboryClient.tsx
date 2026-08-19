'use client'

import { useMemo, useRef, useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export type CampReview = {
  id: number
  reviewer_name: string
  reviewer_type: 'tabornik' | 'rodic'
  camp_name: string | null
  stars: number
  review_text: string
  created_at: string
}

// Totals computed across the whole database, not just the reviews rendered below.
export type ReviewStats = {
  total: number
  average: number
  starCounts: Record<1 | 2 | 3 | 4 | 5, number>
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const STAR_HINTS: Record<number, string> = {
  1: 'Mohlo byť lepšie',
  2: 'Ujde to',
  3: 'Dobre',
  4: 'Výborne',
  5: 'Fantastické!',
}

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('sk-SK', { year: 'numeric', month: 'long', day: 'numeric' })
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  return (
    <div>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} hviezdičiek`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className={`text-[2.2rem] leading-none transition-transform duration-100 hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#3772FF] ${
              star <= active ? 'text-[#FDCA40]' : 'text-gray-200'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {active > 0 && (
        <p className="text-sm text-gray-400 mt-1 font-medium">{STAR_HINTS[active]}</p>
      )}
    </div>
  )
}

function StarDisplay({ stars, size = 'md' }: { stars: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg'
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`${cls} ${s <= stars ? 'text-[#FDCA40]' : 'text-gray-200'}`}>
          ★
        </span>
      ))}
    </span>
  )
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#3772FF] font-medium w-10 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-[14px] bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FDCA40] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-500 w-8 shrink-0">{pct}%</span>
    </div>
  )
}

function AggregateStats({
  reviews,
  stats,
  onWriteReview,
}: {
  reviews: CampReview[]
  stats: ReviewStats | null
  onWriteReview: () => void
}) {
  // Prefer database-wide totals; fall back to the loaded page if the count query failed.
  const total = stats ? stats.total : reviews.length
  const avg = stats
    ? stats.average
    : total > 0
      ? reviews.reduce((s, r) => s + r.stars, 0) / total
      : 0
  const countFor = (s: number) =>
    stats ? (stats.starCounts[s as 1 | 2 | 3 | 4 | 5] ?? 0) : reviews.filter((r) => r.stars === s).length

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start border-b-2 border-gray-100 pb-8 mb-8">
      <div className="flex flex-col items-center md:items-start shrink-0 md:w-52">
        <p className="text-6xl font-bold text-[#080708] leading-none">
          {total > 0 ? avg.toFixed(1) : '–'}
        </p>
        <div className="mt-2">
          <StarDisplay stars={Math.round(avg)} size="lg" />
        </div>
        <p className="text-gray-500 text-sm mt-1">
          {total === 0 ? 'Zatiaľ žiadne recenzie' : total === 1 ? '1 hodnotenie' : `${total} hodnotení`}
        </p>
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        {[5, 4, 3, 2, 1].map((s) => (
          <RatingBar key={s} label={`${s} ★`} count={countFor(s)} total={total} />
        ))}
      </div>

      <div className="shrink-0 flex flex-col items-start gap-3 md:border-l-2 md:border-gray-100 md:pl-8">
        <div>
          <p className="font-bold text-[#080708] text-base">Napísať recenziu</p>
          <p className="text-gray-500 text-sm mt-0.5 max-w-[200px]">
            Zdieľajte vaše skúsenosti s ostatnými
          </p>
        </div>
        <button
          onClick={onWriteReview}
          className="px-6 py-2.5 bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-semibold rounded-full text-sm hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#3772FF]"
        >
          Napísať recenziu zákazníka
        </button>
      </div>
    </div>
  )
}

function CampFilter({
  options,
  value,
  onChange,
}: {
  options: { name: string; count: number }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#080708] bg-white focus:outline-none focus:border-[#3772FF] focus:ring-2 focus:ring-[#3772FF]/20 transition-colors duration-150"
    >
      <option value="">Všetky tábory ({options.reduce((s, o) => s + o.count, 0)})</option>
      {options.map((o) => (
        <option key={o.name} value={o.name}>
          {o.name} ({o.count})
        </option>
      ))}
    </select>
  )
}

function ReviewCard({ review }: { review: CampReview }) {
  return (
    <div className="py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 select-none">
          {initials(review.reviewer_name)}
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <p className="font-bold text-[#080708] text-sm leading-tight">{review.reviewer_name}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" fill="#16a34a" />
              <path d="M3.5 6l1.8 1.8 3.2-3.6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Overená recenzia
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <StarDisplay stars={review.stars} size="md" />
        <span className="text-gray-400 text-xs">·</span>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            review.reviewer_type === 'tabornik'
              ? 'bg-[#FDCA40]/20 text-[#080708]'
              : 'bg-[#3772FF]/10 text-[#3772FF]'
          }`}
        >
          {review.reviewer_type === 'tabornik' ? 'Dieťa z tábora' : 'Rodič dieťaťa'}
        </span>
        {review.camp_name && (
          <>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-xs font-medium text-gray-500">{review.camp_name}</span>
          </>
        )}
        {review.created_at && (
          <>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-400 text-xs">{formatDate(review.created_at)}</span>
          </>
        )}
      </div>

      <p className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">&ldquo;{review.review_text}&rdquo;</p>
    </div>
  )
}

// ── Write review form ──────────────────────────────────────────────────────────

const emptyForm = {
  reviewerName: '',
  reviewerType: '' as '' | 'tabornik' | 'rodic',
  campName: '',
  stars: 0,
  reviewText: '',
}

function ReviewForm({
  camps,
  onClose,
  onSuccess,
}: {
  camps: { id: string; name: string }[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function setField<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.reviewerName.trim()) return setError('Prosím zadajte vaše meno.')
    if (!form.reviewerType) return setError('Prosím vyberte, či ste taborník alebo rodič.')
    if (form.stars === 0) return setError('Prosím vyberte hodnotenie.')
    if (form.reviewText.trim().length < 10) return setError('Prosím napíšte recenziu (min. 10 znakov).')

    setLoading(true)
    try {
      const res = await fetch('/api/letne-tabory-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: form.reviewerName.trim(),
          reviewerType: form.reviewerType,
          campName: form.campName.trim(),
          stars: form.stars,
          reviewText: form.reviewText.trim(),
        }),
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

  const inputCls =
    'border-2 border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:border-[#3772FF] focus:ring-2 focus:ring-[#3772FF]/20 text-[#080708] bg-white transition-colors duration-150'
  const labelCls = 'block text-sm font-semibold text-[#080708] mb-1.5'

  return (
    <div className="border-2 border-[#FDCA40] rounded-2xl p-6 md:p-8 bg-white mb-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#080708] text-lg">Napísať recenziu zákazníka</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 transition-colors p-1 focus-visible:outline-2 focus-visible:outline-[#3772FF]"
          aria-label="Zatvoriť formulár"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-5">
          <label className={labelCls}>
            Som <span className="text-[#DF2935]">*</span>
          </label>
          <div className="flex gap-3">
            {(['tabornik', 'rodic'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setField('reviewerType', type)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#3772FF] ${
                  form.reviewerType === type
                    ? type === 'tabornik'
                      ? 'bg-[#FDCA40] border-[#080708] text-[#080708]'
                      : 'bg-[#3772FF] border-[#3772FF] text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                {type === 'tabornik' ? '🏕️ Dieťa z tábora' : '👨‍👩‍👧 Rodič dieťaťa'}
              </button>
            ))}
          </div>
        </div>

        {form.reviewerType === 'tabornik' && (
          <div className="mb-5">
            <label htmlFor="campName" className={labelCls}>
              Na akom tábore si bol/bola?
            </label>
            <select
              id="campName"
              value={form.campName}
              onChange={(e) => setField('campName', e.target.value)}
              className={inputCls}
            >
              <option value="">Vyber tábor</option>
              {camps.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="reviewerName" className={labelCls}>
            Meno <span className="text-[#DF2935]">*</span>
          </label>
          <input
            id="reviewerName"
            type="text"
            placeholder="Napr. Jana K."
            value={form.reviewerName}
            onChange={(e) => setField('reviewerName', e.target.value)}
            className={inputCls}
            required
          />
        </div>

        <div className="mb-5">
          <label className={labelCls}>
            Celkové hodnotenie <span className="text-[#DF2935]">*</span>
          </label>
          <StarRatingInput value={form.stars} onChange={(v) => setField('stars', v)} />
        </div>

        <div className="mb-6">
          <label htmlFor="reviewText" className={labelCls}>
            Vaša recenzia <span className="text-[#DF2935]">*</span>
          </label>
          <textarea
            id="reviewText"
            rows={4}
            placeholder="Čo sa vám páčilo? Ako prebiehal tábor? Odporučili by ste nás ostatným?"
            value={form.reviewText}
            onChange={(e) => setField('reviewText', e.target.value)}
            className={`${inputCls} resize-none`}
            required
          />
        </div>

        {error && <p className="mb-4 text-[#DF2935] text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold text-base rounded-full py-4 hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#3772FF]"
        >
          {loading ? 'Odosiela sa...' : 'Odoslať recenziu'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Recenzia sa zverejní automaticky.
        </p>
      </form>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function RecenzieLetneTaboryClient({
  reviews,
  camps,
  stats,
}: {
  reviews: CampReview[]
  camps: { id: string; name: string }[]
  stats?: ReviewStats | null
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedCamp, setSelectedCamp] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  const campOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const r of reviews) {
      if (r.camp_name) counts.set(r.camp_name, (counts.get(r.camp_name) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [reviews])

  const filteredReviews = useMemo(
    () => (selectedCamp ? reviews.filter((r) => r.camp_name === selectedCamp) : reviews),
    [reviews, selectedCamp]
  )

  function openForm() {
    setFormOpen(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <div className="bg-bombovo-gray">
          <TopBar />
        </div>
        <Header />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="bg-white border-4 border-[#FDCA40] rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl">
            <span className="text-6xl mb-4 block">🌟</span>
            <h2 className="text-4xl font-bold text-[#080708]" style={{ fontFamily: 'Caveat, cursive' }}>
              Ďakujeme!
            </h2>
            <p className="text-base text-gray-600 mt-3 leading-relaxed">
              Vaša recenzia bola zverejnená. Pomáhate ostatným nájsť ten správny tábor!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#DF2935] text-white border-2 border-[#080708] font-bold rounded-full px-8 py-3 mt-6 hover:-translate-y-0.5 transition-transform duration-200"
            >
              Späť na recenzie
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
        {campOptions.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <label htmlFor="campFilter" className="text-sm font-semibold text-[#080708] shrink-0">
              Filtrovať podľa tábora
            </label>
            <CampFilter options={campOptions} value={selectedCamp} onChange={setSelectedCamp} />
          </div>
        )}

        <AggregateStats
          reviews={filteredReviews}
          stats={selectedCamp ? null : (stats ?? null)}
          onWriteReview={openForm}
        />

        <div ref={formRef}>
          {formOpen && (
            <ReviewForm camps={camps} onClose={() => setFormOpen(false)} onSuccess={() => setSubmitted(true)} />
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🏕️</p>
            <p className="text-gray-500 text-base">Buďte prvý, kto zanechá recenziu!</p>
            <button
              onClick={openForm}
              className="mt-5 px-7 py-3 bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold rounded-full text-sm hover:-translate-y-0.5 transition-transform duration-150"
            >
              Napísať recenziu
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 text-base">Pre tento tábor zatiaľ nemáme žiadne recenzie.</p>
          </div>
        ) : (
          <div>
            <h2 className="font-bold text-lg text-[#080708] mb-2">
              {selectedCamp ? `Recenzie: ${selectedCamp}` : 'Top recenzie od taborníkov'}
            </h2>
            <div className="divide-y divide-gray-100">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
