import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authQueryOptions } from '#/queries/authQueries'
import { loginWithNostr, logout } from '#/api/auth'

interface AuthContextType {
  user?: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  // 1. Session Query
  const { data: user = null, isLoading } = useQuery(authQueryOptions)
  console.log('session query')

  // 2. Login Mutation
  const loginMutation = useMutation({
    mutationFn: loginWithNostr,
    onSuccess: (userData) => {
      // Instantly update the cache — no extra network fetch needed!
      queryClient.setQueryData(['auth'], userData)
    },
  })

  // 3. Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Clear cache and set auth query to null
      queryClient.setQueryData(['auth'], null)
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  const login = async () => {
    try {
      await loginMutation.mutateAsync()
      return { ok: true }
    } catch (err: any) {
      return { ok: false, error: err.message || 'server_error' }
    }
  }

  return (
    <AuthContext
      value={{
        user,
        isAuthenticated: user ? true : false,
        isLoading,
        login,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
