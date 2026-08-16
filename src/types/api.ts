export type UserProfile = {
  pubkey: string
  name?: string | null
  picture?: string | null
  about?: string | null
}

// Gallery
export type GalleryDto = {
  id: string
  creatorId: string
  creatorName: string
  title: string
  description: string
  pieceCount: number
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED'
  publishedAt?: string
  endAt?: string
  createdAt: string
  updatedAt: string
}

export type CreateGalleryRequest = {
  title: string
  description: string
  endAt?: string
}

export type UpdateGalleryRequest = {
  title?: string
  description?: string
  endAt?: string
}

// Piece
export type PieceDto = {
  id: string
  title: string
  description: string
  imgUrl: string
  basePriceSats: string
}

export type PiecePayload = {
  title: string
  description: string
  artistName: string
  artistProfile?: string
  medium?: string
  dimensions?: string
  imgUrl?: string
  basePriceSats: number
}

export type PieceResponse = {
  id: string
  galleryId: string
  title: string
  description: string
  artistName: string
  artistProfile?: string
  medium?: string
  dimensions?: string
  imgUrl?: string
  basePriceSats: number
  createdAt: string
  updatedAt: string
}