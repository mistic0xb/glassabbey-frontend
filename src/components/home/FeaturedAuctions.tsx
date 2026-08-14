import { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

interface FeaturedAuctionsProps {
  pieces?: Piece[]
}

export function FeaturedAuctions({ pieces = [] }: FeaturedAuctionsProps) {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true }),
  )

  if (!pieces.length) return null

  return (
    <section className="py-10 bg-background border-b border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Featured Auction Pieces
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {pieces.map((piece) => (
              <CarouselItem
                key={piece.id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                {/* Link the cards for auction */}
                <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/50">
                  {/* Image Container */}
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-secondary">
                    <img
                      src={piece.imgUrl}
                      loading="lazy"
                      alt={piece.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded-full border border-bid/30 bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-bid backdrop-blur-md">
                      Live
                    </div>
                  </div>

                  {/* Piece Details */}
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                      {piece.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {piece.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Starting
                    </span>
                    <span className="text-xs font-bold text-bid">
                      {Number(piece.basePriceSats).toLocaleString()} Sats
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
