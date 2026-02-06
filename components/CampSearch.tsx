'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

export default function CampSearch() {
  const [ageOpen, setAgeOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  
  const [selectedAge, setSelectedAge] = useState('Vek dieťaťa')
  const [selectedDate, setSelectedDate] = useState('Všetky termíny')
  const [selectedType, setSelectedType] = useState('Všetky typy')

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-12"
        >
          Nájdi perfektný tábor pre svoje dieťa
        </h2>

        {/* Search Bar */}
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
                <span className="text-bombovo-dark font-medium">{selectedAge}</span>
                <FaChevronDown className={`text-bombovo-blue transition-transform duration-300 ${ageOpen ? 'rotate-180' : ''}`} />
              </button>
              {ageOpen && (
                <motion.div
                  className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl z-10 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {['6-9 rokov', '9-13 rokov', '13-18 rokov'].map((age) => (
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
                <span className="text-bombovo-dark font-medium">{selectedDate}</span>
                <FaChevronDown className={`text-bombovo-blue transition-transform duration-300 ${dateOpen ? 'rotate-180' : ''}`} />
              </button>
              {dateOpen && (
                <motion.div
                  className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl z-10 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {['1. Pol Jul 2026', '2. Pol Jul 2026', '1. Pol August 2026', '2. Pol August 2026'].map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date)
                        setDateOpen(false)
                      }}
                      className="w-full px-6 py-3 text-left hover:bg-bombovo-blue hover:text-white transition-colors duration-200"
                    >
                      {date}
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
                <span className="text-bombovo-dark font-medium">{selectedType}</span>
                <FaChevronDown className={`text-bombovo-blue transition-transform duration-300 ${typeOpen ? 'rotate-180' : ''}`} />
              </button>
              {typeOpen && (
                <motion.div
                  className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl z-10 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {['Akčný', 'Umelecký', 'Oddychový', 'Športový', 'Unikátny', 'Tínedžerský'].map((type) => (
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
              className="h-16 px-8 bg-bombovo-red text-white font-bold text-lg rounded-2xl shadow-lg hover:translate-y-0.5 active:translate-y-1 transition-transform duration-150 lg:w-auto w-full"
            >
              Hľadať
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}



