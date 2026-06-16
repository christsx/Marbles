export type WorkOrderStage =
  | "Spec"
  | "Blueprint"
  | "Build"
  | "Test"
  | "Review"
  | "Ship"

export type WorkOrderStatus =
  | "Queued"
  | "In progress"
  | "In review"
  | "Blocked"
  | "Failing"
  | "Shipped"

export type WorkOrderView = "now" | "review" | "blocked" | "queued" | "shipped"

export const WORK_ORDER_VIEWS: { id: WorkOrderView; label: string }[] = [
  { id: "now", label: "Now" },
  { id: "review", label: "In Review" },
  { id: "blocked", label: "Blocked" },
  { id: "queued", label: "Queued" },
  { id: "shipped", label: "Shipped" },
]

export type WorkOrder = {
  id: string
  priority: number
  title: string
  repo: string
  agent: string
  stage: WorkOrderStage
  status: WorkOrderStatus
  reason: string
  nextAction: string
  updated: string
  starred: boolean
  view: WorkOrderView
}

export const workOrders: WorkOrder[] = [
  { id: "WO-1842", priority: 98, title: "Add OAuth device-code flow", repo: "core-api", agent: "Orion", stage: "Review", status: "In review", reason: "PR open, 1 review comment on token TTL", nextAction: "Resolve review comment on token TTL", updated: "12 min ago", starred: true, view: "review" },
  { id: "WO-1839", priority: 92, title: "Billing usage metering pipeline", repo: "billing-svc", agent: "Atlas", stage: "Build", status: "In progress", reason: "Implementing idempotent event writes", nextAction: "Wire idempotent event writes", updated: "3 min ago", starred: true, view: "now" },
  { id: "WO-1835", priority: 87, title: "Dashboard real-time work-order feed", repo: "web-app", agent: "Nova", stage: "Test", status: "Failing", reason: "Flaky websocket reconnect test", nextAction: "Fix flaky websocket reconnect test", updated: "20 min ago", starred: true, view: "blocked" },
  { id: "WO-1828", priority: 79, title: "Migrate sessions to Postgres", repo: "core-api", agent: "Echo", stage: "Blueprint", status: "Blocked", reason: "Awaiting migration plan approval", nextAction: "Awaiting migration plan approval", updated: "2 hours ago", starred: false, view: "blocked" },
  { id: "WO-1821", priority: 74, title: "Public REST API reference docs", repo: "docs-site", agent: "Sol", stage: "Spec", status: "Queued", reason: "Spec not generated from OpenAPI yet", nextAction: "Generate spec from OpenAPI", updated: "1 hour ago", starred: false, view: "queued" },
  { id: "WO-1817", priority: 68, title: "Add audit log export endpoint", repo: "core-api", agent: "Orion", stage: "Build", status: "In progress", reason: "Adding pagination and rate limiting", nextAction: "Add pagination + rate limit", updated: "8 min ago", starred: false, view: "now" },
  { id: "WO-1810", priority: 61, title: "Dark-mode token pass on settings", repo: "web-app", agent: "Nova", stage: "Review", status: "In review", reason: "Contrast feedback from review", nextAction: "Address contrast feedback", updated: "35 min ago", starred: false, view: "review" },
  { id: "WO-1804", priority: 55, title: "Nightly DB backup verification job", repo: "infra", agent: "Echo", stage: "Test", status: "In progress", reason: "Adding restore smoke test", nextAction: "Add restore smoke test", updated: "1 hour ago", starred: false, view: "now" },
  { id: "WO-1799", priority: 48, title: "Granular RBAC policy engine", repo: "core-api", agent: "Atlas", stage: "Spec", status: "Queued", reason: "Spec drafted, awaiting blueprint", nextAction: "Promote spec to blueprint", updated: "3 hours ago", starred: false, view: "queued" },
  { id: "WO-1788", priority: 0, title: "Webhook retry with backoff", repo: "core-api", agent: "Orion", stage: "Ship", status: "Shipped", reason: "Merged and deployed to prod", nextAction: "—", updated: "Yesterday", starred: false, view: "shipped" },
  { id: "WO-1781", priority: 0, title: "Settings page responsive layout", repo: "web-app", agent: "Nova", stage: "Ship", status: "Shipped", reason: "Merged and deployed to prod", nextAction: "—", updated: "2 days ago", starred: false, view: "shipped" },
  { id: "WO-1774", priority: 0, title: "API versioning middleware", repo: "core-api", agent: "Atlas", stage: "Ship", status: "Shipped", reason: "Merged and deployed to prod", nextAction: "—", updated: "3 days ago", starred: false, view: "shipped" },
]

export const STAGE_ORDER: WorkOrderStage[] = [
  "Spec",
  "Blueprint",
  "Build",
  "Test",
  "Review",
  "Ship",
]

export function stageCounts(): Record<WorkOrderStage, number> {
  return {
    Spec: 6,
    Blueprint: 4,
    Build: 11,
    Test: 7,
    Review: 5,
    Ship: 3,
  }
}

export function workOrdersByView(view: WorkOrderView): WorkOrder[] {
  return workOrders
    .filter((wo) => wo.view === view)
    .sort((a, b) => b.priority - a.priority)
}

export function viewCounts(): Record<WorkOrderView, number> {
  return workOrders.reduce(
    (acc, wo) => {
      acc[wo.view] += 1
      return acc
    },
    { now: 0, review: 0, blocked: 0, queued: 0, shipped: 0 }
  )
}

export function getWorkOrder(id: string): WorkOrder | undefined {
  return workOrders.find((wo) => wo.id === id)
}
