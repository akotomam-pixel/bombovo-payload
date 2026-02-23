'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'
import { FaChevronDown } from 'react-icons/fa'

export interface DateEntry {
  startDate: string
  endDate: string
  days: number
  price: string
  available: boolean
}

export interface StrediskoDetailData {
  id: string
  name: string
  basePrice: string
  iconBullets: string[]
  heroGallery: Array<{ src: string; thumb: string }>
  section3: {
    headline: string
    bodyText: string
    nearbyAttractions: string[]
  }
  programText: string
  detaily: {
    ubytovanie: string[]
    vybavenieStrediska: string[]
    zaujimavostiVOkoli: string[]
    zlava: string[]
    doplnkoveSluzby: string[]
    vZakladnejCene: string[]
    vCeneZahrnute: string[]
    vCeneAnimacnehoProgramu: string[]
    bombovyBalicek: string[]
  }
  dates: DateEntry[]
}

const ICON_IMAGES = [
  '/images/skicon1.png',
  '/images/skicon2.png',
  '/images/skicon3.png',
  '/images/skicon4.png',
  '/images/skicon5.png',
]

export default function StrediskoDetailClient({
  data,
}: {
  data: StrediskoDetailData
}) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const lgRef = useRef<any>(null)

  const { id: strediskoId, name, basePrice, iconBullets, heroGallery, section3, programText, detaily, dates } = data

  const totalPhotos = heroGallery.length

  return (
    <main className="min-h-screen bg-white">
      {/* Section 0: Top Bar & Header */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* Section 1: Headline */}
      <div className="bg-bombovo-gray">
        <section className="pt-12 md:pt-16 pb-4 md:pb-5">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:w-[80%]">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark whitespace-nowrap">
                Škola v prírode -{' '}
                <span className="relative inline-block">
                  <span className="font-handwritten text-bombovo-red text-4xl md:text-5xl lg:text-6xl">
                    {name}
                  </span>
                  <svg
                    className="absolute left-0 -bottom-2 w-full"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    style={{ height: '12px' }}
                  >
                    <path d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8" stroke="#FDCA40" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9" stroke="#FDCA40" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
                  </svg>
                </span>
              </h1>
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: Photo Gallery (70%) + Info Box (30%) */}
      <div className="bg-bombovo-gray">
        <section className="pt-4 md:pt-5 pb-12 md:pb-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Gallery (70%) */}
              <div className="lg:w-[70%] w-full">
                <div className="rounded-2xl p-3 bg-bombovo-blue">
                  <div className="flex gap-2">
                    {/* Large Main Photo */}
                    <div
                      className="w-[55%] h-full cursor-pointer rounded-lg overflow-hidden"
                      style={{ minHeight: '400px' }}
                      onClick={() => lgRef.current?.openGallery(0)}
                    >
                      <img src={heroGallery[0]?.src} alt="Foto 1" className="w-full h-full object-cover" style={{ minHeight: '400px' }} />
                    </div>

                    {/* Right: 4 smaller photos */}
                    <div className="w-[45%] grid grid-rows-2 gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="cursor-pointer rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => lgRef.current?.openGallery(1)}>
                          <img src={heroGallery[1]?.thumb} alt="Foto 2" className="w-full h-full object-cover" />
                        </div>
                        <div className="cursor-pointer rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => lgRef.current?.openGallery(2)}>
                          <img src={heroGallery[2]?.thumb} alt="Foto 3" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="cursor-pointer rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => lgRef.current?.openGallery(3)}>
                          <img src={heroGallery[3]?.thumb} alt="Foto 4" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative cursor-pointer rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }} onClick={() => lgRef.current?.openGallery(4)}>
                          <img src={heroGallery[4]?.thumb} alt="Foto 5" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-bombovo-blue bg-opacity-80 flex items-center justify-center">
                            <p className="text-white font-bold text-sm">Ďalšie fotky ({totalPhotos})</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box (30%) */}
              <div className="lg:w-[30%] w-full">
                <div className="border-4 border-bombovo-blue rounded-3xl bg-white p-6 md:p-8">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="inline-flex items-baseline gap-3">
                      <span className="text-bombovo-dark text-2xl md:text-3xl font-bold relative">
                        {basePrice}
                        <span className="absolute left-0 -bottom-1 w-full h-1 bg-bombovo-red"></span>
                      </span>
                      <span className="text-bombovo-dark text-xl font-semibold">- 5 dní</span>
                    </div>
                  </div>

                  {/* Icon Bullet Points */}
                  <div className="space-y-2 mb-6">
                    {iconBullets.slice(0, 5).map((bullet, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                          <Image src={ICON_IMAGES[i] ?? ICON_IMAGES[0]} alt={`Icon ${i + 1}`} width={36} height={36} className="object-contain" />
                        </div>
                        <span className="text-bombovo-dark text-sm font-normal">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div>
                    <a href="#terminy">
                      <button className="w-full md:w-auto px-8 py-3 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200">
                        Pozri termíny
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider color="red" variant={2} />
      </div>

      {/* Section 3: About Stredisko */}
      <div className="bg-white">
        <section className="pt-3 md:pt-5 pb-12 md:pb-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 items-center">
              <div className="lg:w-[70%] w-full mb-8 lg:mb-0 lg:pr-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark mb-6">
                  {section3.headline}
                </h2>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed mb-6">
                  {section3.bodyText}
                </p>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-bombovo-dark mb-3">Zaujímavosti v okolí:</h3>
                  <ul className="space-y-2 text-bombovo-dark">
                    {section3.nearbyAttractions.map((attraction, index) => (
                      <li key={index}>• {attraction}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:w-[30%] w-full flex justify-center lg:justify-start">
                <div className="w-full max-w-[400px]">
                  <div className="bg-white p-5 pb-16 shadow-lg rounded-lg">
                    <div className="w-full bg-[#90EE90] flex items-center justify-center" style={{ width: '100%', aspectRatio: '3 / 4' }}>
                      <p className="text-lg font-bold text-bombovo-dark text-center px-4">[PHOTO PLACEHOLDER 3:4]</p>
                    </div>
                    <p className="text-center mt-6 font-handwritten text-bombovo-dark text-xl">
                      2024 {name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider color="red" variant={3} />
      </div>

      {/* Section 4: Video + Program Info */}
      <div className="bg-bombovo-gray">
        <section className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-[65%] w-full">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '16 / 9' }}>
                  <video className="w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata">
                    <source src="/images/Videos/skolavprirode2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div className="lg:w-1/2 w-full space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark">
                  Unikátny program ktorý si každé dieťa zamiluje
                </h2>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  {programText}
                </p>
                <div>
                  <Link href="/program-skoly-v-prirode">
                    <button className="px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                      Pozri si náš program
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 5: Detaily Accordion */}
      <div className="bg-bombovo-gray">
        <section className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`${openAccordion === 'detaily' ? 'border-4 border-bombovo-yellow rounded-3xl' : ''}`}>
              <div
                className={`bg-bombovo-yellow py-6 px-4 md:px-8 cursor-pointer flex items-center justify-between ${openAccordion === 'detaily' ? 'rounded-t-3xl' : 'rounded-3xl'}`}
                onClick={() => setOpenAccordion(openAccordion === 'detaily' ? null : 'detaily')}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark">Detaily</h2>
                <FaChevronDown className={`text-bombovo-dark text-2xl md:text-3xl transition-transform ${openAccordion === 'detaily' ? '' : 'rotate-[-90deg]'}`} />
              </div>

              {openAccordion === 'detaily' && (
                <div className="bg-white p-6 md:p-12 rounded-b-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <AccordionBox title="UBYTOVANIE" items={detaily.ubytovanie} />
                    <AccordionBox title="VYBAVENIE STREDISKA" items={detaily.vybavenieStrediska} />
                    <AccordionBox title="ZAUJÍMAVOSTI V OKOLÍ" items={detaily.zaujimavostiVOkoli} />
                    <AccordionBox title="ZĽAVA" items={detaily.zlava} />
                    <AccordionBox title="DOPLNKOVÉ SLUŽBY NA VYŽIADANIE" items={detaily.doplnkoveSluzby} />
                    <AccordionBox title="V ZÁKLADNEJ CENE ŠKOLY V PRÍRODE MŠ, ZŠ" items={detaily.vZakladnejCene} />
                    <AccordionBox title="V CENE ZAHRNUTÉ" items={detaily.vCeneZahrnute} />
                    <AccordionBox title="V CENE ANIMAČNÉHO PROGRAMU" items={detaily.vCeneAnimacnehoProgramu} />
                    <AccordionBox title="BOMBOVÝ BALÍČEK" items={detaily.bombovyBalicek} />

                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <WaveDivider color="blue" variant={2} />
      </div>

      {/* Section 6: Termíny */}
      <div className="bg-white">
        <section id="terminy" className="py-16 md:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="hidden md:block text-3xl md:text-4xl font-bold text-bombovo-dark mb-12">
              Dostupné termíny:
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block border-4 border-bombovo-blue rounded-3xl overflow-hidden">
              <div className="bg-bombovo-yellow py-6 px-8">
                <div className="grid grid-cols-4 gap-6">
                  <div className="text-center"><h3 className="text-xl font-black text-bombovo-dark">Termín</h3></div>
                  <div className="text-center"><h3 className="text-xl font-black text-bombovo-dark">Počet dní</h3></div>
                  <div className="text-center"><h3 className="text-xl font-black text-bombovo-dark">Cena</h3></div>
                  <div className="text-center"></div>
                </div>
              </div>
              <div className="bg-white py-8 px-8">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-4 gap-6 items-center ${index < dates.length - 1 ? 'mb-6' : ''} ${!date.available ? 'opacity-50' : ''}`}
                  >
                    <div className="text-center">
                      <p className="text-lg font-semibold text-bombovo-dark">{date.startDate}-{date.endDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-bombovo-dark">{date.days}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-bombovo-dark border-b-4 border-bombovo-red pb-1 inline-block">{date.price}</p>
                    </div>
                    <div className="text-center">
                      {date.available ? (
                        <Link href={`/prihlaska-svp/${strediskoId}?d=${index}`}>
                          <button className="px-8 py-4 bg-bombovo-red border-2 border-white text-white font-bold text-lg rounded-full">
                            MÁM ZÁUJEM
                          </button>
                        </Link>
                      ) : (
                        <button className="px-8 py-4 bg-bombovo-red bg-opacity-30 border-2 border-gray-300 text-gray-600 font-bold text-lg rounded-full cursor-not-allowed">
                          VYPREDANÉ
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              <h2 className="text-3xl font-bold text-bombovo-dark mb-6">Dostupné termíny</h2>
              {dates.map((date, index) => (
                <div key={index} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${!date.available ? 'opacity-50' : ''}`}>
                  <div className="bg-bombovo-yellow p-4">
                    <p className="text-base font-semibold text-bombovo-dark">
                      Termín: {date.startDate} - {date.endDate}
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-bombovo-dark font-medium">Počet dní:</span>
                      <span className="text-bombovo-dark font-bold text-lg">{date.days}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-bombovo-dark font-medium">Cena:</span>
                      <span className={`font-black text-2xl ${date.available ? 'text-bombovo-red' : 'text-gray-600'}`}>{date.price}</span>
                    </div>
                    {date.available ? (
                      <Link href={`/prihlaska-svp/${strediskoId}?d=${index}`}>
                        <button className="w-full px-6 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full">
                          MÁM ZÁUJEM
                        </button>
                      </Link>
                    ) : (
                      <button className="w-full px-6 py-4 bg-bombovo-red bg-opacity-30 border-2 border-gray-300 text-gray-600 font-bold text-lg rounded-full cursor-not-allowed">
                        VYPREDANÉ
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* LightGallery hidden trigger */}
      <div className="hidden">
        <LightGallery
          onInit={(detail) => { lgRef.current = detail.instance }}
          plugins={[lgThumbnail, lgZoom]}
          dynamic
          dynamicEl={heroGallery.map((img, i) => ({
            src: img.src,
            thumb: img.thumb,
            subHtml: `<h4>Foto ${i + 1}</h4>`,
          }))}
          speed={500}
          download={false}
        >
          <span />
        </LightGallery>
      </div>
    </main>
  )
}

function AccordionBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
      <h3 className="text-xl font-bold text-bombovo-dark mb-4">{title}</h3>
      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
        {items.map((item, i) => (
          <p key={i}>• {item}</p>
        ))}
      </div>
    </div>
  )
}
