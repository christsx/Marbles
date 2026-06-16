import {
  PipedreamClient,
  type CreateTokenOpts,
  type CreateTokenResponse,
} from "@pipedream/sdk/server"

import { getPipedreamConfig, isPipedreamConfigured } from "@/lib/pipedream/config"
import { parseGithubCommits } from "@/lib/pipedream/github-commits"
import { parseGithubOverviewMetrics } from "@/lib/pipedream/github-overview-metrics"
import { parseGithubRepoDetails } from "@/lib/pipedream/github-repo-details"
import { parseGithubRepos } from "@/lib/pipedream/github-repos"
import { readProxyJson } from "@/lib/pipedream/read-proxy-json"
import type {
  GitHubCommitSummary,
  GitHubOverviewMetrics,
  GitHubRepoDetails,
  GitHubRepoSummary,
  PipedreamAccountSummary,
} from "@/lib/pipedream/types"

let client: PipedreamClient | null = null

function getClient() {
  if (!isPipedreamConfigured()) {
    throw new Error("Pipedream Connect is not configured")
  }

  if (client) {
    return client
  }

  const config = getPipedreamConfig()

  client = new PipedreamClient({
    clientId: config.clientId!,
    clientSecret: config.clientSecret!,
    projectId: config.projectId!,
    projectEnvironment: config.projectEnvironment!,
  })

  return client
}

export async function createConnectToken(
  externalUserId: string
): Promise<CreateTokenResponse> {
  const config = getPipedreamConfig()
  const pd = getClient()

  const opts: CreateTokenOpts = {
    externalUserId,
  }

  if (config.allowedOrigins?.length) {
    opts.allowedOrigins = config.allowedOrigins
  }

  return pd.tokens.create(opts)
}

export async function listConnectedAccounts(
  externalUserId: string,
  app = "github"
): Promise<PipedreamAccountSummary[]> {
  const pd = getClient()
  const page = await pd.accounts.list({ externalUserId, app })

  return page.data.map((account) => ({
    id: account.id,
    name: account.name ?? null,
    appName: account.app?.name,
  }))
}

export async function disconnectAccount(accountId: string) {
  const pd = getClient()
  await pd.accounts.delete(accountId)
}

export async function listGithubRepos(
  externalUserId: string,
  accountId: string
): Promise<GitHubRepoSummary[]> {
  const pd = getClient()

  const response = await pd.proxy.get({
    url: "https://api.github.com/user/repos",
    externalUserId,
    accountId,
    params: {
      per_page: "100",
      sort: "updated",
      affiliation: "owner,collaborator,organization_member",
    },
    headers: {
      Accept: "application/vnd.github+json",
    },
  })

  const body = await readProxyJson<unknown>(response)
  return parseGithubRepos(body)
}

function splitRepoFullName(fullName: string): [string, string] | null {
  const [owner, repo] = fullName.split("/")

  if (!owner || !repo) {
    return null
  }

  return [owner, repo]
}

export async function getGithubRepoDetails(
  externalUserId: string,
  accountId: string,
  fullName: string
): Promise<GitHubRepoDetails | null> {
  const parts = splitRepoFullName(fullName)

  if (!parts) {
    return null
  }

  const [owner, repo] = parts
  const pd = getClient()

  const repoResponse = await pd.proxy.get({
    url: `https://api.github.com/repos/${owner}/${repo}`,
    externalUserId,
    accountId,
    headers: {
      Accept: "application/vnd.github+json",
    },
  })

  const repoBody = await readProxyJson<unknown>(repoResponse)
  const repoRecord =
    repoBody && typeof repoBody === "object"
      ? (repoBody as { default_branch?: string })
      : null
  const defaultBranch = repoRecord?.default_branch ?? "main"

  let treeBody: unknown | null = null

  try {
    const treeResponse = await pd.proxy.get({
      url: `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}`,
      externalUserId,
      accountId,
      params: {
        recursive: "1",
      },
      headers: {
        Accept: "application/vnd.github+json",
      },
    })

    treeBody = await readProxyJson<unknown>(treeResponse)
  } catch (error) {
    console.error(`Failed to load file tree for ${fullName}:`, error)
  }

  return parseGithubRepoDetails(repoBody, treeBody, fullName)
}

export async function getGithubRecentCommits(
  externalUserId: string,
  accountId: string,
  fullName: string,
  limit = 5
): Promise<GitHubCommitSummary[]> {
  const parts = splitRepoFullName(fullName)

  if (!parts) {
    return []
  }

  const [owner, repo] = parts
  const pd = getClient()

  const response = await pd.proxy.get({
    url: `https://api.github.com/repos/${owner}/${repo}/commits`,
    externalUserId,
    accountId,
    params: {
      per_page: String(limit),
    },
    headers: {
      Accept: "application/vnd.github+json",
    },
  })

  const body = await readProxyJson<unknown>(response)
  return parseGithubCommits(body)
}

export async function getGithubOverviewMetrics(
  externalUserId: string,
  accountId: string,
  fullName: string
): Promise<GitHubOverviewMetrics | null> {
  const parts = splitRepoFullName(fullName)

  if (!parts) {
    return null
  }

  const [owner, repo] = parts
  const pd = getClient()
  const now = new Date()
  const since30d = new Date(now)
  since30d.setDate(since30d.getDate() - 30)
  const since7d = new Date(now)
  since7d.setDate(since7d.getDate() - 7)

  const headers = { Accept: "application/vnd.github+json" }
  const base = `https://api.github.com/repos/${owner}/${repo}`

  const [
    repoResponse,
    issuesResponse,
    pullsResponse,
    branchesResponse,
    closedIssuesResponse,
    workflowRunsResponse,
  ] = await Promise.all([
    pd.proxy.get({ url: base, externalUserId, accountId, headers }),
    pd.proxy.get({
      url: `${base}/issues`,
      externalUserId,
      accountId,
      params: { state: "open", per_page: "100" },
      headers,
    }),
    pd.proxy.get({
      url: `${base}/pulls`,
      externalUserId,
      accountId,
      params: { state: "open", per_page: "100" },
      headers,
    }),
    pd.proxy.get({
      url: `${base}/branches`,
      externalUserId,
      accountId,
      params: { per_page: "100" },
      headers,
    }),
    pd.proxy.get({
      url: `${base}/issues`,
      externalUserId,
      accountId,
      params: {
        state: "closed",
        since: since30d.toISOString(),
        per_page: "100",
      },
      headers,
    }),
    pd.proxy.get({
      url: `${base}/actions/runs`,
      externalUserId,
      accountId,
      params: { per_page: "100" },
      headers,
    }),
  ])

  const [
    repoBody,
    issuesBody,
    pullsBody,
    branchesBody,
    closedIssuesBody,
    workflowRunsBody,
  ] = await Promise.all([
    readProxyJson<unknown>(repoResponse),
    readProxyJson<unknown>(issuesResponse),
    readProxyJson<unknown>(pullsResponse),
    readProxyJson<unknown>(branchesResponse),
    readProxyJson<unknown>(closedIssuesResponse),
    readProxyJson<unknown>(workflowRunsResponse),
  ])

  return parseGithubOverviewMetrics(
    repoBody,
    issuesBody,
    pullsBody,
    branchesBody,
    closedIssuesBody,
    workflowRunsBody,
    since30d,
    since7d
  )
}

export async function getGithubRootPaths(
  externalUserId: string,
  accountId: string,
  fullName: string
): Promise<string[]> {
  const parts = splitRepoFullName(fullName)

  if (!parts) {
    return []
  }

  const [owner, repo] = parts
  const pd = getClient()

  const response = await pd.proxy.get({
    url: `https://api.github.com/repos/${owner}/${repo}/contents`,
    externalUserId,
    accountId,
    headers: {
      Accept: "application/vnd.github+json",
    },
  })

  const body = await readProxyJson<unknown>(response)

  if (!Array.isArray(body)) {
    return []
  }

  return body
    .map((entry) =>
      entry && typeof entry === "object"
        ? (entry as { name?: string }).name
        : undefined
    )
    .filter((name): name is string => Boolean(name))
    .slice(0, 40)
}

export async function getGithubFileText(
  externalUserId: string,
  accountId: string,
  fullName: string,
  path: string
): Promise<string | null> {
  const parts = splitRepoFullName(fullName)

  if (!parts) {
    return null
  }

  const [owner, repo] = parts
  const pd = getClient()

  try {
    const response = await pd.proxy.get({
      url: `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      externalUserId,
      accountId,
      headers: {
        Accept: "application/vnd.github+json",
      },
    })

    const body = await readProxyJson<unknown>(response)

    if (!body || typeof body !== "object") {
      return null
    }

    const record = body as { content?: string; encoding?: string }

    if (record.encoding !== "base64" || !record.content) {
      return null
    }

    return Buffer.from(record.content.replace(/\n/g, ""), "base64").toString(
      "utf-8"
    )
  } catch (error) {
    console.error(`Failed to load ${path} from ${fullName}:`, error)
    return null
  }
}

