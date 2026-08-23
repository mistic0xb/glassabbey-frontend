import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useCreatorGalleries,
  usePublishGallery,
  useCloseGallery,
} from '#/queries/galleryQueries'
import { Plus, Loader2, ImageOff, Wallet } from 'lucide-react'
import { CreatorStats } from '#/components/dashboard/CreatorStats'
import { GalleryCard } from '#/components/dashboard/GalleryCard'

export const Route = createFileRoute('/creator/_auth/dashboard')({
  component: CreatorDashboard,
})

function CreatorDashboard() {
  const { data: galleries = [], isLoading, isError } = useCreatorGalleries()
  const publishMutation = usePublishGallery()
  const closeMutation = useCloseGallery()

  const [activeTab, setActiveTab] = useState<
    'ALL' | 'PUBLISHED' | 'DRAFT' | 'CLOSED'
  >('ALL')

  const filteredGalleries = galleries.filter((g) => {
    if (activeTab === 'ALL') return true
    return g.status === activeTab
  })

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Creator Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your art collections, monitor auctions, and release new
              pieces.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/creator/gallery/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              Create New Gallery
            </Link>
            <Link
              to="/creator/nwc"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Wallet className="h-4 w-4" />
              Manage NWC
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <CreatorStats galleries={galleries} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
          {(['ALL', 'PUBLISHED', 'DRAFT', 'CLOSED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-secondary text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'ALL'
                ? 'All Collections'
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <p className="text-sm text-destructive">
              Failed to load galleries. Please try refreshing.
            </p>
          </div>
        ) : filteredGalleries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <div className="rounded-full bg-secondary/50 p-4 mb-4 text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold">No collections found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {activeTab === 'ALL'
                ? "You haven't created any art galleries yet."
                : `No galleries with status "${activeTab}".`}
            </p>
            {activeTab === 'ALL' && (
              <Link
                to="/creator/gallery/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Build your first collection
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                onPublish={(id) => publishMutation.mutate(id)}
                onClose={(id) => closeMutation.mutate(id)}
                isActionPending={
                  publishMutation.isPending || closeMutation.isPending
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}