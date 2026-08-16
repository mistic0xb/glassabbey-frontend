import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useCreateGallery } from '#/queries/galleryQueries'

import {
  ArrowLeft,
  CalendarIcon,
  Loader2,
  Upload,
  X,
  Link2,
} from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { uploadToBlossom } from '#/lib/nostr/blossom'

export const Route = createFileRoute('/creator/_auth/gallery/new')({
  component: NewGalleryPage,
})

function NewGalleryPage() {
  const navigate = useNavigate()
  const createMutation = useCreateGallery()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endAt, setEndAt] = useState<Date | undefined>()

  // Cover image states
  const [coverImageUrl, setCoverImageUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // State to switch between Blossom file upload and direct Image URL input
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload')

  // Handler for uploading files via Blossom protocol
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      const uploadedUrl = await uploadToBlossom(file)
      setCoverImageUrl(uploadedUrl)
    } catch (err: any) {
      console.error('Blossom upload failed:', err)
      setUploadError(
        err?.message || 'Failed to upload cover image. Please try again.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !endAt) return

    const newGallery = await createMutation.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      coverImageUrl: coverImageUrl.trim() || undefined,
      endAt: endAt.toISOString(),
    })

    navigate({
      to: '/creator/gallery/$galleryId',
      params: { galleryId: newGallery.id },
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Link
          to="/creator/dashboard"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold tracking-tight">
            Create Collection
          </h1>
          <p className="text-xs text-muted-foreground mt-1 mb-6">
            Set up basic information. You will add art pieces in the next step.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Collection Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Genesis Cybernetic Artifacts"
                className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Cover Image Field Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Cover Image
                </label>

                {/* Mode Selector Tabs (Upload vs Paste URL) */}
                {!coverImageUrl && (
                  <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('upload')
                        setUploadError(null)
                      }}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                        uploadMode === 'upload'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Upload className="h-3 w-3" />
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMode('url')
                        setUploadError(null)
                      }}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer',
                        uploadMode === 'url'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <Link2 className="h-3 w-3" />
                      Image Link
                    </button>
                  </div>
                )}
              </div>

              {coverImageUrl ? (
                /* Cover Image Preview Block */
                <div className="relative h-44 w-full overflow-hidden rounded-lg border border-border group">
                  <img
                    src={coverImageUrl}
                    alt="Gallery cover preview"
                    className="h-full w-full object-cover"
                    onError={() =>
                      setUploadError('Failed to load image from provided URL.')
                    }
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImageUrl('')
                        setUploadError(null)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-destructive shadow-md transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : uploadMode === 'upload' ? (
                /* File Dropzone Block */
                <label className="relative flex flex-col items-center justify-center h-36 w-full rounded-lg border border-dashed border-input bg-background/30 hover:bg-muted/40 transition-colors cursor-pointer p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="sr-only"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-xs font-medium">
                        Uploading to Blossom...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="rounded-full bg-secondary p-2.5">
                        <Upload className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-primary">
                          Click to upload
                        </span>
                        <span className="text-xs"> or drag and drop</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        PNG, JPG, WEBP or GIF (Max 10MB)
                      </p>
                    </div>
                  )}
                </label>
              ) : (
                /* Direct Image URL Input Block */
                <div className="space-y-2">
                  <div className="relative flex items-center">
                    <Link2 className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => {
                        setCoverImageUrl(e.target.value)
                        setUploadError(null)
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="w-full rounded-lg border border-input bg-background/50 pl-9 pr-3.5 py-2 text-sm focus:border-primary focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Paste a direct public web URL for your collection banner
                    image.
                  </p>
                </div>
              )}

              {uploadError && (
                <p className="text-[11px] text-destructive mt-1.5">
                  {uploadError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the narrative or theme behind this collection..."
                className="w-full rounded-lg border border-input bg-background/50 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Target End Date<span className="text-destructive">*</span>
              </label>

              <Popover>
                <PopoverTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal border-input bg-background/50 text-foreground h-10',
                      !endAt && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endAt ? (
                      format(endAt, 'PPP')
                    ) : (
                      <span>Pick a closing date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endAt}
                    onSelect={setEndAt}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>

              <p className="text-[11px] text-muted-foreground mt-1">
                When published, this sets the closing timer for all pieces in
                this collection.
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <Link
                to="/creator/dashboard"
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  isUploading ||
                  !title.trim() ||
                  !endAt
                }
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Continue to Upload Pieces
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
