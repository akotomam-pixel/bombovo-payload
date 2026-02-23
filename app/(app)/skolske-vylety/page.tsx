'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'

export default function SkolskeVyletyPage() {
  const [formData, setFormData] = useState({
    teacherName: '',
    schoolAddress: '',
    phone: '',
    email: '',
    numberOfPeople: '',
    note: ''
  })

  const [errors, setErrors] = useState({
    teacherName: '',
    schoolAddress: '',
    phone: '',
    email: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      teacherName: '',
      schoolAddress: '',
      phone: '',
      email: ''
    }

    let isValid = true

    if (!formData.teacherName.trim()) {
      newErrors.teacherName = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.schoolAddress.trim()) {
      newErrors.schoolAddress = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Toto pole je povinné'
      isValid = false
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Neplatné telefónne číslo'
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Toto pole je povinné'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Neplatný formát e-mailu'
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitSuccess(true)
      setFormData({
        teacherName: '',
        schoolAddress: '',
        phone: '',
        email: '',
        numberOfPeople: '',
        note: ''
      })
    } catch (error) {
      setSubmitError('Niečo sa pokazilo. Skúste to prosím znova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Section 0: Top Bar - Grey Background */}
      <div className="bg-bombovo-gray">
        <TopBar />
      </div>
      
      {/* Header - Sticky Navigation */}
      <Header />
      
      {/* Section 1: Headline - Grey Background */}
      <section className="bg-bombovo-gray">
        <div className="pt-12 pb-8 md:pt-16 md:pb-12">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
              <span className="relative inline-block">
                <span className="font-handwritten text-bombovo-red">
                  Školské Výlety Na Horskom Hotely Lomy
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
            
            <div className="text-center space-y-3">
              <p className="text-xl md:text-2xl text-bombovo-dark font-medium">
                Chcete organizovať pre svoju triedu koncoročný školský výlet?
              </p>
              <p className="text-xl md:text-2xl text-bombovo-dark font-medium">
                Príďte Na Horský Hotel Lomy!
              </p>
            </div>
          </div>
        </div>
        
        {/* Divider: Grey → White (BLUE) - Inside grey section at the break point */}
        <WaveDivider color="blue" variant={1} />
      </section>

      {/* NEW Section 2: "Len za 40€" - Text LEFT, Photo RIGHT - White Background */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left: Text Content */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-6">
                Len za 40€ na noc u nás dostaneš:
              </h2>
              
              <ul className="space-y-4 text-lg text-bombovo-dark">
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-2xl">•</span>
                  <span>ubytovanie v 7 miestnych chatkách, strava 3 x denne + pitný režim počas celého dňa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-2xl">•</span>
                  <span>na 10 detí 1 dospelý grátis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-2xl">•</span>
                  <span>možnosť využívať celý areál (bazén v prevádzke podľa počasia)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bombovo-blue text-2xl">•</span>
                  <span>možnosť zapožičania materiálu na vonkajšie hry</span>
                </li>
              </ul>
            </div>

            {/* Right: Photo */}
            <div className="flex-1 rounded-3xl overflow-hidden lg:min-h-0 min-h-[300px]">
              <img 
                src="/images/skolskevylety1.jpg"
                alt="Školské výlety"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NO DIVIDER HERE - Deleted as requested */}

      {/* NEW Section 3: "Viac informácií" - Photo LEFT, Text RIGHT - White Background */}
      <section className="bg-white">
        <div className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Left: Photo */}
              <div className="flex-1 rounded-3xl overflow-hidden lg:min-h-0 min-h-[300px] order-2 lg:order-1">
                <img 
                  src="/images/skolskevylety2.jpg"
                  alt="Viac informácií o školských výletoch"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Text Content */}
              <div className="flex-1 flex flex-col order-1 lg:order-2">
                <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-6">
                  Viac informácií:
                </h2>
                
                <ul className="space-y-3 text-lg text-bombovo-dark">
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-yellow text-2xl font-bold">•</span>
                    <span>Školské výlety je možné realizovať len na stredisku horský Hotel Lomy, Horná Ves.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-yellow text-2xl font-bold">•</span>
                    <span>Dospelá osoba navyše 40 eur / deň.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-yellow text-2xl font-bold">•</span>
                    <span>Možnosť opekačky výmenou za večeru alebo za príplatok 7 eur ako druhá večera (špekačky, chlieb, zelenina, kečup, horčica, náradie na opekanie, ohnisko)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-yellow text-2xl font-bold">•</span>
                    <span>Nosiť si vlastnú stravu na stredisko je prísne zakázané.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-bombovo-yellow text-2xl font-bold">•</span>
                    <span>Dopravu na výlet nezabezpečujeme, doprava je individuálna.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider: White → Grey (RED) - Inside white section at the break point */}
        <WaveDivider color="red" variant={2} />
      </section>

      {/* Section 4: Registration Form - Grey Background */}
      <section id="prihlaska" className="py-12 md:py-16 bg-bombovo-gray scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-8">
            Vyplň prihlášku na školský výlet
          </h2>

          <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-white shadow-lg">
            {submitSuccess ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-bombovo-dark mb-3">
                  Vaša prihláška bola odoslaná!
                </h3>
                <p className="text-lg text-bombovo-dark mb-6">
                  Ozveme sa vám čoskoro.
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
                {/* Teacher Name */}
                <div>
                  <label htmlFor="teacherName" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Meno a priezvisko pedagóga *
                  </label>
                  <div className={`border-2 ${errors.teacherName ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="teacherName"
                      name="teacherName"
                      value={formData.teacherName}
                      onChange={handleInputChange}
                      placeholder="Vaše meno a priezvisko"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.teacherName && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.teacherName}</p>
                  )}
                </div>

                {/* School Address */}
                <div>
                  <label htmlFor="schoolAddress" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Adresa, PSČ, mesto školy *
                  </label>
                  <div className={`border-2 ${errors.schoolAddress ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="text"
                      id="schoolAddress"
                      name="schoolAddress"
                      value={formData.schoolAddress}
                      onChange={handleInputChange}
                      placeholder="Adresa školy"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.schoolAddress && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.schoolAddress}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Telefón na pedagóga *
                  </label>
                  <div className={`border-2 ${errors.phone ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0900 123 456"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-bombovo-red">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Email na pedagóga *
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

                {/* Number of People */}
                <div>
                  <label htmlFor="numberOfPeople" className="block text-sm font-medium text-bombovo-dark mb-2">
                    Počet osôb
                  </label>
                  <div className="border-2 border-bombovo-gray rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors">
                    <input
                      type="text"
                      id="numberOfPeople"
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      placeholder="Počet osôb"
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none"
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
                      placeholder="Vaša poznámka..."
                      className="w-full px-4 py-3 text-base text-bombovo-dark bg-bombovo-gray outline-none resize-none"
                    />
                  </div>
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
