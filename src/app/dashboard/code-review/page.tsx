import Link from "next/link"

import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { StatusBadge, type StatusTone } from "@/components/status-badge"
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

type Severity = "high" | "medium" | "low"

type Finding = {
  area: string
  finding: string
  location: string
  severity: Severity
  recommendation: string
  status: "Open" | "In progress" | "Resolved"
}

const findings: Finding[] = [
  { area: "Security", finding: "Unvalidated input on export endpoint", location: "core-api · audit.ts", severity: "high", recommendation: "Add schema validation + rate limit", status: "Open" },
  { area: "Security", finding: "Refresh token TTL too long (30d)", location: "core-api · oauth.ts", severity: "high", recommendation: "Reduce TTL, rotate on use", status: "In progress" },
  { area: "Reliability", finding: "Non-idempotent billing event write", location: "billing-svc · meter.ts", severity: "high", recommendation: "Key writes by event id", status: "Open" },
  { area: "Complexity", finding: "Function exceeds 80 lines / 12 branches", location: "web-app · feed.tsx", severity: "medium", recommendation: "Extract reducer + helpers", status: "In progress" },
  { area: "Tests", finding: "New endpoint missing integration test", location: "core-api · audit.ts", severity: "medium", recommendation: "Generate integration suite", status: "Open" },
  { area: "Performance", finding: "N+1 query on work-order list", location: "core-api · queue.ts", severity: "medium", recommendation: "Batch with a single join", status: "Open" },
  { area: "Style", finding: "Hard-coded color instead of token", location: "web-app · settings.tsx", severity: "low", recommendation: "Use design token", status: "Resolved" },
]

const severityFilters: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
]

function resolveSeverity(raw: string | undefined): string {
  return severityFilters.some((f) => f.id === raw) ? (raw as string) : "all"
}

function severityCount(id: string): number {
  if (id === "all") return findings.length
  return findings.filter((f) => f.severity === id).length
}

const severityTone: Record<Severity, StatusTone> = {
  high: "error",
  medium: "warning",
  low: "neutral",
}

const findingStatusTone: Record<Finding["status"], StatusTone> = {
  Open: "error",
  "In progress": "warning",
  Resolved: "neutral",
}

export default async function CodeReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ severity?: string }>
}) {
  const { severity: rawSeverity } = await searchParams
  const severity = resolveSeverity(rawSeverity)
  const visible =
    severity === "all"
      ? findings
      : findings.filter((f) => f.severity === severity)

  return (
      <PageContainer>
        <PageHeader
          title="Code Review"
          subtitle="AI review findings across every open and recent pull request."
          action={
            <span className="text-sm text-muted-foreground">
              Last pass 4 min ago · on every PR
            </span>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Merge Rate" value="92%" change={{ trend: "up", label: "+3%" }} footnote="first-pass approvals" />
          <MetricCard label="Open Findings" value="35" footnote="across 6 categories" />
          <MetricCard label="High Severity" value="3" footnote="block merge" />
          <MetricCard label="Resolved (7d)" value="48" change={{ trend: "up", label: "+15" }} footnote="this week" />
        </div>

        <div className="flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
          {severityFilters.map((filter) => {
            const active = filter.id === severity
            return (
              <Link
                key={filter.id}
                href={`/dashboard/code-review?severity=${filter.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "tabular-nums",
                    active ? "text-muted-foreground" : "text-muted-foreground/70"
                  )}
                >
                  {severityCount(filter.id)}
                </span>
              </Link>
            )
          })}
        </div>

        <Card className="py-0 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-28 px-4">Severity</TableHead>
                <TableHead className="px-4">Category</TableHead>
                <TableHead className="px-4">Finding</TableHead>
                <TableHead className="px-4">Recommendation</TableHead>
                <TableHead className="px-4 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((f, i) => (
                <TableRow key={i}>
                  <TableCell className="px-4 py-3">
                    <StatusBadge tone={severityTone[f.severity]}>
                      {f.severity === "high"
                        ? "High"
                        : f.severity === "medium"
                          ? "Medium"
                          : "Low"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="px-4 py-3 font-medium">{f.area}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">{f.finding}</span>
                      <span className="font-mono text-xs text-muted-foreground/70">
                        {f.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {f.recommendation}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <StatusBadge tone={findingStatusTone[f.status]}>
                      {f.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </PageContainer>
  )
}
