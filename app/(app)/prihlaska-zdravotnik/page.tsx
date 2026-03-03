'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'

export default function PrihlaskaZdravotnikPage() {
  const [formData, setFormData] = useState({
    titul: '',
    meno: '',
    priezvisko: '',
    denNarodenia: '',
    mesiacNarodenia: '',
    rokNarodenia: '',
    adresa: '',
    telefon: '',
    email: '',
    vzdelanie: '',
    prax: '',
    strava: '',
    termin: ''
  })

  const [errors, setErrors] = useState({
    meno: '',
    priezvisko: '',
    denNarodenia: '',
    mesiacNarodenia: '',
    rokNarodenia: '',
    adresa: '',
    telefon: '',
    email: '',
    vzdelanie: '',
    prax: '',
    strava: '',
    termin: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^(\+421|00421|0)?[0-9]{9}$/
    return re.test(phone.replace(/\s/g, ''))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      meno: '',
      priezvisko: '',
      denNarodenia: '',
      mesiacNarodenia: '',
      rokNarodenia: '',
      adresa: '',
      telefon: '',
      email: '',
      vzdelanie: '',
      prax: '',
      strava: '',
      termin: ''
    }

    let isValid = true

    if (!formData.meno.trim()) {
      newErrors.meno = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.priezvisko.trim()) {
      newErrors.priezvisko = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.denNarodenia.trim()) {
      newErrors.denNarodenia = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.mesiacNarodenia.trim()) {
      newErrors.mesiacNarodenia = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.rokNarodenia.trim()) {
      newErrors.rokNarodenia = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.adresa.trim()) {
      newErrors.adresa = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Toto pole je povinné'
      isValid = false
    } else if (!validatePhone(formData.telefon)) {
      newErrors.telefon = 'Neplatné telefónne číslo'
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Toto pole je povinné'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Neplatný formát e-mailu'
      isValid = false
    }

    if (!formData.vzdelanie.trim()) {
      newErrors.vzdelanie = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.prax.trim()) {
      newErrors.prax = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.strava.trim()) {
      newErrors.strava = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.termin) {
      newErrors.termin = 'Toto pole je povinné'
      isValid = false
    }

    setErrors(newErrors)
    
    if (!isValid) {
      setSubmitError('Prosím vyplňte všetky povinné polia')
    } else {
      setSubmitError('')
    }
    
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      // TODO: Send to backend API
      console.log('Form data:', formData)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitSuccess(true)
      if (typeof window !== 'undefined') { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'job_application_submitted' }); }
      setFormData({
        titul: '',
        meno: '',
        priezvisko: '',
        denNarodenia: '',
        mesiacNarodenia: '',
        rokNarodenia: '',
        adresa: '',
        telefon: '',
        email: '',
        vzdelanie: '',
        prax: '',
        strava: '',
        termin: ''
      })
    } catch (error) {
      setSubmitError('Niečo sa pokazilo. Skúste to prosím znova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const terminyOptions = [
    '07.03.-08.03.2026 - Horský hotel Lomy, Horná Ves',
    '21.03.-22.03.2026 - Horský hotel Lomy, Horná Ves',
    '28.03.-29.03.2026 - Horský hotel Lomy, Horná Ves'
  ]

  return (
    <main className="min-h-screen">
      {/* Section 0: Top Bar */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      
      {/* Header */}
      <Header />
      
      {/* Section 1: Information - White Background */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-bombovo-dark mb-6">
            Prihláška zdravotníka
          </h1>
          
          {/* Button to scroll to form */}
          <div className="mb-8">
            <button
              onClick={() => document.getElementById('prihlaska')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200"
            >
              Prihlás sa
            </button>
          </div>
          
          <div className="space-y-8 text-lg text-bombovo-dark">
              {/* Ponúkame */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Ponúkame:</h2>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>zaujímavú spoluprácu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>mladý kolektív</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>priestor na sebarealizáciu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>veľa super zážitkov</span>
                  </li>
                </ul>
              </div>

              {/* Požadované vzdelanie */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Požadované vzdelanie:</h2>
                <p className="mb-2">podľa Vyhlášky MZ č.526/2007 Z.z. a Nariadenia vlády č. 296/2010 – Príloha 1</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>lekár</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>sestra</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>pôrodná asistentka</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>zdravotný záchranár</span>
                  </li>
                </ul>
              </div>

              {/* Dôležité predpoklady */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Dôležité predpoklady:</h2>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>pozitívny vzťah k deťom</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>dobrý zdravotný stav a kondícia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>zodpovednosť</span>
                  </li>
                </ul>
              </div>

              {/* Odmena */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Odmena pre zdravotníka:</h2>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>300 eur za 5 – dňovú školu v prírode alebo lyžiarsky výcvik</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>300 eur – 350 eur za 7 – dňový letný tábor</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-blue text-xl">•</span>
                    <span>ubytovanie a stravu hradíme my</span>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Available Terms Table - White Background */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Table */}
          <div className="hidden md:block border-4 border-bombovo-blue rounded-3xl overflow-hidden">
            <div className="bg-bombovo-yellow py-6 px-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center"><h3 className="text-xl font-black text-bombovo-dark">Termín</h3></div>
                <div className="text-center"><h3 className="text-xl font-black text-bombovo-dark">Miesto</h3></div>
              </div>
            </div>
            <div className="bg-white">
              {[
                { termin: '07.03.-08.03.2026', miesto: 'Horský hotel Lomy, Horná Ves' },
                { termin: '21.03.-22.03.2026', miesto: 'Horský hotel Lomy, Horná Ves' },
                { termin: '28.03.-29.03.2026', miesto: 'Horský hotel Lomy, Horná Ves' }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`grid grid-cols-2 gap-6 py-6 px-8 ${idx !== 2 ? 'border-b-2 border-gray-200' : ''}`}
                >
                  <div className="text-center">
                    <p className="text-lg font-semibold text-bombovo-dark">{item.termin}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-bombovo-dark">{item.miesto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {[
              { termin: '07.03.-08.03.2026', miesto: 'Horský hotel Lomy, Horná Ves' },
              { termin: '21.03.-22.03.2026', miesto: 'Horský hotel Lomy, Horná Ves' },
              { termin: '28.03.-29.03.2026', miesto: 'Horský hotel Lomy, Horná Ves' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-bombovo-blue">
                <div className="bg-bombovo-yellow p-4">
                  <p className="text-base font-semibold text-bombovo-dark">Termín: {item.termin}</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-sm text-bombovo-dark"><strong>Miesto:</strong> {item.miesto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider: White → Grey */}
      <div className="bg-white">
        <WaveDivider color="red" variant={2} />
      </div>

      {/* Section 3: Application Form - Grey Background */}
      <section id="prihlaska" className="py-12 md:py-16 bg-bombovo-gray scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-8">
            Vyplň prihlášku a my sa ti ozveme!
          </h2>
          
          <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-white shadow-lg">
            {submitSuccess ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-bombovo-dark mb-3">
                  Ďakujeme za prihlášku!
                </h3>
                <p className="text-lg text-bombovo-dark mb-6">
                  Náš tým na tom pracuje a do pár pracovných dní sa ti ozveme.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-8 py-3 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold rounded-full hover:translate-y-0.5 transition-all duration-200"
                >
                  Poslať ďalšiu prihlášku
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titul */}
                <div>
                  <label htmlFor="titul" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Titul
                  </label>
                  <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                    <input
                      type="text"
                      id="titul"
                      name="titul"
                      value={formData.titul}
                      onChange={handleInputChange}
                      placeholder="Váš titul"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                </div>

                {/* Meno */}
                <div>
                  <label htmlFor="meno" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Meno *
                  </label>
                  <div className={`border-2 ${errors.meno ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="meno"
                      name="meno"
                      value={formData.meno}
                      onChange={handleInputChange}
                      placeholder="Vaše meno"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.meno && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.meno}</p>
                  )}
                </div>

                {/* Priezvisko */}
                <div>
                  <label htmlFor="priezvisko" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Priezvisko *
                  </label>
                  <div className={`border-2 ${errors.priezvisko ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="priezvisko"
                      name="priezvisko"
                      value={formData.priezvisko}
                      onChange={handleInputChange}
                      placeholder="Vaše priezvisko"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.priezvisko && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.priezvisko}</p>
                  )}
                </div>

                {/* Dátum narodenia */}
                <div>
                  <label className="block text-sm font-medium text-bombovo-dark mb-2">
                    Dátum narodenia *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className={`border-2 ${errors.denNarodenia ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="text"
                          name="denNarodenia"
                          value={formData.denNarodenia}
                          onChange={handleInputChange}
                          placeholder="DD"
                          maxLength={2}
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none text-center"
                        />
                      </div>
                      {errors.denNarodenia && (
                        <p className="mt-1 text-xs text-bombovo-red">{errors.denNarodenia}</p>
                      )}
                    </div>
                    <div>
                      <div className={`border-2 ${errors.mesiacNarodenia ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="text"
                          name="mesiacNarodenia"
                          value={formData.mesiacNarodenia}
                          onChange={handleInputChange}
                          placeholder="MM"
                          maxLength={2}
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none text-center"
                        />
                      </div>
                      {errors.mesiacNarodenia && (
                        <p className="mt-1 text-xs text-bombovo-red">{errors.mesiacNarodenia}</p>
                      )}
                    </div>
                    <div>
                      <div className={`border-2 ${errors.rokNarodenia ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="text"
                          name="rokNarodenia"
                          value={formData.rokNarodenia}
                          onChange={handleInputChange}
                          placeholder="YYYY"
                          maxLength={4}
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none text-center"
                        />
                      </div>
                      {errors.rokNarodenia && (
                        <p className="mt-1 text-xs text-bombovo-red">{errors.rokNarodenia}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Adresa */}
                <div>
                  <label htmlFor="adresa" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Adresa, PSČ, Mesto *
                  </label>
                  <div className={`border-2 ${errors.adresa ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="adresa"
                      name="adresa"
                      value={formData.adresa}
                      onChange={handleInputChange}
                      placeholder="Vaša adresa"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.adresa && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.adresa}</p>
                  )}
                </div>

                {/* Telefón */}
                <div>
                  <label htmlFor="telefon" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Telefón *
                  </label>
                  <div className={`border-2 ${errors.telefon ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="tel"
                      id="telefon"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleInputChange}
                      placeholder="0900 123 456"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.telefon && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.telefon}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Email *
                  </label>
                  <div className={`border-2 ${errors.email ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="vas.email@example.com"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.email}</p>
                  )}
                </div>

                {/* Vzdelanie */}
                <div>
                  <label htmlFor="vzdelanie" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Ukončené zdravotné vzdelanie *
                  </label>
                  <div className={`border-2 ${errors.vzdelanie ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="vzdelanie"
                      name="vzdelanie"
                      value={formData.vzdelanie}
                      onChange={handleInputChange}
                      placeholder="Vaše vzdelanie"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.vzdelanie && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.vzdelanie}</p>
                  )}
                </div>

                {/* Prax */}
                <div>
                  <label htmlFor="prax" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Prax *
                  </label>
                  <div className={`border-2 ${errors.prax ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <textarea
                      id="prax"
                      name="prax"
                      rows={3}
                      value={formData.prax}
                      onChange={handleInputChange}
                      placeholder="Vaša prax"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none resize-none"
                    />
                  </div>
                  {errors.prax && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.prax}</p>
                  )}
                </div>

                {/* Strava */}
                <div>
                  <label htmlFor="strava" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Špeciálna strava alebo alergie *
                  </label>
                  <div className={`border-2 ${errors.strava ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <textarea
                      id="strava"
                      name="strava"
                      rows={3}
                      value={formData.strava}
                      onChange={handleInputChange}
                      placeholder="Špeciálna strava alebo alergie"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none resize-none"
                    />
                  </div>
                  {errors.strava && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.strava}</p>
                  )}
                </div>

                {/* Termíny školenia */}
                <div>
                  <label htmlFor="termin" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Termíny školenia *
                  </label>
                  <div className={`border-2 ${errors.termin ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <select
                      id="termin"
                      name="termin"
                      value={formData.termin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none cursor-pointer"
                    >
                      <option value="">Vyberte termín</option>
                      {terminyOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.termin && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.termin}</p>
                  )}
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="p-4 bg-bombovo-red/10 border-2 border-bombovo-red rounded-xl">
                    <p className="text-sm text-bombovo-red font-medium">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? 'Odosiela sa...' : 'Odoslať'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-bombovo-gray">
        <Footer />
      </div>
    </main>
  )
}
