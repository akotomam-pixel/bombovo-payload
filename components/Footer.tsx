'use client'

import Link from 'next/link'
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert('Prosím, súhlaste so spracovaním osobných údajov.')
      return
    }
    // Newsletter submission logic will be added later
    console.log('Newsletter signup:', email)
    alert('Ďakujeme za prihlásenie!')
    setEmail('')
    setAgreedToTerms(false)
  }

  return (
    <footer className="bg-bombovo-dark text-white">
      {/* SECTION A: Four Vertical Columns */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
          
          {/* COLUMN 1: CK Bombovo + Social Media + Page Links */}
          <div className="lg:w-[15%] space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">CK Bombovo</h3>
            
            {/* Social Media Icons */}
            <div className="flex gap-4 mb-8">
              <Link 
                href="/socialne-siete" 
                className="w-12 h-12 rounded-full bg-bombovo-blue flex items-center justify-center hover:bg-opacity-80 transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </Link>
              <Link 
                href="/socialne-siete" 
                className="w-12 h-12 rounded-full bg-bombovo-blue flex items-center justify-center hover:bg-opacity-80 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </Link>
            </div>

            {/* Page Links */}
            <ul className="space-y-3">
              <li>
                <Link href="/letne-tabory" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Letné tábory
                </Link>
              </li>
              <li>
                <Link href="/skoly-v-prirode" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Školy v prírode
                </Link>
              </li>
              <li>
                <Link href="/skolske-vylety" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Školské výlety
                </Link>
              </li>
              <li>
                <Link href="/adaptacne-kurzy" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Adaptačné kurzy
                </Link>
              </li>
              <li>
                <Link href="/nasa-misia" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Naša misia
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Otázky
                </Link>
              </li>
              <li>
                <Link href="/prihlaska-animator" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Pridaj sa do tímu
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Kontaktujte nás
                </Link>
              </li>
              <li>
                <Link href="/pre-firmy" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Pre Firmy
                </Link>
              </li>
              <li>
                <Link href="/test-tabor" className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base">
                  Test Page
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: Dokumenty na stiahnutie */}
          <div className="lg:w-[35%]">
            <h3 className="text-xl font-bold text-white mb-6">Dokumenty na stiahnutie</h3>
            
            <ul className="space-y-3">
              <li>
                <a 
                  href="/documents/Vseobecne-poistne-podmienky-pre-pripad-upadku-CK.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Všeobecné poistné podmienky pre prípad úpadku CK
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Vseobecne-a-zarucne-podmienky.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Všeobecné a záručné podmienky
                </a>
              </li>
              <li>
                <a 
                  href="/documents/ochrana-osobnych-udajov.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Ochrana osobných údajov
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Certifikat-pre-pripad-upadku-CK.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Certifikát pre prípad úpadku CK
                </a>
              </li>
              <li>
                <a 
                  href="/documents/cestne-prehlásenie-BOUNCE-PARK.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Čestné prehlásenie BOUNCE PARK
                </a>
              </li>
              <li>
                <a 
                  href="/documents/vyhlasenie-rodica-o-zdravotnej-sposobilosti dietata.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Vyhlásenie rodiča o zdravotnej spôsobilosti dieťaťa
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Pokyny-k-taborom-Leto-2026.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Pokyny k táborom Leto 2026
                </a>
              </li>
              <li>
                <a 
                  href="/documents/splnomocnenie.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Splnomocnenie o odovzdaní/prebratí dieťaťa
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Dolezite-Informacie-o-SVP2026.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Dôležité informácie o ŠvP
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Prehlasenie-o-zdravotnom-stave.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Prehlásenie o zdravotnom stave
                </a>
              </li>
              <li>
                <a 
                  href="/documents/menny-zoznam-ucastnikov-svp-2026-excel.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Menný zoznam účastníkov ŠvP
                </a>
              </li>
              <li>
                <a 
                  href="/documents/darcekovy-poukaz.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Darčekový poukaz
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Poistenie účastníkov zájazdov */}
          <div className="lg:w-[25%]">
            <h3 className="text-xl font-bold text-white mb-6">Poistenie účastníkov zájazdov</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/documents/Vseobecne-poistne-podmienky2.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Všeobecné poistné podmienky
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Informacie-o-spracuvani-osobnych-udajov-GDPR.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Informácie o spracúvaní údajov
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Informacny-dokument-o-poistnom-produkte.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Informačný dokument o poistnom produkte
                </a>
              </li>
              <li>
                <a 
                  href="/documents/Informacny-dokument-o-poistnom-produkte-tabory.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base"
                >
                  Informačný dokument o poistnom produkte-tábory
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Kontakt */}
          <div className="lg:w-[20%]">
            <h3 className="text-xl font-bold text-white mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FaPhone className="text-bombovo-yellow flex-shrink-0" size={20} />
                <a href="tel:+421915774213" className="text-white hover:opacity-80 transition-all text-sm md:text-base">
                  +421 915 774 213
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-bombovo-yellow flex-shrink-0" size={20} />
                <a href="mailto:bombovo@bombovo.sk" className="text-white hover:opacity-80 transition-all text-sm md:text-base">
                  bombovo@bombovo.sk
                </a>
              </li>
            </ul>
            
            {/* Office Hours */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white font-semibold mb-2 text-sm md:text-base">
                Pondelok – Piatok:
              </p>
              <p className="text-white text-sm md:text-base">
                09:00 – 12:00 a 13:00 – 15:00
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION B: Newsletter Signup */}
      <div className="bg-bombovo-dark border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Prihláste sa na náš newsletter. A zistajte špeciálne ceny!
          </h2>
          
          <form onSubmit={handleNewsletterSubmit} className="space-y-4 max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Zadajte váš e-mail"
                required
                className="flex-1 px-6 py-3 rounded-full bg-white text-bombovo-dark text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-bombovo-yellow"
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-gray-200 hover:bg-bombovo-yellow text-bombovo-dark font-medium transition-all duration-300 text-sm md:text-base"
              >
                Potvrdiť
              </button>
            </div>
            
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="newsletter-terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 flex-shrink-0 cursor-pointer"
                required
              />
              <label htmlFor="newsletter-terms" className="text-white text-xs md:text-sm">
                Súhlasím so{' '}
                <Link href="/gdpr" className="underline hover:opacity-80">
                  spracovaním osobných údajov
                </Link>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION C: Partner Logos */}
      <div className="bg-bombovo-dark border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Ďakujeme našim partnerom
            </h2>
            
            <div className="flex items-center gap-6">
              {/* Partner Logo 1 */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-white overflow-hidden">
                <img src="/images/partner1.png" alt="Partner 1" className="w-full h-full object-cover" />
              </div>
              
              {/* Partner Logo 2 */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-white overflow-hidden">
                <img src="/images/partner2.png" alt="Partner 2" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-bombovo-dark border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-6">
          <p className="text-gray-400 text-xs md:text-sm text-center">
            © 2026 Bombovo. Všetky práva vyhradené.
          </p>
        </div>
      </div>
    </footer>
  )
}



