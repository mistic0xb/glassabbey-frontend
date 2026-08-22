import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { auctionByPieceQueryOptions } from '#/queries/auctionQueries'
import { ArrowLeft, Loader2, AlertTriangle, Gavel } from 'lucide-react'
import { BiddingPage } from '#/components/bidding/BiddingPage'

export const Route = createFileRoute('/auction/$pieceId')({
  component: AuctionPiecePage,
})

function AuctionPiecePage() {
  const { pieceId } = Route.useParams()

  const {
    data: auction,
    isLoading,
    isError,
    error,
  } = useQuery(auctionByPieceQueryOptions(pieceId))

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Loading Auction...
        </p>
      </div>
    )
  }

  if (isError || !auction) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-foreground">
        <div className="rounded-full bg-destructive/10 p-4 border border-destructive/20 mb-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Auction Not Found</h2>
        <p className="mt-2 text-center text-xs text-muted-foreground max-w-sm">
          {error?.message || 'The auction for this piece could not be found or has not been created yet.'}
        </p>
        <Link
          to="/explore"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2 text-xs font-semibold hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Explore
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
          <Link
            to={auction.gallery?.id ? '/explore/$galleryId' : '/explore'}
            params={auction.gallery?.id ? { galleryId: auction.gallery.id } : undefined}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {auction.gallery?.title ? `Back to ${auction.gallery.title}` : 'Back to Explore'}
          </Link>

          <div className="flex items-center gap-2 text-xs text-primary font-semibold bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
            <Gavel className="h-3.5 w-3.5" />
            <span>Live Lightning Auction</span>
          </div>
        </div>

        <BiddingPage initialAuction={auction} />
      </div>
    </div>
  )
}