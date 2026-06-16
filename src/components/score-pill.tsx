import { cn } from "@/lib/utils"

export function ScorePill({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  if (score <= 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-9 items-center justify-center rounded-md px-1.5 font-mono text-sm font-semibold tabular-nums",
        score >= 90 && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        score >= 75 &&
          score < 90 &&
          "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        score < 75 && "bg-muted text-muted-foreground",
        className
      )}
    >
      {score}
    </span>
  )
}
