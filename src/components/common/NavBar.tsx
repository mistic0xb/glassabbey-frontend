import { useAuth } from '#/context/AuthContext'
import { Link } from '@tanstack/react-router'
import { Loader, LogOut, User } from 'lucide-react'

export function Navbar() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()

  const handleLogin = async () => {
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
  }

  const formattedPubkey = user?.pubkey
    ? `${user.pubkey.slice(0, 4)}...${user.pubkey.slice(-4)}`
    : ''

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-foreground hover:opacity-90"
          >
            Glass<span className="text-primary">Abbey</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Explore
            </Link>
            {isAuthenticated && (
              <Link
                to="/creator/dashboard"
                className="transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User Profile Info */}
              <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 pr-3">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="text-xs font-medium text-foreground">
                  {user?.name || formattedPubkey}
                </span>
              </div>

              {/* Logout Action */}
              <button
                onClick={logout}
                className="flex justify-center items-center gap-1 p-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-destructive bg-destructive/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                Logout
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="rounded-lg bg-sidebar-accent border px-4 py-2 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm hover:border-accent"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
