'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'

export default function PrihlaskaAnimatorPage() {
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
    studium: '',
    animatorSkusenost: '',
    skusenostiDeti: '',
    vekPreferencia: [] as string[],
    konicky: '',
    programySkusenosti: [] as string[],
    opisSkusenosti: '',
    hlavnyDovod: '',
    strava: '',
    termin: '',
    consent1: false,
    consent2: false
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
    studium: '',
    animatorSkusenost: '',
    skusenostiDeti: '',
    vekPreferencia: '',
    konicky: '',
    programySkusenosti: '',
    opisSkusenosti: '',
    hlavnyDovod: '',
    termin: '',
    consent1: '',
    consent2: ''
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, arrayName: 'vekPreferencia' | 'programySkusenosti') => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [arrayName]: checked 
        ? [...prev[arrayName], value]
        : prev[arrayName].filter(item => item !== value)
    }))
    if (errors[arrayName]) {
      setErrors(prev => ({ ...prev, [arrayName]: '' }))
    }
  }

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>, consentName: 'consent1' | 'consent2') => {
    setFormData(prev => ({ ...prev, [consentName]: e.target.checked }))
    if (errors[consentName]) {
      setErrors(prev => ({ ...prev, [consentName]: '' }))
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
      studium: '',
      animatorSkusenost: '',
      skusenostiDeti: '',
      vekPreferencia: '',
      konicky: '',
      programySkusenosti: '',
      opisSkusenosti: '',
      hlavnyDovod: '',
      termin: '',
      consent1: '',
      consent2: ''
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
      newErrors.denNarodenia = 'Povinné'
      isValid = false
    }

    if (!formData.mesiacNarodenia.trim()) {
      newErrors.mesiacNarodenia = 'Povinné'
      isValid = false
    }

    if (!formData.rokNarodenia.trim()) {
      newErrors.rokNarodenia = 'Povinné'
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

    if (!formData.studium.trim()) {
      newErrors.studium = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.animatorSkusenost) {
      newErrors.animatorSkusenost = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.skusenostiDeti.trim()) {
      newErrors.skusenostiDeti = 'Toto pole je povinné'
      isValid = false
    }

    if (formData.vekPreferencia.length === 0) {
      newErrors.vekPreferencia = 'Vyber aspoň jednu možnosť'
      isValid = false
    }

    if (!formData.konicky.trim()) {
      newErrors.konicky = 'Toto pole je povinné'
      isValid = false
    }

    if (formData.programySkusenosti.length === 0) {
      newErrors.programySkusenosti = 'Vyber aspoň jednu možnosť'
      isValid = false
    }

    if (!formData.opisSkusenosti.trim()) {
      newErrors.opisSkusenosti = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.hlavnyDovod.trim()) {
      newErrors.hlavnyDovod = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.termin) {
      newErrors.termin = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.consent1) {
      newErrors.consent1 = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.consent2) {
      newErrors.consent2 = 'Toto pole je povinné'
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
        studium: '',
        animatorSkusenost: '',
        skusenostiDeti: '',
        vekPreferencia: [],
        konicky: '',
        programySkusenosti: [],
        opisSkusenosti: '',
        hlavnyDovod: '',
        strava: '',
        termin: '',
        consent1: false,
        consent2: false
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
            <span className="relative inline-block">
              Pridaj Sa Do{' '}
              <span className="font-handwritten text-bombovo-red text-5xl md:text-6xl lg:text-7xl">
                Bombovo Tímu!
              </span>
              {/* Yellow underline */}
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
          
          {/* Cena with red underline */}
          <div className="mb-8">
            <p className="text-2xl font-bold text-bombovo-dark relative inline-block">
              Cena: 30€
              <span className="absolute left-0 -bottom-1 w-full h-1 bg-bombovo-red"></span>
            </p>
          </div>
          
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
            {/* V cene */}
            <div>
              <h2 className="text-2xl font-bold mb-4">V cene:</h2>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>odborné školenie, certifikát pre úspešných</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>animačný manuál CK BOMBOVO</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>2 x ubytovanie, 2 x plná penzia</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>nezabudnuteľný zážitok</span>
                </li>
              </ul>
            </div>

            {/* Additional info */}
            <div className="space-y-4">
              <p>Školenie bude zamerané na základy animácie, kreatívnu tvorbu, komunikačné zručnosti, spôsoby samostatnej a tímovej práce, ale tiež na šport, tanec, tvorivé dielne a animačnú prax.</p>
              
              <p>Ak sa chceš stať animátorom a organizovať voľný čas, zábavu, zaujímavé podujatia pre deti a teenegerov, tak neváhaj a poď do tímu.</p>
              
              <p>Po úspešnom absolvovaní nášho školenia animátorov nominujeme na školy v prírode. V prípade kladného hodnotenia od pedagógov a bossa (šéf animátor) môže byť animátor nominovaný na letné tábory.</p>
            </div>

            {/* Dôležité predpoklady */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Dôležité predpoklady:</h2>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>vek 18 – 30 rokov</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>pohybové nadanie a športové zručnosti</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>umelecké sklony</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>extrovertná povaha</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>zmysel pre humor</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>cit pre dobrodružstvo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>pozitívny vzťah k deťom</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-xl">•</span>
                  <span>sympatické vystupovanie</span>
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
                  <div className="border-2 border-gray-300 rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                    <input
                      type="text"
                      id="titul"
                      name="titul"
                      value={formData.titul}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                    />
                  </div>
                </div>

                {/* Meno & Priezvisko */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="meno" className="block text-sm font-medium text-bombovo-dark mb-2">
                      Meno <span className="text-bombovo-red">*</span>
                    </label>
                    <div className={`border-2 ${errors.meno ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                      <input
                        type="text"
                        id="meno"
                        name="meno"
                        value={formData.meno}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                      />
                    </div>
                    {errors.meno && <p className="mt-1 text-sm text-bombovo-red">{errors.meno}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="priezvisko" className="block text-sm font-medium text-bombovo-dark mb-2">
                      Priezvisko <span className="text-bombovo-red">*</span>
                    </label>
                    <div className={`border-2 ${errors.priezvisko ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                      <input
                        type="text"
                        id="priezvisko"
                        name="priezvisko"
                        value={formData.priezvisko}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                      />
                    </div>
                    {errors.priezvisko && <p className="mt-1 text-sm text-bombovo-red">{errors.priezvisko}</p>}
                  </div>
                </div>

                {/* Dátum narodenia */}
                <div>
                  <label className="block text-sm font-medium text-bombovo-dark mb-2">
                    Dátum narodenia <span className="text-bombovo-red">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className={`border-2 ${errors.denNarodenia ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="text"
                          name="denNarodenia"
                          value={formData.denNarodenia}
                          onChange={handleInputChange}
                          placeholder="DD"
                          maxLength={2}
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none text-center"
                        />
                      </div>
                    </div>
                    <div>
                      <div className={`border-2 ${errors.mesiacNarodenia ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="text"
                          name="mesiacNarodenia"
                          value={formData.mesiacNarodenia}
                          onChange={handleInputChange}
                          placeholder="MM"
                          maxLength={2}
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none text-center"
                        />
                      </div>
                    </div>
                    <div>
                      <div className={`border-2 ${errors.rokNarodenia ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="text"
                          name="rokNarodenia"
                          value={formData.rokNarodenia}
                          onChange={handleInputChange}
                          placeholder="YYYY"
                          maxLength={4}
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                  {(errors.denNarodenia || errors.mesiacNarodenia || errors.rokNarodenia) && (
                    <p className="mt-1 text-sm text-bombovo-red">Všetky časti dátumu sú povinné</p>
                  )}
                </div>

                {/* Adresa */}
                <div>
                  <label htmlFor="adresa" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Adresa, PSČ, Mesto <span className="text-bombovo-red">*</span>
                  </label>
                  <div className={`border-2 ${errors.adresa ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="adresa"
                      name="adresa"
                      value={formData.adresa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                    />
                  </div>
                  {errors.adresa && <p className="mt-1 text-sm text-bombovo-red">{errors.adresa}</p>}
                </div>

                {/* Telefón & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="telefon" className="block text-sm font-medium text-bombovo-dark mb-2">
                      Telefón <span className="text-bombovo-red">*</span>
                    </label>
                    <div className={`border-2 ${errors.telefon ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                      <input
                        type="tel"
                        id="telefon"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                      />
                    </div>
                    {errors.telefon && <p className="mt-1 text-sm text-bombovo-red">{errors.telefon}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bombovo-dark mb-2">
                      Email <span className="text-bombovo-red">*</span>
                    </label>
                    <div className={`border-2 ${errors.email ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-bombovo-red">{errors.email}</p>}
                  </div>
                </div>

                {/* Čo študuješ */}
                <div>
                  <label htmlFor="studium" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Čo študuješ, prípadne v akej oblasti pracuješ? <span className="text-bombovo-red">*</span>
                  </label>
                  <div className={`border-2 ${errors.studium ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="studium"
                      name="studium"
                      value={formData.studium}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                    />
                  </div>
                  {errors.studium && <p className="mt-1 text-sm text-bombovo-red">{errors.studium}</p>}
                </div>

                {/* Bol/a si už animátor */}
                <div>
                  <label className="block text-sm font-medium text-bombovo-dark mb-2">
                    Bol/a si už v škole v prírode / tábore ako animátor? <span className="text-bombovo-red">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="animatorSkusenost"
                        value="áno"
                        checked={formData.animatorSkusenost === 'áno'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-bombovo-blue cursor-pointer"
                      />
                      <span className="text-base text-bombovo-dark">Áno</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="animatorSkusenost"
                        value="nie"
                        checked={formData.animatorSkusenost === 'nie'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-bombovo-blue cursor-pointer"
                      />
                      <span className="text-base text-bombovo-dark">Nie</span>
                    </label>
                  </div>
                  {errors.animatorSkusenost && <p className="mt-1 text-sm text-bombovo-red">{errors.animatorSkusenost}</p>}
                </div>

                {/* Skúsenosti s deťmi */}
                <div>
                  <label htmlFor="skusenostiDeti" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Popíš svoje doterajšie skúsenosti s prácou s deťmi a mládežou. <span className="text-bombovo-red">*</span>
                  </label>
                  <div className={`border-2 ${errors.skusenostiDeti ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <textarea
                      id="skusenostiDeti"
                      name="skusenostiDeti"
                      rows={6}
                      value={formData.skusenostiDeti}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none resize-none"
                    />
                  </div>
                  {errors.skusenostiDeti && <p className="mt-1 text-sm text-bombovo-red">{errors.skusenostiDeti}</p>}
                </div>

                {/* Vek detí */}
                <div>
                  <label className="block text-sm font-medium text-bombovo-dark mb-2">
                    Uprednostňuješ vek detí: <span className="text-bombovo-red">*</span>
                  </label>
                  <div className="space-y-2">
                    {['do 6 rokov', 'do 10 rokov', 'nad 10 rokov'].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          value={option}
                          checked={formData.vekPreferencia.includes(option)}
                          onChange={(e) => handleCheckboxChange(e, 'vekPreferencia')}
                          className="w-5 h-5 text-bombovo-blue cursor-pointer"
                        />
                        <span className="text-base text-bombovo-dark">{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.vekPreferencia && <p className="mt-1 text-sm text-bombovo-red">{errors.vekPreferencia}</p>}
                </div>

                {/* Koníčky */}
                <div>
                  <label htmlFor="konicky" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Vymenuj svoje koníčky, schopnosti, vedomosti a zručnosti, ktoré by si vedel využiť pri práci s deťmi a mládežou. <span className="text-bombovo-red">*</span>
                  </label>
                  <div className={`border-2 ${errors.konicky ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <textarea
                      id="konicky"
                      name="konicky"
                      rows={6}
                      value={formData.konicky}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none resize-none"
                    />
                  </div>
                  {errors.konicky && <p className="mt-1 text-sm text-bombovo-red">{errors.konicky}</p>}
                </div>

                {/* Programy/skúsenosti */}
                <div>
                  <label className="block text-sm font-medium text-bombovo-dark mb-2">
                    Máš skúsenosti, zručnosti z niektorých nasledovných programov, v čom si dobrý/á: <span className="text-bombovo-red">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['jazda na koni', 'lyžička', 'šport', 'tanec', 'rodičia s deťmi', 'plavecký kurz', 'hudba', 'cudzí jazyk'].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          value={option}
                          checked={formData.programySkusenosti.includes(option)}
                          onChange={(e) => handleCheckboxChange(e, 'programySkusenosti')}
                          className="w-5 h-5 text-bombovo-blue cursor-pointer"
                        />
                        <span className="text-base text-bombovo-dark">{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.programySkusenosti && <p className="mt-1 text-sm text-bombovo-red">{errors.programySkusenosti}</p>}
                </div>

                {/* Popíš aké */}
                <div>
                  <label htmlFor="opisSkusenosti" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Popíš aké: <span className="text-bombovo-red">*</span>
                  </label>
                  <div className={`border-2 ${errors.opisSkusenosti ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <textarea
                      id="opisSkusenosti"
                      name="opisSkusenosti"
                      rows={6}
                      value={formData.opisSkusenosti}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none resize-none"
                    />
                  </div>
                  {errors.opisSkusenosti && <p className="mt-1 text-sm text-bombovo-red">{errors.opisSkusenosti}</p>}
                </div>

                {/* Hlavný dôvod */}
                <div>
                  <label htmlFor="hlavnyDovod" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Uveď hlavný dôvod, prečo sa uchádzaš o uvedenú pozíciu. <span className="text-bombovo-red">*</span>
                  </label>
                  <div className={`border-2 ${errors.hlavnyDovod ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <textarea
                      id="hlavnyDovod"
                      name="hlavnyDovod"
                      rows={6}
                      value={formData.hlavnyDovod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none resize-none"
                    />
                  </div>
                  {errors.hlavnyDovod && <p className="mt-1 text-sm text-bombovo-red">{errors.hlavnyDovod}</p>}
                </div>

                {/* Špeciálna strava */}
                <div>
                  <label htmlFor="strava" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Špeciálna strava alebo alergie
                  </label>
                  <div className="border-2 border-gray-300 rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                    <textarea
                      id="strava"
                      name="strava"
                      rows={4}
                      value={formData.strava}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Termín školenia */}
                <div>
                  <label htmlFor="termin" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Termín školenia, o ktorý máš záujem: <span className="text-bombovo-red">*</span>
                  </label>
                  <div className={`border-2 ${errors.termin ? 'border-bombovo-red' : 'border-gray-300'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <select
                      id="termin"
                      name="termin"
                      value={formData.termin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none cursor-pointer"
                    >
                      <option value="">Vybrať termín</option>
                      {terminyOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.termin && <p className="mt-1 text-sm text-bombovo-red">{errors.termin}</p>}
                </div>

                {/* Consent 1 */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent1"
                      checked={formData.consent1}
                      onChange={(e) => handleConsentChange(e, 'consent1')}
                      className="mt-1 w-5 h-5 text-bombovo-blue cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-bombovo-dark">
                      Označením čestne vyhlasujem, že som nikdy v minulosti nebol a ani v súčasnosti nie som trestne stíhaný/á, som psychicky, morálne aj zdravotne spôsobilý/á na výkon uvedenej pozície.
                    </span>
                  </label>
                  {errors.consent1 && <p className="mt-1 text-sm text-bombovo-red ml-8">{errors.consent1}</p>}
                </div>

                {/* Consent 2 */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent2"
                      checked={formData.consent2}
                      onChange={(e) => handleConsentChange(e, 'consent2')}
                      className="mt-1 w-5 h-5 text-bombovo-blue cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-bombovo-dark">
                      Označením súhlasím s administratívnym spracovaním mojich uvedených osobných údajov pre účely výberového konania. Tieto údaje poskytujú len pre Bombovo CK a nebudú poskytnuté iným osobám a subjektom.
                    </span>
                  </label>
                  {errors.consent2 && <p className="mt-1 text-sm text-bombovo-red ml-8">{errors.consent2}</p>}
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
                  {isSubmitting ? 'Odosiela sa...' : 'Odoslať prihlásku'}
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
