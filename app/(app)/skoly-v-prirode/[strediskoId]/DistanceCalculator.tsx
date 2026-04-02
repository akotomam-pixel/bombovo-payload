'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const GOOGLE_MAPS_API_KEY = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'

const LOADING_STEPS: { progress: number; label: string }[] = [
  { progress: 15, label: 'Hľadám lokalitu...' },
  { progress: 35, label: 'Spájam sa s mapami...' },
  { progress: 55, label: 'Vypočítavam trasu...' },
  { progress: 75, label: 'Počítam vzdialenosť...' },
  { progress: 90, label: 'Pripravujem výsledok...' },
  { progress: 100, label: 'Hotovo!' },
]

type Status = 'idle' | 'loading' | 'result' | 'error'

interface AutocompleteResult {
  description: string
  placeId: string
}

interface DistanceResult {
  distanceText: string
  durationText: string
  originText: string
}

interface Props {
  strediskoName: string
  coordinates?: { lat: number; lng: number }
}

declare global {
  interface Window {
    google: typeof google
    initGoogleMaps?: () => void
  }
}

export default function DistanceCalculator({ strediskoName, coordinates }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [loadingLabel, setLoadingLabel] = useState('')
  const [result, setResult] = useState<DistanceResult | null>(null)
  const [autocompleteResults, setAutocompleteResults] = useState<AutocompleteResult[]>([])
  const [sdkLoaded, setSdkLoaded] = useState(false)

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load Google Maps JS SDK once
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.google?.maps) {
      setSdkLoaded(true)
      return
    }
    const existing = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    )
    if (existing) {
      existing.addEventListener('load', () => setSdkLoaded(true))
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setSdkLoaded(true)
    document.head.appendChild(script)
  }, [])

  // Init autocomplete service when SDK is ready
  useEffect(() => {
    if (sdkLoaded && window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    }
  }, [sdkLoaded])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAutocompleteResults([])
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (!value.trim() || !autocompleteService.current) {
      setAutocompleteResults([])
      return
    }
    debounceTimer.current = setTimeout(() => {
      autocompleteService.current!.getPlacePredictions(
        {
          input: value,
          types: ['geocode'],
          componentRestrictions: { country: 'sk' },
          language: 'sk',
        } as google.maps.places.AutocompletionRequest,
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setAutocompleteResults(
              predictions.map((p) => ({ description: p.description, placeId: p.place_id }))
            )
          } else {
            setAutocompleteResults([])
          }
        }
      )
    }, 300)
  }, [])

  const animateProgress = useCallback(() => {
    let stepIndex = 0
    const interval = setInterval(() => {
      if (stepIndex >= LOADING_STEPS.length) {
        clearInterval(interval)
        return
      }
      const step = LOADING_STEPS[stepIndex]
      setProgress(step.progress)
      setLoadingLabel(step.label)
      stepIndex++
    }, 400)
    return interval
  }, [])

  const handleCalculate = useCallback(() => {
    if (!inputValue.trim() || !coordinates || !sdkLoaded) return

    setStatus('loading')
    setProgress(0)
    setLoadingLabel(LOADING_STEPS[0].label)
    setResult(null)

    const progressInterval = animateProgress()

    const service = new window.google.maps.DistanceMatrixService()
    service.getDistanceMatrix(
      {
        origins: [inputValue],
        destinations: [{ lat: coordinates.lat, lng: coordinates.lng }],
        travelMode: window.google.maps.TravelMode.DRIVING,
        language: 'sk',
      },
      (response, status) => {
        clearInterval(progressInterval)

        if (
          status === 'OK' &&
          response?.rows[0]?.elements[0]?.status === 'OK'
        ) {
          const element = response.rows[0].elements[0]
          const distanceText = element.distance.text
          const durationText = element.duration.text
          const originText = response.originAddresses?.[0] ?? inputValue

          setProgress(100)
          setLoadingLabel('Hotovo!')

          setTimeout(() => {
            setResult({ distanceText, durationText, originText })
            setStatus('result')
          }, 300)
        } else {
          setStatus('error')
        }
      }
    )
  }, [inputValue, coordinates, sdkLoaded, animateProgress])

  const reset = useCallback(() => {
    setInputValue('')
    setStatus('idle')
    setProgress(0)
    setLoadingLabel('')
    setResult(null)
    setAutocompleteResults([])
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
      {/* Left column — calculator */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark mb-6">
          Zistite, ako ďaleko je{' '}
          <span className="font-handwritten text-bombovo-red">{strediskoName}</span>
          {' '}od vás
        </h2>

        {/* Input + autocomplete */}
        <div className="relative mb-4" ref={dropdownRef}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="Zadajte vašu lokalitu (napr. ZŠ Bratislava, Miletičova)"
            disabled={status === 'loading'}
            className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-gray rounded-xl outline-none focus:border-bombovo-blue transition-colors duration-200 disabled:opacity-60"
          />
          {autocompleteResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border-2 border-bombovo-blue rounded-xl overflow-hidden shadow-lg">
              {autocompleteResults.map((r) => (
                <button
                  key={r.placeId}
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-bombovo-dark hover:bg-bombovo-gray transition-colors duration-150"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setInputValue(r.description)
                    setAutocompleteResults([])
                  }}
                >
                  {r.description}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          disabled={status === 'loading' || !inputValue.trim()}
          className="w-full px-8 py-3 bg-bombovo-red border-2 border-bombovo-dark text-white font-bold text-base rounded-full hover:translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          Vypočítať vzdialenosť
        </button>

        {/* Loading bar */}
        {status === 'loading' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-bombovo-dark">{loadingLabel}</span>
              <span className="text-sm font-bold text-bombovo-blue">{progress} %</span>
            </div>
            <div className="w-full h-2 bg-bombovo-gray rounded-full overflow-hidden">
              <div
                className="h-full bg-bombovo-blue rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Result block */}
        {status === 'result' && result && (
          <div className="mt-4 p-5 bg-bombovo-gray rounded-2xl border-2 border-bombovo-blue">
            <p className="text-base md:text-lg text-bombovo-dark leading-relaxed">
              Vaša lokalita <strong>{result.originText}</strong> je{' '}
              <strong className="text-bombovo-blue">{result.distanceText}</strong> ďaleko
              a cesta autobusom trvá približne{' '}
              <strong className="text-bombovo-blue">{result.durationText}</strong>.
            </p>
            <button
              onClick={reset}
              className="mt-4 px-6 py-2 border-2 border-bombovo-dark text-bombovo-dark font-bold text-sm rounded-full hover:bg-white transition-all duration-200"
            >
              Vypočítať lokalitu znova
            </button>
          </div>
        )}

        {/* Error block */}
        {status === 'error' && (
          <div className="mt-4 p-5 bg-bombovo-gray rounded-2xl border-2 border-red-400">
            <p className="text-base text-bombovo-dark leading-relaxed">
              Nepodarilo sa vypočítať vzdialenosť. Skúste zadať presnú adresu školy.
            </p>
            <button
              onClick={reset}
              className="mt-4 px-6 py-2 border-2 border-bombovo-dark text-bombovo-dark font-bold text-sm rounded-full hover:bg-white transition-all duration-200"
            >
              Skúsiť znova
            </button>
          </div>
        )}
      </div>

      {/* Right column / bottom on mobile — Google Maps iframe */}
      <div className="w-full lg:w-1/2">
        {coordinates ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}&zoom=14`}
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-[450px] rounded-2xl bg-bombovo-gray flex items-center justify-center">
            <p className="text-bombovo-dark text-sm">Mapa nie je k dispozícii</p>
          </div>
        )}
      </div>
    </div>
  )
}
