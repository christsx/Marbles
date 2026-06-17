import Link from "next/link"

import { SetDashboardBreadcrumb } from "@/components/set-dashboard-breadcrumb"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  agents,
  calibrationStats,
  CAPABILITY_LABELS,
  getAgent,
  initials,
  isBelowBaseline,
  overallCapability,
  utilizationStatus,
  type CalibrationStatus,
  type CapabilityCategory,
} from "@/lib/agents"

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }))
}

function CapabilityRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium tabular-nums">{value}</span>
      </div>
      <ProgressBar value={value} />
    </div>
  )
}

const calibrationStatusTone: Record<CalibrationStatus, StatusTone> = {
  applied: "success",
  in_progress: "warning",
  queued: "neutral",
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agent = getAgent(id)

  if (!agent) {
    notFound()
  }

  const belowBaseline = isBelowBaseline(agent)
  const util = utilizationStatus(agent.utilization)
  const stats = calibrationStats(agent)
  const capability = overallCapability(agent)

  return (
    <>
      <SetDashboardBreadcrumb
        breadcrumb={[
          { label: "Agents", href: "/dashboard/agents" },
          { label: agent.name },
        ]}
      />
      <PageContainer>
        <Link
          href="/dashboard/agents"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Agents
        </Link>

        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-base font-medium">
              {initials(agent.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {agent.name}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{agent.role}</Badge>
              <Badge variant="outline">{agent.model}</Badge>
              {belowBaseline ? (
                <StatusBadge tone="error">Below baseline</StatusBadge>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Active · {agent.lastActiveAt}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Shipped" value={agent.shipped} footnote="work orders" />
          <MetricCard label="Merge Rate" value={agent.mergeRate} />
          <MetricCard label="Test Pass" value={agent.testPassRate} />
          <MetricCard
            label="Active"
            value={`${agent.activeOrders}`}
            footnote="open work orders"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Capability Scorecard</CardTitle>
              <CardDescription>
                Latest evaluation · {agent.lastActiveAt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
                <span className="text-sm text-muted-foreground">
                  Overall score
                </span>
                <span className="text-2xl font-semibold tabular-nums">
                  {capability}
                </span>
              </div>
              {(Object.keys(CAPABILITY_LABELS) as CapabilityCategory[]).map(
                (key) => (
                  <CapabilityRow
                    key={key}
                    label={CAPABILITY_LABELS[key]}
                    value={agent.capabilityScores[key]}
                  />
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reliability & Calibration</CardTitle>
              <CardDescription>
                Reliability = applied ÷ queued calibration items
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Reliability
                  </span>
                  <span className="text-2xl font-semibold tabular-nums">
                    {agent.reliability.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Utilization
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-2xl font-semibold tabular-nums">
                      {agent.utilization}%
                    </span>
                    <Badge variant={util.tone}>{util.label}</Badge>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    Apply rate
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {stats.applied}/{stats.queued} · {stats.applyRate}%
                  </span>
                </div>
                <ProgressBar value={stats.applyRate} />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  Recurring issues
                </span>
                {agent.recurringIssues.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {agent.recurringIssues.map((issue) => (
                      <Badge key={issue} variant="outline">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    None flagged
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calibration Items</CardTitle>
              <CardDescription>
                {stats.applied} applied · {stats.inProgress} in progress ·{" "}
                {stats.queued - stats.applied - stats.inProgress} queued
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              <ul className="flex flex-col divide-y divide-border/60">
                {agent.calibrationItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={cn(
                        "text-sm",
                        item.status === "applied" &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {item.title}
                    </span>
                    <StatusBadge tone={calibrationStatusTone[item.status]}>
                      {item.status === "applied"
                        ? "Applied"
                        : item.status === "in_progress"
                          ? "In progress"
                          : "Queued"}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Throughput Target</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    Progress to weekly target
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {agent.targetProgress}%
                  </span>
                </div>
                <ProgressBar value={agent.targetProgress} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Weekly Target
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {agent.weeklyTarget}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Stretch Target
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {agent.stretchTarget}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  )
}
