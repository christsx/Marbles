import { NextResponse } from "next/server"

import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { listConnectedAccounts } from "@/lib/pipedream/server"
import { getPipedreamExternalUserId } from "@/lib/pipedream/user"

export async function GET(request: Request) {
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

  const app = new URL(request.url).searchParams.get("app") ?? "github"

  try {
    const accounts = await listConnectedAccounts(identity.externalUserId, app)
    return NextResponse.json({ accounts })
  } catch (error) {
    console.error("Failed to list Pipedream accounts:", error)
    return NextResponse.json(
      { error: "Failed to list connected accounts" },
      { status: 500 }
    )
  }
}
