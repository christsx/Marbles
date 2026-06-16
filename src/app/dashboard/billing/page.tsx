import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
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

const breakdown = [
  { label: "Collected", amount: 203900, className: "bg-emerald-500" },
  { label: "Pending", amount: 113700, className: "bg-amber-500" },
  { label: "Overdue", amount: 91700, className: "bg-rose-500" },
]

const totalBilled = breakdown.reduce((sum, b) => sum + b.amount, 0)

type PaymentStatus = "Paid" | "Pending" | "Overdue"

const payments: {
  deal: string
  company: string
  amount: string
  owner: string
  due: string
  status: PaymentStatus
}[] = [
  { deal: "Annual Contract", company: "Cyberdyne", amount: "$96,000", owner: "Sarah Chen", due: "Paid Jun 14", status: "Paid" },
  { deal: "Platform License", company: "Tyrell Corp", amount: "$41,200", owner: "Marcus Webb", due: "Jun 20", status: "Pending" },
  { deal: "Enterprise Rollout", company: "Acme Corp", amount: "$72,500", owner: "Marcus Webb", due: "Jun 18", status: "Pending" },
  { deal: "Multi-seat Upgrade", company: "Globex", amount: "$58,200", owner: "Diego Ramos", due: "Jun 10", status: "Overdue" },
  { deal: "Tier Upgrade", company: "Oscorp", amount: "$33,500", owner: "Tyler Brooks", due: "Jun 8", status: "Overdue" },
]

function StatusBadge({ status }: { status: PaymentStatus }) {
  if (status === "Overdue") return <Badge variant="destructive">{status}</Badge>
  if (status === "Pending")
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        {status}
      </Badge>
    )
  return (
    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
      {status}
    </Badge>
  )
}

export default function BillingPage() {
  return (
    <DashboardShell
      breadcrumb={[{ label: "Pipeline & Sales" }, { label: "Billing & Payments" }]}
    >
      <PageContainer>
        <PageHeader
          title="Billing & Payments"
          subtitle="Cash collected, outstanding balances, and collection health."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Cash Collected (MTD)" value="$203,900" change={{ trend: "up", label: "+8%" }} footnote="of $248,500 booked" />
          <MetricCard label="Outstanding" value="$171,400" footnote="across 4 invoices" />
          <MetricCard label="Overdue" value="$91,700" change={{ trend: "down", label: "2 invoices" }} footnote="needs follow-up" />
          <MetricCard label="Collection Rate" value="82%" change={{ trend: "up", label: "+3%" }} footnote="collected vs booked" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Collected vs Outstanding</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {breakdown.map((segment) => (
                <div
                  key={segment.label}
                  className={segment.className}
                  style={{ width: `${(segment.amount / totalBilled) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {breakdown.map((segment) => (
                <div key={segment.label} className="flex items-center gap-2">
                  <span
                    className={cn("size-2.5 rounded-full", segment.className)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {segment.label}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    ${segment.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Payments</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Deal</TableHead>
                  <TableHead className="px-4 text-right">Amount</TableHead>
                  <TableHead className="px-4">Owner</TableHead>
                  <TableHead className="px-4">Due</TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p, i) => (
                  <TableRow
                    key={i}
                    className={cn(p.status === "Overdue" && "bg-rose-500/[0.04]")}
                  >
                    <TableCell className="px-4 py-3">
                      <span className="font-medium">{p.deal}</span>
                      <span className="ml-1.5 text-muted-foreground">
                        {p.company}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {p.amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {p.owner}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {p.due}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <StatusBadge status={p.status} />
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
