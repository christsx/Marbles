import { MetricCard } from "@/components/overview/metric-card"
import { getOverviewRepoContext } from "@/lib/pipedream/overview-context"
import { getGithubOverviewMetrics } from "@/lib/pipedream/server"

export async function ModuleMetricCards() {
  const context = await getOverviewRepoContext()

  if (!context?.activeRepo || !context.account || !context.configured) {
    return null
  }

  let metrics = null

  try {
    metrics = await getGithubOverviewMetrics(
      context.externalUserId,
      context.account.id,
      context.activeRepo
    )
  } catch (error) {
    console.error("Failed to load GitHub overview metrics:", error)
    return null
  }

  if (!metrics) {
    return null
  }

  const base = metrics.htmlUrl

  const modules = [
    {
      label: "Requirements",
      value: metrics.openIssues.toLocaleString(),
      footnote: "Open issues",
      href: base ? `${base}/issues` : undefined,
    },
    {
      label: "Blueprints",
      value: metrics.branchCount.toLocaleString(),
      footnote: "Branches",
      href: base ? `${base}/branches` : undefined,
    },
    {
      label: "Work Orders",
      value: metrics.openPullRequests.toLocaleString(),
      footnote: "Open pull requests",
      href: base ? `${base}/pulls` : undefined,
    },
    {
      label: "Feedback",
      value: metrics.closedIssues30d.toLocaleString(),
      footnote: "Issues closed · 30 days",
      href: base ? `${base}/issues?q=is%3Aissue+is%3Aclosed` : undefined,
    },
    {
      label: "Tests",
      value: metrics.workflowRuns7d.toLocaleString(),
      footnote: "Workflow runs · 7 days",
      href: base ? `${base}/actions` : undefined,
    },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {modules.map((module) => (
        <MetricCard
          key={module.label}
          label={module.label}
          value={module.value}
          footnote={module.footnote}
          href={module.href}
        />
      ))}
    </div>
  )
}
