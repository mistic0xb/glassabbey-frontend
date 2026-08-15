import { Link } from '@tanstack/react-router'
import NavbarAuth from './NavbarAuth'

export function Navbar() {
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
            <Link
              to="/explore"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: 'text-foreground font-semibold' }}
            >
              Explore
            </Link>
            <Link
              to="/creator/dashboard"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: 'text-foreground font-semibold' }}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Auth Actions Component */}
        <NavbarAuth />
      </div>
    </header>
  )
}
