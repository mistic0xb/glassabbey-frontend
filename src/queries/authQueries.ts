import { fetchSession } from '#/api/auth'
import { queryOptions } from '@tanstack/react-query'

export const authQueryOptions = queryOptions({
    queryKey: ['auth'],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 15, // 15 mins
    retry: false, // Don't retry if /me returns 401/403
})