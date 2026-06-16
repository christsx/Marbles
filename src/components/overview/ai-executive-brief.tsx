import { Badge } from "@/components/ui/badge"
import { PanelCard } from "@/components/overview/panel-card"
import { cn } from "@/lib/utils"

function WandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <path
        d="M13.0001 14L10.0001 11M15.0104 3.5V2M18.9498 5.06066L20.0104 4M18.9498 13L20.0104 14.0607M11.0104 5.06066L9.94979 4M20.5104 9H22.0104M6.13146 20.8686L15.3687 11.6314C15.7647 11.2354 15.9627 11.0373 16.0369 10.809C16.1022 10.6082 16.1022 10.3918 16.0369 10.191C15.9627 9.96265 15.7647 9.76465 15.3687 9.36863L14.6315 8.63137C14.2354 8.23535 14.0374 8.03735 13.8091 7.96316C13.6083 7.8979 13.3919 7.8979 13.1911 7.96316C12.9627 8.03735 12.7647 8.23535 12.3687 8.63137L3.13146 17.8686C2.73545 18.2646 2.53744 18.4627 2.46325 18.691C2.39799 18.8918 2.39799 19.1082 2.46325 19.309C2.53744 19.5373 2.73545 19.7354 3.13146 20.1314L3.86872 20.8686C4.26474 21.2646 4.46275 21.4627 4.69108 21.5368C4.89192 21.6021 5.10827 21.6021 5.30911 21.5368C5.53744 21.4627 5.73545 21.2646 6.13146 20.8686Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const insights = [
  { text: "Throughput up 18% week-over-week — 142 work orders shipped.", tone: "positive" as const },
  { text: "Merge rate held at 92% with cycle time down to 3.4h median.", tone: "positive" as const },
  { text: "2 agents below baseline (Echo, Sol) — calibration recommended.", tone: "warning" as const },
  { text: "11 flaky tests blocking the web-app suite from going green.", tone: "warning" as const },
  { text: "Deploy success at 98%; last release shipped 12 minutes ago.", tone: "positive" as const },
]

export function AiExecutiveBrief() {
  return (
    <PanelCard className="flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2">
          <WandIcon className="size-5 text-muted-foreground" />
          <h2 className="font-heading text-base font-medium">AI factory brief</h2>
        </div>
        <Badge variant="secondary">Updated 8:00 AM</Badge>
      </div>
      <ul className="flex flex-col divide-y divide-border/60 border-t border-border/60 px-5">
        {insights.map((item, i) => (
          <li key={i} className="flex items-start gap-3 py-3 first:pt-4 last:pb-4">
            <span
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                item.tone === "warning" ? "bg-amber-500" : "bg-emerald-500"
              )}
            />
            <span className="text-sm leading-relaxed">{item.text}</span>
          </li>
        ))}
      </ul>
    </PanelCard>
  )
}
