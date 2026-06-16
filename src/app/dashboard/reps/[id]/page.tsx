import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, CheckIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
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
  capacityStatus,
  coachingStats,
  getRep,
  initials,
  isBelowBaseline,
  overallSkill,
  reps,
  SKILL_LABELS,
  type CoachingStatus,
  type SkillCategory,
} from "@/lib/reps"

export function generateStaticParams() {
  return reps.map((rep) => ({ id: rep.id }))
}

function SkillRow({ label, value }: { label: string; value: number }) {
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

function CoachingStatusBadge({ status }: { status: CoachingStatus }) {
  if (status === "completed") {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        <CheckIcon className="size-3" />
        Completed
      </Badge>
    )
  }
  if (status === "in_progress") {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        In progress
      </Badge>
    )
  }
  return <Badge variant="outline">Assigned</Badge>
}

export default async function RepProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const rep = getRep(id)

  if (!rep) {
    notFound()
  }

  const belowBaseline = isBelowBaseline(rep)
  const capacity = capacityStatus(rep.capacity)
  const stats = coachingStats(rep)
  const skill = overallSkill(rep)

  return (
    <DashboardShell
      breadcrumb={[
        { label: "Sales Team", href: "/dashboard/sales-team" },
        { label: rep.name },
      ]}
    >
      <PageContainer>
        <Link
          href="/dashboard/sales-team"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Sales Team
        </Link>

        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback
              className={
                belowBaseline
                  ? "bg-rose-500/10 text-base font-medium text-rose-600 dark:text-rose-400"
                  : "text-base font-medium"
              }
            >
              {initials(rep.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {rep.name}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{rep.role}</Badge>
              {belowBaseline ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  Below baseline
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">On track</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Revenue (MTD)" value={rep.revenue} />
          <MetricCard label="Close Rate" value={rep.closeRate} />
          <MetricCard label="Show Rate" value={rep.showRate} />
          <MetricCard
            label="Hot List"
            value={`${rep.hotList}`}
            footnote="open opportunities"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill Scorecard</CardTitle>
              <CardDescription>
                Latest call review · {rep.lastReviewedAt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between border-b border-border/60 pb-3">
                <span className="text-sm text-muted-foreground">
                  Overall score
                </span>
                <span className="text-2xl font-semibold tabular-nums">
                  {skill}
                </span>
              </div>
              {(Object.keys(SKILL_LABELS) as SkillCategory[]).map((key) => (
                <SkillRow
                  key={key}
                  label={SKILL_LABELS[key]}
                  value={rep.skillScores[key]}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Coaching & Accountability</CardTitle>
              <CardDescription>
                Coachability = completed ÷ assigned coaching items
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Coachability
                  </span>
                  <span className="text-2xl font-semibold tabular-nums">
                    {rep.coachability.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Capacity
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-2xl font-semibold tabular-nums">
                      {rep.capacity}%
                    </span>
                    <Badge variant={capacity.tone}>{capacity.label}</Badge>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    Implementation rate
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {stats.completed}/{stats.assigned} · {stats.implementationRate}%
                  </span>
                </div>
                <ProgressBar value={stats.implementationRate} />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  Recurring issues
                </span>
                {rep.recurringIssues.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rep.recurringIssues.map((issue) => (
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
              <CardTitle className="text-base">Coaching Items</CardTitle>
              <CardDescription>
                {stats.completed} completed · {stats.inProgress} in progress ·{" "}
                {stats.assigned - stats.completed - stats.inProgress} assigned
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              <ul className="flex flex-col divide-y divide-border/60">
                {rep.coachingItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={cn(
                        "text-sm",
                        item.status === "completed" &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {item.title}
                    </span>
                    <CoachingStatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Goal Tracking</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">
                    Progress to blood goal
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {rep.goalProgress}%
                  </span>
                </div>
                <ProgressBar value={rep.goalProgress} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Blood Goal
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {rep.bloodGoal}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
                    Stretch Goal
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {rep.stretchGoal}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </DashboardShell>
  )
}
