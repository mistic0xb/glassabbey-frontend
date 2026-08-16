import { useState, useEffect } from 'react'
import { Upload, Loader2, Link as LinkIcon } from 'lucide-react'
import { useAddPiece, useUpdatePiece } from '#/queries/piecesQueries'
import { uploadToBlossom } from '#/lib/nostr/blossom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import type { PieceResponse } from '#/types/api'

interface PieceModalProps {
  galleryId: string
  isOpen: boolean
  onClose: () => void
  pieceToEdit?: PieceResponse | null
}

export function PieceModal({
  galleryId,
  isOpen,
  onClose,
  pieceToEdit,
}: PieceModalProps) {
  const isEditing = Boolean(pieceToEdit)
  const addPieceMutation = useAddPiece(galleryId)
  const updatePieceMutation = useUpdatePiece(galleryId)

  // Form Fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [artistName, setArtistName] = useState('')
  const [artistProfile, setArtistProfile] = useState('')
  const [medium, setMedium] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [basePriceSats, setBasePriceSats] = useState<number>(1000)

  // Image Upload / Link state
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload')
  const [imgUrl, setImgUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Pre-fill form on edit or reset on add
  useEffect(() => {
    if (pieceToEdit) {
      setTitle(pieceToEdit.title || '')
      setDescription(pieceToEdit.description || '')
      setArtistName(pieceToEdit.artistName || '')
      setArtistProfile(pieceToEdit.artistProfile || '')
      setMedium(pieceToEdit.medium || '')
      setDimensions(pieceToEdit.dimensions || '')
      setBasePriceSats(pieceToEdit.basePriceSats || 1000)
      setImgUrl(pieceToEdit.imgUrl || '')
    } else {
      resetForm()
    }
  }, [pieceToEdit, isOpen])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setUploadError(null)
      const url = await uploadToBlossom(file)
      setImgUrl(url)
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload artwork to Blossom')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!title.trim() || !artistName.trim() || !description.trim()) return

    const piecePayload = {
      title: title.trim(),
      description: description.trim(),
      artistName: artistName.trim(),
      artistProfile: artistProfile.trim() || undefined,
      medium: medium.trim() || undefined,
      dimensions: dimensions.trim() || undefined,
      imgUrl: imgUrl.trim() || undefined,
      basePriceSats,
    }

    if (isEditing && pieceToEdit) {
      await updatePieceMutation.mutateAsync({
        id: pieceToEdit.id,
        ...piecePayload,
      })
    } else {
      await addPieceMutation.mutateAsync(piecePayload)
    }

    resetAndClose()
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setArtistName('')
    setArtistProfile('')
    setMedium('')
    setDimensions('')
    setBasePriceSats(1000)
    setImgUrl('')
    setUploadError(null)
  }

  const resetAndClose = () => {
    resetForm()
    onClose()
  }

  const isPending = addPieceMutation.isPending || updatePieceMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? 'Edit Artwork Piece' : 'Add Artwork Piece'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? 'Update metadata and media links for this gallery piece.'
              : 'Provide metadata and media links for this gallery piece.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Media Input Modes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold">Artwork Image</label>
              <div className="flex gap-1 bg-muted/60 p-0.5 rounded-md text-[11px]">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2 py-0.5 rounded-sm font-medium transition-colors ${
                    uploadMode === 'upload'
                      ? 'bg-background shadow-xs text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-0.5 rounded-sm font-medium transition-colors ${
                    uploadMode === 'url'
                      ? 'bg-background shadow-xs text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  Paste URL
                </button>
              </div>
            </div>

            {uploadMode === 'upload' ? (
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 bg-background/40 hover:bg-background/60 transition-colors">
                {imgUrl ? (
                  <div className="relative w-full flex flex-col items-center">
                    <img
                      src={imgUrl}
                      alt="Preview"
                      className="max-h-44 rounded-md object-contain mb-2"
                    />
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground truncate max-w-full hover:underline"
                    >
                      image-link
                    </a>
                    <button
                      type="button"
                      onClick={() => setImgUrl('')}
                      className="mt-2 text-xs text-destructive hover:underline"
                    >
                      Clear Image
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full py-4">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    )}
                    <span className="text-xs font-semibold">
                      {isUploading
                        ? 'Uploading to Blossom...'
                        : 'Click to upload media'}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      PNG, JPG, WEBP, GIF up to 50MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => setImgUrl(e.target.value)}
                    placeholder="https://blossom.server/media/hash.jpg"
                    className="w-full rounded-lg border border-input bg-background/50 pl-8 pr-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>
                {imgUrl && (
                  <div className="flex justify-center border border-border rounded-lg p-2 bg-background/30">
                    <img
                      src={imgUrl}
                      alt="Preview"
                      className="max-h-36 object-contain rounded-md"
                    />
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-destructive mt-1">{uploadError}</p>
            )}
          </div>

          {/* Title & Artist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Celestial Convergence"
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Artist Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="e.g. Alice Nakamoto"
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background context or history for this work..."
              className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden resize-none"
            />
          </div>

          {/* Medium & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Medium</label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Digital Oil / Octane Render"
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 4096x2160px"
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Artist Profile & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Artist Profile Link
              </label>
              <input
                type="text"
                value={artistProfile}
                onChange={(e) => setArtistProfile(e.target.value)}
                placeholder="e.g. https://x.com/artist"
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Base Price (Sats) <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={basePriceSats}
                onChange={(e) => setBasePriceSats(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isPending ||
                isUploading ||
                !title.trim() ||
                !artistName.trim() ||
                !description.trim()
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Save Artwork Piece'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}