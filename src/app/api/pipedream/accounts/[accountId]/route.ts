import { NextResponse } from "next/server"

import { isPipedreamConfigured } from "@/lib/pipedream/config"
import {
  disconnectAccount,
  listConnectedAccounts,
} from "@/lib/pipedream/server"
import { clearTrackedRepos } from "@/lib/tracked-repos"
import { getPipedreamExternalUserId } from "@/lib/pipedream/user"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ accountId: string }> }
) {
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

  const { accountId } = await params

  try {
    const accounts = await listConnectedAccounts(identity.externalUserId, "github")
    const owned = accounts.some((account) => account.id === accountId)

    if (!owned) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    await disconnectAccount(accountId)
    await clearTrackedRepos(identity.externalUserId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to disconnect GitHub account:", error)
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    )
  }
}
