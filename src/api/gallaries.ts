import type { CreateGalleryRequest, GalleryDto, UpdateGalleryRequest } from "#/types/api"
import client from "./client"

export async function fetchCreatorGalleries(): Promise<GalleryDto[]> {
    const { data } = await client.get<GalleryDto[]>('/gallery/my')
    return data
}

export async function fetchPublishedGalleries(): Promise<GalleryDto[]> {
    const { data } = await client.get<GalleryDto[]>('/gallery')
    return data
}

export async function fetchGalleryById(galleryId: string): Promise<GalleryDto> {
    const { data } = await client.get<GalleryDto>(`/gallery/${galleryId}`)
    return data
}

export async function createGallery(req: CreateGalleryRequest): Promise<GalleryDto> {
    const { data } = await client.post<GalleryDto>('gallery', req)
    return data
}

export async function updateGallery(galleryId: string, req: UpdateGalleryRequest): Promise<GalleryDto> {
    const { data } = await client.put<GalleryDto>(`/gallery/${galleryId}`, req)
    return data
}

export async function publishGallery(galleryId: string): Promise<GalleryDto> {
    const { data } = await client.post<GalleryDto>(`/gallery/${galleryId}/publish`)
    return data
}

export async function closeGallery(galleryId: string): Promise<GalleryDto> {
    const { data } = await client.post<GalleryDto>(`/gallery/${galleryId}/close`)
    return data
}