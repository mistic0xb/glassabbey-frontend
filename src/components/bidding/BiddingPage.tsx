import { useEffect } from 'react'
import type { AuctionDto } from '#/types/api'
import { ArtworkCard } from './ArtworkCard'
import { BidForm } from './BidForm'
import { BidHistory } from './BidHistory'
import { PaymentPanel } from './PaymentPanel'
import { PriceBanner } from './PriceBanner'
import { useAuction } from '#/api/auction/hooks/useAuction'
import { usePendingBid } from '#/api/auction/hooks/usePending'

interface BiddingPageProps {
  initialAuction: AuctionDto
}

export function BiddingPage({ initialAuction }: BiddingPageProps) {
  const {
    auction,
    submitBid,
    pendingBid,
    clearPendingBid,
    cancelBid,
    bidError,
    isSubmitting,
    refetchLeaderboard,
  } = useAuction(initialAuction)

  const {
    isPaid,
    savePendingBid,
    clearPendingBid: removeStoredBid,
  } = usePendingBid(auction.id)

  // FIX: wire BID_ACCEPTED from WebSocket → savePendingBid → shows PaymentPanel
  useEffect(() => {
    if (pendingBid) {
      savePendingBid(pendingBid)
    }
  }, [pendingBid])

  // Refetch Leaderboard
  useEffect(() => {
    if (isPaid) {
      refetchLeaderboard()
    }
  }, [isPaid, refetchLeaderboard])

  const handleCancelPayment = () => {
    if (pendingBid) {
      cancelBid(pendingBid.bidId)
    }
    clearPendingBid()
    removeStoredBid()
  }

  const activePendingBid = pendingBid

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <ArtworkCard
            piece={auction.piece}
            galleryTitle={auction.gallery?.title}
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <PriceBanner auction={auction} />

          {/* FIX 2: Render WebSocket bid submission error alert */}
          {bidError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 font-medium">
              {bidError}
            </div>
          )}

          {activePendingBid ? (
            <PaymentPanel
              pendingBid={pendingBid}
              isPaid={isPaid}
              onCancel={handleCancelPayment}
            />
          ) : (
            // FIX: pass submitBid (STOMP) instead of HTTP post
            <BidForm
              auction={auction}
              onSubmitBid={submitBid}
              isSubmitting={isSubmitting}
            />
          )}

          <BidHistory bids={auction.bids} />
        </div>
      </div>
    </div>
  )
}
