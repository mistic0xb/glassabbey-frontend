import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCreatorGalleries,
  fetchPublishedGalleries,
  fetchGalleryById,
  createGallery,
  updateGallery,
  publishGallery,
  closeGallery
} from '#/api/gallaries'
import type { CreateGalleryRequest, UpdateGalleryRequest } from '#/types/api'

export const galleryKeys = {
  all: ['galleries'] as const,
  creator: () => [...galleryKeys.all, 'creator'] as const,
  public: () => [...galleryKeys.all, 'public'] as const,
  detail: (id: string) => [...galleryKeys.all, 'detail', id] as const,
}

// Creator dashboard hook 
export function useCreatorGalleries() {
  return useQuery({
    queryKey: galleryKeys.creator(),
    queryFn: fetchCreatorGalleries,
  })
}

// Public explore page hook 
export function usePublishedGalleries() {
  return useQuery({
    queryKey: galleryKeys.public(),
    queryFn: fetchPublishedGalleries,
  })
}

export function useGalleryDetail(id: string) {
  return useQuery({
    queryKey: galleryKeys.detail(id),
    queryFn: () => fetchGalleryById(id),
    enabled: Boolean(id),
  })
}

export function useCreateGallery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateGalleryRequest) => createGallery(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.creator() })
    },
  })
}

export function useUpdateGallery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateGalleryRequest }) =>
      updateGallery(id, req),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.creator() })
      queryClient.invalidateQueries({ queryKey: galleryKeys.detail(variables.id) })
    },
  })
}

export function usePublishGallery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => publishGallery(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.creator() })
      queryClient.invalidateQueries({ queryKey: galleryKeys.public() })
      queryClient.invalidateQueries({ queryKey: galleryKeys.detail(id) })
    },
  })
}

export function useCloseGallery() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => closeGallery(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.creator() })
      queryClient.invalidateQueries({ queryKey: galleryKeys.public() })
      queryClient.invalidateQueries({ queryKey: galleryKeys.detail(id) })
    },
  })
}