import { useState } from 'react'
import type { AuctionDto } from '#/types/api'

interface BidFormProps {
  auction: AuctionDto
  onSubmitBid: (bidderName: string, bidIncrementSats: number) => void
  isSubmitting: boolean
}

const BID_PRESETS = [10, 5000, 10000, 25000]

export function BidForm({ auction, onSubmitBid, isSubmitting }: BidFormProps) {
  const [bidIncrement, setBidIncrement] = useState<number>(1000)
  const [bidderName, setBidderName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const willingAmt = auction.currentPriceSats + bidIncrement

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!bidderName.trim()) {
      setError('Please enter a display name')
      return
    }

    if (bidIncrement <= 0) {
      setError('Bid increment must be positive')
      return
    }

    onSubmitBid(bidderName.trim(), bidIncrement)
  }

  if (auction.status === 'CLOSED') {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-zinc-400">
        Bidding is closed for this piece.
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 p-5 bg-zinc-900 ${
        isSubmitting
          ? 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
          : 'border-zinc-800'
      }`}
    >
      {/* Overlay displayed while processing STOMP message */}
      {isSubmitting && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-zinc-950/80 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="mt-3 text-xs font-semibold tracking-wider text-amber-400 animate-pulse">
            GENERATING LIGHTNING INVOICE...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Bid Increment
          </label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {BID_PRESETS.map((inc) => (
              <button
                key={inc}
                type="button"
                disabled={isSubmitting}
                onClick={() => setBidIncrement(inc)}
                className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                  bidIncrement === inc
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-700'
                }`}
              >
                +{inc >= 1000 ? `${inc / 1000}k` : inc}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Your bid: {willingAmt.toLocaleString()} sats
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Display Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            disabled={isSubmitting}
            value={bidderName}
            onChange={(e) => setBidderName(e.target.value)}
            placeholder="Your name"
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-amber-500 focus:outline-none disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-zinc-500">
            +{auction.submissionFeeSats} sats non-refundable submission fee
          </p>
        </div>

        {error && <p className="text-xs font-medium text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !bidderName.trim() || bidIncrement <= 0}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-zinc-950 hover:bg-amber-400 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Processing Bid...' : 'Place Bid'}
        </button>
      </form>
    </div>
  )
}
