'use client'

import type { ReactNode } from 'react'

interface Props {
  headline: string
  subHeadline: string
  yesLabel: string
  noLabel: string
  onYes: () => void
  onNo: () => void
}

// Highlights any "<number> €" amount inside a headline line as a red badge.
function renderLineWithAmount(line: string, keyPrefix: string): ReactNode[] {
  const amountRegex = /(\d+\s?€)/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = amountRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index))
    }
    nodes.push(
      <span
        key={`${keyPrefix}-amount-${i}`}
        className="inline-block px-2 py-0.5 mx-1 rounded-md bg-bombovo-red text-white"
      >
        {match[0]}
      </span>,
    )
    lastIndex = match.index + match[0].length
    i += 1
  }
  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex))
  }
  return nodes
}

export default function StepYesNo({ headline, subHeadline, yesLabel, noLabel, onYes, onNo }: Props) {
  // "|" in the CMS headline text is a manual line-break marker.
  const lines = headline.split('|').map((l) => l.trim())

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark text-center leading-tight">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {renderLineWithAmount(line, `line-${i}`)}
            </span>
          ))}
        </h2>
        <p className="text-bombovo-dark/60 font-medium text-base text-center">{subHeadline}</p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={onYes}
          className="w-full py-4 px-6 bg-bombovo-yellow border-2 border-bombovo-dark text-bombovo-dark font-bold text-lg rounded-xl hover:brightness-95 transition-all duration-150"
        >
          {yesLabel}
        </button>
        <button
          onClick={onNo}
          className="w-full py-4 px-6 bg-white border-2 border-bombovo-dark text-bombovo-dark font-normal text-base rounded-xl hover:bg-bombovo-gray transition-all duration-150"
        >
          {noLabel}
        </button>
      </div>
    </div>
  )
}
