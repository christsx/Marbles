export type OpportunityView = "today" | "overdue" | "active" | "closed" | "lost"

export const OPPORTUNITY_VIEWS: { id: OpportunityView; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "overdue", label: "Overdue" },
  { id: "active", label: "Active" },
  { id: "closed", label: "Closed" },
  { id: "lost", label: "Lost" },
]

export type Opportunity = {
  id: string
  name: string
  company: string
  owner: string
  value: string
  stage: string
  score: number
  reason: string
  lastContact: string
  nextFollowUp: string
  starred: boolean
  view: OpportunityView
}

export const opportunities: Opportunity[] = [
  {
    id: "northwind-platform",
    name: "Q3 Platform Expansion",
    company: "Northwind",
    owner: "Sarah Chen",
    value: "$84,000",
    stage: "Proposal",
    score: 98,
    reason: "Proposal sent 5 days ago, opened 3x — no reply",
    lastContact: "5 days ago",
    nextFollowUp: "Today",
    starred: true,
    view: "today",
  },
  {
    id: "acme-enterprise",
    name: "Enterprise Rollout",
    company: "Acme Corp",
    owner: "Marcus Webb",
    value: "$72,500",
    stage: "Negotiation",
    score: 94,
    reason: "Pricing page viewed twice in 24h",
    lastContact: "2 days ago",
    nextFollowUp: "Today",
    starred: true,
    view: "today",
  },
  {
    id: "initech-renewal",
    name: "Annual Renewal",
    company: "Initech",
    owner: "Priya Nair",
    value: "$46,000",
    stage: "Demo",
    score: 88,
    reason: "Renewal date in 9 days — confirm terms",
    lastContact: "1 day ago",
    nextFollowUp: "Today",
    starred: false,
    view: "today",
  },
  {
    id: "globex-multiseat",
    name: "Multi-seat Upgrade",
    company: "Globex",
    owner: "Diego Ramos",
    value: "$58,200",
    stage: "Proposal",
    score: 91,
    reason: "Ghosting 6 days after proposal",
    lastContact: "6 days ago",
    nextFollowUp: "2 days ago",
    starred: true,
    view: "overdue",
  },
  {
    id: "umbrella-pilot",
    name: "Pilot to Production",
    company: "Umbrella",
    owner: "Sarah Chen",
    value: "$39,800",
    stage: "Proposal",
    score: 83,
    reason: "Follow-up on pricing missed",
    lastContact: "8 days ago",
    nextFollowUp: "3 days ago",
    starred: false,
    view: "overdue",
  },
  {
    id: "soylent-expansion",
    name: "Team Expansion",
    company: "Soylent",
    owner: "Tyler Brooks",
    value: "$31,000",
    stage: "Discovery",
    score: 72,
    reason: "No-show on demo — re-engage",
    lastContact: "4 days ago",
    nextFollowUp: "1 day ago",
    starred: false,
    view: "overdue",
  },
  {
    id: "hooli-platform",
    name: "Platform Migration",
    company: "Hooli",
    owner: "Marcus Webb",
    value: "$64,000",
    stage: "Discovery",
    score: 79,
    reason: "Active discovery — next call booked",
    lastContact: "3 days ago",
    nextFollowUp: "In 2 days",
    starred: false,
    view: "active",
  },
  {
    id: "stark-rollout",
    name: "Division Rollout",
    company: "Stark Industries",
    owner: "Priya Nair",
    value: "$52,400",
    stage: "Demo",
    score: 76,
    reason: "Demo completed — sending recap",
    lastContact: "2 days ago",
    nextFollowUp: "In 3 days",
    starred: false,
    view: "active",
  },
  {
    id: "wayne-security",
    name: "Security Add-on",
    company: "Wayne Enterprises",
    owner: "Diego Ramos",
    value: "$28,900",
    stage: "Discovery",
    score: 68,
    reason: "Early stage — nurturing",
    lastContact: "5 days ago",
    nextFollowUp: "In 5 days",
    starred: false,
    view: "active",
  },
  {
    id: "cyberdyne-annual",
    name: "Annual Contract",
    company: "Cyberdyne",
    owner: "Sarah Chen",
    value: "$96,000",
    stage: "Closed Won",
    score: 100,
    reason: "Closed won — contract signed",
    lastContact: "Yesterday",
    nextFollowUp: "—",
    starred: false,
    view: "closed",
  },
  {
    id: "tyrell-platform",
    name: "Platform License",
    company: "Tyrell Corp",
    owner: "Marcus Webb",
    value: "$41,200",
    stage: "Closed Won",
    score: 100,
    reason: "Closed won — onboarding scheduled",
    lastContact: "3 days ago",
    nextFollowUp: "—",
    starred: false,
    view: "closed",
  },
  {
    id: "oscorp-upgrade",
    name: "Tier Upgrade",
    company: "Oscorp",
    owner: "Tyler Brooks",
    value: "$33,500",
    stage: "Closed Lost",
    score: 0,
    reason: "Lost to competitor on price",
    lastContact: "9 days ago",
    nextFollowUp: "—",
    starred: false,
    view: "lost",
  },
]

export function opportunitiesByView(view: OpportunityView): Opportunity[] {
  return opportunities
    .filter((opp) => opp.view === view)
    .sort((a, b) => b.score - a.score)
}

export function viewCounts(): Record<OpportunityView, number> {
  return opportunities.reduce(
    (acc, opp) => {
      acc[opp.view] += 1
      return acc
    },
    { today: 0, overdue: 0, active: 0, closed: 0, lost: 0 }
  )
}
