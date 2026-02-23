'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaveDivider from '@/components/WaveDivider'

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    // Slovak phone number format
    const re = /^(\+421|00421|0)?[0-9]{9}$/
    return re.test(phone.replace(/\s/g, ''))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, consent: e.target.checked }))
    if (errors.consent) {
      setErrors(prev => ({ ...prev, consent: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      message: '',
      consent: ''
    }

    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Toto pole je povinné'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Neplatný formát e-mailu'
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Toto pole je povinné'
      isValid = false
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Neplatné telefónne číslo'
      isValid = false
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Toto pole je povinné'
      isValid = false
    }

    if (!formData.consent) {
      newErrors.consent = 'Toto pole je povinné'
      isValid = false
    }

    setErrors(newErrors)
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          consent: false
        })
      } else {
        setSubmitError('Niečo sa pokazilo. Skúste to prosím znova.')
      }
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
      
      {/* Section 1: Header - Sticky Navigation */}
      <Header />
      
      {/* Section 1: Headline */}
      <section className="pt-8 pb-6 md:pt-12 md:pb-8 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark mb-4 text-center">
            <span className="relative inline-block">
              Máte Otázky?{' '}
              <span className="font-handwritten text-bombovo-red text-4xl md:text-5xl lg:text-6xl">
                Neváhajte Nás Kontaktovať
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
        </div>
      </section>

      {/* Section 2: Contact Form and Information */}
      <section className="pt-2 pb-8 md:pt-4 md:pb-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Section 2A: Contact Form */}
            <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-bombovo-gray h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-6">
                Napíšte Nám
              </h2>              {submitSuccess ? (
                <div className="py-12 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-bombovo-dark mb-3">
                    Vaša správa bola odoslaná!
                  </h3>
                  <p className="text-lg text-bombovo-dark mb-6">
                    Ozveme sa vám čoskoro.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-8 py-3 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold rounded-full hover:translate-y-0.5 transition-all duration-200"
                  >
                    Poslať ďalšiu správu
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-bombovo-dark mb-2">
                      Meno*
                    </label>
                    <div className={`border-2 ${errors.name ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Vaše meno"
                        className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-bombovo-red">{errors.name}</p>
                    )}
                  </div>                  {/* Email and Phone Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-bombovo-dark mb-2">
                        E-mail*
                      </label>
                      <div className={`border-2 ${errors.email ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="vas.email@example.com"
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-bombovo-red">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-bombovo-dark mb-2">
                        Telefón*
                      </label>
                      <div className={`border-2 ${errors.phone ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0900 123 456"
                          className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-bombovo-red">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-bombovo-dark mb-2">
                      Vaša správa*
                    </label>
                    <div className={`border-2 ${errors.message ? 'border-bombovo-red' : 'border-bombovo-gray'} rounded-xl overflow-hidden focus-within:border-bombovo-blue transition-colors`}>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Napíšte nám vašu správu..."
                        className="w-full px-4 py-3 text-base text-bombovo-dark bg-white outline-none resize-none"
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-sm text-bombovo-red">{errors.message}</p>
                    )}
                  </div>

                  {/* Privacy Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={handleConsentChange}
                        className="mt-1 w-5 h-5 border-2 border-bombovo-gray rounded accent-bombovo-blue cursor-pointer flex-shrink-0"
                      />
                      <span className="text-base text-bombovo-dark">
                        Súhlasím so{' '}
                        <a href="/gdpr" className="underline hover:text-bombovo-blue">
                          spracovaním osobných údajov
                        </a>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-1 text-sm text-bombovo-red ml-8">{errors.consent}</p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <div className="p-4 bg-bombovo-red/10 border-2 border-bombovo-red rounded-xl">
                      <p className="text-sm text-bombovo-red">{submitError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-full hover:translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? 'Odosiela sa...' : 'Odoslať správu'}
                  </button>
                </form>
              )}
            </div>

            {/* Section 2B: Contact Information */}
            <div className="border-4 border-bombovo-blue rounded-3xl p-8 md:p-10 bg-bombovo-gray h-full">
              <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark mb-8">
                Kontaktné Informácie
              </h2>

              <div className="space-y-8">
                {/* Phone Contact */}
                <div>
                  <h3 className="text-xl font-bold text-bombovo-dark mb-3">
                    Telefónny Kontakt
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-bombovo-dark/70">Pevná linka Hotela Lomy:</p>
                      <a href="tel:+421376522523" className="text-base text-bombovo-dark hover:text-bombovo-blue">
                        +421 37 6522 523
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-bombovo-dark/70 mt-3">Mobil:</p>
                      <div className="space-y-1">
                        <a href="tel:+421915774213" className="block text-base text-bombovo-dark hover:text-bombovo-blue">
                          +421 915 774 213
                        </a>
                        <a href="tel:+421903722734" className="block text-base text-bombovo-dark hover:text-bombovo-blue">
                          +421 903 722 734
                        </a>
                        <a href="tel:+421911732735" className="block text-base text-bombovo-dark hover:text-bombovo-blue">
                          +421 911 732 735
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div>
                  <h3 className="text-xl font-bold text-bombovo-dark mb-3">
                    Pracovná Doba
                  </h3>
                  <p className="text-base text-bombovo-dark">
                    Pondelok - Piatok: 09:00 - 12:00 a 13:00 - 15:00
                  </p>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-xl font-bold text-bombovo-dark mb-3">
                    Adresa
                  </h3>
                  <p className="text-base text-bombovo-dark">
                    Široká 5049/24, 949 05 Nitra
                  </p>
                </div>

                {/* Business Register */}
                <div>
                  <h3 className="text-xl font-bold text-bombovo-dark mb-3">
                    Obchodný Register
                  </h3>
                  <div className="space-y-2 text-base text-bombovo-dark">
                    <p>
                      BOMBOVO cestovná kancelária s.r.o
                    </p>
                    <p className="text-sm">
                      Je zapísaná v obchodnom registri Okresného súdu Nitra, oddiel Sro, vl.č.:12350/N
                    </p>
                    <div className="mt-3 space-y-1">
                      <p>IČO: 36539961</p>
                      <p>IČ DPH: SK2020152937</p>
                    </div>
                  </div>
                </div>

                {/* Supervision Authority */}
                <div>
                  <h3 className="text-xl font-bold text-bombovo-dark mb-3">
                    Orgán Dozoru
                  </h3>
                  <div className="space-y-1 text-base text-bombovo-dark">
                    <p>Slovenská obchodná inšpekcia</p>
                    <p>Inšpektorát SOI pre Nitriansky kraj</p>
                    <p>Staničná 1567/9</p>
                    <p>949 01 Nitra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red Divider: White → Grey */}
      <div className="bg-white">
        <WaveDivider color="red" variant={2} />
      </div>

      {/* Section 3: Partners - Grey Background */}
      <section className="py-8 md:py-12 bg-bombovo-gray">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-bombovo-dark text-center mb-8">
            Naši Partneri
          </h2>

          {/* Partner Logos */}
          <div className="flex justify-center items-center gap-12 md:gap-16">
            {/* Partner 1 */}
            <div className="flex flex-col items-center">
              <div 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#90EE90' }}
              >
                <span className="text-2xl md:text-3xl font-bold text-bombovo-dark">Partner 1</span>
              </div>
            </div>

            {/* Partner 2 */}
            <div className="flex flex-col items-center">
              <div 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#90EE90' }}
              >
                <span className="text-2xl md:text-3xl font-bold text-bombovo-dark">Partner 2</span>
              </div>
            </div>
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