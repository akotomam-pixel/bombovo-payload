/**
 * The discount seal, drawn to the Lomy amphitheatre: a ring of timber benches
 * stepping down to a stone fire pit (see `/images/Skoly v Prirode/lomy.png`),
 * so the badge is built from concentric arcs around a centre rather than the
 * clip-art starburst it replaces. The rings are broken by small gaps the way
 * the real seating is broken by its access steps, which keeps it reading as
 * drawn rather than generated.
 *
 * Shared between the Lomy hero photo and the Lomy overview-grid card so both
 * render the identical badge.
 */
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
  // Tiered seating: outer rings are the benches, each notched by a stepped aisle.
  const tiers = [
    { r: 47, gap: 7, rot: -14 },
    { r: 42, gap: 9, rot: 24 },
    { r: 37, gap: 8, rot: -62 },
  ]

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
      {/* Fire-pit centre — the solid ground the figure sits on. */}
      <circle cx="50" cy="50" r="33" fill="#DF2935" />

      {/* Bench tiers, each an arc left open at its aisle. */}
      {tiers.map((t) => {
        const circumference = 2 * Math.PI * t.r
        return (
          <circle
            key={t.r}
            cx="50"
            cy="50"
            r={t.r}
            fill="none"
            stroke="#DF2935"
            strokeWidth="3.1"
            strokeLinecap="round"
            strokeDasharray={`${circumference - t.gap} ${t.gap}`}
            transform={`rotate(${t.rot} 50 50)`}
            opacity={0.92}
          />
        )
      })}

      <text x="50" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="700" letterSpacing="-1">
        {amount}
      </text>
      {/* Hairline rule under the figure, echoing the tier lines. */}
      <line x1="37" y1="54.5" x2="63" y2="54.5" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.45" />
      <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="600" opacity="0.92">
        {deadline}
      </text>
    </svg>
  )
}
