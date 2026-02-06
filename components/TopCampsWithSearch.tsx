'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { camps as allCamps } from '@/lib/campsData'

// Select the 3 featured camps: Tanečná Planéta, Olymp Kemp, V Dračej Nore
const featuredCampIds = ['tanecna-planeta', 'olymp-kemp', 'v-dracej-nore']
const camps = allCamps.filter(camp => featuredCampIds.includes(camp.id))

export default function TopCampsWithSearch() {
  const router = useRouter()
  const [ageOpen, setAgeOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  
  const [selectedAge, setSelectedAge] = useState('all')
  const [selectedDate, setSelectedDate] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const ageOptions = ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17']
  const dateOptions = [
    { value: '1-jul', label: '1. Pol Jul 2026' },
    { value: '2-jul', label: '2. Pol Jul 2026' },
    { value: '1-aug', label: '1. Pol August 2026' },
    { value: '2-aug', label: '2. Pol August 2026' },
  ]
  const typeOptions = ['Akčný', 'Dobrodružný', 'Fantasy', 'Náučný', 'Oddychový', 'Športový', 'Tínedžerský', 'Umelecký', 'Unikátny']

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedAge !== 'all') params.append('age', selectedAge)
    if (selectedDate !== 'all') params.append('date', selectedDate)
    if (selectedType !== 'all') params.append('type', selectedType)
    
    router.push(`/letne-tabory?${params.toString()}`)
  }

  const getAgeLabel = () => {
    if (selectedAge === 'all') return 'Vek dieťaťa'
    return selectedAge
  }

  const getDateLabel = () => {
    if (selectedDate === 'all') return 'Všetky termíny'
    const option = dateOptions.find(opt => opt.value === selectedDate)
    return option?.label || 'Všetky termíny'
  }

  const getTypeLabel = () => {
    if (selectedType === 'all') return 'Všetky typy'
    return selectedType
  }

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <h2 
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-4 leading-tight"
        >
          Naše Najpredávanejšie
          <br />
          Tábory V Roku 2026
        </h2>

        {/* Camp Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {camps.map((camp, index) => (
            <div
              key={camp.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Camp Image - 4:3 aspect ratio to match original photos */}
              <div className="w-full aspect-[4/3] relative overflow-hidden">
                <img 
                  src={camp.image} 
                  alt={camp.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-bombovo-dark mb-3">
                  {camp.name}
                </h3>
                <p className="text-bombovo-dark leading-relaxed mb-4 line-clamp-3">
                  {camp.description}
                </p>
                <Link href={`/letne-tabory/${camp.id}`}>
                  <button
                    className="w-full py-4 px-8 bg-[#FDCA40] border-2 border-[#080708] text-[#080708] font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200"
                  >
                    Zistiť viac
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Transition Subheadline */}
        <h3 
          className="text-2xl md:text-3xl font-amatic text-bombovo-dark text-center mt-16 mb-8"
        >
          <span className="relative inline-block">
            Nevieš Si Vybrať? Vyskúšaj Náš Hľadáčik Táboru!
            <svg
              className="absolute left-0 -bottom-2 w-full"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              style={{ height: '12px' }}
            >
              <path
                d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
                stroke="#3772FF"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                stroke="#3772FF"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </span>
        </h3>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto mt-8">
          <div 
            className="bg-white rounded-3xl shadow-2xl p-4 md:p-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Age Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => {
                    setAgeOpen(!ageOpen)
                    setDateOpen(false)
                    setTypeOpen(false)
                  }}
                  className="w-full h-16 px-6 bg-bombovo-gray rounded-2xl flex items-center justify-between hover:bg-opacity-80 transition-all duration-300 border-2 border-transparent hover:border-bombovo-blue"
                >
                  <span className="text-bombovo-dark font-medium">{getAgeLabel()}</span>
                  <FaChevronDown className={`text-bombovo-blue transition-transform duration-300 ${ageOpen ? 'rotate-180' : ''}`} />
                </button>
                {ageOpen && (
                  <motion.div
                    className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl z-10 max-h-80 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {ageOptions.map((age) => (
                      <button
                        key={age}
                        onClick={() => {
                          setSelectedAge(age)
                          setAgeOpen(false)
                        }}
                        className="w-full px-6 py-3 text-left hover:bg-bombovo-blue hover:text-white transition-colors duration-200"
                      >
                        {age}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Date Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => {
                    setDateOpen(!dateOpen)
                    setAgeOpen(false)
                    setTypeOpen(false)
                  }}
                  className="w-full h-16 px-6 bg-bombovo-gray rounded-2xl flex items-center justify-between hover:bg-opacity-80 transition-all duration-300 border-2 border-transparent hover:border-bombovo-blue"
                >
                  <span className="text-bombovo-dark font-medium">{getDateLabel()}</span>
                  <FaChevronDown className={`text-bombovo-blue transition-transform duration-300 ${dateOpen ? 'rotate-180' : ''}`} />
                </button>
                {dateOpen && (
                  <motion.div
                    className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl z-10 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {dateOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedDate(option.value)
                          setDateOpen(false)
                        }}
                        className="w-full px-6 py-3 text-left hover:bg-bombovo-blue hover:text-white transition-colors duration-200"
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Type Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => {
                    setTypeOpen(!typeOpen)
                    setAgeOpen(false)
                    setDateOpen(false)
                  }}
                  className="w-full h-16 px-6 bg-bombovo-gray rounded-2xl flex items-center justify-between hover:bg-opacity-80 transition-all duration-300 border-2 border-transparent hover:border-bombovo-blue"
                >
                  <span className="text-bombovo-dark font-medium">{getTypeLabel()}</span>
                  <FaChevronDown className={`text-bombovo-blue transition-transform duration-300 ${typeOpen ? 'rotate-180' : ''}`} />
                </button>
                {typeOpen && (
                  <motion.div
                    className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl z-10 max-h-80 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {typeOptions.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type)
                          setTypeOpen(false)
                        }}
                        className="w-full px-6 py-3 text-left hover:bg-bombovo-blue hover:text-white transition-colors duration-200"
                      >
                        {type}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="h-16 px-8 bg-bombovo-red text-white font-bold text-lg rounded-2xl shadow-lg hover:translate-y-0.5 active:translate-y-1 transition-transform duration-150 lg:w-auto w-full"
              >
                Hľadať
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

