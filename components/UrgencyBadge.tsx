/**
 * The urgency badge — a solid pill, not a seal.
 *
 * First attempt reused DiscountSeal's scalloped red-circle shape for this too,
 * placed in the opposite corner. Result: two red starbursts that read as one
 * repeated shape rather than two different messages, and the curved text set
 * inside a small stamp was too cramped to read at a glance. This is
 * deliberately a different shape (a straight pill, not a circle), a different
 * tone (near-black, not the same red as the discount seal — red is reserved
 * for the small pulsing dot, the one urgent accent), and it sits at the
 * bottom of the photo rather than mirroring the seal's corner, so the two
 * badges never compete for the same read.
 */
export default function UrgencyBadge({
  count,
  words,
  className = '',
}: {
  count: number
  words: { top: string; bottom: string }
  className?: string
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-[#080708]/85 py-2 pl-2.5 pr-3.5 shadow-[0_4px_16px_-4px_rgba(8,7,8,0.5)] backdrop-blur-[2px] ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-bombovo-red opacity-80" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-bombovo-red" />
      </span>
      <span className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.03em] text-white">
        {words.top} {count} {words.bottom}
      </span>
    </div>
  )
}
