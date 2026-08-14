import { ErrorComponent } from '#/components/layout/ErrorComponent'
import { FeaturedAuctions } from '#/components/home/FeaturedAuctions'
import { HeroSection } from '#/components/home/HeroSection'
import { featuredPiecesQueryOptions } from '#/queries/piecesQueries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: ({ context: { queryClient } }) => {
    const pieces = queryClient.ensureQueryData(featuredPiecesQueryOptions)
    return pieces
  },
  errorComponent: ErrorComponent,
  component: Home,
})

function Home() {
  const featuredPieces = Route.useLoaderData()
  return (
    <main className="h-svh w-full flex flex-col justify-between overflow-hidden bg-background text-foreground">
      <HeroSection />
      <FeaturedAuctions pieces={featuredPieces} />
    </main>
  )
}
