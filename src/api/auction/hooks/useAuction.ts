import { useEffect, useState, useCallback, useRef } from 'react'
import type { AuctionDto, BidDto, PendingBidResponse } from '#/types/api'
import { wsService } from '../webSocketService'
import { getLeaderboard } from '#/api/bid'

interface AuctionState {
  currentPriceSats: number
  status: 'OPEN' | 'CLOSED'
  topBidders: BidDto[]
  closedAt?: string | null
}

export function useAuction(initialAuction: AuctionDto) {
  const [auctionState, setAuctionState] = useState<AuctionState>({
    currentPriceSats: initialAuction.currentPriceSats,
    status: initialAuction.status,
    topBidders: initialAuction.bids ?? [],
    closedAt: initialAuction.closedAt,
  })
  const [pendingBid, setPendingBid] = useState<PendingBidResponse | null>(null)
  const [bidError, setBidError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Refetch Leaderboard independently
  const refetchLeaderboard = useCallback(async () => {
    try {
      const bids = await getLeaderboard(initialAuction.id)
      setAuctionState(prev => ({ ...prev, topBidders: bids }))
    } catch (err) {
      console.error('Failed to refetch leaderboard:', err)
    }
  }, [initialAuction.id])

  // Ref to hold stable refetch pointer without triggering useEffect reconnects
  const refetchRef = useRef(refetchLeaderboard)
  useEffect(() => {
    refetchRef.current = refetchLeaderboard
  }, [refetchLeaderboard])

  // Subscribe 
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL
    const pieceId = initialAuction.piece.id

    refetchLeaderboard();

    wsService.connect(wsUrl, () => {
      // Subscribe to public auction room updates
      wsService.subscribe(`/topic/auction/${pieceId}`, (msg: any) => {
        switch (msg.type) {
          case 'PRICE_UPDATE':
            setAuctionState(prev => ({ ...prev, currentPriceSats: msg.currentPrice }))
            refetchRef.current();
            break
          case 'AUCTION_CLOSED':
            setAuctionState(prev => ({ ...prev, status: 'CLOSED' }))
            break
        }
      })

      // Subscribe to user personal queue
      wsService.subscribe('/user/queue/bid', (msg: any) => {
        console.log('personal message received:', msg)
        switch (msg.type) {
          case 'STATE':
            setAuctionState({
              currentPriceSats: msg.currentPrice,
              status: msg.status,
              topBidders: msg.topBidders ?? [],
            })
            break
          case 'BID_ACCEPTED':
            setPendingBid({
              bidId: msg.bidId,
              auctionId: initialAuction.id,
              amountSats: msg.submitAmtSats,
              paymentRequest: msg.paymentRequest,
              expiresAtMs: new Date(msg.expiresAt).getTime(),
            })
            setBidError(null)
            setIsSubmitting(false)
            break

          case 'BID_OUTBID':
            setPendingBid(null)
            setBidError(`You were outbid. Current price is ${msg.currentPrice} sats. Please place a new bid.`)
            setIsSubmitting(false)
            break

          case 'BID_REJECTED':
            setBidError(msg.reason)
            setIsSubmitting(false)
            break
        }
      })
    })

    return () => wsService.disconnect()
  }, [initialAuction.piece.id, initialAuction.id, refetchLeaderboard])

  const submitBid = useCallback((bidderName: string, bidIncrementSats: number) => {
    setIsSubmitting(true)
    setBidError(null)

    try {
      wsService.publish(`/app/auction/${initialAuction.piece.id}/bid`, {
        bidderName,
        bidIncrementSats,
        idempotencyKey: crypto.randomUUID(),
      })
    } catch (err) {
      console.error('Failed to publish bid over WebSocket:', err)
      setBidError('Connection error. Please try again.')
      setIsSubmitting(false)
    }
  }, [initialAuction.piece.id])

  const clearPendingBid = useCallback(() => setPendingBid(null), [])

  const cancelBid = useCallback((bidId: string) => {
    wsService.publish(`/app/auction/${initialAuction.piece.id}/cancel`, {
      bidId,
    })
    setPendingBid(null);
  }, [initialAuction.piece.id]);

  return {
    auction: {
      ...initialAuction,
      currentPriceSats: auctionState.currentPriceSats,
      status: auctionState.status,
      bids: auctionState.topBidders,
    },
    submitBid,
    pendingBid,
    clearPendingBid,
    bidError,
    isSubmitting,
    refetchLeaderboard,
    cancelBid
  }
}