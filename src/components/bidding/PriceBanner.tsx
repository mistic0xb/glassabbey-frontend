import type { AuctionDto } from '#/types/api'

interface PriceBannerProps {
  auction: AuctionDto
}

export function PriceBanner({ auction }: PriceBannerProps) {
  const isClosed = auction.status === 'CLOSED'

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-zinc-900 to-zinc-950 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-amber-400/80 font-medium">
            {isClosed ? 'Final Winning Price' : 'Current Highest Bid'}
          </p>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-amber-400">
              {auction.currentPriceSats.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-amber-500/80">SATS</span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isClosed
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isClosed ? 'Auction Closed' : 'Live Auction'}
          </span>
          <p className="mt-2 text-xs text-zinc-400">
            Base: <span className="text-zinc-200">{auction.basePriceSats.toLocaleString()} sats</span>
          </p>
        </div>
      </div>
    </div>
  )
}