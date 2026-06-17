import { auth } from "@clerk/nextjs/server"

import { getBlueprintRepoContext } from "@/lib/blueprints/repo-context"

export async function POST() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ message: "Unauthorized." }, { status: 401 })
  }

  await getBlueprintRepoContext(true)

  return Response.json({ ok: true })
}
