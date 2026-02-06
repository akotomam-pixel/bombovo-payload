'use client'

import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import Link from 'next/link'

export default function ProgramSkolyVPrirodePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Section 0: Top Bar & Header */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* Section 1: Hero Section */}
      <div className="bg-white">
        <section className="pt-16 pb-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-bombovo-dark">
                <span className="relative inline-block">
                  <span className="font-handwritten text-bombovo-red text-5xl md:text-6xl lg:text-7xl">
                    Tajomstvo Starého Denníka
                  </span>
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
                    <path
                      d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                      stroke="#FDCA40"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-bombovo-dark leading-relaxed max-w-4xl mx-auto mt-8">
                Škola v prírode, ktorá pokračuje aj po návrate do školy
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 2: Content Blocks */}
      <div className="bg-white">
        <section className="pt-5 pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Block 1: O čom je Tajomstvo Starého Denníka */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Text */}
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">
                    O čom je Tajomstvo Starého Denníka?
                  </h2>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Naša škola v prírode nie je len zmenou prostredia ani „oddychom od vyučovania". Je to premyslený a príbehový program, ktorý pracuje s triednym kolektívom ako celkom a cielene rozvíja vlastnosti a zručnosti, ktoré sú pre fungovanie triedy kľúčové… spoluprácu, komunikáciu, dôveru, kreativitu a zdravé sebavedomie.
                  </p>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Program je postavený tak, aby deti učil nenápadne a prirodzene… prostredníctvom hry, spoločného príbehu a vlastného zážitku. Každý deň má k sebe priradenú vlastnosť ktorú si deti pomocou aktivít rozvíjajú. Na konci každého dňa žiaci nájdu jednu stranu zo strateného denníka a odhalia tak časti príbehu, ktoré im začnú do seba zapadať.
                  </p>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Počas celého týždňa budú deti proti sebe súťažiť v tímoch. Pripravili sme si aj nový unikátny bodovací systém ktorý ešte viac prehlbuje zážitok z tejto školy v prírode.
                  </p>
                </div>
                {/* Image */}
                <div className="flex justify-center">
                  <div 
                    className="w-full rounded-2xl bg-[#90EE90] flex items-center justify-center shadow-lg"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <p className="text-lg font-bold text-bombovo-dark">[PICTURE]</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2: Dni sú rozdelené nasledovne */}
            <div className="mb-20">
              <div className="space-y-8">
                {/* Headline - Centered */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark">
                    <span className="relative inline-block">
                      <span className="font-handwritten text-bombovo-red text-4xl md:text-5xl lg:text-6xl">
                        Dni sú rozdelené nasledovne:
                      </span>
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
                        <path
                          d="M 0 9 Q 30 4, 60 7 T 120 7 T 180 9"
                          stroke="#FDCA40"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </svg>
                    </span>
                  </h2>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Deň 1 - Tímovosť */}
                  <div className="bg-bombovo-gray rounded-2xl p-6 md:p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-bombovo-dark">
                      1. Deň - Tímovosť
                    </h3>
                    <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                      Deti rozdelíme do tímov v ktorých budú spolupracovať celý týždeň. V tento deň sa budú hrať hry, ktoré sú zamerané na koordináciu a prácu celého tímu. Určite nebudú chýbať ani zoznamovacie hry a diskotéka ktoré dodajú deťom sebavedomie už od prvého dňa.
                    </p>
                  </div>

                  {/* Deň 2 - Hravosť */}
                  <div className="bg-bombovo-gray rounded-2xl p-6 md:p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-bombovo-dark">
                      2. Deň - Hravosť
                    </h3>
                    <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                      Tento deň obsahuje veľa hier pri ktorých sa deti vybláznia a zabavia. Aktivity posilnia ich prirodzenú chuť do hry, cieľom celého dňa je aby si deti užili bezstarostný čas plný smiechu a zábavy, ktorý zakončíme hudobno vedomostným kvízom.
                    </p>
                  </div>

                  {/* Deň 3 - Kreativita */}
                  <div className="bg-bombovo-gray rounded-2xl p-6 md:p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-bombovo-dark">
                      3. Deň - Kreativita
                    </h3>
                    <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                      Tento deň deťom pomôže kreatívne sa prejaviť a ukázať im, že každé dieťa má v sebe kus fantázie ktorú vie prakticky využiť. Deti si vyrobia rakety ktoré potom spolu vyšleme do vzduchu a na záver večera si v tímoch pripravia krátku scénku.
                    </p>
                  </div>

                  {/* Deň 4 - Zvedavosť */}
                  <div className="bg-bombovo-gray rounded-2xl p-6 md:p-8 space-y-4">
                    <h3 className="text-2xl font-bold text-bombovo-dark">
                      4. Deň - Zvedavosť
                    </h3>
                    <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                      Posledný deň má v deťoch znovu vzbudiť zvedavosť. Budeme tráviť veľa času v lese a pripomenieme si aké je dôležité sa starať o prírodu. Ako záverečný večerný program deti čaká veľká šifrovačka, ktorej vylúštenie ukončí príbeh, ktorý celý týždeň prežívali.
                    </p>
                  </div>
                </div>

                {/* CTA Button after days */}
                <div className="text-center pt-8">
                  <Link href="/skoly-v-prirode#strediska">
                    <button className="px-10 py-5 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                      Pozri Školy V Prírode
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Block 3: Ako program funguje v praxi */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="flex justify-center">
                  <div 
                    className="w-full rounded-2xl bg-[#90EE90] flex items-center justify-center shadow-lg"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <p className="text-lg font-bold text-bombovo-dark">[PICTURE]</p>
                  </div>
                </div>
                {/* Text */}
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">
                    Ako program funguje v praxi
                  </h2>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Z pohľadu animátorov sú deti aktívnymi hrdinami príbehu, nie pasívnymi účastníkmi aktivít. Animátor nevystupuje ako vedúci, ktorý rozdáva pokyny, ale ako sprievodca, ktorý vytvára situácie, v ktorých deti samy spolupracujú, rozhodujú sa a hľadajú riešenia. Práve v týchto momentoch sa prirodzene ukazuje dynamika triedy kto preberá zodpovednosť, kto potrebuje podporu, kto dokáže povzbudiť ostatných.
                  </p>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Počas týždňa je viditeľné, ako sa mení atmosféra v kolektíve: deti si viac dôverujú, zapájajú sa, neboja sa prejaviť vlastný názor a postupne sa učia rešpektovať rozdielnosti medzi sebou. Program je flexibilný a vždy prispôsobený konkrétnemu kolektívu či už ide o novú triedu alebo skupinu, ktorá sa pozná dlhšie, no potrebuje zlepšiť vzťahy.
                  </p>
                </div>
              </div>
            </div>

            {/* Block 4: Čím je táto škola v prírode výnimočná */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Text */}
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">
                    Čím je táto škola v prírode výnimočná
                  </h2>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Program je postavený na jednoduchom, ale silnom princípe: každý deň sa venuje jednej detskej vlastnosti napríklad hravosti, spolupráci, kreativite alebo zvedavosti. Tieto témy nie sú len pomenované, ale premietajú sa do všetkých aktivít, hier aj spoločných momentov počas dňa. Vyvrcholením je vždy príbehové odhalenie časti denníka, ktoré dáva deťom možnosť pochopiť zmysel celého dňa.
                  </p>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Veľkou pridanou hodnotou je, že denníky si deti po skončení školy v prírode berú so sebou do školy. Počas týždňa do nich vkladajú aj vlastné stránky svoje myšlienky, zážitky a pohľady. Trieda tak získava hmatateľnú spomienku a spoločný príbeh, ku ktorému sa môže vracať aj počas školského roka.
                  </p>
                </div>
                {/* Image */}
                <div className="flex justify-center">
                  <div 
                    className="w-full rounded-2xl bg-[#90EE90] flex items-center justify-center shadow-lg"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <p className="text-lg font-bold text-bombovo-dark">[PICTURE]</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 5: Čo si trieda odnáša */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Image (left on desktop) */}
                <div className="flex justify-center lg:order-first order-last">
                  <div 
                    className="w-full rounded-2xl bg-[#90EE90] flex items-center justify-center shadow-lg"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <p className="text-lg font-bold text-bombovo-dark">[PICTURE]</p>
                  </div>
                </div>
                {/* Text */}
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark">
                    Čo si trieda odnáša
                  </h2>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    Deti si zo školy v prírode odnášajú:
                  </p>
                  <ul className="space-y-3 text-base md:text-lg text-bombovo-dark leading-relaxed">
                    <li>• lepšie komunikačné a tímové zručnosti</li>
                    <li>• schopnosť spolupracovať namiesto súperenia</li>
                    <li>• väčšiu odvahu vyjadriť vlastný názor</li>
                    <li>• skúsenosť, že chyby sú prirodzenou súčasťou učenia</li>
                    <li>• spoločný príbeh, ktorý posilňuje triedne vzťahy</li>
                  </ul>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed pt-4">
                    Pre učiteľa to znamená triedu, v ktorej sa lepšie pracuje, deti sa navzájom viac rešpektujú a atmosféra je otvorenejšia a podporujúcejšia než predtým.
                  </p>
                </div>
              </div>
            </div>

            {/* Final CTA Button */}
            <div className="text-center pt-8 pb-8">
              <Link href="/skoly-v-prirode#strediska">
                <button className="px-10 py-5 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                  Pozri Školy V Prírode
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
