export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-bombovo-blue/20 border-t-bombovo-blue animate-spin" />
      </div>
    </div>
  )
}
