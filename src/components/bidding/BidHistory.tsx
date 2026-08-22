import type { BidDto } from '#/types/api'

interface BidHistoryProps {
  bids: BidDto[]
}

export function BidHistory({ bids }: BidHistoryProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
        Live Bid Leaderboard
      </h3>

      {bids.length === 0 ? (
        <p className="text-center text-sm text-zinc-500 py-4">No bids placed yet.</p>
      ) : (
        <div className="space-y-2">
          {bids.map((bid, index) => (
            <div
              key={bid.id}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 border ${
                index === 0
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`text-xs font-bold ${
                    index === 0 ? 'text-amber-400' : 'text-zinc-500'
                  }`}
                >
                  #{index + 1}
                </span>
                <span className="text-sm font-medium">
                  {bid.bidderName || `${bid.pubkey.slice(0, 8)}...`}
                </span>
              </div>
              <span className="text-sm font-mono font-bold">
                {bid.willingAmtSats} sats
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}