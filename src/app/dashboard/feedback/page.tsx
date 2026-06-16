import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
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

function TypeBadge({ type }: { type: FeedbackType }) {
  if (type === "Bug" || type === "Regression")
    return <Badge variant="destructive">{type}</Badge>
  if (type === "Praise")
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        {type}
      </Badge>
    )
  return <Badge variant="secondary">{type}</Badge>
}

function StatusLabel({ status }: { status: FeedbackStatus }) {
  return (
    <span
      className={cn(
        "text-sm",
        status === "Resolved"
          ? "text-muted-foreground"
          : status === "New"
            ? "font-medium text-foreground"
            : "text-foreground"
      )}
    >
      {status}
    </span>
  )
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
          <h2 className="font-heading text-base font-medium">Recent Feedback</h2>
          <Card className="py-0">
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
                  <TableRow
                    key={i}
                    className={cn(
                      (item.type === "Bug" || item.type === "Regression") &&
                        item.status === "New" &&
                        "bg-rose-500/[0.03]"
                    )}
                  >
                    <TableCell className="px-4 py-3">
                      <TypeBadge type={item.type} />
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
                      <StatusLabel status={item.status} />
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
