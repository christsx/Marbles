import { auth } from "@clerk/nextjs/server"

import { getOverviewRepoContext } from "@/lib/pipedream/overview-context"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ message: "Unauthorized." }, { status: 401 })
  }

  const context = await getOverviewRepoContext()

  return Response.json({
    connected: Boolean(context?.connected),
    configured: Boolean(context?.configured),
    activeRepo: context?.activeRepo ?? null,
    trackedRepos: context?.trackedRepos ?? [],
  })
}
