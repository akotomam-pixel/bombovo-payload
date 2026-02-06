'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import { camps } from '@/lib/campsData'
import { getCampDetails } from '@/data/camps'
import { FaMapMarkerAlt, FaChild, FaChevronDown, FaChevronRight } from 'react-icons/fa'

export default function CampDetailPage() {
  const params = useParams()
  const campId = params.campId as string
  const camp = camps.find((c) => c.id === campId)
  const campDetails = getCampDetails(campId)

  // State for image gallery
  const [mainImage, setMainImage] = useState(0)
  const totalImages = 10
  const [visibleThumbnailStart, setVisibleThumbnailStart] = useState(0)

  // State for review carousel
  const [currentReview, setCurrentReview] = useState(0)

  // Auto-rotate reviews
  useEffect(() => {
    if (!campDetails) return
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % campDetails.section3.reviews.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [campDetails])

  // State for accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [openStredisko, setOpenStredisko] = useState(false)

  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentLightboxPhoto, setCurrentLightboxPhoto] = useState(0)
  const totalStrediskoPhotos = 6

  const openLightbox = (photoIndex: number) => {
    setCurrentLightboxPhoto(photoIndex)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const handlePrevLightboxPhoto = () => {
    setCurrentLightboxPhoto((prev) => (prev > 0 ? prev - 1 : totalStrediskoPhotos - 1))
  }

  const handleNextLightboxPhoto = () => {
    setCurrentLightboxPhoto((prev) => (prev < totalStrediskoPhotos - 1 ? prev + 1 : 0))
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightboxPhoto()
      } else if (e.key === 'ArrowRight') {
        handleNextLightboxPhoto()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [lightboxOpen])

  // Handle thumbnail navigation
  const handlePrevThumbnail = () => {
    if (visibleThumbnailStart > 0) {
      setVisibleThumbnailStart(visibleThumbnailStart - 1)
    }
  }

  const handleNextThumbnail = () => {
    if (visibleThumbnailStart < totalImages - 5) {
      setVisibleThumbnailStart(visibleThumbnailStart + 1)
    }
  }

  // Handle 404
  if (!camp) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <Header />
        <main className="flex-grow flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-bombovo-dark mb-6">
              Táto stránka neexistuje
            </h1>
            <Link href="/letne-tabory">
              <button className="px-8 py-4 bg-bombovo-yellow text-bombovo-dark font-bold text-lg rounded-3xl hover:translate-y-0.5 transition-transform duration-150">
                Späť na letné tábory
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If camp details not found, show placeholder
  if (!campDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <Header />
        <main className="flex-grow">
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center space-y-8">
                <h1 className="text-5xl lg:text-6xl font-bold text-bombovo-dark">
                  {camp.name}
                </h1>
                <div className="bg-bombovo-gray rounded-3xl p-12 space-y-6">
                  <p className="text-3xl font-handwritten text-bombovo-red">
                    Pripravujeme
                  </p>
                  <p className="text-xl text-gray-600">
                    Detailná stránka pre {camp.name} je v príprave.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  // Render full camp details page
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Section 0: TopBar and Header */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      <main className="flex-grow">
        {/* Section 1: Hero */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Mobile Layout */}
            <div className="lg:hidden space-y-6">
              <h1 className="text-3xl font-bold text-bombovo-dark">
                {campDetails.headline}{' '}
                <span className="relative inline-block text-bombovo-red">
                  {campDetails.headlineHighlight}
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
                  </svg>
                </span>
              </h1>

              {/* Bullet Points */}
              <div className="space-y-3">
                {campDetails.bulletPoints.map((point, idx) => (
                  <p key={idx} className="text-base text-bombovo-dark">{point}</p>
                ))}
              </div>

              {/* Photo Carousel */}
              <div className="relative">
                <div 
                  className="w-full rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#90EE90', aspectRatio: '16/9' }}
                >
                  <p className="text-lg font-bold text-bombovo-dark">[Photo will be placed here]</p>
                </div>
                
                <button
                  onClick={() => setMainImage(mainImage > 0 ? mainImage - 1 : totalImages - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <span className="text-2xl text-bombovo-dark">←</span>
                </button>

                <button
                  onClick={() => setMainImage(mainImage < totalImages - 1 ? mainImage + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg z-10"
                >
                  <span className="text-2xl text-bombovo-dark">→</span>
                </button>
              </div>

              {/* Icons */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-bombovo-blue text-xl" />
                  <span className="text-base text-bombovo-dark">{campDetails.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaChild className="text-bombovo-blue text-xl" />
                  <span className="text-base text-bombovo-dark">{campDetails.age}</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-1">
                <p className="text-xl font-bold text-bombovo-dark relative inline-block">
                  CENA: {campDetails.price}
                  <span className="absolute left-0 -bottom-1 w-full h-1 bg-bombovo-red"></span>
                </p>
              </div>

              {/* Button */}
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
                  {campDetails.headline}{' '}
                  <span className="relative inline-block text-bombovo-red">
                    {campDetails.headlineHighlight}
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
                    </svg>
                  </span>
                </h1>

                <div className="space-y-3">
                  {campDetails.bulletPoints.map((point, idx) => (
                    <p key={idx} className="text-base md:text-lg text-bombovo-dark">{point}</p>
                  ))}
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-bombovo-blue text-xl" />
                    <span className="text-base md:text-lg text-bombovo-dark">{campDetails.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaChild className="text-bombovo-blue text-xl" />
                    <span className="text-base md:text-lg text-bombovo-dark">{campDetails.age}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <p className="text-xl font-bold text-bombovo-dark relative inline-block">
                    CENA: {campDetails.price}
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

              {/* Product Gallery */}
              <div className="lg:col-span-3">
                <div 
                  className="w-full rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#90EE90', aspectRatio: '16/9' }}
                >
                  <p className="text-lg font-bold text-bombovo-dark">[Photo will be placed here]</p>
                </div>

                <div className="relative flex items-center gap-2">
                  <button
                    onClick={handlePrevThumbnail}
                    className={`flex-shrink-0 p-2 ${visibleThumbnailStart === 0 ? 'opacity-30 cursor-not-allowed' : ''} rounded`}
                    disabled={visibleThumbnailStart === 0}
                  >
                    <span className="text-2xl text-bombovo-dark">←</span>
                  </button>

                  <div className="flex-1 grid grid-cols-5 gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const imageIndex = visibleThumbnailStart + index
                      return (
                        <div
                          key={imageIndex}
                          onClick={() => setMainImage(imageIndex)}
                          className={`cursor-pointer rounded-lg overflow-hidden ${mainImage === imageIndex ? 'ring-4 ring-bombovo-yellow' : ''}`}
                          style={{ aspectRatio: '16/9' }}
                        >
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: '#90EE90' }}
                          >
                            <p className="text-xs font-bold text-bombovo-dark">{imageIndex + 1}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={handleNextThumbnail}
                    className={`flex-shrink-0 p-2 ${visibleThumbnailStart >= totalImages - 5 ? 'opacity-30 cursor-not-allowed' : ''} rounded`}
                    disabled={visibleThumbnailStart >= totalImages - 5}
                  >
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
                <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-8">
                  Hodnotenie Tábora
                </h2>
                
                <div className="space-y-6">
                  {Object.entries(campDetails.section2.ratings).map(([key, value]) => {
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
                          <div 
                            className="h-full bg-bombovo-yellow flex items-center px-4"
                            style={{ width: `${value * 10}%` }}
                          >
                            {value > 0 && <span className="text-bombovo-dark font-bold text-base">{value}/10</span>}
                          </div>
                          {value === 0 && (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bombovo-dark font-bold text-base">0/10</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="border-4 border-bombovo-yellow rounded-3xl p-8 md:p-10 bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-6">
                  {campDetails.section2.headline}
                </h2>
                <div className="space-y-4 text-base md:text-lg text-bombovo-dark leading-relaxed mb-8">
                  {campDetails.section2.description.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={() => document.getElementById('dostupne-terminy')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full"
                  >
                    {campDetails.section2.buttonText}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Review Carousel */}
              <div 
                className="rounded-3xl p-8 md:p-10 flex flex-col justify-center min-h-[300px] bg-bombovo-gray border-4 border-bombovo-red shadow-lg"
              >
                <div className="space-y-6">
                  <p className="text-lg md:text-xl text-bombovo-dark leading-relaxed italic">
                    "{campDetails.section3.reviews[currentReview].text}"
                  </p>
                  <p className="text-base md:text-lg text-bombovo-dark font-semibold">
                    — {campDetails.section3.reviews[currentReview].author}
                  </p>
                </div>

                <div className="flex justify-center gap-2.5 mt-8">
                  {campDetails.section3.reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentReview ? 'bg-bombovo-dark' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark">
                  {campDetails.section3.headline}
                </h2>
                <div className="space-y-4 text-base md:text-lg text-bombovo-dark leading-relaxed">
                  {campDetails.section3.text.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Details Accordion */}
        <section className={`${campDetails.section4.hasStredisko ? 'pt-6 md:pt-8 pb-0' : 'py-16 md:py-20'} bg-white`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`${openAccordion === 'main' ? 'border-4 border-bombovo-yellow rounded-3xl' : ''}`}>
              <div
                className={`bg-bombovo-yellow py-6 px-8 cursor-pointer flex items-center justify-between ${openAccordion === 'main' ? 'rounded-t-3xl' : 'rounded-3xl'}`}
                onClick={() => setOpenAccordion(openAccordion === 'main' ? null : 'main')}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">Detaily Tábora</h2>
                <FaChevronDown className={`text-bombovo-dark text-3xl transition-transform ${openAccordion === 'main' ? '' : 'rotate-[-90deg]'}`} />
              </div>

              {openAccordion === 'main' && (
                <div className="bg-white p-8 md:p-12 rounded-b-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* V TOMTO TÁBORE ZAŽIJEŠ */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">V TOMTO TÁBORE ZAŽIJEŠ:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {campDetails.section4.details.vTomtoTaboreZazites.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    {/* V CENE */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">V CENE:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {campDetails.section4.details.vCene.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    {/* LOKALITA */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">LOKALITA:</h3>
                      <p className="text-base text-bombovo-dark leading-relaxed">
                        {campDetails.section4.details.lokalita}
                      </p>
                    </div>

                    {/* DOPRAVA */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">DOPRAVA:</h3>
                      <p className="text-base text-bombovo-dark leading-relaxed">{campDetails.section4.details.doprava}</p>
                    </div>

                    {/* UBYTOVANIE */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">UBYTOVANIE:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {campDetails.section4.details.ubytovanie.map((item, idx) => (
                          <p key={idx}>• {item}</p>
                        ))}
                      </div>
                    </div>

                    {/* ZA PRÍPLATOK */}
                    <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                      <h3 className="text-xl font-bold text-bombovo-dark mb-4">ZA PRÍPLATOK:</h3>
                      <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                        {campDetails.section4.details.zaPriplatok.map((item, idx) => (
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

        {/* Section 4b: Stredisko (if applicable) */}
        {campDetails.section4.hasStredisko && (
          <section className="mt-[10px] pt-0 pb-8 md:pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`${openStredisko ? 'border-4 border-bombovo-yellow rounded-3xl' : ''}`}>
                <div
                  className={`bg-bombovo-yellow py-6 px-8 cursor-pointer flex items-center justify-between ${openStredisko ? 'rounded-t-3xl' : 'rounded-3xl'}`}
                  onClick={() => setOpenStredisko(!openStredisko)}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">
                    Detaily Strediska {campDetails.section4.strediskoName}
                  </h2>
                  <FaChevronDown className={`text-bombovo-dark text-3xl transition-transform ${openStredisko ? '' : 'rotate-[-90deg]'}`} />
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openStredisko ? 'max-h-[2200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-white p-8 md:p-12 rounded-b-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-8">
                        <p className="text-lg text-bombovo-dark leading-relaxed">
                          {campDetails.section4.strediskoDescription}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Array.from({ length: totalStrediskoPhotos }).map((_, index) => (
                            <div
                              key={index}
                              className="cursor-pointer rounded-lg overflow-hidden"
                              style={{ aspectRatio: '4/3' }}
                              onClick={() => openLightbox(index)}
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
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${campDetails.section4.mapCoordinates?.lat || 48.5806195783322},${campDetails.section4.mapCoordinates?.lng || 18.567247}&zoom=14`}
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
        )}

        <div className="bg-white">
          <WaveDivider color="blue" variant={3} />
        </div>

        {/* Section 5: Available Dates */}
        <section id="dostupne-terminy" className="py-16 md:py-20 bg-bombovo-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {campDetails.section5.dates.map((date, idx) => (
                  <div key={idx} className={`grid grid-cols-4 gap-6 items-center ${idx < campDetails.section5.dates.length - 1 ? 'mb-6' : ''}`}>
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
                      {date.registrationId ? (
                        <Link href={`/prihlaska/${date.registrationId}`}>
                          <button className="px-8 py-4 bg-bombovo-red border-2 border-white text-white font-bold text-lg rounded-full">
                            MÁM ZÁUJEM
                          </button>
                        </Link>
                      ) : (
                        <Link href="/kontakt">
                          <button className="px-8 py-4 bg-bombovo-red border-2 border-white text-white font-bold text-lg rounded-full">
                            MÁM ZÁUJEM
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <h2 className="text-3xl font-bold text-bombovo-dark mb-6">Dostupné termíny</h2>
              {campDetails.section5.dates.map((date, idx) => (
                <div key={idx} className="bg-white rounded-2xl mb-4 shadow-lg overflow-hidden">
                  <div className="bg-[#FDCA40] p-4">
                    <p className="text-base font-semibold text-bombovo-dark">
                      Termín {date.start} - {date.end}
                    </p>
                  </div>
                  <div className="bg-white p-4">
                    <p className="text-sm text-gray-600 mb-3">Počet dní {date.days}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base text-gray-400 line-through">{date.originalPrice}</p>
                        <p className="text-xl font-bold text-bombovo-dark mt-2" style={{
                          textDecoration: 'underline',
                          textDecorationColor: '#DF2935',
                          textDecorationThickness: '3px',
                          textUnderlineOffset: '4px'
                        }}>{date.discountedPrice}</p>
                      </div>
                      {date.registrationId ? (
                        <Link href={`/prihlaska/${date.registrationId}`}>
                          <button className="bg-[#DF2935] text-white font-bold px-5 py-3 rounded-full shadow-md">
                            Mám záujem
                          </button>
                        </Link>
                      ) : (
                        <Link href="/kontakt">
                          <button className="bg-[#DF2935] text-white font-bold px-5 py-3 rounded-full shadow-md">
                            Mám záujem
                          </button>
                        </Link>
                      )}
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
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-5xl font-bold">×</button>
          <button onClick={(e) => { e.stopPropagation(); handlePrevLightboxPhoto(); }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl">◄</button>
          <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#90EE90' }}>
              <p className="text-5xl font-bold text-bombovo-dark">Photo Placement {currentLightboxPhoto + 1}</p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleNextLightboxPhoto(); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl">►</button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xl font-semibold">
            {currentLightboxPhoto + 1} / {totalStrediskoPhotos}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
