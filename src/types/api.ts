interface UserProfile {
  pubkey: string
  name?: string | null
  picture?: string | null
  about?: string | null
}

interface Piece {
  id: string
  title: string
  description: string
  imgUrl: string
  basePriceSats: string
}