import { auth } from "@clerk/nextjs/server"

import { isPipedreamConfigured } from "@/lib/pipedream/config"
import { getPipedreamExternalUserId } from "@/lib/pipedream/user"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const identity = await getPipedreamExternalUserId()

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return Response.json({
    externalUserId: identity.externalUserId,
    configured: isPipedreamConfigured(),
  })
}
