'use client'

import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  headline: string
  items: FAQItem[]
}

export default function FAQ({ headline, items }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  if (items.length === 0) return null

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <h2 className="text-2xl md:text-3xl font-amatic text-bombovo-dark text-center mb-8">
          {headline}
        </h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((faq, index) => {
            const isOpen = openItems.includes(index)
            return (
              <div key={index} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-4 md:p-5 bg-bombovo-yellow hover:opacity-90 transition-opacity duration-200 rounded-xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-left text-base md:text-lg font-semibold text-bombovo-dark pr-4">
                    {faq.question}
                  </span>
                  <FaChevronDown
                    className={`flex-shrink-0 text-bombovo-dark transition-transform duration-200 text-lg md:text-xl ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-4 md:p-6 bg-white">
                      <p className="text-bombovo-dark text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* RED CTA BUTTON */}
        <div className="text-center mt-10">
          <Link href="/faq">
            <button className="px-8 py-4 bg-bombovo-red text-white font-bold text-base md:text-lg rounded-full hover:bg-opacity-90 hover:shadow-lg hover:translate-y-0.5 active:translate-y-1 transition-all duration-200">
              Pozri Viac Otázok
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
