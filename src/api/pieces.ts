import type { PiecePayload, PieceResponse } from "#/types/api"
import client from "./client"

export async function getGalleryPieces(galleryId: string): Promise<PieceResponse[]> {
    const { data } = await client.get(`/gallery/${galleryId}/piece`)
    return data
}

export async function addPiece(galleryId: string, payload: PiecePayload): Promise<PieceResponse> {
    const { data } = await client.post(`/gallery/${galleryId}/piece`, payload)
    return data
}

export async function updatePiece(galleryId: string, pieceId: string, payload: Partial<PiecePayload>): Promise<PieceResponse> {
    const { data } = await client.patch(`/gallery/${galleryId}/piece/${pieceId}`, payload)
    return data
}

export async function deletePiece(pieceId: string): Promise<void> {
    await client.delete(`/piece/${pieceId}`)
}