import { auth } from "@clerk/nextjs/server"

export type WorkspaceIdentity = {
  userId: string
  orgId: string | null | undefined
  externalUserId: string
}

export async function getWorkspaceIdentity(): Promise<WorkspaceIdentity | null> {
  const { userId, orgId } = await auth()

  if (!userId) {
    return null
  }

  return {
    userId,
    orgId,
    externalUserId: orgId ? `org_${orgId}` : `user_${userId}`,
  }
}
