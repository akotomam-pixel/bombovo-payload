'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export interface ReviewData {
  content: string
  author: string
  photo?: string
}

export interface CenterData {
  id: string
  name: string
  price: string
  image: string
}

export interface Section3Block {
  headline: string
  body: string
  photo: string
}

export interface SkolyVPrirodPageData {
  headline: string
  headlineHighlight: string
  bodyText: string
  reviews: ReviewData[]
  section3: [Section3Block, Section3Block, Section3Block]
  strediskaHeadline: string
  centers: CenterData[]
}

export default function SkolyVPrirodClient({ data }: { data: SkolyVPrirodPageData }) {
  const { headline, headlineHighlight, bodyText, reviews, section3, strediskaHeadline, centers } = data

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  useEffect(() => {
    if (reviews.length <= 1) return
    const interval = setInterval(() => {
      nextReview()
    }, 7000)
    return () => clearInterval(interval)
  }, [currentReviewIndex, reviews.length])

  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      prevReview()
    } else if (info.offset.x < -swipeThreshold) {
      nextReview()
    }
  }

  const reviewPhotoSrc = (index: number) =>
    reviews[index]?.photo ??
    `/images/Skoly%20v%20Prirode/review${index + 1}.${index === 0 ? 'jpg' : 'JPG'}`

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
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

              {/* MOBILE ONLY: Headline */}
              <h1 className="lg:hidden text-3xl font-bold text-bombovo-dark">
                {headline}
                <br />
                <span className="relative inline-block">
                  <span className="text-bombovo-red font-bold">
                    {headlineHighlight}
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

              {/* DESKTOP ONLY: Left column */}
              <div className="hidden lg:flex lg:w-[40%] flex-col justify-center space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark">
                  {headline}
                  <br />
                  <span className="relative inline-block">
                    <span className="text-bombovo-red font-bold">
                      {headlineHighlight}
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
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  {bodyText}
                </p>
                <div>
                  <a href="#strediska">
                    <button className="px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                      Pozri strediská
                    </button>
                  </a>
                </div>
              </div>

              {/* Video */}
              <div className="w-full lg:w-[60%] flex items-center justify-center">
                <div className="w-full relative">
                  <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '16 / 9' }}>
                    <video className="w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata">
                      <source src="/images/Videos/skolyvprirode1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

              {/* MOBILE ONLY: Body text + button */}
              <div className="lg:hidden space-y-4">
                <p className="text-base text-bombovo-dark leading-relaxed">
                  {bodyText}
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

      {/* Section 2: Review Carousel */}
      <div className="bg-white">
        <section className="py-8 md:py-5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* MOBILE LAYOUT */}
            <div className="lg:hidden">
              <div className="flex justify-center mb-8">
                <div
                  className="bg-white p-4 pb-14 shadow-2xl rounded-sm"
                  style={{ transform: 'rotate(4deg)', maxWidth: '300px' }}
                >
                  <img
                    src={reviewPhotoSrc(currentReviewIndex)}
                    alt={`Review ${currentReviewIndex + 1}`}
                    className="object-cover"
                    style={{ width: '250px', height: '320px' }}
                  />
                  <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">
                    2025 Školy v prírode
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
                        "{reviews[currentReviewIndex].content}"
                      </p>
                      <p className="text-bombovo-dark text-sm font-bold">
                        — {reviews[currentReviewIndex].author}
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
                        "{reviews[currentReviewIndex].content}"
                      </p>
                      <p className="text-bombovo-dark font-bold text-sm md:text-base">
                        — {reviews[currentReviewIndex].author}
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

              <div className="lg:w-[58%] w-full">
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <div className="absolute" style={{ left: '0%', bottom: '15%', transform: 'rotate(-6deg)', zIndex: 1 }}>
                    <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                      <img src={reviewPhotoSrc(0)} alt="Review Photo 1" className="object-cover" style={{ width: '200px', height: '260px' }} />
                      <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">2025 Školy v prírode</p>
                    </div>
                  </div>
                  <div className="absolute" style={{ left: '30%', top: '10%', transform: 'rotate(4deg)', zIndex: 2 }}>
                    <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                      <img src={reviewPhotoSrc(1)} alt="Review Photo 2" className="object-cover" style={{ width: '200px', height: '260px' }} />
                      <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">2025 Školy v prírode</p>
                    </div>
                  </div>
                  <div className="absolute" style={{ right: '5%', top: '0%', transform: 'rotate(-4deg)', zIndex: 3 }}>
                    <div className="bg-white p-4 pb-14 shadow-2xl rounded-sm">
                      <img src={reviewPhotoSrc(2)} alt="Review Photo 3" className="object-cover" style={{ width: '200px', height: '260px' }} />
                      <p className="text-center mt-3 font-handwritten text-bombovo-dark text-base">2025 Školy v prírode</p>
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
              {/* Block 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">{section3[0].headline}</h3>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{section3[0].body}</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                    <img src={section3[0].photo} alt={section3[0].headline} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Block 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center lg:order-first order-last">
                  <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                    <img src={section3[1].photo} alt={section3[1].headline} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">{section3[1].headline}</h3>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{section3[1].body}</p>
                </div>
              </div>

              {/* Block 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">{section3[2].headline}</h3>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">{section3[2].body}</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-full rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '4 / 3' }}>
                    <img src={section3[2].photo} alt={section3[2].headline} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* CTA */}
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
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-12">
              {strediskaHeadline}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {centers.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-64 relative overflow-hidden">
                    <img src={center.image} alt={center.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-bombovo-dark leading-tight">{center.name}</h3>
                    <div className="flex gap-3 mt-6">
                      <div className="flex-1 bg-bombovo-red rounded-2xl p-4 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{center.price}</span>
                      </div>
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

      <Footer />
    </main>
  )
}
