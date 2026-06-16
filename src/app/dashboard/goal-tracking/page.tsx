import Link from "next/link"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageContainer } from "@/components/page-container"
import { PageHeader } from "@/components/page-header"
import { MetricCard } from "@/components/overview/metric-card"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ProgressBar } from "@/components/progress-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { reps } from "@/lib/reps"

export default function GoalTrackingPage() {
  const onPace = reps.filter((r) => r.goalProgress >= 70).length
  const behind = reps.filter((r) => r.goalProgress < 50).length

  return (
    <DashboardShell
      breadcrumb={[{ label: "Performance" }, { label: "Goal Tracking" }]}
    >
      <PageContainer>
        <PageHeader
          title="Goal Tracking"
          subtitle="Blood goals, stretch goals, and pacing across the team."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Team Attainment" value="71%" change={{ trend: "up", label: "+6%" }} footnote="to blood goal" />
          <MetricCard label="On Pace" value={`${onPace}`} footnote={`of ${reps.length} reps`} />
          <MetricCard label="Behind" value={`${behind}`} footnote="need attention" />
          <MetricCard label="Days Left" value="14" footnote="in the month" />
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-base font-medium">Goal Progress by Rep</h2>
          <Card className="py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Rep</TableHead>
                  <TableHead className="px-4 text-right">Blood Goal</TableHead>
                  <TableHead className="px-4 text-right">Stretch Goal</TableHead>
                  <TableHead className="px-4">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reps.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell className="px-4 py-3">
                      <Link
                        href={`/dashboard/reps/${rep.id}`}
                        className="font-medium hover:underline"
                      >
                        {rep.name}
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums">
                      {rep.bloodGoal}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                      {rep.stretchGoal}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProgressBar value={rep.goalProgress} className="max-w-40" />
                        <span className="w-10 text-sm tabular-nums text-muted-foreground">
                          {rep.goalProgress}%
                        </span>
                        {rep.goalProgress < 50 && (
                          <Badge variant="destructive">Behind</Badge>
                        )}
                      </div>
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
