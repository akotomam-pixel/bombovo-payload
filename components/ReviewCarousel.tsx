'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Review {
  reviewText: string
  reviewAuthor: string
  photo?: { url: string } | null
  badgeText?: string
}

interface ReviewCarouselProps {
  reviews: Review[]
  displaySeconds: number
}

export default function ReviewCarousel({ reviews, displaySeconds }: ReviewCarouselProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  useEffect(() => {
    if (reviews.length === 0) return
    const interval = setInterval(() => {
      nextReview()
    }, displaySeconds * 1000)
    return () => clearInterval(interval)
  }, [currentReviewIndex, displaySeconds, reviews.length])

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      prevReview()
    } else if (info.offset.x < -swipeThreshold) {
      nextReview()
    }
  }

  if (reviews.length === 0) return null

  const current = reviews[currentReviewIndex]

  return (
    <section className="py-8 md:py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MOBILE LAYOUT */}
        <div className="lg:hidden">
          <div className="flex justify-center mb-8">
            <div
              className="bg-white p-4 pb-14 shadow-2xl rounded-sm"
              style={{ transform: 'rotate(4deg)', maxWidth: '300px' }}
            >
              {current.photo?.url && (
                <img
                  src={current.photo.url}
                  alt={`Review ${currentReviewIndex + 1}`}
                  className="object-cover"
                  style={{ width: '250px', height: '320px' }}
                />
              )}
              <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                {current.badgeText || 'Letné Tábory 2025'}
              </p>
            </div>
          </div>

          <div className="w-full px-4 mb-6">
            <motion.div
              className="border-4 border-bombovo-blue rounded-3xl bg-bombovo-gray p-8 shadow-lg cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-bombovo-dark text-base leading-relaxed mb-4">
                    "{current.reviewText}"
                  </p>
                  <p className="text-bombovo-dark text-sm font-bold">
                    — {current.reviewAuthor}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

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
              {reviews[0]?.photo?.url && (
                <div
                  className="absolute"
                  style={{ left: '0%', bottom: '15%', transform: 'rotate(-6deg)', zIndex: 1 }}
                >
                  <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                    <img
                      src={reviews[0].photo.url}
                      alt="Review Photo 1"
                      className="object-cover"
                      style={{ width: '200px', height: '260px' }}
                      loading="lazy"
                    />
                    <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                      {reviews[0].badgeText || 'Letné Tábory 2025'}
                    </p>
                  </div>
                </div>
              )}
              {reviews[1]?.photo?.url && (
                <div
                  className="absolute"
                  style={{ left: '30%', top: '10%', transform: 'rotate(4deg)', zIndex: 2 }}
                >
                  <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                    <img
                      src={reviews[1].photo.url}
                      alt="Review Photo 2"
                      className="object-cover"
                      style={{ width: '200px', height: '260px' }}
                      loading="lazy"
                    />
                    <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                      {reviews[1].badgeText || 'Letné Tábory 2025'}
                    </p>
                  </div>
                </div>
              )}
              {reviews[2]?.photo?.url && (
                <div
                  className="absolute"
                  style={{ right: '5%', top: '0%', transform: 'rotate(-4deg)', zIndex: 3 }}
                >
                  <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                    <img
                      src={reviews[2].photo.url}
                      alt="Review Photo 3"
                      className="object-cover"
                      style={{ width: '200px', height: '260px' }}
                      loading="lazy"
                    />
                    <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                      {reviews[2].badgeText || 'Letné Tábory 2025'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Blue Framed Review Box (42%) */}
          <div className="lg:w-[42%] w-full relative">
            <button
              onClick={prevReview}
              className="absolute -left-20 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-bombovo-gray border-[3px] border-bombovo-blue flex items-center justify-center shadow-lg hover:bg-gray-300 transition-all"
              aria-label="Previous review"
            >
              <svg className="w-6 h-6 text-bombovo-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

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
                    "{current.reviewText}"
                  </p>
                  <p className="text-bombovo-dark font-bold text-sm md:text-base">
                    — {current.reviewAuthor}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

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
