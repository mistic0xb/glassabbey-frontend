import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useGalleryDetail,
  usePublishGallery,
  useCloseGallery,
} from '#/queries/galleryQueries'
import { PieceCard } from '#/components/PieceCard'
import {
  ArrowLeft,
  Loader2,
  Layers,
  CheckCircle,
  Plus,
  AlertTriangle,
  Trash2,
  Pencil,
  Calendar,
} from 'lucide-react'
import { useDeletePiece, useGalleryPieces } from '#/queries/piecesQueries'
import { PieceModal } from '#/components/dashboard/PieceModal'
import type { PieceResponse } from '#/types/api'
import formatDate from '#/lib/formatDate'

export const Route = createFileRoute('/creator/_auth/gallery/$galleryId')({
  component: GalleryDetailPage,
})

function GalleryDetailPage() {
  const { galleryId } = Route.useParams()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedPiece, setSelectedPiece] = useState<PieceResponse | null>(null)

  const {
    data: gallery,
    isLoading: isGalleryLoading,
    isError: isGalleryError,
  } = useGalleryDetail(galleryId)
  const { data: pieces = [], isLoading: isPiecesLoading } =
    useGalleryPieces(galleryId)

  const publishMutation = usePublishGallery()
  const closeMutation = useCloseGallery()
  const deletePieceMutation = useDeletePiece(galleryId)

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setSelectedPiece(null)
  }

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
          to="/creator/dashboard"
          className="mt-4 text-xs font-semibold text-primary"
        >
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/creator/dashboard"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Gallery Action Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-xl border border-border bg-card/80 p-6 mb-8 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary uppercase">
                {gallery.status}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {pieces.length} Pieces
              </span>
            </div>
            <h1 className="text-3xl font-extrabold">{gallery.title}</h1>
            <p className="text-xm text-muted-foreground mt-1 max-w-2xl">
              {gallery.description || 'No description added yet.'}
            </p>

            <div className="flex items-center gap-1.5 text-xm text-muted-foreground mt-4">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {gallery.status === 'PUBLISHED'
                  ? `Ends: ${formatDate(gallery.endAt)}`
                  : gallery.status === 'DRAFT'
                    ? `Created: ${formatDate(gallery.createdAt)}`
                    : `Ended: ${formatDate(gallery.endAt || gallery.updatedAt)}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-border/60 pt-4 md:border-t-0 md:pt-0">
            {gallery.status === 'DRAFT' && (
              <button
                onClick={() => publishMutation.mutate(gallery.id)}
                disabled={publishMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-bid px-4 py-2.5 text-xs font-semibold text-bid-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-md"
              >
                {publishMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Publish Collection
              </button>
            )}

            {gallery.status === 'PUBLISHED' && (
              <button
                onClick={() => closeMutation.mutate(gallery.id)}
                disabled={closeMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {closeMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Close Gallery
              </button>
            )}
          </div>
        </div>

        {/* Art Pieces Section */}
        <div className="rounded-xl border border-border bg-card/40 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Art Pieces ({pieces.length})</h2>
            {gallery.status === 'DRAFT' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Piece
              </button>
            )}
          </div>

          {isPiecesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pieces.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
              <Layers className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-semibold">
                No pieces added to this gallery
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload artwork via Blossom or URL and set piece details.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pieces.map((piece) => (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  actions={
                    gallery.status === 'DRAFT' && (
                      <div className="flex items-center gap-1.5">
                        {/* Edit btn  */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPiece(piece)
                            setIsAddModalOpen(true)
                          }}
                          className="rounded-md bg-background/80 p-1.5 text-foreground hover:bg-accent backdrop-blur-md transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete btn */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePieceMutation.mutate(piece.id)
                          }}
                          className="rounded-md bg-background/80 p-1.5 text-destructive hover:bg-destructive hover:text-white backdrop-blur-md transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Piece Modal (Create/Edit) */}
      <PieceModal
        galleryId={galleryId}
        pieceToEdit={selectedPiece}
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
