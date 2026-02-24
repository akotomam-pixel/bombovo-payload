'use client'

interface Props {
  headline: string
  yesLabel: string
  noLabel: string
  onYes: () => void
  onNo: () => void
}

export default function StepYesNo({ headline, yesLabel, noLabel, onYes, onNo }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-bombovo-dark text-center leading-tight">
        <span className="relative inline-block text-bombovo-dark">
          {headline}
          <svg
            className="absolute left-0 -bottom-2 w-full"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            style={{ height: '10px' }}
          >
            <path
              d="M 0 8 Q 25 2, 50 6 T 100 6 T 150 6 T 200 8"
              stroke="#DF2935"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h2>
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
