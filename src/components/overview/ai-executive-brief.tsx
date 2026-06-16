import { Badge } from "@/components/ui/badge"
import { PanelCard } from "@/components/overview/panel-card"

const insights = [
  "Throughput up 18% week-over-week — 142 work orders shipped.",
  "Merge rate held at 92% with cycle time down to 3.4h median.",
  "2 agents below baseline (Echo, Sol) — calibration recommended.",
  "11 flaky tests blocking the web-app suite from going green.",
  "Deploy success at 98%; last release shipped 12 minutes ago.",
]

export function AiExecutiveBrief() {
  return (
    <PanelCard className="flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold">Summary</h2>
          <p className="text-sm text-muted-foreground">Key signals from the last 24 hours</p>
        </div>
        <Badge variant="outline">Updated 8:00 AM</Badge>
      </div>
      <ul className="flex flex-col divide-y divide-border border-t border-border px-5">
        {insights.map((text, i) => (
          <li key={i} className="py-3.5 text-sm leading-relaxed text-foreground first:pt-4 last:pb-4">
            {text}
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
