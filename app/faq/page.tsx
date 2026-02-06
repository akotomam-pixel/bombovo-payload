'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FaChevronDown } from 'react-icons/fa'

const faqs = [
  {
    id: 1,
    question: 'Má Bombovo vyškolených animátorov?',
    answer: 'Áno. Každý animátor v Bombove prechádza dôkladným výcvikom a výberovým procesom. Chceme si byť istí, že je to ten pravý človek pre prácu s deťmi. Máme vysoké štandardy a dbáme na to, aby každý člen nášho tímu mal nielen skúsenosti, ale aj správny prístup k deťom. Bezpečnosť a kvalita starostlivosti sú pre nás prvoradé.',
  },
  {
    id: 2,
    question: 'Ako vám môžem veriť, keď sa môjmu dieťaťu inde v tábore nepáčilo?',
    answer: 'Nie sme ako ostatné cestovné agentúry. Nám nejde len o čísla, ide nám hlavne o to, aby sa vaše dieťa bavilo a vrátilo sa domov šťastné. Preto sme na trhu už celých 20 rokov a ponúkame tábor v cene, ktorá zahŕňa skutočne všetko. Nechceme, aby sa vaše dieťa nudilo alebo cítilo sklamané. Od jedinečného programu plného aktivít až po každého člena nášho tímu – všetci sa snažíme, aby si vaše dieťa užilo celý pobyt u nás. Keď nám rodičia povedia "inde sa mu to nepáčilo," berieme to vážne a ukážeme im rozdiel.',
  },
  {
    id: 3,
    question: 'Doplácam si výlety k táboru?',
    answer: 'Nie. Cena každého tábora je konečná a zahŕňa všetko. Žiadne skryté poplatky, žiadne doplatky za aktivity či výlety. Ak chcete svojmu dieťaťu dopriať tábor, kde sa nebude nudiť a všetko je už zahrnuté v cene, Bombovo je tá správna voľba.',
  },
  {
    id: 4,
    question: 'Dá sa strava prispôsobiť potrebám môjho dieťaťa?',
    answer: 'Samozrejme. Či už ide o celiakiu, intoleranciu laktózy, vegetariánsku alebo vegánsku stravu, náš skúsený kuchársky tím vie pripraviť plnohodnotné jedlá pre každé dieťa. Stačí nám to uviesť do prihlášky a postaráme sa o to, aby vaše dieťa jedlo rovnako dobre ako všetci ostatní.',
  },
  {
    id: 5,
    question: 'Môže byť môj syn/dcéra na izbe s kamarátmi?',
    answer: 'Áno. Stačí to napísať do prihlášky a náš tým sa o to postará. 😊',
  },
  {
    id: 6,
    question: 'Môžu byť dievčatá a chlapci spoločne na jednej izbe?',
    answer: 'Bohužiaľ nie. Podľa platných smerníc nemôžeme umiestniť dievčatá a chlapcov na spoločnú izbu, a to ani v prípade, že sú to súrodenci. Je to z dôvodu bezpečnosti a súkromia všetkých detí.',
  },
  {
    id: 7,
    question: 'Môže priniesť alebo odviezť moje dieťa niekto iný?',
    answer: 'Samozrejme. Stačí vyplniť jednoduchý formulár a zaslať ho na náš email, alebo ho odovzdať osobne našemu pracovníkovi pri prevzatí dieťaťa na konci tábora.',
  },
  {
    id: 8,
    question: 'Je môj syn/dcéra dosť starý/á na týždenný tábor bez rodičov?',
    answer: 'Každý náš tábor je vytvorený pre konkrétnu vekovú skupinu. Ak vaše dieťa patrí do danej vekovej kategórie, môžete si byť istí, že je dosť staré. Videli sme tisíce detí v tomto veku a vieme, že to zvládnu. Najčastejší problém nie je, či je dieťa pripravené, ale ako mu pomôcť prekonať počiatočný smútok po domove. Preto máme špeciálne pripravený program, ktorý deti tak zaujme, že na smútok rýchlo zabudnú. Už po prvom dni plnom hier, nových kamarátov a dobrodružstiev vaše dieťa zistí, že to zvládne úplne samo.',
  },
  {
    id: 9,
    question: 'Ako prebieha platba za tábor?',
    answer: 'Túto informáciu doplníme neskôr.',
  },
  {
    id: 10,
    question: 'Ako je to s vrátením peňazí, keď dieťa ochorie?',
    answer: 'Ak vaše dieťa ochorie pred začiatkom tábora, vrátime vám plnú sumu bez akýchkoľvek otázok. Nie je fér brať vám peniaze za niečo, čoho sa vaše dieťa nemôže zúčastniť z dôvodu choroby. Pre nás je dôležité, aby ste mali istotu a pokoj.',
  },
  {
    id: 11,
    question: 'Môžem si uplatniť rekreačný poukaz?',
    answer: 'Áno. Stačí, keď nám ho pošlete do kancelárie alebo prinesiete osobne.',
  },
  {
    id: 12,
    question: 'Kde nájdem fotky z tábora?',
    answer: 'Túto informáciu doplníme neskôr.',
  },
  {
    id: 13,
    question: 'Môžu deti počas tábora používať telefóny?',
    answer: 'Áno, ale s rozumným obmedzením. Hoci deti nemajú telefón pri sebe 24 hodín denne (chceme, aby si tábor naplno užili), každé dieťa dostáva svoj telefón na dve hodiny počas obednej prestávky. V tomto čase mu môžete pokojne zavolať.',
  },
  {
    id: 14,
    question: 'Je na stredisku bufet?',
    answer: 'Áno. V bufete si deti môžu kúpiť rôzne sladkosti, nápoje, ale aj Bombovo suveníry na pamiatku.',
  },
  {
    id: 15,
    question: 'Čo ak sa tam moje dieťa stretne so zlými deťmi alebo zlým vplyvom?',
    answer: 'Naši animátori sú vyškolení nielen na organizovanie aktivít, ale hlavne na to, aby rozpoznali a okamžite riešili akýkoľvek problém. Sú neustále prítomní a pozorní – či už ide o konflikty medzi deťmi, nevhodné správanie, alebo len situácie, ktoré by mohli prerásť do problému. Práve vďaka tomu, že máme skúsený tím, ktorý vie, na čo dávať pozor, sa nám takéto situácie stávajú naozaj málokedy. Vytvárame pozitívne prostredie, kde deti prirodzene preberajú správne vzory správania od našich animátorov a od sebe navzájom. Ak by sa predsa len niečo stalo, rodičia sú okamžite informovaní a situácia sa rieši hneď na mieste. Vaše dieťa je u nás v bezpečí.',
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Section 0: Top Bar */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      
      {/* Section 1: Header */}
      <Header />
      
      {/* FAQ Section - White Background */}
      <div className="bg-white py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FAQ Items */}
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
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  )
}



