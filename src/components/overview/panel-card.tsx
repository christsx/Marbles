import { cn } from "@/lib/utils"

export const panelClass =
  "rounded-lg border border-border bg-card text-card-foreground shadow-xs"

export function PanelCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn(panelClass, className)} {...props} />
}
