import { auth } from "@clerk/nextjs/server"

export async function getPipedreamExternalUserId() {
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
