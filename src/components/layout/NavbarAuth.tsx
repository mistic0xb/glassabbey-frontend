import { useAuth } from '#/context/AuthContext'
import { Loader, LogOut, User } from 'lucide-react'
import { useState } from 'react'

export default function NavbarAuth() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()

  // Local state to track active async action progress
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogin = async () => {
    // lock button & show spinner immediately on click
    setIsLoggingIn(true)
    try {
      const res = await login()
      if (!res.ok) {
        if (res.error === 'no_extension') {
          alert(
            'Please install a Nostr extension (e.g., Alby, nos2x) to sign in.',
          )
        } else if (res.error === 'rejected') {
          alert('Signature request rejected in extension.')
        } else {
          alert('Authentication failed. Please try again.')
        }
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    // lock button & show spinner on logout
    setIsLoggingOut(true)
    try {
      logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const formattedPubkey = user?.pubkey
    ? `${user.pubkey.slice(0, 4)}...${user.pubkey.slice(-4)}`
    : ''

  // Initial Auth Check Spinner
  if (isLoading) {
    return <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
  }

  // Authenticated State
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        {/* User Profile Info */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pr-3 shadow-xs">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              <User className="h-4 w-4" />
            </div>
          )}
          <span className="text-xs font-medium text-foreground">
            {user?.name || formattedPubkey}
          </span>
        </div>

        {/* Logout Action with Loading State */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut} // prevent double clicks
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-destructive/10 text-xs text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50 cursor-pointer"
          title="Sign Out"
        >
          {isLoggingOut ? (
            <Loader className="h-4 w-4 animate-spin text-destructive" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </button>
      </div>
    )
  }

  // Unauthenticated State (Sign In Button)
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLogin}
        disabled={isLoggingIn} // prevent multiple triggers
        className="flex items-center gap-2 rounded-lg border border-border bg-sidebar-accent px-4 py-2 text-xs font-semibold shadow-xs transition-all hover:border-accent hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
      >
        {isLoggingIn ? (
          <>
            <Loader className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>
    </div>
  )
}
