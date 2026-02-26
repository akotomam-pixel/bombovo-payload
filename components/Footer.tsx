'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa'
import FooterNewsletter from './FooterNewsletter'

interface FooterDoc {
  name: string
  file?: { url?: string } | null
  url?: string | null
}

function docHref(doc: FooterDoc): string {
  if (doc.file && typeof doc.file === 'object' && doc.file.url) return doc.file.url
  if (doc.url) return doc.url
  return '#'
}

const FALLBACK_S1: FooterDoc[] = [
  { name: 'Všeobecné poistné podmienky pre prípad úpadku CK', url: '/documents/Vseobecne-poistne-podmienky-pre-pripad-upadku-CK.pdf' },
  { name: 'Všeobecné a záručné podmienky', url: '/documents/Vseobecne-a-zarucne-podmienky.pdf' },
  { name: 'Ochrana osobných údajov', url: '/documents/ochrana-osobnych-udajov.pdf' },
  { name: 'Certifikát pre prípad úpadku CK', url: '/documents/Certifikat-pre-pripad-upadku-CK.pdf' },
  { name: 'Čestné prehlásenie BOUNCE PARK', url: '/documents/cestne-prehlásenie-BOUNCE-PARK.pdf' },
  { name: 'Vyhlásenie rodiča o zdravotnej spôsobilosti dieťaťa', url: '/documents/vyhlasenie-rodica-o-zdravotnej-sposobilosti dietata.pdf' },
  { name: 'Pokyny k táborom Leto 2026', url: '/documents/Pokyny-k-taborom-Leto-2026.pdf' },
  { name: 'Splnomocnenie o odovzdaní/prebratí dieťaťa', url: '/documents/splnomocnenie.pdf' },
  { name: 'Dôležité informácie o ŠvP', url: '/documents/Dolezite-Informacie-o-SVP2026.pdf' },
  { name: 'Prehlásenie o zdravotnom stave', url: '/documents/Prehlasenie-o-zdravotnom-stave.pdf' },
  { name: 'Menný zoznam účastníkov ŠvP', url: '/documents/menny-zoznam-ucastnikov-svp-2026-excel.pdf' },
  { name: 'Darčekový poukaz', url: '/documents/darcekovy-poukaz.pdf' },
]

const FALLBACK_S2: FooterDoc[] = [
  { name: 'Všeobecné poistné podmienky', url: '/documents/Vseobecne-poistne-podmienky2.pdf' },
  { name: 'Informácie o spracúvaní údajov', url: '/documents/Informacie-o-spracuvani-osobnych-udajov-GDPR.pdf' },
  { name: 'Informačný dokument o poistnom produkte', url: '/documents/Informacny-dokument-o-poistnom-produkte.pdf' },
  { name: 'Informačný dokument o poistnom produkte-tábory', url: '/documents/Informacny-dokument-o-poistnom-produkte-tabory.pdf' },
]

export default function Footer() {
  const [section1Title, setSection1Title] = useState('Dokumenty na stiahnutie')
  const [section1Docs, setSection1Docs] = useState<FooterDoc[]>(FALLBACK_S1)
  const [section2Title, setSection2Title] = useState('Poistenie účastníkov zájazdov')
  const [section2Docs, setSection2Docs] = useState<FooterDoc[]>(FALLBACK_S2)

  useEffect(() => {
    fetch('/api/globals/footer?depth=1')
      .then((r) => r.json())
      .then((data) => {
        if (data?.section1Title) setSection1Title(data.section1Title)
        if (Array.isArray(data?.section1Docs) && data.section1Docs.length > 0) setSection1Docs(data.section1Docs)
        if (data?.section2Title) setSection2Title(data.section2Title)
        if (Array.isArray(data?.section2Docs) && data.section2Docs.length > 0) setSection2Docs(data.section2Docs)
      })
      .catch(() => { /* keep fallback */ })
  }, [])

  const linkClass = 'text-white hover:opacity-80 hover:underline transition-all duration-200 text-sm md:text-base'

  return (
    <footer className="bg-bombovo-dark text-white">
      {/* SECTION A: Four Vertical Columns */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">

          {/* COLUMN 1: CK Bombovo + Social Media + Page Links */}
          <div className="lg:w-[15%] space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">CK Bombovo</h3>

            <div className="flex gap-4 mb-8">
              <Link href="/socialne-siete" className="w-12 h-12 rounded-full bg-bombovo-blue flex items-center justify-center hover:bg-opacity-80 transition-all duration-300" aria-label="Facebook">
                <FaFacebook size={24} />
              </Link>
              <Link href="/socialne-siete" className="w-12 h-12 rounded-full bg-bombovo-blue flex items-center justify-center hover:bg-opacity-80 transition-all duration-300" aria-label="Instagram">
                <FaInstagram size={24} />
              </Link>
            </div>

            <ul className="space-y-3">
              {[
                ['/letne-tabory', 'Letné tábory'],
                ['/skoly-v-prirode', 'Školy v prírode'],
                ['/skolske-vylety', 'Školské výlety'],
                ['/adaptacne-kurzy', 'Adaptačné kurzy'],
                ['/nasa-misia', 'Naša misia'],
                ['/faq', 'Otázky'],
                ['/prihlaska-animator', 'Pridaj sa do tímu'],
                ['/kontakt', 'Kontaktujte nás'],
                ['/pre-firmy', 'Pre Firmy'],
                ['/sutaz', 'Súťaž'],
                ['/test-tabor', 'Test Page'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 2: Dokumenty na stiahnutie — dynamic from Payload */}
          <div className="lg:w-[35%]">
            <h3 className="text-xl font-bold text-white mb-6">{section1Title}</h3>
            <ul className="space-y-3">
              {section1Docs.map((doc, i) => (
                <li key={i}>
                  <a href={docHref(doc)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Poistenie — dynamic from Payload */}
          <div className="lg:w-[25%]">
            <h3 className="text-xl font-bold text-white mb-6">{section2Title}</h3>
            <ul className="space-y-3">
              {section2Docs.map((doc, i) => (
                <li key={i}>
                  <a href={docHref(doc)} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Kontakt */}
          <div className="lg:w-[20%]">
            <h3 className="text-xl font-bold text-white mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FaPhone className="text-bombovo-yellow flex-shrink-0" size={20} />
                <a href="tel:+421915774213" className="text-white hover:opacity-80 transition-all text-sm md:text-base">+421 915 774 213</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-bombovo-yellow flex-shrink-0" size={20} />
                <a href="mailto:bombovo@bombovo.sk" className="text-white hover:opacity-80 transition-all text-sm md:text-base">bombovo@bombovo.sk</a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white font-semibold mb-2 text-sm md:text-base">Pondelok – Piatok:</p>
              <p className="text-white text-sm md:text-base">09:00 – 12:00 a 13:00 – 15:00</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION B: Newsletter Signup — client component for form state */}
      <FooterNewsletter />

      {/* SECTION C: Partner Logos */}
      <div className="bg-bombovo-dark border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Ďakujeme našim partnerom</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-white overflow-hidden">
                <img src="/images/partner1.png" alt="Partner 1" className="w-full h-full object-cover" />
              </div>
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
          <p className="text-gray-400 text-xs md:text-sm text-center">© 2026 Bombovo. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  )
}



