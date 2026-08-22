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
  coverImageUrl?: string | null
  pieceCount: number
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED'
  publishedAt?: string
  endAt: string
  createdAt: string
  updatedAt: string
}

export type CreateGalleryRequest = {
  title: string
  description: string
  coverImageUrl?: string
  endAt?: string
}

export type UpdateGalleryRequest = {
  title?: string
  description?: string
  coverImageUrl?: string
  endAt?: string
}

// Piece
export interface PieceDto {
  id: string;
  galleryId: string;
  title: string;
  description: string;
  artistName: string
  artistProfile?: string
  medium?: string
  dimensions?: string
  imgUrl: string;
  basePriceSats: number;
  createdAt: string;
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

// Auction
export type AuctionStatus = 'OPEN' | 'CLOSED';

export interface BidDto {
  id: string;
  auctionId: string;
  pubkey: string;
  bidderName?: string;
  willingAmtSats: number;
  paymentHash: string;
  status: 'PENDING' | 'CONFIRMED' | 'EXPIRED';
  createdAt: string;
}

export interface AuctionDto {
  id: string;
  piece: PieceDto;
  gallery?: GalleryDto;
  basePriceSats: number;
  currentPriceSats: number;
  submissionFeeSats: number;
  status: AuctionStatus;
  closedAt?: string | null;
  createdAt: string;
  bids?: BidDto[];
}

export interface PendingBidResponse {
  bidId: string;
  auctionId: string;
  amountSats: number;
  // paymentHash: string;
  paymentRequest: string; // LN BOLT11 invoice string
  expiresAtMs: number;
}


export interface NwcConnDto {
  id: string
  walletName: string
  isPrimary: boolean
  isActive: boolean
  lastUsedAt?: string | null
  createdAt: string
}

export interface RegisterNwcRequest {
  walletName: string
  nwcString: string
  isPrimary: boolean
}