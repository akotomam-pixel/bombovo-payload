'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

interface CampFilterProps {
  selectedAge: string
  selectedType: string
  selectedDate: string
  onAgeChange: (age: string) => void
  onTypeChange: (type: string) => void
  onDateChange: (date: string) => void
  onClearFilters: () => void
}

export default function CampFilter({
  selectedAge,
  selectedType,
  selectedDate,
  onAgeChange,
  onTypeChange,
  onDateChange,
  onClearFilters
}: CampFilterProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const ageOptions = [
    { value: 'all', label: 'Vek Dieťaťa' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' },
    { value: '16', label: '16' },
    { value: '17', label: '17' },
  ]

  const typeOptions = [
    { value: 'all', label: 'Typ Tábora' },
    { value: 'Akčný', label: 'Akčný' },
    { value: 'Dobrodružný', label: 'Dobrodružný' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Náučný', label: 'Náučný' },
    { value: 'Oddychový', label: 'Oddychový' },
    { value: 'Športový', label: 'Športový' },
    { value: 'Tínedžerský', label: 'Tínedžerský' },
    { value: 'Umelecký', label: 'Umelecký' },
    { value: 'Unikátny', label: 'Unikátny' },
  ]

  const dateOptions = [
    { value: 'all', label: 'Termín Tábora' },
    { value: '1-jul', label: '1. Pol Jul 2026' },
    { value: '2-jul', label: '2. Pol Jul 2026' },
    { value: '1-aug', label: '1. Pol August 2026' },
    { value: '2-aug', label: '2. Pol August 2026' },
  ]

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const handleOptionSelect = (
    dropdown: string,
    value: string,
    onChange: (val: string) => void
  ) => {
    onChange(value)
    setOpenDropdown(null)
  }

  const getSelectedLabel = (value: string, options: typeof ageOptions) => {
    const option = options.find(opt => opt.value === value)
    return option?.label || options[0].label
  }

  return (
    <div className="sticky top-32 space-y-6 w-full pr-6">
      {/* Headline */}
      <h2 className="text-2xl font-bold text-bombovo-red">
        Hľadáčik Táboru
      </h2>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="text-sm text-bombovo-blue hover:text-bombovo-red transition-colors duration-200 font-medium uppercase tracking-wide w-full text-left"
      >
        VYMAZAŤ FILTRE
      </button>

      {/* Age Filter */}
      <div className="relative w-full">
        <button
          onClick={() => toggleDropdown('age')}
          className={`w-full px-6 py-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
            openDropdown === 'age'
              ? 'bg-[#D5E3F0]'
              : 'bg-[#E8EFF5] hover:bg-[#D5E3F0]'
          }`}
        >
          <span className="font-medium text-bombovo-dark whitespace-nowrap text-base">
            {getSelectedLabel(selectedAge, ageOptions)}
          </span>
          <FiChevronDown
            className={`transition-transform duration-200 flex-shrink-0 ml-4 ${
              openDropdown === 'age' ? 'rotate-180' : ''
            }`}
          />
        </button>

          <AnimatePresence>
            {openDropdown === 'age' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
              >
                {ageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleOptionSelect('age', option.value, onAgeChange)
                    }
                    className={`w-full px-4 py-3 text-left hover:bg-[#D5E3F0] transition-colors duration-150 ${
                      selectedAge === option.value
                        ? 'bg-[#E8EFF5] font-semibold'
                        : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {/* Type Filter */}
      <div className="relative w-full">
        <button
          onClick={() => toggleDropdown('type')}
          className={`w-full px-6 py-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
            openDropdown === 'type'
              ? 'bg-[#D5E3F0]'
              : 'bg-[#E8EFF5] hover:bg-[#D5E3F0]'
          }`}
        >
          <span className="font-medium text-bombovo-dark whitespace-nowrap text-base">
            {getSelectedLabel(selectedType, typeOptions)}
          </span>
          <FiChevronDown
            className={`transition-transform duration-200 flex-shrink-0 ml-4 ${
              openDropdown === 'type' ? 'rotate-180' : ''
            }`}
          />
        </button>

          <AnimatePresence>
            {openDropdown === 'type' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
              >
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleOptionSelect('type', option.value, onTypeChange)
                    }
                    className={`w-full px-4 py-3 text-left hover:bg-[#D5E3F0] transition-colors duration-150 ${
                      selectedType === option.value
                        ? 'bg-[#E8EFF5] font-semibold'
                        : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {/* Date Filter */}
      <div className="relative w-full">
        <button
          onClick={() => toggleDropdown('date')}
          className={`w-full px-6 py-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
            openDropdown === 'date'
              ? 'bg-[#D5E3F0]'
              : 'bg-[#E8EFF5] hover:bg-[#D5E3F0]'
          }`}
        >
          <span className="font-medium text-bombovo-dark whitespace-nowrap text-base">
            {getSelectedLabel(selectedDate, dateOptions)}
          </span>
          <FiChevronDown
            className={`transition-transform duration-200 flex-shrink-0 ml-4 ${
              openDropdown === 'date' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {openDropdown === 'date' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
            >
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    handleOptionSelect('date', option.value, onDateChange)
                  }
                  className={`w-full px-4 py-3 text-left hover:bg-[#D5E3F0] transition-colors duration-150 ${
                    selectedDate === option.value
                      ? 'bg-[#E8EFF5] font-semibold'
                      : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

