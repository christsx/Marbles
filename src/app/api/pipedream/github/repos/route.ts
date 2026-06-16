import { NextResponse } from "next/server"

import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { listConnectedAccounts, listGithubRepos } from "@/lib/pipedream/server"
import { getPipedreamExternalUserId } from "@/lib/pipedream/user"

export async function GET() {
  if (!isPipedreamConfigured()) {
    return NextResponse.json(
      { error: "Pipedream Connect is not configured" },
      { status: 503 }
    )
  }

  const identity = await getPipedreamExternalUserId()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const accounts = await listConnectedAccounts(identity.externalUserId, "github")
    const account = accounts[0]

    if (!account) {
      return NextResponse.json({ repos: [] })
    }

    const repos = await listGithubRepos(identity.externalUserId, account.id)
    return NextResponse.json({ repos, accountId: account.id })
  } catch (error) {
    console.error("Failed to list GitHub repos:", error)
    return NextResponse.json(
      { error: "Failed to list GitHub repositories" },
      { status: 500 }
    )
  }
}
