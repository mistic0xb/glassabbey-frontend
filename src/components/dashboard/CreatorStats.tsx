import type { GalleryDto } from '#/types/api'
import { LayoutGrid, Radio, FileText, CheckCircle2 } from 'lucide-react'

interface CreatorStatsProps {
  galleries: GalleryDto[]
}

export function CreatorStats({ galleries }: CreatorStatsProps) {
  const total = galleries.length
  const liveCount = galleries.filter((g) => g.status === 'PUBLISHED').length
  const draftCount = galleries.filter((g) => g.status === 'DRAFT').length
  const closedCount = galleries.filter((g) => g.status === 'CLOSED').length
  const totalPieces = galleries.reduce((acc, g) => acc + (g.pieceCount || 0), 0)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Live Collections</span>
          <Radio className="h-4 w-4 text-bid animate-pulse" />
        </div>
        <div className="text-2xl font-bold text-foreground">{liveCount}</div>
        <p className="text-[11px] text-muted-foreground mt-1">{totalPieces} total pieces active</p>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Drafts</span>
          <FileText className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-foreground">{draftCount}</div>
        <p className="text-[11px] text-muted-foreground mt-1">Unpublished collections</p>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Completed</span>
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground">{closedCount}</div>
        <p className="text-[11px] text-muted-foreground mt-1">Archived galleries</p>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total Built</span>
          <LayoutGrid className="h-4 w-4 text-accent" />
        </div>
        <div className="text-2xl font-bold text-foreground">{total}</div>
        <p className="text-[11px] text-muted-foreground mt-1">Lifetime created</p>
      </div>
    </div>
  )
}