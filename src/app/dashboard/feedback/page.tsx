import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { SectionHeading } from "@/components/section-heading"
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

type FeedbackType = "Bug" | "Feature" | "Regression" | "Praise"
type FeedbackStatus = "New" | "Triaged" | "In build" | "Resolved"

type FeedbackItem = {
  title: string
  type: FeedbackType
  source: string
  status: FeedbackStatus
  linkedWO: string
}

const items: FeedbackItem[] = [
  { title: "Export times out on large audit logs", type: "Bug", source: "Customer · Acme", status: "In build", linkedWO: "WO-1839" },
  { title: "Add SAML SSO for enterprise", type: "Feature", source: "Sales", status: "In build", linkedWO: "WO-1799" },
  { title: "Dashboard feed drops updates on reconnect", type: "Regression", source: "Beta", status: "New", linkedWO: "WO-1835" },
  { title: "Settings page unreadable in dark mode", type: "Bug", source: "Support", status: "Triaged", linkedWO: "WO-1810" },
  { title: "Work-order queue is much faster now", type: "Praise", source: "Customer · Globex", status: "Resolved", linkedWO: "—" },
  { title: "Webhook retries fixed our integration", type: "Praise", source: "Customer · Initech", status: "Resolved", linkedWO: "WO-1788" },
]

const feedbackTypeTone: Record<FeedbackType, StatusTone> = {
  Bug: "error",
  Regression: "error",
  Praise: "success",
  Feature: "info",
}

const feedbackStatusTone: Record<FeedbackStatus, StatusTone> = {
  New: "warning",
  Triaged: "info",
  "In build": "warning",
  Resolved: "neutral",
}

export default function FeedbackPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Quality" }, { label: "Feedback" }]}>
      <PageContainer>
        <PageHeader
          title="Feedback"
          subtitle="User and QA signal that feeds straight back into the requirement queue."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Open Feedback" value="27" footnote="bugs + requests" />
          <MetricCard label="Bugs Open" value="9" change={{ trend: "down", label: "-4" }} footnote="3 high severity" />
          <MetricCard label="Feature Requests" value="14" change={{ trend: "up", label: "+5" }} footnote="this week" />
          <MetricCard label="CSAT" value="94%" change={{ trend: "up", label: "+2%" }} footnote="last 30 days" />
        </div>

        <section className="flex flex-col gap-3">
          <SectionHeading title="Recent Feedback" />
          <Card className="py-0 shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28 px-4">Type</TableHead>
                  <TableHead className="px-4">Feedback</TableHead>
                  <TableHead className="px-4">Source</TableHead>
                  <TableHead className="px-4">Linked WO</TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-4 py-3">
                      <StatusBadge tone={feedbackTypeTone[item.type]}>
                        {item.type}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {item.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {item.source}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {item.linkedWO}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <StatusBadge tone={feedbackStatusTone[item.status]}>
                        {item.status}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </PageContainer>
    </DashboardShell>
  )
}
