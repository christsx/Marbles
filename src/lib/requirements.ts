export type RequirementStatus =
  | "Triage"
  | "Specced"
  | "In build"
  | "Shipped"

export type RequirementSource =
  | "Customer"
  | "Founder"
  | "Support"
  | "Sales"
  | "Internal"

export type Requirement = {
  id: string
  title: string
  source: RequirementSource
  priority: number
  status: RequirementStatus
  owner: string
  created: string
}

export const requirements: Requirement[] = [
  { id: "REQ-318", title: "SSO with SAML for enterprise tenants", source: "Sales", priority: 96, status: "In build", owner: "Orion", created: "2 days ago" },
  { id: "REQ-317", title: "Export audit logs to S3", source: "Customer", priority: 91, status: "Specced", owner: "Atlas", created: "3 days ago" },
  { id: "REQ-314", title: "Granular role-based permissions", source: "Customer", priority: 88, status: "In build", owner: "Atlas", created: "4 days ago" },
  { id: "REQ-311", title: "Usage-based billing tiers", source: "Founder", priority: 84, status: "Triage", owner: "—", created: "5 days ago" },
  { id: "REQ-309", title: "Webhook retry with backoff", source: "Support", priority: 77, status: "Shipped", owner: "Orion", created: "1 week ago" },
  { id: "REQ-305", title: "Mobile-responsive settings pages", source: "Customer", priority: 69, status: "Triage", owner: "—", created: "1 week ago" },
  { id: "REQ-301", title: "In-app changelog feed", source: "Internal", priority: 58, status: "Specced", owner: "Nova", created: "2 weeks ago" },
]

export const sourceCounts: { source: RequirementSource; count: number }[] = [
  { source: "Customer", count: 41 },
  { source: "Sales", count: 22 },
  { source: "Support", count: 18 },
  { source: "Founder", count: 9 },
  { source: "Internal", count: 14 },
]
