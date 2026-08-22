import { useEffect, useState, useCallback, useRef } from 'react'
import client from '#/api/client'
import type { PendingBidResponse } from '#/types/api'

const STORAGE_KEY = 'glassabbey_pending_bid'

export function usePendingBid(auctionId: string) {
  const [pendingBid, setPendingBid] = useState<PendingBidResponse | null>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${auctionId}`)
    if (!stored) return null
    try {
      const parsed: PendingBidResponse = JSON.parse(stored)
      if (Date.now() > parsed.expiresAtMs) {
        localStorage.removeItem(`${STORAGE_KEY}_${auctionId}`)
        return null
      }
      return parsed
    } catch {
      return null
    }
  })

  const [isPaid, setIsPaid] = useState(false)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearPendingBid = useCallback(() => {
    localStorage.removeItem(`${STORAGE_KEY}_${auctionId}`)
    setPendingBid(null)
    setIsPaid(false)
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
  }, [auctionId])

  const savePendingBid = useCallback(
    (bidData: PendingBidResponse) => {
      localStorage.setItem(`${STORAGE_KEY}_${auctionId}`, JSON.stringify(bidData))
      setPendingBid(bidData)
      setIsPaid(false)
    },
    [auctionId]
  )

  const checkPaymentStatus = useCallback(async () => {
    if (!pendingBid) return

    try {
      const { data } = await client.get<{ paid: boolean }>(
        `/auction/${pendingBid.auctionId}/bid/check/${pendingBid.bidId}`
      )
      if (data.paid) {
        setIsPaid(true)
        setTimeout(() => clearPendingBid(), 3000)
      }
    } catch (err) {
      console.error('Error checking bid status:', err)
    }
  }, [pendingBid, clearPendingBid])

  // Poll invoice status & handle browser tab focus recovery
  useEffect(() => {
    if (!pendingBid || isPaid) return

    checkPaymentStatus()
    pollIntervalRef.current = setInterval(checkPaymentStatus, 3000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkPaymentStatus()
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pendingBid, isPaid, checkPaymentStatus])

  return { pendingBid, isPaid, savePendingBid, clearPendingBid }
}