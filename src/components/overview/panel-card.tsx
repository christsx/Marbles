import { cn } from "@/lib/utils"

export const panelClass =
  "rounded-xl border border-border bg-card text-card-foreground shadow-none ring-0"

export function PanelCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn(panelClass, className)} {...props} />
}
