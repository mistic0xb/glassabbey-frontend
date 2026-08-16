import { addPiece, deletePiece, getGalleryPieces, updatePiece } from '#/api/pieces'
import type { PiecePayload } from '#/types/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const pieceKeys = {
    all: ['pieces'] as const,
    gallery: (galleryId: string) => [...pieceKeys.all, 'gallery', galleryId] as const,
}

export function useGalleryPieces(galleryId: string) {
    return useQuery({
        queryKey: pieceKeys.gallery(galleryId),
        queryFn: () => getGalleryPieces(galleryId),
        enabled: Boolean(galleryId),
    })
}

export function useAddPiece(galleryId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: PiecePayload) => addPiece(galleryId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pieceKeys.gallery(galleryId) })
            queryClient.invalidateQueries({ queryKey: ['gallery', galleryId] })
        },
    })
}

export function useUpdatePiece(galleryId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, ...payload }: Partial<PiecePayload> & { id: string }) =>
            updatePiece(galleryId, id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pieceKeys.gallery(galleryId) })
            queryClient.invalidateQueries({ queryKey: ['gallery', galleryId] })
        },
    })
}

export function useDeletePiece(galleryId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (pieceId: string) => deletePiece(galleryId, pieceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pieceKeys.gallery(galleryId) })
            queryClient.invalidateQueries({ queryKey: ['gallery', galleryId] })
        },
    })
}