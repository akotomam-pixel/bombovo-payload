'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CountdownBanner from './CountdownBanner'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import type { LightGallery as LightGalleryType } from 'lightgallery/lightgallery'

const SIZES = ['S', 'M', 'L', 'XL']

const COLORS = [
  { id: 'black', label: 'Čierna', hex: '#1a1a1a' },
  { id: 'gray', label: 'Sivá', hex: '#8a8a8a' },
]

const PHOTOS: Record<string, string[]> = {
  black: [
    '/images/merch/hoodie-black/photo-1.jpeg',
    '/images/merch/hoodie-black/photo-2.jpeg',
    '/images/merch/hoodie-black/photo-3.jpeg',
    '/images/merch/hoodie-black/photo-4.jpeg',
    '/images/merch/hoodie-black/photo-5.jpeg',
    '/images/merch/hoodie-black/photo-6.jpeg',
  ],
  gray: [
    '/images/merch/hoodie-grey/gphoto-1.jpeg',
    '/images/merch/hoodie-grey/gphoto-2.jpeg',
    '/images/merch/hoodie-grey/gphoto-3.jpeg',
    '/images/merch/hoodie-grey/gphoto-4.png',
    '/images/merch/hoodie-grey/gphoto-5.jpeg',
    '/images/merch/hoodie-grey/gphoto-6.png',
  ],
}

export default function MerchPage() {
  const router = useRouter()
  const lgRef = useRef<LightGalleryType | null>(null)

  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  const basePrice = 39.99
  const photos = PHOTOS[selectedColor.id]

  const dynamicEl = photos.map(src => ({ src, thumb: src }))

  function openGallery(index: number) {
    lgRef.current?.openGallery(index)
  }

  function handleOrder() {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    const cart = {
      color: selectedColor.id,
      colorLabel: selectedColor.label,
      size: selectedSize,
      qty,
      basePrice,
    }
    sessionStorage.setItem('merch-cart', JSON.stringify(cart))
    router.push('/merch-festanimatorfest/checkout')
  }

  return (
    <>
      <Header />
      <CountdownBanner />

      {/* Hidden LightGallery instance */}
      <div className="hidden">
        <LightGallery
          onInit={detail => { lgRef.current = detail.instance }}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={dynamicEl}
          speed={500}
          download={false}
        >
          <span />
        </LightGallery>
      </div>

      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* LEFT — Image area */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              {/* Main image */}
              <button
                onClick={() => openGallery(0)}
                className="relative w-full aspect-square rounded-3xl overflow-hidden bg-bombovo-gray cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-blue"
              >
                <Image
                  src={photos[0]}
                  alt={`FEST Animator Hoodie 2026 – ${selectedColor.label}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </button>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {photos.slice(1, 4).map((src, i) => (
                  <button
                    key={src}
                    onClick={() => openGallery(i + 1)}
                    className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-bombovo-gray cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-blue hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={src}
                      alt={`FEST Animator Hoodie 2026 – ${selectedColor.label} ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 16vw"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT — Product info */}
            <div className="lg:w-1/2 flex flex-col gap-6">

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-bombovo-red text-white text-xs font-bold rounded-full uppercase tracking-wide">FEST 2026</span>
                <span className="px-3 py-1 bg-bombovo-yellow text-bombovo-dark text-xs font-bold rounded-full uppercase tracking-wide">47 kusov zostatok</span>
                <span className="px-3 py-1 bg-bombovo-blue text-white text-xs font-bold rounded-full uppercase tracking-wide">Limitovaná edícia</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-bombovo-dark leading-tight">
                  FEST Animator<br />Hoodie 2026
                </h1>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Teraz máš šancu nosiť originálnu mikinu FEST Animator Fest aj ty.
                </p>
                <p className="mt-3 text-sm leading-relaxed">
                  <span className="text-bombovo-red font-semibold">Toto je predobjednávka:</span>
                  <span className="text-gray-500"> Doručenie mikín môže trvať až 3–5 týždňov. Počet je limitovaný na 50 kusov.</span>
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-bombovo-dark">€39.99</span>
              </div>

              {/* Color picker */}
              <div>
                <p className="font-semibold text-bombovo-dark mb-2 text-sm uppercase tracking-wide">
                  Farba: <span className="normal-case font-normal">{selectedColor.label}</span>
                </p>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      title={c.label}
                      className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                        selectedColor.id === c.id
                          ? 'border-bombovo-blue scale-110 ring-2 ring-bombovo-blue ring-offset-2'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size picker */}
              <div>
                <p className="font-semibold text-bombovo-dark mb-2 text-sm uppercase tracking-wide">Veľkosť</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false) }}
                      className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-blue active:scale-95 ${
                        selectedSize === s
                          ? 'bg-bombovo-dark border-bombovo-dark text-white'
                          : 'bg-white border-gray-200 text-bombovo-dark hover:border-bombovo-dark'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="mt-2 text-bombovo-red text-sm font-medium">Vyber prosím veľkosť pred objednávkou.</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <p className="font-semibold text-bombovo-dark mb-2 text-sm uppercase tracking-wide">Množstvo</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 font-bold text-lg flex items-center justify-center hover:border-bombovo-dark transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-blue"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-lg text-bombovo-dark">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(5, q + 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 font-bold text-lg flex items-center justify-center hover:border-bombovo-dark transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-blue"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleOrder}
                className="w-full py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:bg-yellow-400 active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bombovo-dark focus-visible:ring-offset-2"
              >
                Objednať →
              </button>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
