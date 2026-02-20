'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const reviews = [
  {
    id: 1,
    content: 'Spokojnosť so všetkým, výborný program, ktorý bavil deti aj nás učiteľky, dobrá spolupráca, ochota, ústretovosť.',
    author: 'ZŠ Odborárska, Bratislava',
  },
  {
    id: 2,
    content: 'Práca animátorov bola na vysokej úrovni, vyzdvihujeme empatiu voči našim deťom, nadmieru boli nápomocní pri každej aktivite aj bežných činnostiach.',
    author: 'MŠ SNP, Ivanka pri Dunaji',
  },
  {
    id: 3,
    content: 'ŠvP sme si užili, animátori boli ochotní pomáhať nám aj mimo svojich animačných aktivít, čo nám uľahčovalo našu prácu. Hry pre deti boli neobvyklé, originálne a zábavné no super.',
    author: 'ZŠ Topoľová, Nitra',
  },
]

const centers = [
  { id: 'stred-europy-krahule', name: 'Stred Európy Krahule', price: 'od 165.00 €', image: '/images/Skoly%20v%20Prirode/krahule.png' },
  { id: 'penzion-rohacan', name: 'Penzión Roháčan', price: 'od 185.00 €', image: '/images/Skoly%20v%20Prirode/penzionrohac.png' },
  { id: 'penzion-sabina', name: 'Penzión Sabina', price: 'od 200.00 €', image: '/images/Skoly%20v%20Prirode/penzionsabina.png' },
  { id: 'hotel-zuna', name: 'Hotel Zuna', price: 'od 195.00 €', image: '/images/Skoly%20v%20Prirode/hotelzuna.png' },
  { id: 'hotel-martinske-hole', name: 'Hotel Martinské Hole', price: 'od 200.00 €', image: '/images/Skoly%20v%20Prirode/martinskehole.png' },
  { id: 'horsky-hotel-minciar', name: 'Horský Hotel Minciar', price: 'od 195.00 €', image: '/images/Skoly%20v%20Prirode/minciar.png' },
  { id: 'horsky-hotel-lomy', name: 'Horský Hotel Lomy', price: 'od 165.00 €', image: '/images/Skoly%20v%20Prirode/lomy.png' },
]

export default function SkolyVPrirodePage() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  // Auto-play: Change review every 7 seconds on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      nextReview()
    }, 7000) // 7 seconds

    return () => clearInterval(interval)
  }, [currentReviewIndex])

  // Handle swipe gestures on mobile
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      prevReview()
    } else if (info.offset.x < -swipeThreshold) {
      nextReview()
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Section 0: Top Bar & Header */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* Section 1: Hero Split - Text Left (40%) / Video Right (60%) */}
      <div className="bg-bombovo-gray">
        <section className="pt-7 pb-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Unified layout — video loads once, text split for correct mobile ordering */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

              {/* MOBILE ONLY: Headline (shown above video on mobile) */}
              <h1 className="lg:hidden text-3xl font-bold text-bombovo-dark">
                Školy v prírode
                <br />
                <span className="relative inline-block">
                  <span className="text-bombovo-red font-bold">
                    Ktoré učiteľky milujú
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

              {/* DESKTOP ONLY: Left column — headline + body + button */}
              <div className="hidden lg:flex lg:w-[40%] flex-col justify-center space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark">
                  Školy v prírode
                  <br />
                  <span className="relative inline-block">
                    <span className="text-bombovo-red font-bold">
                      Ktoré učiteľky milujú
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
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  U nás v Cestovnej kancelárii Bombovo žiaci zažijú dni plné zmysluplných zážitkov a učitelia si doprajú zaslúžený oddych. Od ubytovania, stravy až po program a bezpečnosť deťom funguje všetko plynule.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed font-semibold">
                  Škola v prírode s Bombovom je týždeň, ktorý skutočne stojí za to.
                </p>
                <div>
                  <a href="#strediska">
                    <button className="px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                      Pozri strediská
                    </button>
                  </a>
                </div>
              </div>

              {/* Video — single element, shown on both mobile and desktop */}
              <div className="w-full lg:w-[60%] flex items-center justify-center">
                <div className="w-full relative">
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
                      <source src="/images/Videos/skolyvprirode1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

              {/* MOBILE ONLY: Body text + button (shown below video on mobile) */}
              <div className="lg:hidden space-y-4">
                <p className="text-base text-bombovo-dark leading-relaxed">
                  U nás v Cestovnej kancelárii Bombovo žiaci zažijú dni plné zmysluplných zážitkov a učitelia si doprajú zaslúžený oddych. Od ubytovania, stravy až po program a bezpečnosť deťom funguje všetko plynule.
                </p>
                <p className="text-base text-bombovo-dark leading-relaxed font-semibold">
                  Škola v prírode s Bombovom je týždeň, ktorý skutočne stojí za to.
                </p>
                <div>
                  <a href="#strediska">
                    <button className="px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                      Pozri strediská
                    </button>
                  </a>
                </div>
              </div>

            </div>
        </div>
      </section>
      
      {/* Divider: Grey → White (Blue) */}
      <WaveDivider color="blue" variant={1} />
      </div>

      {/* Section 2: Review Carousel - Redesigned with Blue Frame & Overlapping Photos */}
      <div className="bg-white">
        <section className="py-8 md:py-5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* MOBILE LAYOUT */}
            <div className="lg:hidden">
              {/* Photo - Polaroid */}
              <div className="flex justify-center mb-8">
                <div 
                  className="bg-white p-4 pb-14 shadow-2xl rounded-sm"
                  style={{ transform: 'rotate(4deg)', maxWidth: '300px' }}
                >
                  <img 
                    src={`/images/Skoly%20v%20Prirode/review${currentReviewIndex + 1}.${currentReviewIndex === 0 ? 'jpg' : 'JPG'}`}
                    alt={`Review ${currentReviewIndex + 1}`}
                    className="object-cover"
                    style={{ width: '250px', height: '320px' }}
                  />
                  <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                    2025 Školy v prírode
                  </p>
                </div>
              </div>

              {/* Review Box - Full Width, Swipeable, No Arrows */}
              <div className="w-full px-4 mb-6">
                <motion.div 
                  className="border-4 border-bombovo-blue rounded-3xl bg-bombovo-gray p-8 shadow-lg cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                >
                  {/* Review Text - Black on Grey - Full Width */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReviewIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-bombovo-dark text-base leading-relaxed mb-4">
                        "{reviews[currentReviewIndex].content}"
                      </p>
                      <p className="text-bombovo-dark text-sm font-bold">
                        — {reviews[currentReviewIndex].author}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
              
              {/* Dots - Outside and Below Box */}
              <div className="flex justify-center gap-2.5 mt-5">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReviewIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentReviewIndex ? 'bg-bombovo-dark' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden lg:flex gap-10 items-center">
              {/* LEFT: Blue Framed Review Box (40%) */}
              <div className="lg:w-[42%] w-full relative">
                {/* Left Arrow - Outside Frame - Grey Background */}
                <button
                  onClick={prevReview}
                  className="absolute -left-20 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-bombovo-gray border-[3px] border-bombovo-blue flex items-center justify-center shadow-lg hover:bg-gray-300 transition-all"
                  aria-label="Previous review"
                >
                  <svg className="w-6 h-6 text-bombovo-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Blue Frame Container - Reduced Padding */}
                <div className="border-[5px] border-bombovo-blue rounded-3xl bg-bombovo-gray p-7 shadow-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReviewIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-bombovo-dark text-base md:text-lg leading-relaxed mb-6">
                        "{reviews[currentReviewIndex].content}"
                      </p>
                      <p className="text-bombovo-dark font-bold text-sm md:text-base">
                        — {reviews[currentReviewIndex].author}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pagination Dots - Outside and Below Frame */}
                <div className="flex justify-center gap-2.5 mt-5">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReviewIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentReviewIndex ? 'bg-bombovo-dark' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Right Arrow - Outside Frame - Grey Background */}
                <button
                  onClick={nextReview}
                  className="absolute -right-20 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-bombovo-gray border-[3px] border-bombovo-blue flex items-center justify-center shadow-lg hover:bg-gray-300 transition-all"
                  aria-label="Next review"
                >
                  <svg className="w-6 h-6 text-bombovo-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>              {/* RIGHT: Overlapping Polaroid Photos (58%) */}
              <div className="lg:w-[58%] w-full">
                <div className="relative h-[400px] md:h-[500px] w-full">
                  {/* Photo 1 - Back/Left */}
                  <div 
                    className="absolute"
                    style={{
                      left: '0%',
                      bottom: '15%',
                      transform: 'rotate(-6deg)',
                      zIndex: 1
                    }}
                  >
                    <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                      <img 
                        src="/images/Skoly%20v%20Prirode/review1.jpg"
                        alt="Review Photo 1"
                        className="object-cover"
                        style={{ width: '200px', height: '260px' }}
                      />
                      <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                        2025 Školy v prírode
                      </p>
                    </div>
                  </div>

                  {/* Photo 2 - Middle */}
                  <div 
                    className="absolute"
                    style={{
                      left: '30%',
                      top: '10%',
                      transform: 'rotate(4deg)',
                      zIndex: 2
                    }}
                  >
                    <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                      <img 
                        src="/images/Skoly%20v%20Prirode/review2.JPG"
                        alt="Review Photo 2"
                        className="object-cover"
                        style={{ width: '200px', height: '260px' }}
                      />
                      <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                        2025 Školy v prírode
                      </p>
                    </div>
                  </div>

                  {/* Photo 3 - Front/Right */}
                  <div 
                    className="absolute"
                    style={{
                      right: '5%',
                      top: '0%',
                      transform: 'rotate(-4deg)',
                      zIndex: 3
                    }}
                  >
                    <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                      <img 
                        src="/images/Skoly%20v%20Prirode/review3.JPG"
                        alt="Review Photo 3"
                        className="object-cover"
                        style={{ width: '200px', height: '260px' }}
                      />
                      <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                        2025 Školy v prírode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
      {/* Divider: White → Grey (Blue) */}
      <WaveDivider color="blue" variant={2} />
      </div>

      {/* Section 3: Why Teachers Love Bombovo */}
      <div className="bg-bombovo-gray">
        <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Point 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Text */}
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">
                  Overené strediská, ktoré spĺňajú všetky hygienické normy
                </h3>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  V CK Bombovo spolupracujeme iba so strediskami, ktoré spĺňajú stanovené požiadavky na komfort, hygienu, vybavenie a sú dlhodobo overené školami a učiteľmi z celého Slovenska.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Naši animátori komunikujú s vedením strediska a s kuchyňou a ak niečo nefunguje rieši to náš tím a nie učitelia. U nás je ubytovanie a strava istota, nie lotéria!
                </p>
              </div>
              {/* Image */}
              <div className="flex justify-center">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                  <img 
                    src="/images/Skoly%20v%20Prirode/secion3.1.JPG"
                    alt="Prečo učiteľky milujú Bombovo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Point 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image (on left for desktop) */}
              <div className="flex justify-center lg:order-first order-last">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                  <img 
                    src="/images/Skoly%20v%20Prirode/secion3.2.JPG"
                    alt="Vlastný program"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Text */}
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">
                  Profesionálny a zaškolený animačný tím
                </h3>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  V Bombove nenájdete žiadnych amatérov animátorov. Našich animátorov každoročne preškolujeme aby sme zariadili že váš turnus bude mať naozaj hladký priebeh. Program má pevný rytmus a náš tím presne vie ako reagovať v každej situácii.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Naše školy v prírode nie sú o neustálom dozore, ale o tom, že učiteľ má svoj profesionálny tím, na ktorý sa môže vždy spoľahnúť.
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Text */}
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">
                  Unikátny program, ktorý nikde inde nenájdete
                </h3>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Najväčšou úľavou pre učiteľa je keď zistí, že na škole v prírode nemusí nič zachraňovať. Naše aktivity držia deti od prvého dňa pokope a každá časť dňa na seba prirodzene nadväzuje.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Nejde teda o sled náhodných hier ale o mystický príbeh, pomocou ktorého sa deti učia spolupracovať, dôverovať si a preberať zodpovednosť bez toho aby sa cítili byť pod tlakom. Naše školy v prírode tak nekončia príchodom do školy ale zanechajú v deťoch cenné skúsenosti a spoločné zážitky, ktoré v nich zostanú navždy.
                </p>
              </div>
              {/* Image */}
              <div className="flex justify-center">
                <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                  <img 
                    src="/images/Skoly%20v%20Prirode/secion3.3.JPG"
                    alt="Kvalifikovaní animátori"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* CTA Button - Reduced Mobile Spacing (60% reduction) */}
            <div className="text-center pt-4 pb-4 md:pt-8 md:pb-0">
              <Link href="/program-skoly-v-prirode">
                <button className="px-10 py-5 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                  Pozri si náš program
                </button>
              </Link>
            </div>
          </div>
        </div>
        </section>
      
      {/* Divider: Grey → White (Blue) */}
      <WaveDivider color="blue" variant={3} />
      </div>

      {/* Section 4: Centers Grid */}
      <div className="bg-white">
        <section id="strediska" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-12">
            Naše strediská na rok 2026
          </h2>          {/* Centers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {centers.map((center) => (
              <div 
                key={center.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Center Photo */}
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={center.image}
                    alt={center.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Center Name */}
                  <h3 className="text-2xl font-bold text-bombovo-dark leading-tight">
                    {center.name}
                  </h3>

                  {/* Price and CTA Row */}
                  <div className="flex gap-3 mt-6">
                    {/* Price */}
                    <div className="flex-1 bg-bombovo-red rounded-2xl p-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{center.price}</span>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/skoly-v-prirode/${center.id}`} className="flex-1">
                      <button className="w-full h-full bg-bombovo-yellow text-bombovo-dark text-lg font-bold rounded-2xl p-4 hover:translate-y-0.5 active:translate-y-1 transition-transform duration-150">
                        Výber možností
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}