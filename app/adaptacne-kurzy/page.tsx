'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'
import { FaChevronDown } from 'react-icons/fa'

export default function AdaptacneKurzyPage() {
  const [openAccordion, setOpenAccordion] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    people: '',
    note: ''
  })
  const [formError, setFormError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (formError) {
      setFormError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim() || !formData.address.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFormError('Prosím vyplňte všetky povinné polia')
      return
    }
    
    // TODO: Email functionality to be added later
    console.log('Form submitted:', formData)
    alert('Formulár bol odoslaný! (Email funkcionalita bude pridaná neskôr)')
    setFormError('')
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Section 0: Top Bar */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Section 1: Hero - White Background */}
      <section className="pt-12 pb-0 md:pt-16 md:pb-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark mb-4">
            <span className="relative inline-block">
              Adaptačné Kurzy Pre Problémové Triedy
              <svg
                className="absolute left-0 -bottom-1 w-full"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
                style={{ height: '8px' }}
              >
                <path
                  d="M 0 4 Q 25 2, 50 4 T 100 4 T 150 4 T 200 4"
                  stroke="#DF2935"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-base md:text-lg text-bombovo-dark mt-6 max-w-4xl">
            Máte problémovú triedu a celý rok sa len snažíte prežiť každý deň? Príďte s nimi na náš adaptačný kurz a urobte krok k novým začiatkom.
          </p>
        </div>
      </section>

      {/* FIX 1: Blue Decorative Line Between Section 1 and 2 */}
      <div className="bg-white">
        <WaveDivider color="blue" variant={1} />
      </div>

      {/* Section 2: Split Content - White Background */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FIX 2: Use align-items-start to align photo with text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">
            
            {/* Mobile: Image first */}
            <div className="lg:hidden">
              <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img 
                  src="/images/adaptacne1.JPG"
                  alt="Adaptačný kurz"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Section 2A: Text Content */}
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-bombovo-dark">
                O čom je náš adaptačný kurz?
              </h2>
              
              <div className="space-y-4 text-base text-bombovo-dark leading-relaxed">
                <p>
                  Naše Adaptačné kurzy sú navrhnuté tak, aby žiakom pomohli plynule sa začleniť do nového kolektívu a zabezpečili, že ich začiatok bude úspešný a plný pozitívnych zážitkov. Hlavným cieľom kurzu je, umožniť žiakom, aby sa lepšie adaptovali v novom prostredí, spoznali svojich spolužiakov a vybudovali si dobré vzťahy medzi sebou a triednym učiteľom.
                </p>

                <div className="space-y-3 pt-2">
                  <p><strong>Lepšia Adaptácia:</strong> Pomôžeme žiakom znížiť stres a neistotu spojenú so začiatkom štúdia.</p>
                  <p><strong>Silnejšia Komunita:</strong> Pomôžeme im vytvoriť v triede sieť priateľov a podporovateľov.</p>
                  <p><strong>Osobný Rozvoj:</strong> Zlepšíme ich sebavedomie a pripravíme ich na akademické výzvy. Zlepšíme ich komunikačné schopnosti v kolektíve.</p>
                  <p><strong>Prírodná Terapia:</strong> Uvoľnite sa a načerpáte energiu v krásnom horskom prostredí.</p>
                  <p><strong>Večery pri Ohnisku:</strong> Užijeme si spoločenské aktivity, zdieľanie príbehov a budovanie komunity pri táboráku.</p>
                </div>
              </div>

              <div className="pt-2">
                {/* BONUS FIX: Scroll to form section with offset to show headline */}
                <button 
                  onClick={() => {
                    const element = document.getElementById('prihlaska-form')
                    if (element) {
                      const yOffset = -100 // Offset to show headline
                      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                      window.scrollTo({ top: y, behavior: 'smooth' })
                    }
                  }}
                  className="px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200"
                >
                  Prihlás svoju triedu
                </button>
              </div>
            </div>

            {/* Section 2B: Image - Desktop only - Extended vertically */}
            <div className="hidden lg:block">
              <div className="w-full h-full min-h-[600px] rounded-2xl overflow-hidden">
                <img 
                  src="/images/adaptacne1.JPG"
                  alt="Adaptačný kurz"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIX 3: Blue Color Break Line Between Section 2 and 3 */}
      <div className="bg-white">
        <WaveDivider color="blue" variant={2} />
      </div>

      {/* Section 3: Split Content - Grey Background */}
      <section className="py-12 md:py-16 bg-bombovo-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Mobile: Image first */}
            <div className="lg:hidden">
              <div className="w-full rounded-2xl overflow-hidden h-[500px]">
                <img 
                  src="/images/adaptacne2.JPG"
                  alt="Program adaptačného kurzu"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Section 3A: Image - Desktop only */}
            <div className="hidden lg:flex items-stretch">
              <div className="w-full rounded-2xl overflow-hidden">
                <img 
                  src="/images/adaptacne2.JPG"
                  alt="Program adaptačného kurzu"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Section 3B: Program Content */}
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-bombovo-dark">
                Program Adaptačného Kurzu
              </h2>
              
              <div className="space-y-6">
                {/* Block 1 */}
                <div>
                  <h3 className="text-lg font-bold text-bombovo-dark mb-2">1. Blok: Zoznamovanie</h3>
                  <p className="text-base text-bombovo-dark leading-relaxed">
                    Prvá časť adaptačného kurzu poskytuje deťom bezpečné prostredie na zoznámenie sa a budovanie prvých krokov k silnému kolektívu. V tomto bloku sa zameriavame hlavne na teambuildingové aktivity, ktoré v deťoch budujú zdravé sebavedomie a prirodzene podporujú socializáciu.
                  </p>
                </div>

                {/* Block 2 */}
                <div>
                  <h3 className="text-lg font-bold text-bombovo-dark mb-2">2. Blok: Sebareflexia</h3>
                  <p className="text-base text-bombovo-dark leading-relaxed">
                    V druhej časti kurzu sa deti naučia vnímať samy seba, pomenovať, čo prežívajú bez strachu z hodnotenia a porovnávania. Sebareflexia prebieha nenápadnou hravou formou spojenou so zážitkami. Deti si začnú prirodzene uvedomovať, že každý je iný a rozdielnosti sú prirodzenou súčasťou každého kolektívu.
                  </p>
                </div>

                {/* Block 3 */}
                <div>
                  <h3 className="text-lg font-bold text-bombovo-dark mb-2">3. Blok: Komunikácia a tímová spolupráca</h3>
                  <p className="text-base text-bombovo-dark leading-relaxed">
                    Záver kurzu učí triedu fungovať ako jeden tím. Deti sa pomocou rôznych aktivít učia navzájom komunikovať, rešpektovať rozdielne názory a hľadať spoločné riešenia. Dôraz sa kladie hlavne na spoluprácu a aktivity sú postavené tak, aby si každý v tíme našiel svoje miesto. Žiaci si postupne uvedomia že trieda musí fungovať ako celok a to pomôže nastaviť zdravé fungovanie kolektívu aj po návrate do školy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Details - Grey Background (no divider) */}
      <section className="pt-2 pb-12 md:pt-4 md:pb-16 bg-bombovo-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${openAccordion ? 'border-4 border-bombovo-yellow rounded-3xl' : ''}`}>
            <div
              className={`bg-bombovo-yellow py-6 px-8 cursor-pointer flex items-center justify-between ${openAccordion ? 'rounded-t-3xl' : 'rounded-3xl'}`}
              onClick={() => setOpenAccordion(!openAccordion)}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark">Info o kurze</h2>
              <FaChevronDown className={`text-bombovo-dark text-2xl md:text-3xl transition-transform ${openAccordion ? '' : 'rotate-[-90deg]'}`} />
            </div>

            {openAccordion && (
              <div className="bg-white p-8 md:p-12 rounded-b-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Duration */}
                  <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                    <h3 className="text-xl font-bold text-bombovo-dark mb-4">DĹŽKA KURZU:</h3>
                    <p className="text-base text-bombovo-dark leading-relaxed">
                      Minimálna dĺžka kurzu je 3 dni/2 noci. Kurz vieme pripraviť až do dĺžky 5 dní. Kurz je najlepšie absolvovať, ako trieda samostatne.
                    </p>
                  </div>

                  {/* Price Includes */}
                  <div className="border-4 border-bombovo-blue rounded-2xl bg-bombovo-gray p-6">
                    <h3 className="text-xl font-bold text-bombovo-dark mb-4">ZÁKLADNÁ CENA ZAHŔŇA:</h3>
                    <div className="space-y-2 text-base text-bombovo-dark leading-relaxed">
                      <p>• Ubytovanie</p>
                      <p>• Stravovanie a pitný režim (3x denne)</p>
                      <p>• Štruktúrovaný vzdelávací program s animátormi</p>
                      <p>• Na 10 detí 1 dospelý má pobyt zdarma</p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blue Divider: Grey → White */}
      <div className="bg-bombovo-gray">
        <WaveDivider color="blue" variant={1} />
      </div>

      {/* Section 5: Form - White Background */}
      <section id="prihlaska-form" className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark text-center mb-8 md:mb-12">
            Vyplňte Prihlášku A Vypracujeme Vám Ponuku Na Mieru
          </h2>

          <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-bombovo-gray">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Meno a priezvisko pedagóga *
                </label>
                <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Adresa, PSČ, mesto školy *
                </label>
                <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Telefón na pedagóga *
                </label>
                <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Email na pedagóga *
                </label>
                <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                  />
                </div>
              </div>

              {/* Number of People */}
              <div>
                <label htmlFor="people" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Počet osôb
                </label>
                <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                  <input
                    type="text"
                    id="people"
                    name="people"
                    value={formData.people}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Poznámka
                </label>
                <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                  <textarea
                    id="note"
                    name="note"
                    rows={4}
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none resize-none"
                  />
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-4 bg-bombovo-red/10 border-2 border-bombovo-red rounded-xl">
                  <p className="text-sm font-medium text-bombovo-red text-center">{formError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200"
              >
                Odoslať
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-white">
        <Footer />
      </div>
    </main>
  )
}



