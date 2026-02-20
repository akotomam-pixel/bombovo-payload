'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const reviews = [
  {
    id: 1,
    content: 'Náš syn je už 7x veľmi spokojný a kamarátstva, ktoré si v tábore našiel, trvajú aj po jeho skončení. Budúce leto už pôjdeme jedine s vami. Máme odskúšaných viacero táborov, ale vy ste jediní, čo nás ani raz nesklamali.',
    author: 'Rodič Andrea D.',
    photo: '/images/homepage/Review1.JPG',
  },
  {
    id: 2,
    content: 'Ďakujeme za našu dcéru Lauru, za kopec zážitkov a starostlivosť. Bol to pre ňu úžasný týždeň prázdnin.',
    author: 'Dovičáková Martina',
    photo: '/images/homepage/review2.JPG',
  },
  {
    id: 3,
    content: 'Dcérke sa v tábore veľmi páčilo. Aktivity, prístup animátorov bolo na jedničku, o rok sa chce vrátiť ku vám do tábora, už odpočítava dni. Ďakujeme.',
    author: 'Magdaléna R.',
    photo: '/images/homepage/review3.JPG',
  },
]

export default function ReviewCarousel() {
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
    <section className="py-8 md:py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MOBILE LAYOUT */}
        <div className="lg:hidden">
          {/* Photo - Polaroid - SYNCED WITH REVIEW (NO ANIMATION) */}
          <div className="flex justify-center mb-8">
            <div 
              className="bg-white p-4 pb-14 shadow-2xl rounded-sm"
              style={{ transform: 'rotate(4deg)', maxWidth: '300px' }}
            >
              <img 
                src={reviews[currentReviewIndex].photo}
                alt={`Review ${currentReviewIndex + 1}`}
                className="object-cover"
                style={{ width: '250px', height: '320px' }}
              />
              <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                Letné Tábory 2025
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
          {/* LEFT: Overlapping Polaroid Photos (58%) */}
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
                    src="/images/homepage/Review1.JPG"
                    alt="Review Photo 1"
                    className="object-cover"
                    style={{ width: '200px', height: '260px' }}
                    loading="lazy"
                  />
                  <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                    Letné Tábory 2025
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
                    src="/images/homepage/review2.JPG"
                    alt="Review Photo 2"
                    className="object-cover"
                    style={{ width: '200px', height: '260px' }}
                    loading="lazy"
                  />
                  <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                    Letné Tábory 2025
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
                    src="/images/homepage/review3.JPG"
                    alt="Review Photo 3"
                    className="object-cover"
                    style={{ width: '200px', height: '260px' }}
                    loading="lazy"
                  />
                  <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                    Letné Tábory 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Blue Framed Review Box (42%) */}
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
          </div>
        </div>
      </div>
    </section>
  )
}



