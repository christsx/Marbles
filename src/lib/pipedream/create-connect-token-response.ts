import { NextResponse } from "next/server"

import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { createConnectToken } from "@/lib/pipedream/server"
import { getPipedreamExternalUserId } from "@/lib/pipedream/user"

export async function createConnectTokenResponse() {
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
    const tokenResponse = await createConnectToken(identity.externalUserId)
    return NextResponse.json(tokenResponse)
  } catch (error) {
    console.error("Failed to create Pipedream connect token:", error)
    return NextResponse.json(
      { error: "Failed to create connect token" },
      { status: 500 }
    )
  }
}
