import { auth } from "@clerk/nextjs/server"

import { getServerApiKeyState } from "@/lib/ai/model-availability"
import { DEFAULT_MODEL_ID } from "@/lib/ai/model-catalog"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ message: "Unauthorized." }, { status: 401 })
  }

  return Response.json({
    apiKeys: getServerApiKeyState(),
    defaultModelId: DEFAULT_MODEL_ID,
  })
}
