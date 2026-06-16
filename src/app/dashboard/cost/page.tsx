import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Model = {
  name: string
  provider: string
  workOrders: number
  tokens: string
  spend: number
  costPerWO: string
  color: string
}

const models: Model[] = [
  { name: "claude-opus-4.8", provider: "Anthropic", workOrders: 214, tokens: "1.84B", spend: 6120, costPerWO: "$28.60", color: "var(--chart-1)" },
  { name: "gpt-5.5", provider: "OpenAI", workOrders: 168, tokens: "1.32B", spend: 3980, costPerWO: "$23.69", color: "var(--chart-2)" },
  { name: "claude-sonnet-4.6", provider: "Anthropic", workOrders: 96, tokens: "0.71B", spend: 1240, costPerWO: "$12.92", color: "var(--chart-3)" },
  { name: "embeddings + tools", provider: "Mixed", workOrders: 0, tokens: "0.40B", spend: 410, costPerWO: "—", color: "var(--chart-5)" },
]

const totalSpend = models.reduce((sum, m) => sum + m.spend, 0)

function money(value: number) {
  return `$${value.toLocaleString()}`
}

export default function CostPage() {
  return (
    <DashboardShell breadcrumb={[{ label: "Operate" }, { label: "Cost & Models" }]}>
      <PageContainer>
        <PageHeader
          title="Cost & Models"
          subtitle="Compute spend, token usage, and unit economics per model."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Spend (MTD)" value={money(totalSpend)} change={{ trend: "up", label: "+9%" }} footnote="of $18k budget" />
          <MetricCard label="Cost per WO" value="$24.80" change={{ trend: "down", label: "-$3.10" }} footnote="blended, trending down" />
          <MetricCard label="Tokens (MTD)" value="4.27B" footnote="input + output" />
          <MetricCard label="Budget Used" value="65%" footnote="14 days remaining" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by Model</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {models.map((model) => (
                <div
                  key={model.name}
                  style={{
                    width: `${(model.spend / totalSpend) * 100}%`,
                    backgroundColor: model.color,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {models.map((model) => (
                <div key={model.name} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  <span className="text-sm text-muted-foreground">{model.name}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {Math.round((model.spend / totalSpend) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Model Breakdown</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Model</TableHead>
                  <TableHead className="px-4">Provider</TableHead>
                  <TableHead className="px-4 text-right">Work Orders</TableHead>
                  <TableHead className="px-4 text-right">Tokens</TableHead>
                  <TableHead className="px-4 text-right">Spend</TableHead>
                  <TableHead className="px-4 text-right">Cost / WO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.name}>
                    <TableCell className="px-4 py-3 font-mono font-medium">
                      {model.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {model.provider}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {model.workOrders || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {model.tokens}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {money(model.spend)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {model.costPerWO}
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
