'use client'

import { useMemo, useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CampFilter from '@/components/CampFilter'
import CampCard from '@/components/CampCard'
import { camps } from '@/lib/campsData'

function CampsContent() {
  const searchParams = useSearchParams()
  const [selectedAge, setSelectedAge] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')

  // Read URL parameters and set filters on mount
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
      // Age filter
      if (selectedAge !== 'all') {
        const age = Number(selectedAge)
        const [campMinAge, campMaxAge] = camp.ageRange

        // Check if selected age falls within camp's age range
        if (age < campMinAge || age > campMaxAge) return false
      }

      // Type filter
      if (selectedType !== 'all') {
        if (!camp.displayTypes.includes(selectedType)) return false
      }

      // Date filter
      if (selectedDate !== 'all') {
        if (!camp.dates.includes(selectedDate)) return false
      }

      return true
    })
  }, [selectedAge, selectedType, selectedDate])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopBar />
      <Header />

      <main className="flex-grow">
        {/* Main Content - Filter + Camps */}
        <section className="py-12">
          <div className="flex gap-0">
            {/* Left Side - Filter Panel (20%) */}
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

            {/* Right Side - Camp Cards (80%) */}
            <div className="w-full lg:w-[80%] pl-6 pr-6">
              {/* Mobile Filter Section */}
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

              {/* Results Count */}
              <div className="mb-8">
                <p className="text-lg text-gray-600">
                  Zobrazuje sa{' '}
                  <span className="font-bold text-bombovo-dark">{filteredCamps.length}</span> z{' '}
                  <span className="font-bold text-bombovo-dark">{camps.length}</span> táborov
                </p>
              </div>

              {/* Camp Grid */}
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
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function LetneTaborePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-2xl text-gray-500">Načítavam...</p>
        </main>
        <Footer />
      </div>
    }>
      <CampsContent />
    </Suspense>
  )
}



