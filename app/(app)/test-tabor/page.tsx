'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'
import { FaMapMarkerAlt, FaChild, FaChevronDown } from 'react-icons/fa'

const pageData = {
  headline: 'Tábor gréckych hrdinov –',
  headlineHighlight: 'Olymp kemp',
  bulletPoints: [
    'Tábor inšpirovaný gréckou mytológiou, ktorý dieťa vtiahne do deja pomocou dobrodružného príbehu. Každý deň spoznáš jedného z gréckych bohov a zahráš si netradičné športové hry. Tak sa priprav na poriadne akčné dobrodružstvo na ktoré nezabudneš!',
  ],
  location: 'Horský hotel Lomy',
  age: 'Pre deti vo veku 8-14 rokov',
  price: '359 €',
  section2: {
    ratings: {
      kreativita: 3,
      mystika: 10,
      sebarozvoj: 6,
      pohyb: 10,
      kritickeMyslenie: 7,
    },
    headline: 'O čom je Tábor Olymp Kemp?',
    description: [
      'Tábor gréckych hrdinov spája aktívny pohyb, šport a fascinujúci svet gréckej mytológie do jedného veľkého dobrodružstva. Deti sa tu nehrajú len hry stávajú sa hrdinami vlastného príbehu. Prostredníctvom športových výziev, tímových úloh a príbehov antických bohov a hrdinov sa prirodzene hýbu, premýšľajú a spolupracujú.',
      'Deti trávia čas aktívne, vonku a v kolektíve, nie pri obrazovkách, a zároveň zažívajú učenie cez zážitok, ktorý má jasný zmysel a emóciu. Na Olymp kempe zažiješ aktivity ako IIiada popri ktorej si vyrobíš vlastný meč, Paridov súd na ktorom si zostrojíš svoj vlastný obranný štít a Turnaj Olympských bohov na ktorom si zmeriaš sily v celodennom turnaji na ktorom nesmie chýbať futbal.',
    ],
    buttonText: 'Pozri Dostupné Termíny',
  },
  section3: {
    reviews: [
      {
        text: '[THE REVIEW WILL BE PLACED HERE. I WILL WRITE THIS LONGER JUST TO SEE HOW BIGGER IT WOULD LOOK ON THE DESIGN WHEN THE REVIEW WOULD BE LONGER SO PUT EXACTLY THIS TEXT INSIDE OF THERE]',
        author: 'Mamička Dieťaťa',
      },
      {
        text: '[THE REVIEW WILL BE PLACED HERE. I WILL WRITE THIS LONGER JUST TO SEE HOW BIGGER IT WOULD LOOK ON THE DESIGN WHEN THE REVIEW WOULD BE LONGER SO PUT EXACTLY THIS TEXT INSIDE OF THERE]',
        author: 'Mamička Dieťaťa',
      },
      {
        text: '[THE REVIEW WILL BE PLACED HERE. I WILL WRITE THIS LONGER JUST TO SEE HOW BIGGER IT WOULD LOOK ON THE DESIGN WHEN THE REVIEW WOULD BE LONGER SO PUT EXACTLY THIS TEXT INSIDE OF THERE]',
        author: 'Mamička Dieťaťa',
      },
    ],
    headline: 'Ako Olymp Camp prežíva dieťa?',
    text: [
      'Počas týždňa vznikajú nové priateľstvá a silné spoločné spomienky. Dieťa zároveň objavuje svoje silné stránky, učí sa veriť si a odchádza domov s pocitom hrdosti, že dokázalo viac, než si na začiatku myslelo.',
    ],
  },
  section4: {
    vTomtoTaboreZazijete: [
      'Aresov deň – Boh vojny – kde si zahráš Iliadu/vybíjaná trochu inak/ a vyrobíš si vlastný meč',
      'Aténin deň – Bohyňa stratégie – zúčastníš sa Paridovho súdu /volejbal trochu inak/ a zostrojíš si vlastný obranný štít',
      'Hermov deň – Boh cestovateľstva a posolstva – budeš súčasťou božích poslov /cezpolný beh opäť inak/',
      'Poseidonov deň – Boh oceánov a morí – zažiješ Potopu Atén s netradičným vodným pólom a spravíš si malý oceán vo fľaši',
      'Turnaj Olympských bohov – zmeriaš si sily v celodennom turnaji a zahráš si aj futbal',
      'Výlet do Bounce parku v Banskej Bystrici',
      'Pohodičku pri bazéne, diskotéky, opekačku',
      'Všetko, čo vytvoríme si môžete so sebou zobrať domov ako inšpiráciu alebo darček',
      'V prípade nepriaznivých okolností môže nastať zmena programu',
    ],
    vCene: [
      'Program podľa ponuky',
      'Odborná a zdravotná starostlivosť',
      '6 x ubytovanie',
      '6 x plná penzia 5 x denne, pitný režim',
      'Foto z tábora na facebooku',
      'Poistenie voči úpadku CK, DPH',
      'Táborové tričko',
      'Výlet',
      'Vstup do Bazéna',
    ],
    lokalita: 'Tábor sa nachádza v Horskom hoteli Lomy v Lomskej doline pri obci Horná Ves (okres Prievidza), v srdci pohoria Vtáčnik.',
    doprava: 'Individuálna',
    ubytovanie: [
      'Hotelové izby pre 4-5 detí s vlastným sociálnym zariadením',
      'Drevené chatky pre 7 detí s vlastným sociálnym zariadením',
    ],
    zaPriplatok: [
      'Komplexné cestovné poistenie ECP 4,50 €/pobyt (storno, prerušenie cesty, úraz, zodpovednosť za škodu)',
      'Dieťa si môže na tábore zakúpiť reklamné predmety Bombovo',
    ],
    strediskoName: 'Horský hotel Lomy',
    strediskoDescription: 'Horský hotel Lomy je obklopený nádhernou prírodou. Ponúka deťom skutočnú zábavu pod otvoreným nebom a každé dieťa si Lomy zamiluje hneď po prvom dni.',
    mapLat: 48.5806195783322,
    mapLng: 18.567247,
  },
  section5: {
    dates: [
      { start: '02.08.2026', end: '08.08.2026', days: '7', originalPrice: '379.00 €', discountedPrice: '359.00 €' },
    ],
  },
}

const totalImages = 10
const totalStrediskoPhotos = 6

export default function TestTaborPage() {
  const [mainImage, setMainImage] = useState(0)
  const [visibleThumbnailStart, setVisibleThumbnailStart] = useState(0)
  const [currentReview, setCurrentReview] = useState(0)
  const [openAccordion, setOpenAccordion] = useState(false)
  const [openStredisko, setOpenStredisko] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentLightboxPhoto, setCurrentLightboxPhoto] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % pageData.section3.reviews.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') setCurrentLightboxPhoto((p) => (p > 0 ? p - 1 : totalStrediskoPhotos - 1))
      if (e.key === 'ArrowRight') setCurrentLightboxPhoto((p) => (p < totalStrediskoPhotos - 1 ? p + 1 : 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen])

  const handlePrevThumbnail = () => {
    if (visibleThumbnailStart > 0) setVisibleThumbnailStart(visibleThumbnailStart - 1)
  }
  const handleNextThumbnail = () => {
    if (visibleThumbnailStart < totalImages - 5) setVisibleThumbnailStart(visibleThumbnailStart + 1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      <main className="flex-grow">

        {/* Section 1: Hero */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              <h1 className="text-3xl font-bold text-bombovo-dark">
                {pageData.headline}{' '}
                <span className="relative inline-block text-bombovo-red">
                  {pageData.headlineHighlight}
                  <svg className="absolute left-0 -bottom-2 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ height: '12px' }}>
                    <path d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8" stroke="#FDCA40" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <div className="space-y-3">
                {pageData.bulletPoints.map((point, idx) => (
                  <p key={idx} className="text-base text-bombovo-dark">{point}</p>
                ))}
              </div>

              <div className="relative">
                <div className="w-full rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#90EE90', aspectRatio: '16/9' }}>
                  <p className="text-lg font-bold text-bombovo-dark">[Photo will be placed here]</p>
                </div>
                <button onClick={() => setMainImage(mainImage > 0 ? mainImage - 1 : totalImages - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-2xl text-bombovo-dark">←</span>
                </button>
                <button onClick={() => setMainImage(mainImage < totalImages - 1 ? mainImage + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg z-10">
                  <span className="text-2xl text-bombovo-dark">→</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-bombovo-blue text-xl" />
                  <span className="text-base text-bombovo-dark">{pageData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaChild className="text-bombovo-blue text-xl" />
                  <span className="text-base text-bombovo-dark">{pageData.age}</span>
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xl font-bold text-bombovo-dark relative inline-block">
                  CENA: {pageData.price}
                  <span className="absolute left-0 -bottom-1 w-full h-1 bg-bombovo-red"></span>
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => document.getElementById('dostupne-terminy')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full"
                >
                  Pozri Dostupné Termíny
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-bombovo-dark">
                  {pageData.headline}{' '}
                  <span className="relative inline-block text-bombovo-red">
                    {pageData.headlineHighlight}
                    <svg className="absolute left-0 -bottom-2 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ height: '12px' }}>
                      <path d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8" stroke="#FDCA40" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>

                <div className="space-y-3">
                  {pageData.bulletPoints.map((point, idx) => (
                    <p key={idx} className="text-base md:text-lg text-bombovo-dark">{point}</p>
                  ))}
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-bombovo-blue text-xl" />
                    <span className="text-base md:text-lg text-bombovo-dark">{pageData.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaChild className="text-bombovo-blue text-xl" />
                    <span className="text-base md:text-lg text-bombovo-dark">{pageData.age}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-xl font-bold text-bombovo-dark relative inline-block">
                    CENA: {pageData.price}
                    <span className="absolute left-0 -bottom-1 w-full h-1 bg-bombovo-red"></span>
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => document.getElementById('dostupne-terminy')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full"
                  >
                    Pozri Dostupné Termíny
                  </button>
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="lg:col-span-3">
                <div className="w-full rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#90EE90', aspectRatio: '16/9' }}>
                  <p className="text-lg font-bold text-bombovo-dark">[Photo will be placed here]</p>
                </div>

                <div className="relative flex items-center gap-2">
                  <button onClick={handlePrevThumbnail} className={`flex-shrink-0 p-2 ${visibleThumbnailStart === 0 ? 'opacity-30 cursor-not-allowed' : ''} rounded`} disabled={visibleThumbnailStart === 0}>
                    <span className="text-2xl text-bombovo-dark">←</span>
                  </button>
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const imageIndex = visibleThumbnailStart + index
                      return (
                        <div key={imageIndex} onClick={() => setMainImage(imageIndex)} className={`cursor-pointer rounded-lg overflow-hidden ${mainImage === imageIndex ? 'ring-4 ring-bombovo-yellow' : ''}`} style={{ aspectRatio: '16/9' }}>
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#90EE90' }}>
                            <p className="text-xs font-bold text-bombovo-dark">{imageIndex + 1}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={handleNextThumbnail} className={`flex-shrink-0 p-2 ${visibleThumbnailStart >= totalImages - 5 ? 'opacity-30 cursor-not-allowed' : ''} rounded`} disabled={visibleThumbnailStart >= totalImages - 5}>
                    <span className="text-2xl text-bombovo-dark">→</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        <WaveDivider color="blue" variant={1} />

        {/* Section 2: Ratings + Description */}
        <section className="py-16 md:py-20 bg-bombovo-gray">
          <div className="w-full mx-auto px-2 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Ratings */}
              <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-bombovo-gray">
                <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-8">Hodnotenie Tábora</h2>
                <div className="space-y-6">
                  {Object.entries(pageData.section2.ratings).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      kreativita: 'Kreativita',
                      mystika: 'Mystika',
                      sebarozvoj: 'Sebarozvoj',
                      pohyb: 'Pohyb',
                      kritickeMyslenie: 'Kritické myslenie',
                    }
                    return (
                      <div key={key}>
                        <h3 className="text-lg font-bold text-bombovo-dark mb-3">{labels[key]}</h3>
                        <div className="relative w-full h-10 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
                          <div className="h-full bg-bombovo-yellow flex items-center px-4" style={{ width: `${value * 10}%` }}>
                            {value > 0 && <span className="text-bombovo-dark font-bold text-base">{value}/10</span>}
                          </div>
                          {value === 0 && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bombovo-dark font-bold text-base">0/10</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="border-4 border-bombovo-yellow rounded-3xl p-8 md:p-10 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-6">{pageData.section2.headline}</h2>
                <div className="space-y-4 text-base md:text-lg text-bombovo-dark leading-relaxed mb-8">
                  {pageData.section2.description.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => document.getElementById('dostupne-terminy')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full"
                  >
                    {pageData.section2.buttonText}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="bg-bombovo-gray">
          <WaveDivider color="blue" variant={2} />
        </div>

        {/* Section 3: Reviews + Text */}
        <section className="pt-16 md:pt-20 pb-6 md:pb-8 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Review Carousel */}
              <div className="rounded-3xl p-8 md:p-10 flex flex-col justify-center min-h-[300px] bg-bombovo-gray border-4 border-bombovo-red shadow-lg">
                <div className="space-y-6">
                  <p className="text-lg md:text-xl text-bombovo-dark leading-relaxed italic">
                    "{pageData.section3.reviews[currentReview].text}"
                  </p>
                  <p className="text-base md:text-lg text-bombovo-dark font-semibold">
                    — {pageData.section3.reviews[currentReview].author}
                  </p>
                </div>
                <div className="flex justify-center gap-2.5 mt-8">
                  {pageData.section3.reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentReview ? 'bg-bombovo-dark' : 'bg-gray-300'}`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark">{pageData.section3.headline}</h2>
                <div className="space-y-4 text-base md:text-lg text-bombovo-dark leading-relaxed">
                  {pageData.section3.text.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 4: Details Accordion */}
        <section className="pt-6 md:pt-8 pb-0 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`${openAccordion ? 'border-4 border-bombovo-yellow rounded-3xl' : ''}`}>
              <div
                className={`bg-bombovo-yellow py-6 px-8 cursor-pointer flex items-center justify-between ${openAccordion ? 'rounded-t-3xl' : 'rounded-3xl'}`}
                onClick={() => setOpenAccordion(!openAccordion)}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">Detaily Tábora</h2>
                <FaChevronDown className={`text-bombovo-dark text-3xl transition-transform ${openAccordion ? '' : 'rotate-[-90deg]'}`} />
              </div>

              {openAccordion && (
                <div className="bg-white p-8 md:p-12 rounded-b-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">V TOMTO TÁBORE ZAŽIJEŠ:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {pageData.section4.vTomtoTaboreZazijete.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">V CENE:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {pageData.section4.vCene.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">LOKALITA:</h3>
                      <p className="text-base text-bombovo-dark leading-relaxed">{pageData.section4.lokalita}</p>
                    </div>

                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">DOPRAVA:</h3>
                      <p className="text-base text-bombovo-dark leading-relaxed">{pageData.section4.doprava}</p>
                    </div>

                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">UBYTOVANIE:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {pageData.section4.ubytovanie.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">ZA PRÍPLATOK:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {pageData.section4.zaPriplatok.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 4b: Detaily Strediska */}
        <section className="mt-[10px] pt-0 pb-8 md:pb-12 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`${openStredisko ? 'border-4 border-bombovo-yellow rounded-3xl' : ''}`}>
              <div
                className={`bg-bombovo-yellow py-6 px-8 cursor-pointer flex items-center justify-between ${openStredisko ? 'rounded-t-3xl' : 'rounded-3xl'}`}
                onClick={() => setOpenStredisko(!openStredisko)}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">
                  Detaily Strediska {pageData.section4.strediskoName}
                </h2>
                <FaChevronDown className={`text-bombovo-dark text-3xl transition-transform ${openStredisko ? '' : 'rotate-[-90deg]'}`} />
              </div>

              <div className={`overflow-hidden transition-all duration-300 ${openStredisko ? 'max-h-[2200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white p-8 md:p-12 rounded-b-3xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <p className="text-lg text-bombovo-dark leading-relaxed">
                        {pageData.section4.strediskoDescription}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: totalStrediskoPhotos }).map((_, index) => (
                          <div
                            key={index}
                            className="cursor-pointer rounded-lg overflow-hidden"
                            style={{ aspectRatio: '4/3' }}
                            onClick={() => { setCurrentLightboxPhoto(index); setLightboxOpen(true) }}
                          >
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#90EE90' }}>
                              <p className="text-lg md:text-xl font-bold text-bombovo-dark text-center px-2">
                                Photo Placement {index + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${pageData.section4.mapLat},${pageData.section4.mapLng}&zoom=14`}
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white">
          <WaveDivider color="blue" variant={3} />
        </div>

        {/* Section 5: Available Dates */}
        <section id="dostupne-terminy" className="py-16 md:py-20 bg-bombovo-gray">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

            <h2 className="hidden md:block text-3xl md:text-4xl font-bold text-bombovo-dark mb-12">
              Dostupné Termíny:
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
                {pageData.section5.dates.map((date, idx) => (
                  <div key={idx} className={`grid grid-cols-4 gap-6 items-center ${idx < pageData.section5.dates.length - 1 ? 'mb-6' : ''}`}>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-bombovo-dark">{date.start} - {date.end}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-bombovo-dark">{date.days}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4">
                        <p className="text-lg text-gray-500 line-through">{date.originalPrice}</p>
                        <p className="text-2xl font-black text-bombovo-dark border-b-4 border-bombovo-red pb-1">{date.discountedPrice}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <button className="px-8 py-4 bg-bombovo-red border-2 border-white text-white font-bold text-lg rounded-full">
                        MÁM ZÁUJEM
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <h2 className="text-3xl font-bold text-bombovo-dark mb-6">Dostupné termíny</h2>
              {pageData.section5.dates.map((date, idx) => (
                <div key={idx} className="bg-white rounded-2xl mb-4 shadow-lg overflow-hidden">
                  <div className="bg-[#FDCA40] p-4">
                    <p className="text-base font-semibold text-bombovo-dark">Termín {date.start} - {date.end}</p>
                  </div>
                  <div className="bg-white p-4">
                    <p className="text-sm text-gray-600 mb-3">Počet dní {date.days}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base text-gray-400 line-through">{date.originalPrice}</p>
                        <p className="text-xl font-bold text-bombovo-dark mt-2" style={{ textDecoration: 'underline', textDecorationColor: '#DF2935', textDecorationThickness: '3px', textUnderlineOffset: '4px' }}>
                          {date.discountedPrice}
                        </p>
                      </div>
                      <button className="bg-[#DF2935] text-white font-bold px-5 py-3 rounded-full shadow-md">
                        Mám záujem
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white text-5xl font-bold">×</button>
          <button onClick={(e) => { e.stopPropagation(); setCurrentLightboxPhoto((p) => p > 0 ? p - 1 : totalStrediskoPhotos - 1) }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl">◄</button>
          <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#90EE90' }}>
              <p className="text-5xl font-bold text-bombovo-dark">Photo Placement {currentLightboxPhoto + 1}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setCurrentLightboxPhoto((p) => p < totalStrediskoPhotos - 1 ? p + 1 : 0) }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl">►</button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xl font-semibold">
            {currentLightboxPhoto + 1} / {totalStrediskoPhotos}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
