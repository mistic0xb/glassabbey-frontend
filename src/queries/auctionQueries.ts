import { queryOptions } from '@tanstack/react-query'
import client from '#/api/client'
import type { AuctionDto } from '#/types/api'

export const auctionByPieceQueryOptions = (pieceId: string) =>
  queryOptions({
    queryKey: ['auction', 'piece', pieceId],
    queryFn: async () => {
      const { data } = await client.get<AuctionDto>(`/auction/piece/${pieceId}`)
      return data
    },
    enabled: !!pieceId,
  })