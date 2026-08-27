/**
 * The discount seal — a single circle with a scalloped, wavy rim, read as a
 * wax-seal or rubber-stamp shape rather than a flat pill badge.
 *
 * Shared between the Lomy hero photo and every overview-grid stredisko card
 * so all of them render the identical badge.
 */

/**
 * Precomputed once at module load: a closed polygon path tracing a circle
 * whose radius oscillates sinusoidally, which reads as a smooth scalloped
 * edge at this size without needing per-render recomputation.
 */
export const WAVY_CIRCLE_PATH = (() => {
  const cx = 50
  const cy = 50
  const baseR = 42
  const amplitude = 3.4
  const waves = 14
  const points = 160

  let d = ''
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2
    const r = baseR + amplitude * Math.sin(waves * t)
    const x = cx + r * Math.cos(t)
    const y = cy + r * Math.sin(t)
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return `${d} Z`
})()

export default function DiscountSeal({
  amount,
  deadline,
  size,
  className = '',
}: {
  amount: string
  deadline: string
  size: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`Zľava ${amount}, ${deadline}`}
      className={className}
      style={{ fontFamily: 'inherit', filter: 'drop-shadow(0 8px 20px rgba(223,41,53,0.34))' }}
    >
      <path d={WAVY_CIRCLE_PATH} fill="#DF2935" />

      <text x="50" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="700" letterSpacing="-1">
        {amount}
      </text>
      {/* Hairline rule between the amount and the deadline. */}
      <line x1="37" y1="54.5" x2="63" y2="54.5" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.45" />
      <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="600" opacity="0.92">
        {deadline}
      </text>
    </svg>
  )
}
