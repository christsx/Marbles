import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { agents, initials, isBelowBaseline } from "@/lib/agents"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}

export function AgentFleet() {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-medium">Agent Fleet</h2>
        <span className="text-sm text-muted-foreground">{agents.length} agents</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const belowBaseline = isBelowBaseline(agent)
          return (
            <Link
              key={agent.id}
              href={`/dashboard/agents/${agent.id}`}
              className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Card
                className={cn(
                  "group/agent h-full cursor-pointer transition-colors hover:bg-muted/40",
                  belowBaseline &&
                    "bg-rose-500/[0.03] ring-rose-500/25 dark:bg-rose-500/5"
                )}
              >
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-medium",
                          belowBaseline &&
                            "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {initials(agent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-sm font-medium">{agent.name}</span>
                      {belowBaseline ? (
                        <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                          <span className="size-1.5 rounded-full bg-rose-500" />
                          Below baseline
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {agent.role}
                        </span>
                      )}
                    </div>
                    <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover/agent:translate-x-0.5" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Shipped" value={agent.shipped} />
                    <Stat label="Merge" value={agent.mergeRate} />
                    <Stat label="Active" value={`${agent.activeOrders}`} />
                    <Stat label="Util" value={`${agent.utilization}%`} />
                    <Stat label="Rel" value={agent.reliability.toFixed(1)} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
