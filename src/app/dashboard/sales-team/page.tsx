import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  capacityStatus,
  coachingStats,
  initials,
  isBelowBaseline,
  reps,
} from "@/lib/reps"

export default function SalesTeamPage() {
  const belowBaselineCount = reps.filter(isBelowBaseline).length

  return (
    <DashboardShell
      breadcrumb={[{ label: "Pipeline & Sales" }, { label: "Sales Team" }]}
    >
      <PageContainer>
        <PageHeader
          title="Sales Team"
          subtitle={`${reps.length} reps · ${belowBaselineCount} below baseline`}
        />

        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Rep</TableHead>
                <TableHead className="px-4 text-right">Revenue</TableHead>
                <TableHead className="px-4 text-right">Close</TableHead>
                <TableHead className="px-4 text-right">Show</TableHead>
                <TableHead className="px-4">Capacity</TableHead>
                <TableHead className="px-4 text-right">Coachability</TableHead>
                <TableHead className="px-4 text-right">Hot List</TableHead>
                <TableHead className="px-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reps.map((rep) => {
                const belowBaseline = isBelowBaseline(rep)
                const capacity = capacityStatus(rep.capacity)
                const stats = coachingStats(rep)
                return (
                  <TableRow
                    key={rep.id}
                    className={cn(
                      "group/row",
                      belowBaseline && "bg-rose-500/[0.04]"
                    )}
                  >
                    <TableCell className="px-4 py-3">
                      <Link
                        href={`/dashboard/reps/${rep.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="size-8">
                          <AvatarFallback
                            className={cn(
                              "text-xs font-medium",
                              belowBaseline &&
                                "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {initials(rep.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{rep.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {rep.role}
                            {belowBaseline && (
                              <span className="text-rose-600 dark:text-rose-400">
                                {" "}
                                · Below baseline
                              </span>
                            )}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {rep.revenue}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {rep.closeRate}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {rep.showRate}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="tabular-nums">{rep.capacity}%</span>
                        <Badge variant={capacity.tone}>{capacity.label}</Badge>
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          "tabular-nums",
                          belowBaseline &&
                            "font-medium text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {rep.coachability.toFixed(1)}
                      </span>
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {stats.implementationRate}%
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {rep.hotList}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/reps/${rep.id}`}
                        aria-label={`Open ${rep.name}`}
                        className="inline-flex"
                      >
                        <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover/row:translate-x-0.5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </PageContainer>
    </DashboardShell>
  )
}
