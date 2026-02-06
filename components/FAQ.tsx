'use client'

import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import Link from 'next/link'

const faqs = [
  {
    id: 1,
    question: 'Ako vám môžem veriť, keď sa môjmu dieťaťu inde v tábore nepáčilo?',
    answer: 'Nie sme ako ostatné cestovné agentúry. Nám nejde len o čísla, ide nám hlavne o to, aby sa vaše dieťa bavilo a vrátilo sa domov šťastné. Preto sme na trhu už celých 20 rokov a ponúkame tábor v cene, ktorá zahŕňa skutočne všetko. Nechceme, aby sa vaše dieťa nudilo alebo cítilo sklamané. Od jedinečného programu plného aktivít až po každého člena nášho tímu – všetci sa snažíme, aby si vaše dieťa užilo celý pobyt u nás. Keď nám rodičia povedia "inde sa mu to nepáčilo," berieme to vážne a ukážeme im rozdiel.',
  },
  {
    id: 2,
    question: 'Doplácam si výlety k táboru?',
    answer: 'Nie. Cena každého tábora je konečná a zahŕňa všetko. Žiadne skryté poplatky, žiadne doplatky za aktivity či výlety. Ak chcete svojmu dieťaťu dopriať tábor, kde sa nebude nudiť a všetko je už zahrnuté v cene, Bombovo je tá správna voľba.',
  },
  {
    id: 3,
    question: 'Dá sa strava prispôsobiť potrebám môjho dieťaťa?',
    answer: 'Samozrejme. Či už ide o celiakiu, intoleranciu laktózy, vegetariánsku alebo vegánsku stravu, náš skúsený kuchársky tím vie pripraviť plnohodnotné jedlá pre každé dieťa. Stačí nám to uviesť do prihlášky a postaráme sa o to, aby vaše dieťa jedlo rovnako dobre ako všetci ostatní.',
  },
  {
    id: 4,
    question: 'Je môj syn/dcéra dosť starý/á na týždenný tábor bez rodičov?',
    answer: 'Každý náš tábor je vytvorený pre konkrétnu vekovú skupinu. Ak vaše dieťa patrí do danej vekovej kategórie, môžete si byť istí, že je dosť staré. Videli sme tisíce detí v tomto veku a vieme, že to zvládnu. Najčastejší problém nie je, či je dieťa pripravené, ale ako mu pomôcť prekonať počiatočný smútok po domove. Preto máme špeciálne pripravený program, ktorý deti tak zaujme, že na smútok rýchlo zabudnú. Už po prvom dni plnom hier, nových kamarátov a dobrodružstiev vaše dieťa zistí, že to zvládne úplne samo.',
  },
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline - 30% BIGGER + The Girl Next Door Font */}
        <h2 
          className="text-2xl md:text-3xl font-amatic text-bombovo-dark text-center mb-8"
        >
          Často Kladené Otázky
        </h2>

        {/* FAQ Items - ONLY 4 QUESTIONS - YELLOW BOXES LIKE FAQ PAGE */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openItems.includes(faq.id)
            
            return (
              <div 
                key={faq.id}
                className="rounded-xl overflow-hidden"
              >
                {/* Question Button - Yellow */}
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between p-4 md:p-5 bg-bombovo-yellow hover:opacity-90 transition-opacity duration-200 rounded-xl"
                  aria-expanded={isOpen}
                >
                  <span className="text-left text-base md:text-lg font-semibold text-bombovo-dark pr-4">
                    {faq.question}
                  </span>
                  <FaChevronDown 
                    className={`flex-shrink-0 text-bombovo-dark transition-transform duration-200 text-lg md:text-xl ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer Content - with shadow */}
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







