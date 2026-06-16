export type ArtifactItem = {
  title: string
  kind: string
  updated: string
}

export type ArtifactCategory = {
  slug: string
  title: string
  description: string
  count: number
  items: ArtifactItem[]
}

export const artifactCategories: ArtifactCategory[] = [
  {
    slug: "pull-requests",
    title: "Pull Requests",
    description: "Agent-authored PRs awaiting review or merged.",
    count: 64,
    items: [
      { title: "feat: OAuth device-code flow", kind: "PR · core-api", updated: "12 min ago" },
      { title: "fix: websocket reconnect backoff", kind: "PR · web-app", updated: "40 min ago" },
      { title: "feat: usage metering events", kind: "PR · billing-svc", updated: "2 hours ago" },
      { title: "chore: bump deps + lockfile", kind: "PR · web-app", updated: "Yesterday" },
    ],
  },
  {
    slug: "generated-modules",
    title: "Generated Modules",
    description: "Reusable code modules scaffolded by agents.",
    count: 38,
    items: [
      { title: "rate-limiter middleware", kind: "Module · TS", updated: "1 day ago" },
      { title: "audit-log writer", kind: "Module · TS", updated: "2 days ago" },
      { title: "saml-assertion parser", kind: "Module · TS", updated: "3 days ago" },
    ],
  },
  {
    slug: "api-schemas",
    title: "API Schemas",
    description: "OpenAPI specs and generated client types.",
    count: 12,
    items: [
      { title: "core-api v2 OpenAPI", kind: "Schema · YAML", updated: "1 day ago" },
      { title: "billing-svc events", kind: "Schema · JSON", updated: "4 days ago" },
      { title: "web-app client types", kind: "Types · TS", updated: "1 day ago" },
    ],
  },
  {
    slug: "test-suites",
    title: "Test Suites",
    description: "Generated unit, integration, and e2e suites.",
    count: 27,
    items: [
      { title: "auth integration suite", kind: "Suite · 84 tests", updated: "Today" },
      { title: "billing metering suite", kind: "Suite · 41 tests", updated: "2 days ago" },
      { title: "dashboard e2e (Playwright)", kind: "Suite · 19 tests", updated: "Yesterday" },
    ],
  },
  {
    slug: "migrations",
    title: "Migrations",
    description: "Reversible database migrations by release.",
    count: 16,
    items: [
      { title: "0042_add_sessions_table", kind: "Migration", updated: "3 days ago" },
      { title: "0041_audit_log_indexes", kind: "Migration", updated: "5 days ago" },
      { title: "0040_billing_usage", kind: "Migration", updated: "1 week ago" },
    ],
  },
  {
    slug: "docs",
    title: "Docs",
    description: "Generated reference docs and changelogs.",
    count: 21,
    items: [
      { title: "REST API reference", kind: "Doc", updated: "2 days ago" },
      { title: "Architecture overview", kind: "Doc", updated: "1 week ago" },
      { title: "Release changelog", kind: "Doc", updated: "Today" },
    ],
  },
]

export function getArtifactCategory(slug: string): ArtifactCategory | undefined {
  return artifactCategories.find((category) => category.slug === slug)
}
