'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CountdownBanner from '../CountdownBanner'

interface Cart {
  color: string
  colorLabel: string
  size: string
  qty: number
  basePrice: number
  delivery?: 'shipping' | 'camp'
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-bombovo-dark bg-white focus:border-bombovo-dark focus:outline-none transition-colors text-sm placeholder:text-gray-400'

const labelClass = 'block text-xs font-bold text-bombovo-dark uppercase tracking-wide mb-1.5'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)

  // Form state
  const [delivery, setDelivery] = useState<'shipping' | 'camp'>('shipping')
  const TURNUS_OPTIONS = [
    'FEST Animator Fest — 12.7.2026 – 18.7.2026',
    'FEST Animator Fest — 19.7.2026 – 25.7.2026',
    'FEST Animator Fest — 26.7.2026 – 1.8.2026',
    'FEST Animator Fest — 9.8.2026 – 15.8.2026',
    'FEST Animator Fest — 15.8.2026 – 23.8.2026',
  ]
  const [turnus, setTurnus] = useState(TURNUS_OPTIONS[0])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [streetName, setStreetName] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [gdpr, setGdpr] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('merch-cart')
    if (!raw) {
      router.replace('/merch-festanimatorfest')
      return
    }
    const parsed: Cart = JSON.parse(raw)
    setCart(parsed)
    if (parsed.delivery) setDelivery(parsed.delivery)
  }, [router])

  const shippingPrice = delivery === 'shipping' ? 5.34 : 0
  const subtotal = cart ? parseFloat((cart.basePrice * cart.qty).toFixed(2)) : 0
  const total = parseFloat((subtotal + shippingPrice).toFixed(2))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cart) return
    if (!gdpr) {
      setError('Súhlas so spracovaním osobných údajov je povinný.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/merch/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, email, phone,
          color: cart.color, colorLabel: cart.colorLabel,
          size: cart.size, qty: cart.qty, delivery,
          turnus: delivery === 'camp' ? turnus : undefined,
          street: delivery === 'shipping' ? `${streetName} ${houseNumber}`.trim() : undefined,
          city: delivery === 'shipping' ? city : undefined,
          zip: delivery === 'shipping' ? zip : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Nastala chyba. Skús to prosím znova.')
        return
      }

      sessionStorage.removeItem('merch-cart')
      router.push(`/merch-festanimatorfest/success?id=${data.orderId}&delivery=${delivery}`)

    } catch {
      setError('Nastala neočakávaná chyba. Skús to prosím znova.')
    } finally {
      setLoading(false)
    }
  }

  if (!cart) return null

  return (
    <>
      <Header />
      <CountdownBanner />
      <main className="min-h-screen bg-[#f5f5f3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">

          {/* Back link */}
          <Link
            href="/merch-festanimatorfest"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-bombovo-dark transition-colors mb-8 focus-visible:outline-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Späť na produkt
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* ── LEFT COLUMN — form ── */}
            <form onSubmit={handleSubmit} className="w-full lg:w-[60%] space-y-6">

              {/* SECTION 1 — Delivery */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-bold text-bombovo-dark text-base mb-4">Spôsob doručenia</h2>
                <div className="space-y-3">

                  {/* Shipping — shown first */}
                  <button
                    type="button"
                    onClick={() => setDelivery('shipping')}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-dark ${
                      delivery === 'shipping'
                        ? 'bg-bombovo-dark border-bombovo-dark text-white'
                        : 'bg-white border-gray-200 text-bombovo-dark hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          delivery === 'shipping' ? 'border-white' : 'border-gray-400'
                        }`}>
                          {delivery === 'shipping' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Doručenie na adresu</p>
                          <p className={`text-xs mt-0.5 ${delivery === 'shipping' ? 'text-white/70' : 'text-gray-500'}`}>
                            Predobjednávka — doručenie môže trvať 3–5 týždňov
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm flex-shrink-0 ${delivery === 'shipping' ? 'text-bombovo-yellow' : 'text-bombovo-dark'}`}>
                        €5.34
                      </span>
                    </div>
                  </button>

                  {/* Camp pickup */}
                  <div
                    onClick={() => setDelivery('camp')}
                    role="radio"
                    aria-checked={delivery === 'camp'}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setDelivery('camp')}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-dark ${
                      delivery === 'camp'
                        ? 'bg-bombovo-dark border-bombovo-dark text-white'
                        : 'bg-white border-gray-200 text-bombovo-dark hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          delivery === 'camp' ? 'border-white' : 'border-gray-400'
                        }`}>
                          {delivery === 'camp' && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Odovzdanie na tábore</p>
                          <p className={`text-xs mt-0.5 ${delivery === 'camp' ? 'text-white/70' : 'text-gray-500'}`}>
                            Vyzdvihneš si ho priamo na FEST tábore od animátorov
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm flex-shrink-0 ${delivery === 'camp' ? 'text-bombovo-yellow' : 'text-green-600'}`}>
                        ZADARMO
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 2 — Address (only for shipping) */}
              {delivery === 'shipping' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                  <h2 className="font-bold text-bombovo-dark text-base">Fakturačná adresa</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Meno *</label>
                      <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="Ján" />
                    </div>
                    <div>
                      <label className={labelClass}>Priezvisko *</label>
                      <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="Novák" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Ulica *</label>
                      <input type="text" required value={streetName} onChange={e => setStreetName(e.target.value)} className={inputClass} placeholder="Hlavná" />
                    </div>
                    <div>
                      <label className={labelClass}>Číslo domu *</label>
                      <input type="text" required value={houseNumber} onChange={e => setHouseNumber(e.target.value)} className={inputClass} placeholder="12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>PSČ *</label>
                      <input type="text" required value={zip} onChange={e => setZip(e.target.value)} className={inputClass} placeholder="811 01" />
                    </div>
                    <div>
                      <label className={labelClass}>Mesto *</label>
                      <input type="text" required value={city} onChange={e => setCity(e.target.value)} className={inputClass} placeholder="Bratislava" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Telefón *</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+421 900 000 000" />
                  </div>

                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="jan.novak@email.sk" />
                  </div>
                </div>
              )}

              {/* Contact info for camp pickup */}
              {delivery === 'camp' && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                  <h2 className="font-bold text-bombovo-dark text-base">Kontaktné údaje</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Meno *</label>
                      <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} placeholder="Ján" />
                    </div>
                    <div>
                      <label className={labelClass}>Priezvisko *</label>
                      <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} placeholder="Novák" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Telefón *</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="+421 900 000 000" />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="jan.novak@email.sk" />
                  </div>
                  <div>
                    <label className={labelClass}>Na ktorý turnus ideš? *</label>
                    <select
                      required
                      value={turnus}
                      onChange={e => setTurnus(e.target.value)}
                      className={inputClass}
                    >
                      {TURNUS_OPTIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* SECTION 3 — Payment */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-bold text-bombovo-dark text-base mb-4">Spôsob platby</h2>
                <div className="px-5 py-4 rounded-xl border-2 bg-bombovo-dark border-bombovo-dark">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">Zaplatím prevodom na účet</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  QR kód s platobnou výzvou vám príde po dokončení objednávky na email. Máte 48 hodín na zaplatenie.
                </p>
              </div>


              {/* GDPR */}
              <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors ${!gdpr ? 'border-gray-200 bg-white' : 'border-bombovo-dark bg-white'}`}>
                <input
                  id="gdpr"
                  type="checkbox"
                  required
                  checked={gdpr}
                  onChange={e => setGdpr(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-bombovo-dark flex-shrink-0 cursor-pointer"
                />
                <label htmlFor="gdpr" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                  Súhlasím so spracovaním osobných údajov za účelom vybavenia objednávky. <span className="text-bombovo-red font-semibold">*</span>
                </label>
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-bombovo-red text-sm font-medium">
                  {error}
                </div>
              )}


            </form>

            {/* ── RIGHT COLUMN — order summary (sticky) ── */}
            <div className="w-full lg:w-[40%] lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-bombovo-dark text-base">
                    Produkty v košíku <span className="text-gray-400 font-normal">(1 položka)</span>
                  </h2>
                </div>

                <div className="px-6 py-5">
                  {/* Product row */}
                  <div className="flex items-start gap-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-16 h-16 rounded-xl bg-bombovo-gray flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <span className="text-2xl">👕</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-bombovo-dark text-sm leading-snug">FEST Animator Hoodie 2026</p>
                      <p className="text-xs text-gray-500 mt-1">{cart.colorLabel} · {cart.size} · {cart.qty} ks</p>
                    </div>
                    <p className="font-bold text-bombovo-dark text-sm flex-shrink-0">
                      €{subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Medzisúčet</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Doprava</span>
                    <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingPrice === 0 ? 'ZADARMO' : `€${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                    <span className="font-bold text-bombovo-dark text-base">Celkom</span>
                    <span className="font-bold text-bombovo-dark text-xl">€{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Desktop submit in summary */}
                <div className="px-6 pb-6">
                  <button
                    form="checkout-form"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-sm rounded-full hover:bg-yellow-400 active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-dark focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Spracúvam…' : 'Dokončiť objednávku'}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
