import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScorePill } from "@/components/score-pill"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Status = "At risk" | "Proposal" | "Negotiation" | "Stalled"

type Opportunity = {
  priority: number
  name: string
  company: string
  value: string
  owner: string
  status: Status
  nextAction: string
}

const opportunities: Opportunity[] = [
  { priority: 98, name: "Q3 Platform Expansion", company: "Northwind", value: "$84,000", owner: "Sarah Chen", status: "Proposal", nextAction: "Send revised proposal" },
  { priority: 92, name: "Enterprise Rollout", company: "Acme Corp", value: "$72,500", owner: "Marcus Webb", status: "Negotiation", nextAction: "Confirm contract terms" },
  { priority: 87, name: "Multi-seat Upgrade", company: "Globex", value: "$58,200", owner: "Diego Ramos", status: "At risk", nextAction: "Re-engage — ghosting 6d" },
  { priority: 79, name: "Annual Renewal", company: "Initech", value: "$46,000", owner: "Priya Nair", status: "Stalled", nextAction: "Schedule decision call" },
  { priority: 74, name: "Pilot to Production", company: "Umbrella", value: "$39,800", owner: "Sarah Chen", status: "Proposal", nextAction: "Follow up on pricing" },
]

function StatusBadge({ status }: { status: Status }) {
  if (status === "At risk") {
    return <Badge variant="destructive">{status}</Badge>
  }
  if (status === "Stalled") {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
        {status}
      </Badge>
    )
  }
  return <Badge variant="secondary">{status}</Badge>
}

export function OpportunityHealth() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-medium">Opportunity Health</h2>
        <span className="text-sm text-muted-foreground">Top priority deals</span>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 px-4">Priority</TableHead>
              <TableHead className="px-4">Opportunity</TableHead>
              <TableHead className="px-4 text-right">Value</TableHead>
              <TableHead className="px-4">Owner</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4">Next Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opp, i) => (
              <TableRow key={i}>
                <TableCell className="px-4 py-3">
                  <ScorePill score={opp.priority} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span className="font-medium">{opp.name}</span>
                  <span className="ml-1.5 text-muted-foreground">
                    {opp.company}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-right font-medium tabular-nums">
                  {opp.value}
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {opp.owner}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusBadge status={opp.status} />
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {opp.nextAction}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </section>
  )
}
