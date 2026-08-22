import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import type { PendingBidResponse } from '#/types/api'

interface PaymentPanelProps {
  pendingBid: PendingBidResponse
  isPaid: boolean
  onCancel: () => void
}

export function PaymentPanel({
  pendingBid,
  isPaid,
  onCancel,
}: PaymentPanelProps) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, Math.floor((pendingBid.expiresAtMs - Date.now()) / 1000)),
  )

  // Auto-dismiss PaymentPanel 2 seconds after payment confirmation
  useEffect(() => {
    if (isPaid) {
      const timeout = setTimeout(() => {
        onCancel()
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isPaid, onCancel])

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.max(
        0,
        Math.floor((pendingBid.expiresAtMs - Date.now()) / 1000),
      )
      setTimeLeft(seconds)
      if (seconds === 0) clearInterval(timer)
    }, 1000)

    return () => clearInterval(timer)
  }, [pendingBid.expiresAtMs])

  const copyInvoice = () => {
    navigator.clipboard.writeText(pendingBid.paymentRequest)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isPaid) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center text-emerald-400">
        <h3 className="text-xl font-bold">Payment Confirmed!</h3>
        <p className="mt-1 text-sm text-emerald-300">
          Your bid of {pendingBid.amountSats.toLocaleString()} SATS is active.
        </p>
      </div>
    )
  }

  if (timeLeft === 0) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
        <h3 className="text-lg font-bold">Invoice Expired</h3>
        <p className="mt-1 text-sm text-zinc-400">
          This payment request timed out. Please submit a new bid.
        </p>
        <button
          onClick={onCancel}
          className="mt-4 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition"
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 text-center">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Pay Lightning Invoice
        </span>
        <span className="text-xs font-mono font-medium text-zinc-400">
          Expires in: <span className="text-white font-bold">{timeLeft}s</span>
        </span>
      </div>

      {/* Client-side SVG QR Code - Scaled up for easy scanning */}
      <div className="mx-auto flex justify-center rounded-2xl bg-white p-4 shadow-xl max-w-70">
        <QRCode
          value={pendingBid.paymentRequest.toLowerCase()}
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          viewBox="0 0 256 256"
        />
      </div>

      <div className="space-y-2.5">
        <button
          onClick={copyInvoice}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
        >
          {copied ? 'Copied to Clipboard!' : 'Copy Lightning Invoice'}
        </button>

        <a
          href={`lightning:${pendingBid.paymentRequest}`}
          className="block w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 transition"
        >
          Open Lightning Wallet
        </a>

        <button
          onClick={onCancel}
          className="w-full text-xs text-red-500/80 hover:text-red-400 pt-1 transition"
        >
          Cancel Bid
        </button>
      </div>
    </div>
  )
}
