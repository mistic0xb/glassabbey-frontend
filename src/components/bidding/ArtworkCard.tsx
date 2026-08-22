import { ExternalLink, Tag } from 'lucide-react'
import type { PieceDto } from '#/types/api'

interface ArtworkCardProps {
  piece?: PieceDto
  galleryTitle?: string
}

export function ArtworkCard({ piece, galleryTitle }: ArtworkCardProps) {
  if (!piece) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center text-zinc-400">
        Artwork details unavailable.
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat().format(piece.basePriceSats)

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl">
      {/* High-Impact Artwork Media Frame */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-950">
        {piece.imgUrl ? (
          <img
            src={piece.imgUrl}
            alt={piece.title}
            className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-zinc-500">
            No image media available
          </div>
        )}

        {/* Optional Badges */}
        {galleryTitle && (
          <span className="absolute top-3 left-3 rounded-md bg-zinc-950/80 px-2.5 py-1 text-xs font-semibold text-zinc-200 backdrop-blur-md border border-zinc-800">
            {galleryTitle}
          </span>
        )}

        {piece.medium && (
          <span className="absolute top-3 right-3 rounded-md bg-zinc-950/80 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-zinc-200 backdrop-blur-md border border-zinc-800 uppercase">
            {piece.medium}
          </span>
        )}
      </div>

      {/* Complete Piece Metadata */}
      <div className="p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            {piece.artistProfile ? (
              <a
                href={piece.artistProfile}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
              >
                {piece.artistName}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="font-semibold text-zinc-300">
                {piece.artistName || 'Unknown Artist'}
              </span>
            )}

            {piece.dimensions && (
              <span className="text-xs text-zinc-500">{piece.dimensions}</span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            {piece.title}
          </h1>

          {piece.description && (
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {piece.description}
            </p>
          )}
        </div>

        {/* Base Starting Price Display */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Base Starting Price
          </span>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200">
            <Tag className="h-3.5 w-3.5 text-emerald-400" />
            <span>{formattedPrice}</span>
            <span className="text-[10px] text-zinc-400 font-normal">SATS</span>
          </div>
        </div>
      </div>
    </div>
  )
}