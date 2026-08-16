import formatDate from '#/lib/formatDate'
import type { GalleryDto } from '#/types/api'
import { Link } from '@tanstack/react-router'
import { Calendar, Layers, ArrowUpRight, Loader2, ImageIcon } from 'lucide-react'

interface GalleryCardProps {
  gallery: GalleryDto
  onPublish?: (id: string) => void
  onClose?: (id: string) => void
  isActionPending?: boolean
}

export function GalleryCard({
  gallery,
  onPublish,
  onClose,
  isActionPending,
}: GalleryCardProps) {
  const statusStyles = {
    DRAFT: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    PUBLISHED: 'bg-bid/10 text-bid border-bid/30',
    CLOSED: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card/80 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Cover Image Header */}
      <div className="relative h-36 w-full overflow-hidden bg-muted">
        {gallery.coverImageUrl ? (
          <img
            src={gallery.coverImageUrl}
            alt={gallery.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-card/80 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 pt-3">
        <div>
          {/* Card Header & Status */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                statusStyles[gallery.status]
              }`}
            >
              {gallery.status === 'PUBLISHED' && (
                <span className="h-1.5 w-1.5 rounded-full bg-bid animate-pulse" />
              )}
              {gallery.status}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              {gallery.pieceCount || 0} Pieces
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {gallery.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 min-h-8">
            {gallery.description || 'No description provided.'}
          </p>
        </div>

        {/* Date & Actions Footer */}
        <div className="mt-6 pt-4 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {gallery.status === 'PUBLISHED'
                ? `Ends: ${formatDate(gallery.endAt)}`
                : gallery.status === 'DRAFT'
                  ? `Created: ${formatDate(gallery.createdAt)}`
                  : `Ended: ${formatDate(gallery.endAt || gallery.updatedAt)}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/creator/gallery/$galleryId"
              params={{ galleryId: gallery.id }}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Manage
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            {gallery.status === 'DRAFT' && onPublish && (
              <button
                onClick={() => onPublish(gallery.id)}
                disabled={isActionPending}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-bid px-3 py-2 text-xs font-semibold text-bid-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {isActionPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  'Publish'
                )}
              </button>
            )}

            {gallery.status === 'PUBLISHED' && onClose && (
              <button
                onClick={() => onClose(gallery.id)}
                disabled={isActionPending}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isActionPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  'Close'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}