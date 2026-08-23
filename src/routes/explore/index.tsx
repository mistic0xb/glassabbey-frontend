import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { usePublishedGalleries, publishedGalleriesQueryOptions } from '#/queries/galleryQueries'
import { ExploreGalleryCard } from '#/components/explore/ExploreGalleryCard'
import { Search, Sparkles, Loader2, ImageOff } from 'lucide-react'

export const Route = createFileRoute('/explore/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(publishedGalleriesQueryOptions()),
  component: Explore,
})

function Explore() {
  const { data: galleries = [], isLoading, isError } = usePublishedGalleries()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter only published galleries (safety check) & matching search query
  const filteredGalleries = galleries.filter((g) => {
    const matchesStatus = g.status === 'PUBLISHED'
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Hero Banner */}
      <section className="border-b border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Live Digital Art Exhibitions
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Explore Collections & Auctions
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
            Discover curated galleries, bid on unique pieces, and support independent creators via Bitcoin Lightning.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by collection title, artist, or keyword..."
              className="w-full rounded-xl border border-input bg-background/80 pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Active Galleries</h2>
          <span className="text-xs text-muted-foreground font-medium">
            Showing {filteredGalleries.length} collections
          </span>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">
              Failed to load galleries. Please try refreshing the page.
            </p>
          </div>
        ) : filteredGalleries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <div className="rounded-full bg-secondary/50 p-4 mb-4 text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">No active collections found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {searchQuery
                ? `No results matching "${searchQuery}". Try a different keyword.`
                : 'There are currently no published galleries live right now.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => (
              <ExploreGalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}