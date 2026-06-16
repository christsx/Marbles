import Link from "next/link"
import { ArrowUpRightIcon, GitBranchIcon } from "lucide-react"

import { PanelCard } from "@/components/overview/panel-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export function RepoStatusCard() {
  return (
    <Link href="/dashboard/deployments" className="group block h-full">
      <PanelCard
        className={cn(
          "flex h-full flex-col gap-5 p-5 transition-colors",
          "group-hover:border-foreground/20 group-hover:bg-muted/30"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranchIcon className="size-4 text-muted-foreground" />
            <span className="font-medium">main · core-api</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              Checks passing
            </Badge>
            <ArrowUpRightIcon className="size-4 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
          </div>
        </div>
        <div className="flex flex-wrap gap-12">
          <Stat label="Open work orders" value="41" />
          <Stat label="Last deploy" value="12 min ago" />
          <Stat label="Coverage" value="87%" />
        </div>
      </PanelCard>
    </Link>
  )
}
