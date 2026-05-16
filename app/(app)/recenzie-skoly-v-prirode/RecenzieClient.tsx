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
  q1?: string
  q2?: string
  q3?: string
  q4?: string
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
            className={`text-4xl leading-none transition-transform duration-100 hover:scale-110 focus-visible:outline-2 focus-visible:outline-bombovo-blue ${
              star <= active ? 'text-bombovo-yellow' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {active > 0 && <p className="text-sm text-gray-500 mt-1">{STAR_HINTS[active]}</p>}
    </div>
  )
}

function StarDisplay({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-lg ${s <= stars ? 'text-bombovo-yellow' : 'text-gray-200'}`}>
          ★
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ApprovedReview }) {
  const hasNewFormat = !!(review.q1 || review.q2 || review.q3)

  return (
    <div className="border-2 border-gray-100 rounded-2xl p-6 bg-white shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-bombovo-dark text-sm leading-tight">{review.teacherName}</p>
          <p className="text-gray-500 text-xs mt-0.5">{review.schoolName}</p>
        </div>
        <StarDisplay stars={review.stars} />
      </div>

      {review.stredisko && (
        <span className="bg-bombovo-blue/10 text-bombovo-blue text-xs font-semibold px-3 py-1 rounded-full self-start">
          {review.stredisko}
          {review.kidCount ? ` · ${review.kidCount} detí` : ''}
        </span>
      )}

      <div className="border-t border-gray-100 pt-3 space-y-3 text-sm text-gray-700 leading-relaxed">
        {hasNewFormat ? (
          <>
            {review.q1 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ubytovanie a stredisko</p>
                <p>"{review.q1}"</p>
              </div>
            )}
            {review.q2 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Animačný tím a program</p>
                <p>"{review.q2}"</p>
              </div>
            )}
            {review.q3 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Čo sa vám páčilo</p>
                <p>"{review.q3}"</p>
              </div>
            )}
            {review.q4 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Doplnok</p>
                <p>"{review.q4}"</p>
              </div>
            )}
          </>
        ) : (
          <p>"{review.reviewText}"</p>
        )}
      </div>
    </div>
  )
}

const emptyForm = {
  teacherName: '',
  schoolName: '',
  stars: 0,
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  stredisko: '',
  kidCount: '',
}

export default function RecenzieClient({ strediska, approvedReviews }: Props) {
  const [formOpen, setFormOpen] = useState(false)
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

    if (!form.teacherName.trim()) return setError('Prosím zadajte meno učiteľa / učiteľky.')
    if (!form.schoolName.trim()) return setError('Prosím zadajte názov školy.')
    if (form.stars === 0) return setError('Prosím vyberte celkové hodnotenie.')
    if (form.q1.trim().length < 5) return setError('Prosím odpovedzte na otázku o ubytovaní.')
    if (form.q2.trim().length < 5) return setError('Prosím odpovedzte na otázku o animačnom tíme.')
    if (form.q3.trim().length < 5) return setError('Prosím odpovedzte, čo sa vám páčilo.')

    setLoading(true)
    try {
      const body: Record<string, unknown> = {
        teacherName: form.teacherName.trim(),
        schoolName: form.schoolName.trim(),
        stars: form.stars,
        q1: form.q1.trim(),
        q2: form.q2.trim(),
        q3: form.q3.trim(),
      }
      if (form.q4.trim()) body.q4 = form.q4.trim()
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

  const inputClass =
    'border-2 border-gray-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:border-bombovo-blue focus:ring-2 focus:ring-bombovo-blue/20 text-bombovo-dark bg-white transition-all duration-150'
  const labelClass = 'block text-sm font-semibold text-bombovo-dark mb-1'
  const textareaClass = `${inputClass} resize-none`

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {success ? (
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="bg-white border-4 border-bombovo-yellow rounded-3xl p-10 text-center max-w-sm mx-4 shadow-2xl">
            <span className="text-6xl mb-4 block" aria-hidden="true">🌟</span>
            <h2 className="text-4xl font-bold text-bombovo-dark" style={{ fontFamily: 'Caveat, cursive' }}>
              Svet si zaslúži vás!
            </h2>
            <p className="text-base text-gray-600 mt-3 leading-relaxed">
              Ďakujeme za vašu recenziu. Pomáhate ostatným učiteľom nájsť to správne miesto pre ich žiakov.
            </p>
            <button
              onClick={() => { setForm(emptyForm); setSuccess(false); setError(''); setFormOpen(false) }}
              className="bg-bombovo-red text-white border-2 border-bombovo-dark font-bold rounded-full px-8 py-3 mt-6 hover:translate-y-0.5 transition-transform duration-200"
            >
              Späť na recenzie
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Page header */}
          <section className="bg-bombovo-gray pt-10 pb-8 px-4 text-center">
            <h1 className="font-bold text-3xl md:text-4xl text-bombovo-dark">
              Recenzie od učiteľov
            </h1>
            {approvedReviews.length > 0 && (
              <p className="text-gray-500 mt-2 text-sm">
                {approvedReviews.length} overených recenzií od učiteľov zo Slovenska
              </p>
            )}
          </section>

          <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">

            {/* ── Collapsible form ───────────────────────────────────────────── */}
            <div className="border-4 border-bombovo-blue rounded-3xl overflow-hidden mb-10 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setFormOpen(!formOpen)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-bombovo-gray/50 transition-colors duration-150"
                aria-expanded={formOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✍️</span>
                  <span className="font-bold text-bombovo-dark text-base md:text-lg">
                    Napíšte recenziu
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-bombovo-dark flex-shrink-0 transition-transform duration-300 ${formOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Accordion body */}
              <div className={`grid transition-all duration-300 ease-in-out ${formOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="px-6 pb-8 pt-5 border-t-2 border-bombovo-blue/20">
                    <form onSubmit={handleSubmit} noValidate>

                      {/* Name + School */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="teacherName" className={labelClass}>
                            Meno učiteľa / učiteľky <span className="text-bombovo-red">*</span>
                          </label>
                          <input
                            id="teacherName" type="text" required
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
                            id="schoolName" type="text" required
                            placeholder="ZŠ Odborárska, Bratislava"
                            value={form.schoolName}
                            onChange={(e) => setField('schoolName', e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Overall star rating */}
                      <div className="mt-5">
                        <label className={labelClass}>
                          Celkové hodnotenie <span className="text-bombovo-red">*</span>
                        </label>
                        <StarRatingInput value={form.stars} onChange={(v) => setField('stars', v)} />
                      </div>

                      {/* Q1 */}
                      <div className="mt-5">
                        <label htmlFor="q1" className={labelClass}>
                          Ako ste boli spokojní s vybavením, čistotou a ubytovaním strediska? <span className="text-bombovo-red">*</span>
                        </label>
                        <textarea
                          id="q1" required rows={3}
                          placeholder="Napríklad: Izby boli čisté a priestranné, jedlo bolo výborné..."
                          value={form.q1}
                          onChange={(e) => setField('q1', e.target.value)}
                          className={textareaClass}
                        />
                      </div>

                      {/* Q2 */}
                      <div className="mt-5">
                        <label htmlFor="q2" className={labelClass}>
                          Ako ste boli spokojní s naším animačným tímom a programom? <span className="text-bombovo-red">*</span>
                        </label>
                        <textarea
                          id="q2" required rows={3}
                          placeholder="Napríklad: Animátori boli skvelí, deti sa zabávali celý deň..."
                          value={form.q2}
                          onChange={(e) => setField('q2', e.target.value)}
                          className={textareaClass}
                        />
                      </div>

                      {/* Q3 */}
                      <div className="mt-5">
                        <label htmlFor="q3" className={labelClass}>
                          Čo sa vám na škole v prírode najviac páčilo? <span className="text-bombovo-red">*</span>
                        </label>
                        <textarea
                          id="q3" required rows={3}
                          placeholder="Napríklad: Deti sa nechceli vracať domov, program bol nabitý aktivitami..."
                          value={form.q3}
                          onChange={(e) => setField('q3', e.target.value)}
                          className={textareaClass}
                        />
                      </div>

                      {/* Q4 */}
                      <div className="mt-5">
                        <label htmlFor="q4" className={labelClass}>
                          Chceli by ste niečo dodať?
                          <span className="text-gray-400 font-normal ml-1">(nepovinné)</span>
                        </label>
                        <textarea
                          id="q4" rows={2}
                          placeholder="Akékoľvek ďalšie pripomienky alebo odporúčania..."
                          value={form.q4}
                          onChange={(e) => setField('q4', e.target.value)}
                          className={textareaClass}
                        />
                      </div>

                      {/* Optional: stredisko + kidCount */}
                      <div className="mt-6 pt-5 border-t-2 border-gray-100">
                        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4">Nepovinné doplnky</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="stredisko" className={labelClass}>Stredisko</label>
                            <select
                              id="stredisko"
                              value={form.stredisko}
                              onChange={(e) => setField('stredisko', e.target.value)}
                              className={`${inputClass} cursor-pointer`}
                            >
                              <option value="">— Vyberte stredisko —</option>
                              {strediska.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="kidCount" className={labelClass}>Počet detí</label>
                            <input
                              id="kidCount" type="number" min={1} max={300}
                              placeholder="napr. 28"
                              value={form.kidCount}
                              onChange={(e) => setField('kidCount', e.target.value)}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {error && <p className="mt-4 text-bombovo-red text-sm font-medium">{error}</p>}

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-base rounded-full py-4 w-full hover:translate-y-0.5 active:translate-y-1 transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Odosiela sa...' : 'Odoslať recenziu'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Reviews list ───────────────────────────────────────────────── */}
            {approvedReviews.length === 0 ? (
              <p className="italic text-gray-500 text-center py-12">
                Buďte prvá škola, ktorá zanechá recenziu!
              </p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-bombovo-dark mb-6">
                  Čo hovoria učitelia o Bombove
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {approvedReviews.map((review, i) => (
                    <ReviewCard key={i} review={review} />
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      <Footer />
    </main>
  )
}
