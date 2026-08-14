import { BackgroundBeams } from '@/components/ui/background-beams'
import { Link } from '@tanstack/react-router'

export function HeroSection() {
  return (
    <div className="relative flex flex-1 w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background antialiased">
      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-3xl p-4 text-center">
        {/* Live Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-bid/30 bg-bid/10 px-3 py-1 text-xs text-bid backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-bid animate-pulse" />
          Live Real-Time Bidding
        </div>

        {/* Hero Title */}
        <h1 className="bg-linear-to-b from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Glass Abbey
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto my-4 max-w-lg text-center text-sm text-muted-foreground md:text-base">
          Join high-stakes auctions for fine art, luxury items, and exclusive
          digital assets. Powered by lightning settlement.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/explore">
            <button className="cursor-pointer rounded-lg bg-bid px-6 py-3 font-medium text-bid-foreground shadow-lg transition-all hover:opacity-90">
              Explore Auctions
            </button>
          </Link>
        </div>
      </div>

      {/* Background Beams */}
      <BackgroundBeams />
    </div>
  )
}
