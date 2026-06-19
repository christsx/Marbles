import { cache } from "react"
import { unstable_cache } from "next/cache"

import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { listConnectedAccounts } from "@/lib/pipedream/server"
import type { PipedreamAccountSummary } from "@/lib/pipedream/types"
import { getWorkspaceIdentity } from "@/lib/workspace-identity"
import { getActiveRepo, getTrackedRepos } from "@/lib/tracked-repos"

const CONNECTED_ACCOUNTS_CACHE_SECONDS = 60

const getCachedConnectedAccounts = unstable_cache(
  async (externalUserId: string): Promise<PipedreamAccountSummary[]> => {
    try {
      return await listConnectedAccounts(externalUserId, "github")
    } catch (error) {
      console.error("Failed to load GitHub accounts:", error)
      return []
    }
  },
  ["github-connected-accounts"],
  { revalidate: CONNECTED_ACCOUNTS_CACHE_SECONDS }
)

export type OverviewRepoContext = {
  externalUserId: string
  configured: boolean
  account: PipedreamAccountSummary | null
  trackedRepos: string[]
  activeRepo: string | null
  connected: boolean
}

export const getOverviewRepoContext = cache(
  async (): Promise<OverviewRepoContext | null> => {
    const identity = await getWorkspaceIdentity()

    if (!identity) {
      return null
    }

    const configured = isPipedreamConfigured()
    let accounts: PipedreamAccountSummary[] = []

    if (configured) {
      accounts = await getCachedConnectedAccounts(identity.externalUserId)
    }

    const trackedRepos = await getTrackedRepos(identity.externalUserId)
    const activeRepo = await getActiveRepo(
      identity.externalUserId,
      trackedRepos
    )

    return {
      externalUserId: identity.externalUserId,
      configured,
      account: accounts[0] ?? null,
      trackedRepos,
      activeRepo,
      connected: accounts.length > 0 || trackedRepos.length > 0,
    }
  }
)
