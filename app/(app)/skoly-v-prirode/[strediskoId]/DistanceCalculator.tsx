'use client'

import { useState, useCallback } from 'react'

const LOADING_STEPS: { progress: number; label: string }[] = [
  { progress: 15, label: 'Hľadám lokalitu...' },
  { progress: 35, label: 'Spájam sa s mapami...' },
  { progress: 55, label: 'Vypočítavam trasu...' },
  { progress: 75, label: 'Počítam vzdialenosť...' },
  { progress: 90, label: 'Pripravujem výsledok...' },
  { progress: 100, label: 'Hotovo!' },
]

type Status = 'idle' | 'loading' | 'result' | 'error'

interface DistanceResult {
  distanceText: string
  durationText: string
  originText: string
}

interface Props {
  strediskoName: string
  coordinates?: { lat: number; lng: number }
}

function formatDistance(meters: number): string {
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  if (h === 0) return `${m} minút`
  return `${h} hodín ${m} minút`
}

export default function DistanceCalculator({ strediskoName, coordinates }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [loadingLabel, setLoadingLabel] = useState('')
  const [result, setResult] = useState<DistanceResult | null>(null)

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

  const handleCalculate = useCallback(async () => {
    if (!inputValue.trim() || !coordinates) return

    setStatus('loading')
    setProgress(0)
    setLoadingLabel(LOADING_STEPS[0].label)
    setResult(null)

    const progressInterval = animateProgress()

    try {
      // Geocode the typed address with Nominatim
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&countrycodes=sk&format=json&limit=1`,
        { headers: { 'User-Agent': 'BombovoApp/1.0 (bombovo.sk)' } },
      )
      const geoData: any[] = await geoRes.json()

      if (!geoData.length) {
        clearInterval(progressInterval)
        setStatus('error')
        return
      }

      const userLat = parseFloat(geoData[0].lat)
      const userLon = parseFloat(geoData[0].lon)

      // Calculate driving distance via OpenRouteService
      // ORS takes [longitude, latitude] — opposite order from Google Maps
      const orsKey = process.env.NEXT_PUBLIC_ORS_API_KEY
      const orsRes = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car',
        {
          method: 'POST',
          headers: {
            Authorization: orsKey ?? '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: [
              [userLon, userLat],
              [coordinates.lng, coordinates.lat],
            ],
          }),
        },
      )

      if (!orsRes.ok) {
        clearInterval(progressInterval)
        setStatus('error')
        return
      }

      const orsData = await orsRes.json()
      const summary = orsData.routes?.[0]?.summary

      if (!summary) {
        clearInterval(progressInterval)
        setStatus('error')
        return
      }

      clearInterval(progressInterval)
      setProgress(100)
      setLoadingLabel('Hotovo!')

      setTimeout(() => {
        setResult({
          distanceText: formatDistance(summary.distance),
          durationText: formatDuration(summary.duration),
          originText: inputValue,
        })
        setStatus('result')
      }, 300)
    } catch {
      clearInterval(progressInterval)
      setStatus('error')
    }
  }, [inputValue, coordinates, animateProgress])

  const reset = useCallback(() => {
    setInputValue('')
    setStatus('idle')
    setProgress(0)
    setLoadingLabel('')
    setResult(null)
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
      {/* Left column — calculator */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-bombovo-dark mb-6 leading-tight">
          <span className="block">Zistite, ako ďaleko je</span>
          <span className="block mt-1 md:mt-2">
            <span className="font-handwritten text-bombovo-red">{strediskoName}</span>
            {' '}
            <span className="font-bold text-bombovo-dark">od vás</span>
          </span>
        </h2>

        {/* Input */}
        <div className="mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="Zadajte vašu lokalitu (napr. ZŠ Bratislava, Miletičova)"
            disabled={status === 'loading'}
            className="w-full px-4 py-3 text-base text-bombovo-dark bg-white border-2 border-bombovo-gray rounded-xl outline-none focus:border-bombovo-blue transition-colors duration-200 disabled:opacity-60"
          />
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
              Lokalitu sa nepodarilo nájsť. Skúste zadať mesto alebo presnú adresu školy.
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

      {/*
        Right column / bottom on mobile — OpenStreetMap.

        This was a Google Maps embed carrying a hardcoded API key in client
        source, which the move to Nominatim + ORS (commit 7a80709) left behind.
        OSM's own embed needs no key and no extra dependency, so the whole
        component now uses one mapping provider.
      */}
      <div className="w-full lg:w-1/2">
        {coordinates ? (
          <iframe
            title={`Mapa — ${strediskoName}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.035}%2C${coordinates.lat - 0.018}%2C${coordinates.lng + 0.035}%2C${coordinates.lat + 0.018}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`}
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '16px' }}
            loading="lazy"
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
