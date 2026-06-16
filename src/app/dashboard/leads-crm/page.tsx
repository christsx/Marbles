import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const sources = [
  { name: "Meta Ads", count: 9, avgResponse: "3m 20s" },
  { name: "Google Ads", count: 7, avgResponse: "11m 05s" },
  { name: "Referral", count: 5, avgResponse: "4m 40s" },
  { name: "Webinar", count: 3, avgResponse: "16m 30s" },
]

const maxSource = Math.max(...sources.map((s) => s.count))

type Lead = {
  name: string
  company: string
  source: string
  owner: string
  responseTime: string
  slaBreached: boolean
  crmComplete: boolean
  status: string
}

const leads: Lead[] = [
  { name: "Alex Morgan", company: "Northwind", source: "Meta Ads", owner: "Priya Nair", responseTime: "2m 10s", slaBreached: false, crmComplete: true, status: "Contacted" },
  { name: "Jamie Fox", company: "Acme Corp", source: "Google Ads", owner: "Jordan Lee", responseTime: "18m 40s", slaBreached: true, crmComplete: false, status: "New" },
  { name: "Robin Patel", company: "Globex", source: "Referral", owner: "Priya Nair", responseTime: "4m 02s", slaBreached: false, crmComplete: true, status: "Qualified" },
  { name: "Casey Lin", company: "Initech", source: "Webinar", owner: "Jordan Lee", responseTime: "31m 15s", slaBreached: true, crmComplete: false, status: "New" },
  { name: "Sam Rivera", company: "Umbrella", source: "Meta Ads", owner: "Priya Nair", responseTime: "5m 48s", slaBreached: false, crmComplete: true, status: "Contacted" },
]

export default function LeadsCrmPage() {
  return (
    <DashboardShell
      breadcrumb={[{ label: "Pipeline & Sales" }, { label: "Leads & CRM" }]}
    >
      <PageContainer>
        <PageHeader
          title="Leads & CRM"
          subtitle="Lead response speed and CRM compliance at a glance."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="New Leads (today)" value="24" change={{ trend: "up", label: "+6" }} footnote="across all sources" />
          <MetricCard label="SLA Compliance" value="94%" footnote="10-min contact rule" />
          <MetricCard label="CRM Completion" value="88%" change={{ trend: "up", label: "+2%" }} footnote="required fields filled" />
          <MetricCard label="Open Red Flags" value="3" footnote="missing outcome / notes" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {sources.map((source) => (
              <div key={source.name} className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-sm font-medium">
                  {source.name}
                </span>
                <ProgressBar
                  value={(source.count / maxSource) * 100}
                  className="flex-1"
                />
                <span className="w-8 shrink-0 text-right text-sm tabular-nums">
                  {source.count}
                </span>
                <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                  {source.avgResponse}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Recent Leads</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Lead</TableHead>
                  <TableHead className="px-4">Source</TableHead>
                  <TableHead className="px-4">Owner</TableHead>
                  <TableHead className="px-4">Response</TableHead>
                  <TableHead className="px-4">CRM</TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead, i) => (
                  <TableRow
                    key={i}
                    className={cn(lead.slaBreached && "bg-rose-500/[0.04]")}
                  >
                    <TableCell className="px-4 py-3">
                      <span className="font-medium">{lead.name}</span>
                      <span className="ml-1.5 text-muted-foreground">
                        {lead.company}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {lead.source}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {lead.owner}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={cn(
                          "tabular-nums",
                          lead.slaBreached
                            ? "font-medium text-rose-600 dark:text-rose-400"
                            : "text-muted-foreground"
                        )}
                      >
                        {lead.responseTime}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {lead.crmComplete ? (
                        <Badge variant="secondary">Complete</Badge>
                      ) : (
                        <Badge variant="destructive">Incomplete</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground">
                      {lead.status}
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
