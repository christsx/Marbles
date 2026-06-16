export type CapabilityCategory =
  | "planning"
  | "coding"
  | "testing"
  | "review"
  | "debugging"

export const CAPABILITY_LABELS: Record<CapabilityCategory, string> = {
  planning: "Planning",
  coding: "Coding",
  testing: "Testing",
  review: "Review",
  debugging: "Debugging",
}

export type CalibrationStatus = "queued" | "in_progress" | "applied"

export type CalibrationItem = {
  title: string
  status: CalibrationStatus
}

export type Agent = {
  id: string
  name: string
  role: string
  model: string
  shipped: string
  mergeRate: string
  testPassRate: string
  utilization: number
  reliability: number
  activeOrders: number
  weeklyTarget: string
  stretchTarget: string
  targetProgress: number
  lastActiveAt: string
  capabilityScores: Record<CapabilityCategory, number>
  calibrationItems: CalibrationItem[]
  recurringIssues: string[]
}

export const agents: Agent[] = [
  {
    id: "atlas",
    name: "Atlas",
    role: "Full-Stack Agent",
    model: "claude-opus-4.8",
    shipped: "142",
    mergeRate: "94%",
    testPassRate: "97%",
    utilization: 82,
    reliability: 8.6,
    activeOrders: 12,
    weeklyTarget: "120 WO",
    stretchTarget: "160 WO",
    targetProgress: 83,
    lastActiveAt: "2 min ago",
    capabilityScores: {
      planning: 88,
      coding: 91,
      testing: 84,
      review: 86,
      debugging: 82,
    },
    calibrationItems: [
      { title: "Prefer composition over deep inheritance", status: "applied" },
      { title: "Generate integration tests for new endpoints", status: "applied" },
      { title: "Confirm migration plan before schema changes", status: "applied" },
      { title: "Reduce diff size on large refactors", status: "in_progress" },
    ],
    recurringIssues: ["Occasionally over-scopes refactors"],
  },
  {
    id: "nova",
    name: "Nova",
    role: "Frontend Agent",
    model: "claude-opus-4.8",
    shipped: "118",
    mergeRate: "91%",
    testPassRate: "95%",
    utilization: 74,
    reliability: 8.1,
    activeOrders: 9,
    weeklyTarget: "110 WO",
    stretchTarget: "150 WO",
    targetProgress: 78,
    lastActiveAt: "5 min ago",
    capabilityScores: {
      planning: 82,
      coding: 90,
      testing: 80,
      review: 79,
      debugging: 81,
    },
    calibrationItems: [
      { title: "Use design tokens instead of hard-coded colors", status: "applied" },
      { title: "Add a11y labels to interactive elements", status: "applied" },
      { title: "Write component tests before merge", status: "in_progress" },
      { title: "Avoid client components when server works", status: "queued" },
    ],
    recurringIssues: ["Misses edge-case loading states"],
  },
  {
    id: "orion",
    name: "Orion",
    role: "Backend Agent",
    model: "gpt-5.5",
    shipped: "97",
    mergeRate: "88%",
    testPassRate: "92%",
    utilization: 91,
    reliability: 7.4,
    activeOrders: 15,
    weeklyTarget: "100 WO",
    stretchTarget: "140 WO",
    targetProgress: 74,
    lastActiveAt: "1 min ago",
    capabilityScores: {
      planning: 79,
      coding: 84,
      testing: 72,
      review: 76,
      debugging: 75,
    },
    calibrationItems: [
      { title: "Add input validation on every route handler", status: "in_progress" },
      { title: "Confirm idempotency before queue writes", status: "applied" },
      { title: "Keep migrations reversible", status: "queued" },
    ],
    recurringIssues: ["Thin test coverage", "Skips error-path handling"],
  },
  {
    id: "vega",
    name: "Vega",
    role: "QA Agent",
    model: "claude-opus-4.8",
    shipped: "83",
    mergeRate: "96%",
    testPassRate: "99%",
    utilization: 68,
    reliability: 8.9,
    activeOrders: 7,
    weeklyTarget: "80 WO",
    stretchTarget: "110 WO",
    targetProgress: 76,
    lastActiveAt: "3 min ago",
    capabilityScores: {
      planning: 86,
      coding: 78,
      testing: 96,
      review: 88,
      debugging: 90,
    },
    calibrationItems: [
      { title: "Prioritize flaky tests in the triage queue", status: "applied" },
      { title: "Generate property-based tests for parsers", status: "applied" },
      { title: "Tag regressions with the failing commit", status: "applied" },
    ],
    recurringIssues: [],
  },
  {
    id: "echo",
    name: "Echo",
    role: "Infra Agent",
    model: "gpt-5.5",
    shipped: "44",
    mergeRate: "72%",
    testPassRate: "81%",
    utilization: 58,
    reliability: 5.9,
    activeOrders: 5,
    weeklyTarget: "90 WO",
    stretchTarget: "120 WO",
    targetProgress: 41,
    lastActiveAt: "1 hr ago",
    capabilityScores: {
      planning: 58,
      coding: 62,
      testing: 54,
      review: 49,
      debugging: 56,
    },
    calibrationItems: [
      { title: "Rebuild Terraform module conventions", status: "queued" },
      { title: "Stop applying changes without a plan diff", status: "queued" },
      { title: "Complete rollback-safety calibration", status: "in_progress" },
      { title: "Review 3 failed deploy postmortems", status: "queued" },
    ],
    recurringIssues: [
      "Applies infra changes too eagerly",
      "Weak rollback planning",
      "Misses cost guardrails",
    ],
  },
  {
    id: "sol",
    name: "Sol",
    role: "Docs Agent",
    model: "gpt-5.5",
    shipped: "39",
    mergeRate: "70%",
    testPassRate: "79%",
    utilization: 49,
    reliability: 5.4,
    activeOrders: 4,
    weeklyTarget: "70 WO",
    stretchTarget: "100 WO",
    targetProgress: 38,
    lastActiveAt: "2 hr ago",
    capabilityScores: {
      planning: 52,
      coding: 60,
      testing: 48,
      review: 46,
      debugging: 50,
    },
    calibrationItems: [
      { title: "Follow the docs style guide", status: "queued" },
      { title: "Link API references to source symbols", status: "queued" },
      { title: "Keep changelog entries in sync with PRs", status: "in_progress" },
      { title: "Shadow Vega on 5 review passes", status: "queued" },
    ],
    recurringIssues: [
      "Docs drift from implementation",
      "Low cross-reference accuracy",
    ],
  },
]

export function getAgent(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id)
}

export function isBelowBaseline(agent: Agent): boolean {
  return agent.reliability < 6
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function calibrationStats(agent: Agent) {
  const queued = agent.calibrationItems.length
  const applied = agent.calibrationItems.filter(
    (item) => item.status === "applied"
  ).length
  const inProgress = agent.calibrationItems.filter(
    (item) => item.status === "in_progress"
  ).length
  const applyRate = queued === 0 ? 0 : Math.round((applied / queued) * 100)
  return { queued, applied, inProgress, applyRate }
}

export function overallCapability(agent: Agent): number {
  const values = Object.values(agent.capabilityScores)
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

export function utilizationStatus(utilization: number): {
  label: string
  tone: "destructive" | "secondary"
} {
  if (utilization >= 90) return { label: "Saturated", tone: "destructive" }
  if (utilization >= 75) return { label: "Busy", tone: "secondary" }
  return { label: "Healthy", tone: "secondary" }
}
