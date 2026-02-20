'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'
import { FaChevronDown } from 'react-icons/fa'
import { getStrediskoById } from '@/data/strediska'

export default function StrediskoDetailPage() {
  const params = useParams()
  const strediskoId = params.strediskoId as string
  
  // State for photo gallery lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentLightboxPhoto, setCurrentLightboxPhoto] = useState(0)
  const totalPhotos = 6

  // State for details accordion
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  // Load stredisko data
  const strediskoData = getStrediskoById(strediskoId)

  const openLightbox = (photoIndex: number) => {
    setCurrentLightboxPhoto(photoIndex)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextPhoto = () => {
    setCurrentLightboxPhoto((prev) => (prev + 1) % totalPhotos)
  }

  const prevPhoto = () => {
    setCurrentLightboxPhoto((prev) => (prev - 1 + totalPhotos) % totalPhotos)
  }

  if (!strediskoData) {
    return <div>Stredisko not found</div>
  }

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:w-[80%]">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark whitespace-nowrap">
                Škola v prírode - <span className="relative inline-block">
                  <span className="font-handwritten text-bombovo-red text-4xl md:text-5xl lg:text-6xl">
                    {strediskoData.name}
                  </span>
                  <svg
                    className="absolute left-0 -bottom-2 w-full"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    style={{ height: '12px' }}
                  >
                    <path
                      d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
                      stroke="#FDCA40"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                      stroke="#FDCA40"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Section 2/A - Photo Gallery (70%) */}
              <div className="lg:w-[70%] w-full">
                <div className="rounded-2xl p-3 bg-bombovo-blue">
                  {/* Masonry Grid Layout */}
                  <div className="flex gap-2">
                    {/* Large Main Photo (Left) */}
                    <div 
                      className="w-[55%] h-full cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => openLightbox(0)}
                    >
                      <div className="w-full h-full bg-[#90EE90] flex items-center justify-center" style={{ minHeight: '400px' }}>
                        <p className="text-sm font-bold text-bombovo-dark">[PHOTO 1]</p>
                      </div>
                    </div>

                    {/* Right Side - 5 Smaller Photos in Grid */}
                    <div className="w-[45%] grid grid-rows-2 gap-2">
                      {/* Top Row - 2 Photos */}
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className="cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => openLightbox(1)}
                        >
                          <div className="w-full h-full bg-[#90EE90] flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                            <p className="text-xs font-bold text-bombovo-dark text-center">[2]</p>
                          </div>
                        </div>
                        <div 
                          className="cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => openLightbox(2)}
                        >
                          <div className="w-full h-full bg-[#90EE90] flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                            <p className="text-xs font-bold text-bombovo-dark text-center">[3]</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - 2 Photos + "More Photos" Button */}
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className="cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => openLightbox(3)}
                        >
                          <div className="w-full h-full bg-[#90EE90] flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                            <p className="text-xs font-bold text-bombovo-dark text-center">[4]</p>
                          </div>
                        </div>
                        <div 
                          className="relative cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => openLightbox(4)}
                        >
                          <div className="w-full h-full bg-[#90EE90] flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                            <p className="text-xs font-bold text-bombovo-dark text-center">[5]</p>
                          </div>
                          {/* Overlay Button */}
                          <div className="absolute inset-0 bg-bombovo-blue bg-opacity-80 flex items-center justify-center">
                            <p className="text-white font-bold text-sm">Ďalšie fotky ({totalPhotos})</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2/B - Info Box with Blue Frame (30%) */}
              <div className="lg:w-[30%] w-full">
                <div className="border-4 border-bombovo-blue rounded-3xl bg-white p-6 md:p-8">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="inline-flex items-baseline gap-3">
                      <span className="text-bombovo-dark text-2xl md:text-3xl font-bold relative">
                        {strediskoData.basePrice}
                        <span className="absolute left-0 -bottom-1 w-full h-1 bg-bombovo-red"></span>
                      </span>
                      <span className="text-bombovo-dark text-xl font-semibold">- 5 dní</span>
                    </div>
                  </div>

                  {/* Icon Bullet Points */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/images/skicon1.png"
                          alt="Icon 1"
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-bombovo-dark text-sm font-normal">{strediskoData.iconBullets[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/images/skicon2.png"
                          alt="Icon 2"
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-bombovo-dark text-sm font-normal">{strediskoData.iconBullets[1]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/images/skicon3.png"
                          alt="Icon 3"
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-bombovo-dark text-sm font-normal">{strediskoData.iconBullets[2]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/images/skicon4.png"
                          alt="Icon 4"
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-bombovo-dark text-sm font-normal">{strediskoData.iconBullets[3]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                        <Image
                          src="/images/skicon5.png"
                          alt="Icon 5"
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-bombovo-dark text-sm font-normal">{strediskoData.iconBullets[4]}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
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
        
        {/* Divider: Grey → White */}
        <WaveDivider color="red" variant={2} />
      </div>

      {/* Section 3: About Stredisko - Text (70%) + Photo (30%) */}
      <div className="bg-white">
        <section className="pt-3 md:pt-5 pb-12 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 items-center">
              {/* Section 3/A - Text (70%) */}
              <div className="lg:w-[70%] w-full mb-8 lg:mb-0 lg:pr-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark mb-6">
                  {strediskoData.section3.headline}
                </h2>
                
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed mb-6">
                  {strediskoData.section3.bodyText}
                </p>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-bombovo-dark mb-3">Zaujímavosti v okolí:</h3>
                  <ul className="space-y-2 text-bombovo-dark">
                    {strediskoData.section3.nearbyAttractions.map((attraction, index) => (
                      <li key={index}>• {attraction}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section 3/B - Photo Frame (30%) */}
              <div className="lg:w-[30%] w-full flex justify-center lg:justify-start">
                <div className="w-full max-w-[400px]">
                  {/* Clean Photo Frame */}
                  <div className="bg-white p-5 pb-16 shadow-lg rounded-lg">
                    <div 
                      className="w-full bg-[#90EE90] flex items-center justify-center"
                      style={{ width: '100%', aspectRatio: '3 / 4' }}
                    >
                      <p className="text-lg font-bold text-bombovo-dark text-center px-4">
                        [PHOTO PLACEHOLDER 3:4]
                      </p>
                    </div>
                    <p className="text-center mt-6 font-handwritten text-bombovo-dark text-xl">
                      2024 {strediskoData.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Divider: White → Grey */}
        <WaveDivider color="red" variant={3} />
      </div>

      {/* Section 4: Video (65%) + Program Info (35%) */}
      <div className="bg-bombovo-gray">
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Section 4/A - Video (65%) */}
              <div className="lg:w-[65%] w-full">
                <div 
                  className="w-full rounded-2xl overflow-hidden shadow-lg bg-black"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    preload="metadata"
                  >
                    <source src="/images/Videos/skolavprirode2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              {/* Section 4/B - Program Info (50%) */}
              <div className="lg:w-1/2 w-full space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark">
                  Unikátny program ktorý si každé dieťa zamiluje
                </h2>
                
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  {strediskoData.programText}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    
                    {/* UBYTOVANIE */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">UBYTOVANIE</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {strediskoData.detaily.ubytovanie.map((item, index) => (
                          <p key={index}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    {/* VYBAVENIE STREDISKA */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">VYBAVENIE STREDISKA</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {strediskoData.detaily.vybavenieStrediska.map((item, index) => (
                          <p key={index}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    {/* ZAUJÍMAVOSTI V OKOLÍ */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">ZAUJÍMAVOSTI V OKOLÍ</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {strediskoData.detaily.zaujimavostiVOkoli.map((item, index) => (
                          <p key={index}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    {/* ZĽAVA */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">ZĽAVA</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        <p>• 30 € / dieťa zľava zo základnej ceny pobytu – platí len pre rezervácie jarných Švp s podpisom zmluvy do termínu 31.10.2025 – táto zľava nie je kombinovateľná s inými zľavami</p>
                        <p>• 20 € / dieťa zľava z ceny animačného programu pre školy, ktoré boli s našou CK v škole v prírode aspoň raz od r. 2020 – táto zľava nie je kombinovateľná s inými zľavami, platí len v prípade ak ste si neuplatnili zľavu do 31.10.2025</p>
                      </div>
                    </div>

                    {/* DOPLNKOVÉ SLUŽBY */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">DOPLNKOVÉ SLUŽBY NA VYŽIADANIE</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        <p>• Zdravotník z CK Bombovo aj s lekárničkou 550 €/pobyt (klasický 5-dňový pobyt)</p>
                        <p>• pobytový deň navyše 40 €/dieťa</p>
                        <p>• pobyt dospelej osoby navyše – 150€/pobyt</p>
                        <p>• pobyt pedagogického dieťaťa s animačným programom – 150 €/pobyt</p>
                        <p>• komplexné cestovné poistenie ECP (cena 4,50 € / dieťa / pobyt)</p>
                        <p>• obed navyše 8€ / osoba</p>
                      </div>
                    </div>

                    {/* V ZÁKLADNEJ CENE */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">V ZÁKLADNEJ CENE ŠKOLY V PRÍRODE MŠ, ZŠ</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        <p>• 4x ubytovanie, 4x plná penzia, strava 5x denne, pitný režim</p>
                        <p>• Cena pevného lôžka je rovnaká ako cena prístelky</p>
                        <p>• Príplatok k základnej cene školy v prírode pre 2.stupeň ZŠ je 8 € / pobyt</p>
                      </div>
                    </div>

                    {/* V CENE ZAHRNUTÉ */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">V CENE ZAHRNUTÉ</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        <p>• Na 10 detí 1 dospelý pobyt zdarma</p>
                        <p>• Pobytový poplatok</p>
                      </div>
                    </div>

                    {/* V CENE ANIMAČNÉHO PROGRAMU */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">V CENE ANIMAČNÉHO PROGRAMU</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        <p>• 55 € / dieťa – animácia 7 hod denne okrem dňa odchodu (28 hodín spolu/pobyt)</p>
                        <p>• celodenná animácia 65 € / dieťa</p>
                        <p>• ZŠ na 15 detí 1 animátor</p>
                        <p>• MŠ na 10 detí 1 animátor</p>
                        <p>• animačný a športový materiál</p>
                        <p>• zábavné hry a kvízy, kamoš tanec</p>
                        <p>• darčeky pre každého účastníka ŠvP</p>
                      </div>
                    </div>

                    {/* BOMBOVÝ BALÍČEK */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6 w-full">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">BOMBOVÝ BALÍČEK</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        <p>• cena 30 €/dieťa</p>
                        <p>• možný len v prípade školy v prírode s animačným programom</p>
                        <p>• odmena 100 € na každých 10 platiacich detí</p>
                        <p>• autobusová doprava Kremnica + vstup do Štôlne Andrej</p>
                        <p>• výlet sa vždy organizuje v stredu, ak nie je dohodnuté inak</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Divider: Grey → White */}
        <WaveDivider color="blue" variant={2} />
      </div>

      {/* Section 6: Termíny (Dates Table) */}
      <div className="bg-white">
        <section id="terminy" className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="text-center"><h3 className="text-xl font-black text-bombovo-dark"></h3></div>
                </div>
              </div>

              <div className="bg-white py-8 px-8">
                {strediskoData.dates.map((date, index) => (
                  <div 
                    key={index}
                    className={`grid grid-cols-4 gap-6 items-center ${index < strediskoData.dates.length - 1 ? 'mb-6' : ''} ${!date.available ? 'opacity-50' : ''}`}
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
              
              {strediskoData.dates.map((date, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden ${!date.available ? 'opacity-50' : ''}`}
                >
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

      {/* Footer */}
      <Footer />

      {/* Lightbox Modal for Photo Gallery */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-4xl font-bold hover:text-gray-300 z-50"
          >
            ×
          </button>

          {/* Photo Counter */}
          <div className="absolute top-6 left-6 text-white text-xl font-semibold z-50">
            {currentLightboxPhoto + 1}/{totalPhotos}
          </div>

          {/* Main Photo */}
          <div 
            className="relative max-w-[85vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full bg-[#90EE90] flex items-center justify-center rounded-lg" style={{ minWidth: '400px', minHeight: '500px' }}>
              <p className="text-2xl font-bold text-bombovo-dark">PHOTO {currentLightboxPhoto + 1}</p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white bg-opacity-20 text-white flex items-center justify-center hover:bg-opacity-30 transition-all text-3xl"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white bg-opacity-20 text-white flex items-center justify-center hover:bg-opacity-30 transition-all text-3xl"
          >
            ›
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4">
            {Array.from({ length: totalPhotos }).map((_, index) => (
              <div
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentLightboxPhoto(index); }}
                className={`cursor-pointer flex-shrink-0 rounded-md overflow-hidden ${
                  index === currentLightboxPhoto ? 'border-4 border-bombovo-yellow' : 'border-2 border-white'
                }`}
                style={{ width: '80px', height: '60px' }}
              >
                <div className="w-full h-full bg-[#90EE90] flex items-center justify-center">
                  <p className="text-xs font-bold text-bombovo-dark">{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
