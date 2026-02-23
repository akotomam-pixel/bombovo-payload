'use client'

import { useState } from 'react'
import Image from 'next/image'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'

export default function PreFirmyPage() {
  const [formData, setFormData] = useState({
    nazovFirmy: '',
    pocetZamestnancov: '',
    sposobFinancovania: '',
    castTabora: '',
    poziadavka: '',
    poznamky: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Ďakujeme za vašu prihlášku! Náš tím sa vám ozve v priebehu niekoľkých dní.')
  }

  const showCastTaboraField = formData.sposobFinancovania === 'cast-tabora'
  const showPoziadavkaField = formData.sposobFinancovania === 'poziadavka'

  return (
    <main className="min-h-screen bg-white">
      {/* Section 0: Top Bar & Header */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      <Header />

      {/* Section 1: Hero Split 50/50 */}
      <div className="bg-white">
        <section className="py-16 md:py-20">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Section 1/A: Left - Text Content */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark">
                  <span className="relative inline-block">
                    <span className="text-bombovo-red">Letné Tábory Pre Firmy.</span>
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

                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Letné tábory pre firmy sú najobľúbenejší benefit prosperujúcich firiem na Slovensku. Znižujú fluktuáciu zamestnancov, zvyšujú lojalitu rodičov vo vašom tíme a robia z vašej firmy obľúbeného zamestnávateľa.
                </p>

                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Dávame vašej firme príležitosť využiť prostriedky zo sociálneho fondu na benefit, ktorý zamestnanci skutočne oceňujú.
                </p>

                <div className="pt-4">
                  <a href="#prihlaska">
                    <button className="px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200">
                      Získať Ponuku
                    </button>
                  </a>
                </div>
              </div>

              {/* Section 1/B: Right - Image */}
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
        </section>
        
        {/* Divider: White → Grey */}
        <WaveDivider color="blue" variant={1} />
      </div>

      {/* Section 2: Company Logos */}
      <div className="bg-bombovo-gray">
        <section className="py-16 md:py-20">
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark text-center mb-12 px-4">
              Dôverujú nám najznámejšie firmy na Slovensku
            </h2>

          <div className="w-full px-8 lg:px-16">
            <div className="flex items-center justify-between gap-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div 
                  key={num}
                  className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={`/images/logo${num}.png`}
                    alt={`Company Logo ${num}`}
                    width={128}
                    height={128}
                    className={`object-contain ${num === 1 ? 'scale-110 p-0' : 'p-2'}`}
                  />
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>
        
        {/* Divider: Grey → White */}
        <WaveDivider color="blue" variant={2} />
      </div>

      {/* Section 3: Benefits Blocks */}
      <div className="bg-white">
        <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Block 1: Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center">
              <div 
                className="w-full rounded-2xl bg-[#90EE90] flex items-center justify-center shadow-lg"
                style={{ aspectRatio: '4 / 3' }}
              >
                <p className="text-lg font-bold text-bombovo-dark">[PICTURE]</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">
                Váš Dôveryhodný Partner Pre Firemné Benefity
              </h3>
              <div className="space-y-4">
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Sme cestovná kancelária Bombovo ktorá sa špecializuje na tábory, školy v prírode a akcie pre deti už viac ako 20 rokov. Spolupracujeme s najväčšími firmami na Slovensku, aby sme im poskytli benefit, ktorý skutočne funguje.
                </p>
                <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                  Každý rok organizujeme letné tábory pre prosperujúce spoločnosti, ktoré chcú posilniť lojalitu svojich zamestnancov a riešiť najväčší letný stres pracujúcich rodičov. Naša skúsenosť, profesionálny tím a overené výsledky robia z nás partnera, ktorému môžete dôverovať.
                </p>
              </div>
            </div>
          </div>

          {/* Block 2: Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 lg:order-first">
              <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">
                Čo Získate, Keď Sa K Nám Pripojíte?
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    <strong>Unikátny benefit, ktorý si vaši zamestnanci zapamätajú</strong> – Zatiaľ čo väčšina firiem ponúka štandardné stravné lístky, vy ponúknete niečo, čo konkurencia nemá. Keď rodič vidí, že firma myslí na jeho rodinu, neodchádza ku konkurencii len kvôli pár stovkám eur navyše.
                  </p>
                </div>

                <div>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    <strong>Produktívni zamestnanci namiesto vyčerpaných rodičov</strong> – Leto je pre pracujúcich rodičov najstresujúcejšie obdobie, keď riešia "kam s deťmi?". Keď im dáte riešenie, máte zamestnancov, ktorí sa môžu naplno sústrediť na prácu.
                  </p>
                </div>

                <div>
                  <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                    <strong>Konkurenčná výhoda v boji o talenty</strong> – Najlepší kandidáti si dnes vyberajú zamestnávateľa a rodičia sa pýtajú: "Ako táto firma podporuje rodiny?". Zatiaľ čo konkurencia ponúka benefity pre zamestnanca, vy ponúkate benefity pre celú rodinu.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:order-last order-first">
              <div 
                className="w-full rounded-2xl bg-[#90EE90] flex items-center justify-center shadow-lg"
                style={{ aspectRatio: '4 / 3' }}
              >
                <p className="text-lg font-bold text-bombovo-dark">[PICTURE]</p>
              </div>
            </div>
          </div>

          {/* Block 3: Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/prefirmysc3.3.png"
                  alt="Najlepšie Firmy"
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '4 / 3' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-bombovo-dark">
                Najlepšie Firmy Na Slovensku Už S Nami Spolupracujú Viac Ako 20 Rokov
              </h3>
              <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                Zabezpečili sme letné tábory pre viac ako 2,000 detí zamestnancov najväčších spoločností:
              </p>
              <ul className="space-y-2 text-base md:text-lg text-bombovo-dark leading-relaxed">
                <li>• BILLA s.r.o. s nami spolupracuje posledné 2 roky</li>
                <li>• Profix Group s nami spolupracuje [X rokov]</li>
                <li>• Spoločnosť O2 s nami spolupracuje už [X rokov]</li>
                <li>• Robili sme tábory pre firmy ako Volvo a Foxconn</li>
              </ul>
            </div>
          </div>

        </div>
        </section>
        
        {/* Divider: White → Grey */}
        <WaveDivider color="blue" variant={1} />
      </div>

      {/* Section 4: 3 Steps Process */}
      <div className="bg-bombovo-gray">
        <section className="py-16 md:py-20">
        <div className="w-full px-8 lg:px-16">
          <h2 className="text-3xl md:text-4xl font-bold text-bombovo-dark text-center mb-16">
            3 Jednoduché Kroky Ako Využiť Sociálny Fond Na Letné Tábory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Step 1 */}
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-32 h-32 flex items-center justify-center">
                  <Image
                    src="/images/Iconfim1.png"
                    alt="Icon 1"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-bombovo-dark">
                KROK 1: Vyplňte Prihlášku
              </h3>
              <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                Keď máte záujem, jediné čo musíte urobiť je vyplniť prihlášku nižšie. Odpoviete na niekoľko jednoduchých otázok a náš tím vám pripraví špeciálnu ponuku na mieru pre vašu firmu.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-32 h-32 flex items-center justify-center">
                  <Image
                    src="/images/Iconfim2.png"
                    alt="Icon 2"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-bombovo-dark">
                KROK 2: Vyberte Si Financovanie
              </h3>
              <ul className="text-sm md:text-base text-bombovo-dark leading-relaxed space-y-1 text-left">
                <li>• Môžete zamestnancom preplatiť celý tábor alebo jeho časť</li>
                <li>• Môžete využiť služby Benefit Plus</li>
                <li>• Môžete využiť služby Doxx</li>
                <li>• Môžete využiť Gusto kartu</li>
                <li>• Poskytneme vám špeciálny zľavový kód pre vašich zamestnancov</li>
                <li>• Iné financovanie podľa vašich požiadaviek</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-32 h-32 flex items-center justify-center">
                  <Image
                    src="/images/Iconfim3.png"
                    alt="Icon 3"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-bombovo-dark">
                KROK 3: Jednoducho Sa Uvoľnite
              </h3>
              <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
                Pre vašu administratívu je to jednoduché. Žiadne papierovačky, žiadne starosti. My sa o všetko postaráme a vy budete mať len jednu účtenku, ktorú budete musieť spracovať. Zamestnanci budú šťastní a vy zostanete bez práce navyše.
              </p>
            </div>

          </div>
        </div>
        </section>
        
        {/* Divider: Grey → White */}
        <WaveDivider color="blue" variant={2} />
      </div>

      {/* Section 5: Contact Form */}
      <div className="bg-white">
        <section id="prihlaska" className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark text-center mb-8 md:mb-12">
            Vyplňte Prihlášku A Náš Tým Sa Vám Ozve V Priebehu Niekoľkých Dní
          </h2>

          <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-bombovo-gray">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Názov Firmy & Počet Zamestnancov */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nazovFirmy" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Názov Firmy *
                  </label>
                  <input
                    type="text"
                    id="nazovFirmy"
                    name="nazovFirmy"
                    value={formData.nazovFirmy}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-blue rounded-xl outline-none focus:border-bombovo-red transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="pocetZamestnancov" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Počet Zamestnancov *
                  </label>
                  <input
                    type="text"
                    id="pocetZamestnancov"
                    name="pocetZamestnancov"
                    value={formData.pocetZamestnancov}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-blue rounded-xl outline-none focus:border-bombovo-red transition-colors"
                  />
                </div>
              </div>

              {/* Spôsob Financovania */}
              <div>
                <label htmlFor="sposobFinancovania" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Spôsob Financovania *
                </label>
                <select
                  id="sposobFinancovania"
                  name="sposobFinancovania"
                  value={formData.sposobFinancovania}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-blue rounded-xl outline-none focus:border-bombovo-red transition-colors"
                >
                  <option value="">Vyberte spôsob financovania</option>
                  <option value="cely-tabor">Zaplatiť celý tábor</option>
                  <option value="cast-tabora">Zaplatiť časť tábora</option>
                  <option value="benefit-plus">Využiť služby Benefit Plus</option>
                  <option value="doxx">Využiť služby Doxx</option>
                  <option value="gusto-karta">Využiť Gusto kartu</option>
                  <option value="zlavovy-kod">Chcem špeciálny zľavový kód pre mojich zamestnancov</option>
                  <option value="poziadavka">Mám požiadavku pre svoje financovanie</option>
                </select>
              </div>

              {/* Conditional: Aká veľká časť tábora */}
              {showCastTaboraField && (
                <div>
                  <label htmlFor="castTabora" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Akú veľkú časť tábora chcete zaplatiť? *
                  </label>
                  <input
                    type="text"
                    id="castTabora"
                    name="castTabora"
                    value={formData.castTabora}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-blue rounded-xl outline-none focus:border-bombovo-red transition-colors"
                    placeholder="Napr. 50%, 100€, atď."
                  />
                </div>
              )}

              {/* Conditional: Napíšte svoju požiadavku */}
              {showPoziadavkaField && (
                <div>
                  <label htmlFor="poziadavka" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Napíšte svoju požiadavku *
                  </label>
                  <textarea
                    id="poziadavka"
                    name="poziadavka"
                    rows={4}
                    value={formData.poziadavka}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-blue rounded-xl outline-none focus:border-bombovo-red transition-colors resize-none"
                    placeholder="Popíšte Vašu požiadavku na financovanie..."
                  />
                </div>
              )}

              {/* Poznámky/Otázky (Optional) */}
              <div>
                <label htmlFor="poznamky" className="block text-sm font-medium text-bombovo-dark mb-2">
                  Poznámky/Otázky
                </label>
                <textarea
                  id="poznamky"
                  name="poznamky"
                  rows={4}
                  value={formData.poznamky}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-blue rounded-xl outline-none focus:border-bombovo-red transition-colors resize-none"
                  placeholder="Máte nejaké otázky alebo poznámky?"
                />
              </div>

              {/* Info Text Before Submit */}
              <p className="text-sm md:text-base text-bombovo-dark text-center italic">
                Toto nie je záväzná prihláška. Náš tým sa vám ozve v priebehu niekoľkých dní.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200"
              >
                ODOSLAŤ PRIHLÁŠKU
              </button>
            </form>
          </div>
        </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
