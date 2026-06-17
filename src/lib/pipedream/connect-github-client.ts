"use client"

import { createPipedreamFrontendClient } from "@/lib/pipedream/frontend-client"

type ConnectResult = { ok: true } | { ok: false; error: string }

export async function connectGithubViaPipedream(): Promise<ConnectResult> {
  const identityRes = await fetch("/api/pipedream/identity")

  if (!identityRes.ok) {
    return { ok: false, error: "Could not start connector." }
  }

  const identity = (await identityRes.json()) as {
    externalUserId?: string
    configured?: boolean
  }

  if (!identity.configured || !identity.externalUserId) {
    return { ok: false, error: "Pipedream Connect is not configured." }
  }

  const client = createPipedreamFrontendClient(identity.externalUserId)

  return new Promise((resolve) => {
    let settled = false

    const finish = (result: ConnectResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }

    void client.connectAccount({
      app: "github",
      onSuccess: () => finish({ ok: true }),
      onError: (err) => finish({ ok: false, error: err.message }),
      onClose: (status) => {
        if (status.successful === false) {
          finish({ ok: false, error: "Connection cancelled." })
        }
      },
    })
  })
}
