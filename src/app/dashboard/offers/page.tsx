import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { ProgressBar } from "@/components/progress-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Offer = {
  name: string
  price: number
  units: number
  revenue: number
  margin: number
  cac: number
  ltv: number
  roas: string
  color: string
}

const offers: Offer[] = [
  { name: "Done-For-You", price: 12000, units: 11, revenue: 132000, margin: 68, cac: 1420, ltv: 28800, roas: "4.2x", color: "var(--chart-1)" },
  { name: "Accelerator", price: 6000, units: 16, revenue: 96000, margin: 72, cac: 960, ltv: 14400, roas: "3.8x", color: "var(--chart-2)" },
  { name: "Coaching", price: 2400, units: 27, revenue: 64800, margin: 81, cac: 540, ltv: 7200, roas: "5.1x", color: "var(--chart-3)" },
  { name: "Workshop", price: 1200, units: 32, revenue: 38400, margin: 76, cac: 310, ltv: 2800, roas: "4.6x", color: "var(--chart-4)" },
  { name: "Audit", price: 750, units: 29, revenue: 21750, margin: 84, cac: 190, ltv: 1950, roas: "6.0x", color: "var(--chart-5)" },
]

const totalRevenue = offers.reduce((sum, o) => sum + o.revenue, 0)

function money(value: number) {
  return `$${value.toLocaleString()}`
}

export default function OffersPage() {
  return (
    <DashboardShell
      breadcrumb={[{ label: "Performance" }, { label: "Offer Financial Models" }]}
    >
      <PageContainer>
        <PageHeader
          title="Offer Financial Models"
          subtitle="Unit economics and profitability by offer."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Top Offer" value="Done-For-You" footnote="$132k revenue" />
          <MetricCard label="Total Revenue" value={money(totalRevenue)} change={{ trend: "up", label: "+11%" }} footnote="across 5 offers" />
          <MetricCard label="Avg Margin" value="76%" change={{ trend: "up", label: "+2%" }} footnote="blended" />
          <MetricCard label="Best ROAS" value="6.0x" footnote="Audit offer" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Mix</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {offers.map((offer) => (
                <div
                  key={offer.name}
                  style={{
                    width: `${(offer.revenue / totalRevenue) * 100}%`,
                    backgroundColor: offer.color,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {offers.map((offer) => (
                <div key={offer.name} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: offer.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {offer.name}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {Math.round((offer.revenue / totalRevenue) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Offer Breakdown</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Offer</TableHead>
                  <TableHead className="px-4 text-right">Price</TableHead>
                  <TableHead className="px-4 text-right">Units</TableHead>
                  <TableHead className="px-4 text-right">Revenue</TableHead>
                  <TableHead className="w-40 px-4">Margin</TableHead>
                  <TableHead className="px-4 text-right">CAC</TableHead>
                  <TableHead className="px-4 text-right">LTV</TableHead>
                  <TableHead className="px-4 text-right">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.name}>
                    <TableCell className="px-4 py-3 font-medium">{offer.name}</TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {money(offer.price)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {offer.units}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {money(offer.revenue)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <ProgressBar value={offer.margin} className="flex-1" />
                        <span className="w-9 text-right text-sm tabular-nums text-muted-foreground">
                          {offer.margin}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {money(offer.cac)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {money(offer.ltv)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                      {offer.roas}
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
