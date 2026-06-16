import type { GitHubOverviewMetrics } from "@/lib/pipedream/types"

type GitHubIssue = {
  pull_request?: unknown
  closed_at?: string | null
}

type GitHubWorkflowRuns = {
  workflow_runs?: Array<{ created_at?: string }>
}

function countOpenIssues(payload: unknown): number {
  if (!Array.isArray(payload)) {
    return 0
  }

  return (payload as GitHubIssue[]).filter((issue) => !issue.pull_request).length
}

function countArray(payload: unknown): number {
  return Array.isArray(payload) ? payload.length : 0
}

function countClosedIssuesSince(payload: unknown, since: Date): number {
  if (!Array.isArray(payload)) {
    return 0
  }

  return (payload as GitHubIssue[]).filter((issue) => {
    if (!issue.closed_at) {
      return false
    }

    return new Date(issue.closed_at) >= since
  }).length
}

function countWorkflowRunsSince(payload: unknown, since: Date): number {
  if (!payload || typeof payload !== "object") {
    return 0
  }

  const runs = (payload as GitHubWorkflowRuns).workflow_runs

  if (!Array.isArray(runs)) {
    return 0
  }

  return runs.filter((run) => {
    if (!run.created_at) {
      return false
    }

    return new Date(run.created_at) >= since
  }).length
}

export function parseGithubOverviewMetrics(
  repoPayload: unknown,
  issuesPayload: unknown,
  pullsPayload: unknown,
  branchesPayload: unknown,
  closedIssuesPayload: unknown,
  workflowRunsPayload: unknown,
  since30d: Date,
  since7d: Date
): GitHubOverviewMetrics | null {
  if (!repoPayload || typeof repoPayload !== "object") {
    return null
  }

  const repo = repoPayload as { html_url?: string }

  return {
    openIssues: countOpenIssues(issuesPayload),
    branchCount: countArray(branchesPayload),
    openPullRequests: countArray(pullsPayload),
    closedIssues30d: countClosedIssuesSince(closedIssuesPayload, since30d),
    workflowRuns7d: countWorkflowRunsSince(workflowRunsPayload, since7d),
    htmlUrl: repo.html_url ?? "",
  }
}
