'use client'

import { useState } from 'react'
import Image from 'next/image'
import StepYesNo from './steps/StepYesNo'
import StepNameCamp from './steps/StepNameCamp'
import StepEmail from './steps/StepEmail'
import StepSuccess from './steps/StepSuccess'

interface Camp {
  id: string
  name: string
}

export interface PopupContent {
  photoUrl: string | null
  step0Headline: string
  step0YesLabel: string
  step0NoLabel: string
  step1Headline: string
  step1NamePlaceholder: string
  step1CampDefaultLabel: string
  step1NextLabel: string
  step2Headline: string
  step2EmailPlaceholder: string
  step2SubmitLabel: string
  step3SuccessHeadline: string
  step3SuccessBody: string
  camps: Camp[]
}

interface Props extends PopupContent {
  onClose: () => void
  maxSize: { w: number; h: number } | null
}

export default function PopupModal({ onClose, photoUrl, camps, maxSize, ...content }: Props) {
  const [step, setStep] = useState(0)
  const [entryName, setEntryName] = useState('')
  const [entryCamp, setEntryCamp] = useState('')

  function handleYes() { setStep(1) }
  function handleNameCampNext(name: string, camp: string) {
    setEntryName(name)
    setEntryCamp(camp)
    setStep(2)
  }
  function handleSuccess() { setStep(3) }
  function handleBack() { setStep(1) }

  const stepContent = (
    <div className="w-full">
      {step === 0 && (
        <StepYesNo
          headline={content.step0Headline}
          yesLabel={content.step0YesLabel}
          noLabel={content.step0NoLabel}
          onYes={handleYes}
          onNo={onClose}
        />
      )}
      {step === 1 && (
        <StepNameCamp
          headline={content.step1Headline}
          namePlaceholder={content.step1NamePlaceholder}
          campDefaultLabel={content.step1CampDefaultLabel}
          nextLabel={content.step1NextLabel}
          camps={camps}
          onNext={handleNameCampNext}
        />
      )}
      {step === 2 && (
        <StepEmail
          headline={content.step2Headline}
          emailPlaceholder={content.step2EmailPlaceholder}
          submitLabel={content.step2SubmitLabel}
          name={entryName}
          selectedCamp={entryCamp}
          onSuccess={handleSuccess}
          onBack={handleBack}
        />
      )}
      {step === 3 && (
        <StepSuccess
          successHeadline={content.step3SuccessHeadline}
          successBody={content.step3SuccessBody}
          onClose={onClose}
        />
      )}
    </div>
  )

  const closeButton = (
    <button
      onClick={onClose}
      aria-label="Zavrieť"
      className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white border-2 border-bombovo-dark hover:bg-bombovo-gray transition-all text-bombovo-dark z-10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
  )

  return (
    <>
      {/* ── MOBILE: full screen, 50/50 split ── */}
      <div className="md:hidden fixed inset-0 flex flex-col overflow-hidden">
        {/* Form — top 50% */}
        <div className="relative h-1/2 bg-white flex flex-col justify-center items-center px-6 overflow-visible">
          {closeButton}
          {stepContent}
        </div>

        {/* Photo — bottom 50% */}
        <div className="relative h-1/2 flex-shrink-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Vyhraj tábor zadarmo"
              fill
              className="object-cover"
              unoptimized={photoUrl.startsWith('http')}
            />
          ) : (
            <div className="w-full h-full bg-bombovo-blue flex items-center justify-center">
              <span className="text-6xl">🎁</span>
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP: side by side ── */}
      <div
        className="hidden md:flex shadow-2xl rounded-2xl overflow-hidden"
        style={{
          width: 'calc(100vw - 80px)',
          height: 'calc(100vh - 30px)',
          maxWidth: maxSize ? `${maxSize.w}px` : undefined,
          maxHeight: maxSize ? `${maxSize.h}px` : undefined,
        }}
      >
        {/* Left panel — photo */}
        <div className="relative w-[48%] flex-shrink-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Vyhraj tábor zadarmo"
              fill
              className="object-cover"
              unoptimized={photoUrl.startsWith('http')}
            />
          ) : (
            <div className="w-full h-full bg-bombovo-blue flex items-center justify-center">
              <span className="text-7xl">🎁</span>
            </div>
          )}
        </div>

        {/* Right panel — form */}
        <div className="relative flex-1 bg-white border-2 border-bombovo-blue rounded-r-2xl flex flex-col justify-center items-center px-14 py-10 overflow-hidden">
          {closeButton}
          {stepContent}
        </div>
      </div>
    </>
  )
}
