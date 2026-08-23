import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Wallet, Loader2, ArrowLeft } from 'lucide-react'
import client from '#/api/client'

export const Route = createFileRoute('/creator/_auth/nwc')({
  component: NwcPage,
})

function NwcPage() {
  const navigate = useNavigate()
  const [walletName, setWalletName] = useState('')
  const [nwcString, setNwcString] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await client.post('/nwc/register', { walletName, nwcString, isPrimary })
      navigate({ to: '/creator/dashboard' })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save NWC string.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg space-y-6">
        <button
          onClick={() => navigate({ to: '/creator/dashboard' })}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Wallet className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Add NWC Wallet</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Wallet Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alby, Mutiny, Umbrel"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                NWC String
              </label>
              <textarea
                required
                rows={3}
                placeholder="nostr+walletconnect://..."
                value={nwcString}
                onChange={(e) => setNwcString(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 font-mono text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPrimary"
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded-xs border-border bg-secondary/30 text-primary focus:ring-primary/50"
              />
              <label
                htmlFor="isPrimary"
                className="text-xs font-medium text-muted-foreground cursor-pointer"
              >
                Set as primary wallet
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {isSubmitting ? 'Saving...' : 'Save NWC Wallet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
