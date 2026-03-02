'use client'

import { useMemo, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import CampFilter from '@/components/CampFilter'
import CampCard from '@/components/CampCard'
import type { Camp } from '@/lib/campsData'

interface Props {
  camps: Camp[]
}

function CampsContent({ camps }: Props) {
  const searchParams = useSearchParams()
  const [selectedAge, setSelectedAge] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')

  useEffect(() => {
    const age = searchParams.get('age')
    const type = searchParams.get('type')
    const date = searchParams.get('date')
    if (age) setSelectedAge(age)
    if (type) setSelectedType(type)
    if (date) setSelectedDate(date)
  }, [searchParams])

  const handleClearFilters = () => {
    setSelectedAge('all')
    setSelectedType('all')
    setSelectedDate('all')
  }

  const filteredCamps = useMemo(() => {
    return camps.filter((camp) => {
      if (selectedAge !== 'all') {
        const age = Number(selectedAge)
        const [campMinAge, campMaxAge] = camp.ageRange
        if (age < campMinAge || age > campMaxAge) return false
      }
      if (selectedType !== 'all') {
        if (!camp.displayTypes.includes(selectedType)) return false
      }
      if (selectedDate !== 'all') {
        if (!camp.dates.includes(selectedDate)) return false
      }
      return true
    })
  }, [camps, selectedAge, selectedType, selectedDate])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />

      {/* Hero Section - Desktop only */}
      <section
        className="hidden lg:block bg-bombovo-gray overflow-hidden relative"
        style={{ height: 'min(310px, calc(100vh - 130px))' }}
      >
        {/* Polaroid fan — 7 photos, girl in front/center */}
        {(() => {
          const photos = [
            { src: '/images/Letne Tabory/babinec.JPG',          alt: 'Bombovo tábor',  rotate: -19, left: '1%',  zIndex: 1 },
            { src: '/images/Letne Tabory/olympcamp.JPG',         alt: 'Bombovo tábor',  rotate: -12, left: '13%', zIndex: 2 },
            { src: '/images/Letne Tabory/Art.JPG',               alt: 'Bombovo tábor',  rotate: -5,  left: '25%', zIndex: 3 },
            { src: '/images/Girl-removedbc.png',                  alt: 'Šťastné dieťa', rotate: 0,   left: '37%', zIndex: 8, isMain: true },
            { src: '/images/Letne Tabory/trhlina.JPG',           alt: 'Bombovo tábor',  rotate: 5,   left: '52%', zIndex: 3 },
            { src: '/images/Letne Tabory/fest.JPG',              alt: 'Bombovo tábor',  rotate: 12,  left: '64%', zIndex: 2 },
            { src: '/images/Letne Tabory/summeradvatnure.JPG',   alt: 'Bombovo tábor',  rotate: 19,  left: '76%', zIndex: 1 },
          ]
          const W = 188
          const H = 224
          return photos.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: 0,
                left: p.left,
                zIndex: p.zIndex,
                transform: `rotate(${p.rotate}deg)`,
                transformOrigin: 'bottom center',
                background: '#fff',
                padding: '10px 10px 36px 10px',
                boxShadow: p.isMain
                  ? '0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.14)'
                  : '0 6px 24px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.10)',
                borderRadius: '2px',
                width: `${W + 20}px`,
              }}
            >
              <img
                src={p.src}
                alt={p.alt}
                style={{
                  width: `${W}px`,
                  height: `${H}px`,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <p className="text-center mt-2 font-handwritten text-bombovo-dark text-sm">
                Letné Tábory 2025
              </p>
            </div>
          ))
        })()}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          <WaveDivider color="blue" variant={2} />
        </div>
      </section>

      <main className="flex-grow bg-white">
        <section className="py-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex gap-0">
              {/* Filter Panel - desktop */}
              <div className="hidden lg:block w-full lg:w-[20%] flex-shrink-0 pl-6">
                <CampFilter
                  selectedAge={selectedAge}
                  selectedType={selectedType}
                  selectedDate={selectedDate}
                  onAgeChange={setSelectedAge}
                  onTypeChange={setSelectedType}
                  onDateChange={setSelectedDate}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Camp Cards */}
              <div className="w-full lg:w-[80%] pl-6 pr-6">
                {/* Filter Panel - mobile */}
                <div className="lg:hidden mb-8">
                  <CampFilter
                    selectedAge={selectedAge}
                    selectedType={selectedType}
                    selectedDate={selectedDate}
                    onAgeChange={setSelectedAge}
                    onTypeChange={setSelectedType}
                    onDateChange={setSelectedDate}
                    onClearFilters={handleClearFilters}
                  />
                </div>

                <div className="mb-8">
                  <p className="text-lg text-gray-600">
                    Zobrazuje sa{' '}
                    <span className="font-bold text-bombovo-dark">{filteredCamps.length}</span> z{' '}
                    <span className="font-bold text-bombovo-dark">{camps.length}</span> táborov
                  </p>
                </div>

                {filteredCamps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCamps.map((camp, index) => (
                      <CampCard
                        key={camp.id}
                        id={camp.id}
                        name={camp.name}
                        age={camp.age}
                        types={camp.types}
                        displayTypes={camp.displayTypes}
                        price={camp.price}
                        index={index}
                        description={camp.description}
                        image={camp.image}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-2xl text-gray-500 mb-4">
                      Nenašli sa žiadne tábory podľa vašich filtrov
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="px-8 py-4 bg-bombovo-yellow text-bombovo-dark font-bold text-lg rounded-3xl hover:translate-y-0.5 transition-transform duration-150"
                    >
                      Vymazať filtre
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function CampsClient({ camps }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-white">
          <TopBar />
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p className="text-2xl text-gray-500">Načítavam...</p>
          </main>
          <Footer />
        </div>
      }
    >
      <CampsContent camps={camps} />
    </Suspense>
  )
}
