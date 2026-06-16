import { Badge } from "@/components/ui/badge"
import { MetricCard } from "@/components/overview/metric-card"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
    </section>
  )
}

export function SectionCards() {
  return (
    <div className="flex flex-col gap-10">
      <Section title="Revenue">
        <MetricCard
          label="Revenue This Month"
          value="$248,500"
          change={{ trend: "up", label: "+12%" }}
          footnote="vs. $221,800 last month"
        />
        <MetricCard
          label="Forecast"
          value="$312,000"
          footnote={
            <span className="flex items-center gap-2">
              Projected close
              <Badge variant="secondary">High confidence</Badge>
            </span>
          }
        />
        <MetricCard
          label="Pipeline Value"
          value="$1.42M"
          footnote="86 active opportunities"
        />
      </Section>

      <Section title="Execution Health">
        <MetricCard
          label="Follow-Up Compliance"
          value="82%"
          change={{ trend: "up", label: "+4%" }}
          footnote="14 follow-ups overdue"
        />
        <MetricCard
          label="Speed to Lead"
          value="6m 12s"
          change={{ trend: "down", label: "-18s" }}
          footnote={
            <span className="flex items-center gap-2">
              94% within SLA
              <Badge variant="secondary">10 min target</Badge>
            </span>
          }
        />
        <MetricCard
          label="CRM Compliance"
          value="88%"
          change={{ trend: "up", label: "+2%" }}
          footnote="3 open red flags"
        />
      </Section>

      <Section title="Team Health">
        <MetricCard
          label="Coachability"
          value="7.8"
          change={{ trend: "up", label: "+0.3" }}
          footnote="Team average, trending up"
        />
        <MetricCard
          label="Team Capacity"
          value="76%"
          footnote={
            <span className="flex items-center gap-2">
              Utilization
              <Badge variant="secondary">Healthy</Badge>
            </span>
          }
        />
        <MetricCard
          label="Reps Below Baseline"
          value="2"
          footnote="of 9 reps need coaching"
        />
      </Section>
    </div>
  )
}
