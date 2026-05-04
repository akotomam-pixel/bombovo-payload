'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Stredisko {
  id: string
  name: string
}

interface ApprovedReview {
  teacherName: string
  schoolName: string
  stars: number
  reviewText: string
  stredisko?: string
  kidCount?: number
  createdAt: string
}

interface Props {
  strediska: Stredisko[]
  approvedReviews: ApprovedReview[]
}

const STAR_HINTS: Record<number, string> = {
  1: 'Mohlo byť lepšie',
  2: 'Ujde to',
  3: 'Dobre',
  4: 'Výborne',
  5: 'Fantastické!',
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
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
            className={`text-4xl leading-none transition-transform duration-100 hover:scale-110 focus-visible:outline-2 focus-visible:outline-bombovo-blue ${
              star <= active ? 'text-bombovo-yellow' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {active > 0 && (
        <p className="text-sm text-gray-500 mt-1">{STAR_HINTS[active]}</p>
      )}
    </div>
  )
}

function StarDisplay({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-xl ${s <= stars ? 'text-bombovo-yellow' : 'text-gray-300'}`}>
          {s <= stars ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ApprovedReview }) {
  return (
    <div className="border-2 border-bombovo-yellow rounded-3xl p-6 bg-bombovo-gray flex flex-col gap-1">
      <StarDisplay stars={review.stars} />
      <p className="text-sm leading-relaxed text-gray-700 my-3">"{review.reviewText}"</p>
      <p className="font-bold text-bombovo-dark text-sm">{review.teacherName}</p>
      <p className="text-gray-500 text-sm">{review.schoolName}</p>
      {review.stredisko && (
        <span className="bg-bombovo-blue text-white text-xs font-semibold px-3 py-1 rounded-full mt-3 inline-block self-start">
          {review.stredisko}
          {review.kidCount ? ` · ${review.kidCount} detí` : ''}
        </span>
      )}
    </div>
  )
}

const emptyForm = {
  teacherName: '',
  schoolName: '',
  stars: 0,
  reviewText: '',
  stredisko: '',
  kidCount: '',
}

export default function RecenzieClient({ strediska, approvedReviews }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function setField(key: keyof typeof emptyForm, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.teacherName.trim()) {
      setError('Prosím zadajte meno učiteľa / učiteľky.')
      return
    }
    if (!form.schoolName.trim()) {
      setError('Prosím zadajte názov školy.')
      return
    }
    if (form.stars === 0) {
      setError('Prosím vyberte hodnotenie.')
      return
    }
    if (!form.reviewText.trim() || form.reviewText.trim().length < 10) {
      setError('Recenzia musí mať aspoň 10 znakov.')
      return
    }

    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        teacherName: form.teacherName.trim(),
        schoolName: form.schoolName.trim(),
        stars: form.stars,
        reviewText: form.reviewText.trim(),
      }
      if (form.stredisko) body.stredisko = form.stredisko
      if (form.kidCount !== '') body.kidCount = Number(form.kidCount)

      const res = await fetch('/api/teacher-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Nastala chyba. Skúste to prosím znova.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Nastala chyba. Skúste to prosím znova.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setForm(emptyForm)
    setSuccess(false)
    setError('')
  }

  const inputClass =
    'border-2 border-bombovo-blue rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-bombovo-blue/30 text-bombovo-dark bg-white transition-shadow duration-150'
  const labelClass = 'block text-sm font-semibold text-bombovo-dark mb-1'

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {success ? (
        <div className="flex-1 flex items-center justify-center bg-black/50 py-16 px-4">
          <div className="bg-white border-4 border-bombovo-yellow rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl">
            <span className="text-6xl mb-4 block" aria-hidden="true">🌟</span>
            <h2
              className="text-4xl font-bold text-bombovo-dark"
              style={{ fontFamily: 'Caveat, cursive' }}
            >
              Svet si zaslúži vás!
            </h2>
            <p className="text-base text-gray-600 mt-3 leading-relaxed">
              Ďakujeme za vašu recenziu. Pomáhate ostatným učiteľom nájsť to správne miesto pre
              ich žiakov. Recenzia sa zobrazí po schválení.
            </p>
            <button
              onClick={handleReset}
              className="bg-bombovo-red text-white border-2 border-bombovo-dark font-bold rounded-full px-8 py-3 mt-6 hover:translate-y-0.5 transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-bombovo-dark"
            >
              Späť na recenzie
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Hero band */}
          <section className="bg-bombovo-gray py-12 text-center px-4">
            <h1 className="font-bold text-4xl md:text-5xl text-bombovo-dark">
              Povedzte nám, ako to{' '}
              <span className="text-bombovo-red underline decoration-bombovo-red">prebehlo</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto mt-3 leading-relaxed">
              Vaša recenzia pomáha ostatným učiteľom pri rozhodovaní. Ďakujeme, že ste si našli
              chvíľu.
            </p>
          </section>

          {/* Form section */}
          <section className="max-w-2xl mx-auto px-4 py-12 w-full">
            <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-white shadow-lg">
              <form onSubmit={handleSubmit} noValidate>
                {/* Row 1: name + school */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="teacherName" className={labelClass}>
                      Meno učiteľa / učiteľky <span className="text-bombovo-red">*</span>
                    </label>
                    <input
                      id="teacherName"
                      type="text"
                      required
                      placeholder="Mgr. Jana Nováková"
                      value={form.teacherName}
                      onChange={(e) => setField('teacherName', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="schoolName" className={labelClass}>
                      Názov školy <span className="text-bombovo-red">*</span>
                    </label>
                    <input
                      id="schoolName"
                      type="text"
                      required
                      placeholder="ZŠ Odborárska, Bratislava"
                      value={form.schoolName}
                      onChange={(e) => setField('schoolName', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row 2: star rating */}
                <div className="mt-6">
                  <label className={labelClass}>
                    Celkové hodnotenie <span className="text-bombovo-red">*</span>
                  </label>
                  <StarRatingInput
                    value={form.stars}
                    onChange={(v) => setField('stars', v)}
                  />
                </div>

                {/* Row 3: review text */}
                <div className="mt-6">
                  <label htmlFor="reviewText" className={labelClass}>
                    Váš zážitok <span className="text-bombovo-red">*</span>
                  </label>
                  <textarea
                    id="reviewText"
                    required
                    rows={5}
                    placeholder="Povedzte nám, ako to prebehlo. Čo sa deťom páčilo? Čo ocenili učitelia?"
                    value={form.reviewText}
                    onChange={(e) => setField('reviewText', e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Divider */}
                <div className="mt-8 mb-2 flex items-center gap-3">
                  <div className="flex-1 border-t-2 border-bombovo-gray" />
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                    Nepovinné doplnky
                  </span>
                  <div className="flex-1 border-t-2 border-bombovo-gray" />
                </div>

                {/* Row 4: stredisko + kidCount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="stredisko" className={labelClass}>
                      Stredisko
                    </label>
                    <select
                      id="stredisko"
                      value={form.stredisko}
                      onChange={(e) => setField('stredisko', e.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">— Vyberte stredisko —</option>
                      {strediska.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="kidCount" className={labelClass}>
                      Počet detí
                    </label>
                    <input
                      id="kidCount"
                      type="number"
                      min={1}
                      max={300}
                      placeholder="napr. 28"
                      value={form.kidCount}
                      onChange={(e) => setField('kidCount', e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="mt-4 text-bombovo-red text-sm font-medium">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full py-4 w-full hover:translate-y-0.5 active:translate-y-1 transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-bombovo-dark"
                >
                  {loading ? 'Odosiela sa...' : 'Odoslať recenziu'}
                </button>
              </form>
            </div>
          </section>

          {/* Reviews section */}
          <section className="max-w-2xl mx-auto px-4 pb-16 w-full">
            <h2 className="text-3xl font-bold text-bombovo-dark mb-8">
              Čo hovoria ostatné učiteľky
            </h2>
            {approvedReviews.length === 0 ? (
              <p className="italic text-gray-500 text-center">
                Buďte prvá škola, ktorá zanechá recenziu!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedReviews.map((review, i) => (
                  <ReviewCard key={i} review={review} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <Footer />
    </main>
  )
}
