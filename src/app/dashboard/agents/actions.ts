"use server"

import { auth } from "@clerk/nextjs/server"

export type ProvisionAgentState = {
  status: "idle" | "success" | "error"
  message: string
}

export async function provisionAgent(
  _prev: ProvisionAgentState,
  formData: FormData
): Promise<ProvisionAgentState> {
  const name = String(formData.get("name") ?? "").trim()
  const specialty = String(formData.get("specialty") ?? "Full-Stack")
  const model = String(formData.get("model") ?? "").trim()
  const repos = String(formData.get("repos") ?? "").trim()
  const weeklyTarget = Number(formData.get("weeklyTarget") ?? 0)
  const autonomy = String(formData.get("autonomy") ?? "Supervised")

  if (!name || !model) {
    return { status: "error", message: "Codename and base model are required." }
  }

  if (weeklyTarget <= 0) {
    return { status: "error", message: "Set a weekly target above zero." }
  }

  const { userId, orgId } = await auth()

  if (!userId) {
    return { status: "error", message: "You must be signed in to provision an agent." }
  }

  if (!orgId) {
    return {
      status: "error",
      message: "Select or create an organization before provisioning agents.",
    }
  }

  return {
    status: "success",
    message: `${name} provisioned as a ${specialty} agent on ${model}${
      repos ? ` · scoped to ${repos}` : ""
    }. Running in ${autonomy.toLowerCase()} mode.`,
  }
}
