import client from '#/api/client'
import type { BidDto } from '#/types/api'

export async function getLeaderboard(auctionId: string): Promise<BidDto[]> {
  const response = await client.get<BidDto[]>(`/auction/${auctionId}/bid`)
  return response.data
}