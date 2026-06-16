import { cache } from "react"

import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { listConnectedAccounts } from "@/lib/pipedream/server"
import type { PipedreamAccountSummary } from "@/lib/pipedream/types"
import { getPipedreamExternalUserId } from "@/lib/pipedream/user"
import { getActiveRepo, getTrackedRepos } from "@/lib/tracked-repos"

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
    const identity = await getPipedreamExternalUserId()

    if (!identity) {
      return null
    }

    const configured = isPipedreamConfigured()
    let accounts: PipedreamAccountSummary[] = []

    if (configured) {
      try {
        accounts = await listConnectedAccounts(identity.externalUserId, "github")
      } catch (error) {
        console.error("Failed to load GitHub accounts:", error)
      }
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
      connected: accounts.length > 0,
    }
  }
)
