import { ExternalLink, Tag } from 'lucide-react'

export type PieceData = {
  id: string
  title: string
  description?: string
  artistName: string
  artistProfile?: string
  medium?: string
  dimensions?: string
  imgUrl?: string
  basePriceSats: number
}

interface PieceCardProps {
  piece: PieceData
  actions?: React.ReactNode
  onClick?: () => void
}

export function PieceCard({ piece, actions, onClick }: PieceCardProps) {
  const formattedPrice = new Intl.NumberFormat().format(piece.basePriceSats)

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/60 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-xl hover:-translate-y-1"
    >
      {/* Aspect Ratio Container for Media */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted/40">
        {piece.imgUrl ? (
          <img
            src={piece.imgUrl}
            alt={piece.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground/60">
            No image media
          </div>
        )}

        {/* Medium Overlay Badge */}
        {piece.medium && (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-foreground backdrop-blur-md border border-border/40 uppercase">
            {piece.medium}
          </span>
        )}

        {/* Action Buttons Overlay (Delete / Edit) */}
        {actions && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-90 transition-opacity">
            {actions}
          </div>
        )}
      </div>

      {/* Body Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            {piece.artistProfile ? (
              <a
                href={piece.artistProfile}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                {piece.artistName}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="font-semibold text-foreground/80">
                {piece.artistName}
              </span>
            )}

            {piece.dimensions && (
              <span className="text-[10px] text-muted-foreground/70">
                {piece.dimensions}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {piece.title}
          </h3>
          {piece.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {piece.description}
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Starting Price
          </span>
          <div className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-bold text-foreground">
            <Tag className="h-3 w-3 text-primary" />
            <span>{formattedPrice}</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              SATS
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
