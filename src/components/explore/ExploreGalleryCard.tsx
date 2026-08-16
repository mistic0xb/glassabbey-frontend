import { Link } from '@tanstack/react-router'
import { User, Layers, ArrowUpRight, ImageIcon } from 'lucide-react'
import type { GalleryDto } from '#/types/api'
import { CountdownTimer } from './CountDownTimer'

interface ExploreGalleryCardProps {
  gallery: GalleryDto & { previewImages?: string[] }
}

export function ExploreGalleryCard({ gallery }: ExploreGalleryCardProps) {
  const images = gallery.previewImages || []
  const displayCover = gallery.coverImageUrl

  return (
    <Link to="/explore/$galleryId" params={{ galleryId: gallery.id }}>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
        {/* Visual Cover / Collage Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {displayCover ? (
            <img
              src={displayCover}
              alt={gallery.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : images.length === 1 ? (
            <img
              src={images[0]}
              alt={gallery.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : images.length === 2 ? (
            <div className="grid h-full w-full grid-cols-2 gap-0.5">
              <img
                src={images[0]}
                alt=""
                className="h-full w-full object-cover"
              />
              <img
                src={images[1]}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : images.length >= 3 ? (
            <div className="grid h-full w-full grid-cols-3 gap-0.5">
              <img
                src={images[0]}
                alt=""
                className="col-span-2 h-full w-full object-cover"
              />
              <div className="grid h-full grid-rows-2 gap-0.5">
                <img
                  src={images[1]}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <img
                  src={images[2]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary/40 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-40" />
            </div>
          )}

          <div className="absolute top-2 right-2 z-10 rounded-lg border border-white/10 bg-black/50 p-1 shadow-lg backdrop-blur-md">
            <CountdownTimer targetDate={gallery.endAt} />
          </div>

          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-black/20" />
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <User className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{gallery.creatorName}</span>
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {gallery.title}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {gallery.description}
            </p>
          </div>

          {/* Card Footer */}
          <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              <span>
                {gallery.pieceCount}{' '}
                {gallery.pieceCount === 1 ? 'Piece' : 'Pieces'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">
              Explore
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
