import { createFileRoute, Link } from '@tanstack/react-router'
import { useGalleryDetail } from '#/queries/galleryQueries'
import { useGalleryPieces } from '#/queries/piecesQueries'
import { PieceCard } from '#/components/PieceCard'
import {
  ArrowLeft,
  Loader2,
  Layers,
  AlertTriangle,
  User,
  Calendar,
} from 'lucide-react'
import formatDate from '#/lib/formatDate'
import { CountdownTimer } from '#/components/explore/CountDownTimer'

export const Route = createFileRoute('/explore/$galleryId')({
  component: ExploreGalleryDetailPage,
})

function ExploreGalleryDetailPage() {
  const { galleryId } = Route.useParams()

  const {
    data: gallery,
    isLoading: isGalleryLoading,
    isError: isGalleryError,
  } = useGalleryDetail(galleryId)

  const {
    data: pieces = [],
    isLoading: isPiecesLoading,
  } = useGalleryPieces(galleryId)

  if (isGalleryLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isGalleryError || !gallery) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <AlertTriangle className="h-10 w-10 text-destructive mb-3" />
        <h2 className="text-lg font-bold">Gallery not found</h2>
        <Link
          to="/explore"
          className="mt-4 text-xs font-semibold text-primary hover:underline"
        >
          Return to Explore
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        {/* Gallery Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 mb-8 backdrop-blur-sm shadow-sm">
          {/* Cover Image Background Banner */}
          {gallery.coverImageUrl ? (
            <div className="absolute inset-0 z-0">
              <img
                src={gallery.coverImageUrl}
                alt={gallery.title}
                className="h-full w-full object-cover object-center opacity-25 filter blur-xs scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-card via-card/95 to-card/70" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-linear-to-r from-card via-card/90 to-card/60" />
          )}

          {/* Banner Content */}
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between p-6 sm:p-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary uppercase">
                  {gallery.status}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">
                    {gallery.creatorName}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  {pieces.length} {pieces.length === 1 ? 'Piece' : 'Pieces'}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {gallery.title}
              </h1>

              <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                {gallery.description || 'No description provided.'}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                <Calendar className="h-3.5 w-3.5" />
                <span>Published {formatDate(gallery.publishedAt || gallery.createdAt)}</span>
              </div>
            </div>

            {/* Timer Badge Container */}
            {gallery.endAt && gallery.status === 'PUBLISHED' && (
              <div className="flex flex-col items-start md:items-end gap-1 border-t border-border/60 pt-4 md:border-t-0 md:pt-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Time Remaining
                </span>
                <div className="rounded-xl border border-white/10 bg-black/60 p-1.5 shadow-lg backdrop-blur-md">
                  <CountdownTimer targetDate={gallery.endAt} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Art Pieces Section */}
        <div className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">
              Collection ({pieces.length})
            </h2>
          </div>

          {isPiecesLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : pieces.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <Layers className="h-10 w-10 text-muted-foreground mb-3 opacity-60" />
              <p className="text-base font-semibold">
                No pieces available in this gallery
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                The artist hasn't added any artwork to this collection yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  piece={{
                    id: piece.id,
                    title: piece.title,
                    description: piece.description,
                    artistName: piece.artistName,
                    artistProfile: piece.artistProfile,
                    medium: piece.medium,
                    dimensions: piece.dimensions,
                    imgUrl: piece.imgUrl,
                    basePriceSats: piece.basePriceSats,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}