export type SkillCategory =
  | "discovery"
  | "tonality"
  | "qualification"
  | "objectionHandling"
  | "closing"

export const SKILL_LABELS: Record<SkillCategory, string> = {
  discovery: "Discovery",
  tonality: "Tonality",
  qualification: "Qualification",
  objectionHandling: "Objection Handling",
  closing: "Closing",
}

export type CoachingStatus = "assigned" | "in_progress" | "completed"

export type CoachingItem = {
  title: string
  status: CoachingStatus
}

export type Rep = {
  id: string
  name: string
  role: string
  revenue: string
  closeRate: string
  showRate: string
  capacity: number
  coachability: number
  hotList: number
  bloodGoal: string
  stretchGoal: string
  goalProgress: number
  lastReviewedAt: string
  skillScores: Record<SkillCategory, number>
  coachingItems: CoachingItem[]
  recurringIssues: string[]
}

export const reps: Rep[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Closer",
    revenue: "$62,400",
    closeRate: "34%",
    showRate: "78%",
    capacity: 82,
    coachability: 8.6,
    hotList: 12,
    bloodGoal: "$50,000",
    stretchGoal: "$75,000",
    goalProgress: 83,
    lastReviewedAt: "2 days ago",
    skillScores: {
      discovery: 88,
      tonality: 84,
      qualification: 90,
      objectionHandling: 82,
      closing: 86,
    },
    coachingItems: [
      { title: "Tighten discovery framing on enterprise calls", status: "completed" },
      { title: "Apply the 3-step objection loop", status: "completed" },
      { title: "Reinforce next-step commitment before close", status: "completed" },
      { title: "Slow down the closing sequence", status: "in_progress" },
    ],
    recurringIssues: ["Occasionally rushes the close"],
  },
  {
    id: "marcus-webb",
    name: "Marcus Webb",
    role: "Closer",
    revenue: "$54,900",
    closeRate: "31%",
    showRate: "74%",
    capacity: 74,
    coachability: 8.1,
    hotList: 9,
    bloodGoal: "$50,000",
    stretchGoal: "$70,000",
    goalProgress: 78,
    lastReviewedAt: "4 days ago",
    skillScores: {
      discovery: 82,
      tonality: 80,
      qualification: 84,
      objectionHandling: 76,
      closing: 81,
    },
    coachingItems: [
      { title: "Surface budget earlier in discovery", status: "completed" },
      { title: "Mirror tone on price objections", status: "completed" },
      { title: "Build a stronger qualification checklist", status: "in_progress" },
      { title: "Practice reframing the 'think about it' objection", status: "assigned" },
    ],
    recurringIssues: ["Objection handling under pressure"],
  },
  {
    id: "diego-ramos",
    name: "Diego Ramos",
    role: "Closer",
    revenue: "$48,200",
    closeRate: "29%",
    showRate: "71%",
    capacity: 91,
    coachability: 7.4,
    hotList: 15,
    bloodGoal: "$45,000",
    stretchGoal: "$65,000",
    goalProgress: 74,
    lastReviewedAt: "3 days ago",
    skillScores: {
      discovery: 79,
      tonality: 76,
      qualification: 72,
      objectionHandling: 64,
      closing: 75,
    },
    coachingItems: [
      { title: "Use the objection-handling framework on every call", status: "in_progress" },
      { title: "Confirm decision-maker before demo", status: "completed" },
      { title: "Reduce talk-time ratio to under 45%", status: "assigned" },
    ],
    recurringIssues: ["High talk-time", "Skips qualification steps"],
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Setter",
    revenue: "$41,800",
    closeRate: "27%",
    showRate: "69%",
    capacity: 68,
    coachability: 8.9,
    hotList: 7,
    bloodGoal: "$40,000",
    stretchGoal: "$55,000",
    goalProgress: 76,
    lastReviewedAt: "1 day ago",
    skillScores: {
      discovery: 86,
      tonality: 88,
      qualification: 83,
      objectionHandling: 80,
      closing: 78,
    },
    coachingItems: [
      { title: "Lead with a sharper opening hook", status: "completed" },
      { title: "Qualify pain before booking", status: "completed" },
      { title: "Confirm appointment with a calendar hold", status: "completed" },
    ],
    recurringIssues: [],
  },
  {
    id: "tyler-brooks",
    name: "Tyler Brooks",
    role: "Closer",
    revenue: "$22,300",
    closeRate: "18%",
    showRate: "52%",
    capacity: 58,
    coachability: 5.9,
    hotList: 5,
    bloodGoal: "$45,000",
    stretchGoal: "$60,000",
    goalProgress: 41,
    lastReviewedAt: "8 days ago",
    skillScores: {
      discovery: 58,
      tonality: 62,
      qualification: 54,
      objectionHandling: 49,
      closing: 56,
    },
    coachingItems: [
      { title: "Rebuild discovery from the ground up", status: "assigned" },
      { title: "Stop discounting before objections surface", status: "assigned" },
      { title: "Complete objection-handling module", status: "in_progress" },
      { title: "Review 3 closing call recordings", status: "assigned" },
    ],
    recurringIssues: [
      "Discounts too early",
      "Weak discovery",
      "Misses objections",
    ],
  },
  {
    id: "jordan-lee",
    name: "Jordan Lee",
    role: "Setter",
    revenue: "$19,700",
    closeRate: "16%",
    showRate: "48%",
    capacity: 49,
    coachability: 5.4,
    hotList: 4,
    bloodGoal: "$40,000",
    stretchGoal: "$55,000",
    goalProgress: 38,
    lastReviewedAt: "11 days ago",
    skillScores: {
      discovery: 52,
      tonality: 60,
      qualification: 48,
      objectionHandling: 46,
      closing: 50,
    },
    coachingItems: [
      { title: "Follow the call opening script", status: "assigned" },
      { title: "Qualify before booking the appointment", status: "assigned" },
      { title: "Reduce no-shows with confirmation cadence", status: "in_progress" },
      { title: "Shadow a top setter for 5 calls", status: "assigned" },
    ],
    recurringIssues: [
      "Books unqualified meetings",
      "Low show rate",
    ],
  },
]

export function getRep(id: string): Rep | undefined {
  return reps.find((rep) => rep.id === id)
}

export function isBelowBaseline(rep: Rep): boolean {
  return rep.coachability < 6
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function coachingStats(rep: Rep) {
  const assigned = rep.coachingItems.length
  const completed = rep.coachingItems.filter(
    (item) => item.status === "completed"
  ).length
  const inProgress = rep.coachingItems.filter(
    (item) => item.status === "in_progress"
  ).length
  const implementationRate =
    assigned === 0 ? 0 : Math.round((completed / assigned) * 100)
  return { assigned, completed, inProgress, implementationRate }
}

export function overallSkill(rep: Rep): number {
  const values = Object.values(rep.skillScores)
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

export function capacityStatus(capacity: number): {
  label: string
  tone: "destructive" | "secondary"
} {
  if (capacity >= 90) return { label: "Over", tone: "destructive" }
  if (capacity >= 75) return { label: "Near", tone: "secondary" }
  return { label: "Healthy", tone: "secondary" }
}
