export type AssetItem = {
  title: string
  kind: string
  updated: string
}

export type AssetCategory = {
  slug: string
  title: string
  description: string
  count: number
  items: AssetItem[]
}

export const assetCategories: AssetCategory[] = [
  {
    slug: "follow-up-templates",
    title: "Follow-Up Templates",
    description: "Cadence emails and texts for every stage.",
    count: 18,
    items: [
      { title: "Day 1 — Demo recap email", kind: "Email", updated: "2 days ago" },
      { title: "Day 3 — Value nudge text", kind: "Text", updated: "2 days ago" },
      { title: "Day 7 — Case study share", kind: "Email", updated: "1 week ago" },
      { title: "Day 14 — Pricing follow-up", kind: "Email", updated: "1 week ago" },
      { title: "Day 30 — Reactivation", kind: "Text", updated: "3 weeks ago" },
    ],
  },
  {
    slug: "objection-library",
    title: "Objection Library",
    description: "Proven responses to common objections.",
    count: 24,
    items: [
      { title: "“It's too expensive”", kind: "Script", updated: "5 days ago" },
      { title: "“I need to think about it”", kind: "Script", updated: "5 days ago" },
      { title: "“Send me some info”", kind: "Script", updated: "1 week ago" },
      { title: "“We already use a competitor”", kind: "Script", updated: "2 weeks ago" },
    ],
  },
  {
    slug: "sales-decks",
    title: "Sales Decks",
    description: "Pitch and proposal decks by offer.",
    count: 9,
    items: [
      { title: "Done-For-You pitch deck", kind: "Deck", updated: "1 week ago" },
      { title: "Accelerator proposal", kind: "Deck", updated: "2 weeks ago" },
      { title: "Enterprise overview", kind: "Deck", updated: "3 weeks ago" },
    ],
  },
  {
    slug: "demo-recordings",
    title: "Demo Recordings",
    description: "Top-performing recorded demos.",
    count: 32,
    items: [
      { title: "Sarah Chen — Northwind close", kind: "Recording", updated: "3 days ago" },
      { title: "Marcus Webb — Acme negotiation", kind: "Recording", updated: "4 days ago" },
      { title: "Diego Ramos — Globex discovery", kind: "Recording", updated: "1 week ago" },
    ],
  },
  {
    slug: "call-scripts",
    title: "Call Scripts",
    description: "Discovery, close, and reactivation scripts.",
    count: 14,
    items: [
      { title: "Discovery call framework", kind: "Script", updated: "Yesterday" },
      { title: "Closing sequence", kind: "Script", updated: "3 days ago" },
      { title: "No-show reactivation", kind: "Script", updated: "1 week ago" },
    ],
  },
  {
    slug: "case-studies",
    title: "Case Studies",
    description: "Proof assets and customer wins.",
    count: 11,
    items: [
      { title: "Cyberdyne — 3x pipeline in 90 days", kind: "PDF", updated: "2 weeks ago" },
      { title: "Tyrell Corp — onboarding win", kind: "PDF", updated: "3 weeks ago" },
    ],
  },
]

export function getAssetCategory(slug: string): AssetCategory | undefined {
  return assetCategories.find((category) => category.slug === slug)
}
