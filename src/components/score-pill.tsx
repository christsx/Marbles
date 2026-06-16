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
        "inline-flex h-7 min-w-9 items-center justify-center rounded-md border border-border bg-background px-1.5 font-mono text-sm font-medium tabular-nums text-foreground shadow-xs",
        className
      )}
    >
      {score}
    </span>
  )
}
