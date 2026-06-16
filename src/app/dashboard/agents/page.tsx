import Link from "next/link"
import { ChevronRightIcon, PlusIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  agents,
  calibrationStats,
  initials,
  isBelowBaseline,
  utilizationStatus,
} from "@/lib/agents"

export default function AgentsPage() {
  const belowBaselineCount = agents.filter(isBelowBaseline).length

  return (
    <DashboardShell breadcrumb={[{ label: "Build & Ship" }, { label: "Agents" }]}>
      <PageContainer>
        <PageHeader
          title="Agents"
          subtitle={`${agents.length} agents · ${belowBaselineCount} below baseline`}
          action={
            <Button size="lg" asChild>
              <Link href="/dashboard/agents/new">
                <PlusIcon />
                Provision agent
              </Link>
            </Button>
          }
        />

        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Agent</TableHead>
                <TableHead className="px-4 text-right">Shipped</TableHead>
                <TableHead className="px-4 text-right">Merge</TableHead>
                <TableHead className="px-4 text-right">Test Pass</TableHead>
                <TableHead className="px-4">Utilization</TableHead>
                <TableHead className="px-4 text-right">Reliability</TableHead>
                <TableHead className="px-4 text-right">Active</TableHead>
                <TableHead className="px-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const belowBaseline = isBelowBaseline(agent)
                const util = utilizationStatus(agent.utilization)
                const stats = calibrationStats(agent)
                return (
                  <TableRow
                    key={agent.id}
                    className={cn(
                      "group/row",
                      belowBaseline && "bg-rose-500/[0.04]"
                    )}
                  >
                    <TableCell className="px-4 py-3">
                      <Link
                        href={`/dashboard/agents/${agent.id}`}
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
                            {initials(agent.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {agent.role} · {agent.model}
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
                      {agent.shipped}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {agent.mergeRate}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {agent.testPassRate}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="tabular-nums">{agent.utilization}%</span>
                        <Badge variant={util.tone}>{util.label}</Badge>
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
                        {agent.reliability.toFixed(1)}
                      </span>
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {stats.applyRate}%
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {agent.activeOrders}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/agents/${agent.id}`}
                        aria-label={`Open ${agent.name}`}
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
