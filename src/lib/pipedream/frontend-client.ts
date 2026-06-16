"use client"

import { PipedreamClient } from "@pipedream/sdk/browser"

import { getPublicPipedreamProjectEnvironment } from "@/lib/pipedream/config"

async function fetchConnectToken() {
  const response = await fetch("/api/connect-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Connect token")
  }

  const payload = (await response.json()) as {
    token: string
    expiresAt: string
    connectLinkUrl: string
  }

  if (!payload.token) {
    throw new Error("Failed to fetch Connect token")
  }

  return {
    token: payload.token,
    expiresAt: new Date(payload.expiresAt),
    connectLinkUrl: payload.connectLinkUrl,
  }
}

export function createPipedreamFrontendClient(externalUserId: string) {
  return new PipedreamClient({
    projectEnvironment: getPublicPipedreamProjectEnvironment(),
    externalUserId,
    tokenCallback: fetchConnectToken,
  })
}
