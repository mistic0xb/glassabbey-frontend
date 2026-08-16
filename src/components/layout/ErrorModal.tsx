import { useRouter } from '@tanstack/react-router'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorComponentProps {
  error?: Error | null
  reset?: () => void
}

export function ErrorModal({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  const handleRetry = () => {
    if (reset) {
      reset()
    } else {
      router.invalidate()
    }
  }

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center p-4 text-center">
      <div className="relative flex max-w-md flex-col items-center rounded-xl border border-border bg-card p-6 shadow-xl">
        
        {/* Warning Icon Badge */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>

        {/* Error Message */}
        <p className="mt-2 text-xs text-muted-foreground line-clamp-3 font-mono bg-secondary/50 p-2.5 rounded-md border border-border/50 w-full">
          {error?.message || 'An unexpected error occurred while loading this section.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={handleRetry}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>

          <button
            onClick={() => router.navigate({ to: '/' })}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            Go Home
          </button>
        </div>

      </div>
    </div>
  )
}