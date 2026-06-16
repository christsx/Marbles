import { cn } from "@/lib/utils"

export type StatusTone = "neutral" | "success" | "warning" | "error" | "info"

const dotClass: Record<StatusTone, string> = {
  neutral: "bg-muted-foreground/45",
  success: "bg-emerald-600 dark:bg-emerald-500",
  warning: "bg-amber-600 dark:bg-amber-500",
  error: "bg-destructive",
  info: "bg-foreground/35",
}

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode
  tone?: StatusTone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground shadow-xs",
        className
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", dotClass[tone])} />
      {children}
    </span>
  )
}
