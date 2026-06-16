export type PipedreamAccountSummary = {
  id: string
  name: string | null
  appName?: string
}

export type GitHubRepoSummary = {
  id: number | string
  fullName: string
  private: boolean
  updatedAt: string
}

export type GitHubRepoDetails = {
  fullName: string
  private: boolean
  defaultBranch: string
  language: string | null
  pushedAt: string
  updatedAt: string
  openIssues: number
  sizeKb: number
  fileCount: number | null
  htmlUrl: string
}

export type GitHubCommitSummary = {
  sha: string
  message: string
  author: string
  committedAt: string
  htmlUrl: string
}

export type GitHubOverviewMetrics = {
  openIssues: number
  branchCount: number
  openPullRequests: number
  closedIssues30d: number
  workflowRuns7d: number
  htmlUrl: string
}
