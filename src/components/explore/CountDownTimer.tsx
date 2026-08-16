import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  targetDate: string | null
  onEnd?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
  isUrgent: boolean
}

function calculateTimeLeft(targetDate: string | null): TimeLeft {
  if (!targetDate)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isUrgent: false }

  const difference = new Date(targetDate).getTime() - new Date().getTime()
  if (difference <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isUrgent: false }

  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000
  const isUrgent = difference <= TWELVE_HOURS_MS

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
    isUrgent,
  }
}

export function CountdownTimer({ targetDate, onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft(targetDate)
      setTimeLeft(updated)
      if (updated.isExpired) {
        clearInterval(timer)
        onEnd?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onEnd])

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-md bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-xs">
        <Clock className="h-3 w-3" />
        <span>Ended</span>
      </div>
    )
  }

  const containerStyle = timeLeft.isUrgent
    ? 'border-red-500/40 bg-red-500/20 text-red-400 animate-pulse shadow-red-500/20'
    : 'border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400'

  const iconStyle = timeLeft.isUrgent
    ? 'text-red-400 animate-ping'
    : 'animate-pulse text-amber-400 dark:text-amber-400'

  const labelStyle = timeLeft.isUrgent
    ? 'text-red-400/80'
    : 'text-amber-500/80 dark:text-amber-400/80'

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-mono font-medium backdrop-blur-xs shadow-xs transition-colors duration-300 ${containerStyle}`}
    >
      <Clock className={`h-3.5 w-3.5 ${iconStyle}`} />
      <div className="flex items-center gap-0.5">
        {timeLeft.days > 0 && (
          <>
            <span className="font-bold">{timeLeft.days}</span>
            <span className={`text-[10px] mr-0.5 ${labelStyle}`}>
              d
            </span>
          </>
        )}
        <span className="font-bold">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="opacity-60">:</span>
        <span className="font-bold">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="opacity-60">:</span>
        <span className="font-bold">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}