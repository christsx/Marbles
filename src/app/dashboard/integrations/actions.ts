"use server"

import { revalidatePath } from "next/cache"

import { getPipedreamExternalUserId } from "@/lib/pipedream/user"
import {
  clearActiveRepo,
  clearTrackedRepos,
  getActiveRepo,
  getTrackedRepos,
  setActiveRepo,
  setTrackedRepos,
} from "@/lib/tracked-repos"

export async function saveTrackedReposAction(repos: string[]) {
  const identity = await getPipedreamExternalUserId()

  if (!identity) {
    return { ok: false as const, error: "Unauthorized" }
  }

  const unique = Array.from(new Set(repos.filter(Boolean)))
  const previousActive = await getActiveRepo(identity.externalUserId)

  await setTrackedRepos(identity.externalUserId, unique)

  if (unique.length === 0) {
    await clearActiveRepo(identity.externalUserId)
  } else if (!previousActive || !unique.includes(previousActive)) {
    await setActiveRepo(identity.externalUserId, unique[0])
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/integrations")

  return { ok: true as const, repos: unique }
}

export async function setActiveRepoAction(fullName: string) {
  const identity = await getPipedreamExternalUserId()

  if (!identity) {
    return { ok: false as const, error: "Unauthorized" }
  }

  const trackedRepos = await getTrackedRepos(identity.externalUserId)

  if (!trackedRepos.includes(fullName)) {
    return { ok: false as const, error: "Repository is not tracked" }
  }

  await setActiveRepo(identity.externalUserId, fullName)
  revalidatePath("/dashboard")

  return { ok: true as const, activeRepo: fullName }
}

export async function clearTrackedReposAction() {
  const identity = await getPipedreamExternalUserId()

  if (!identity) {
    return { ok: false as const, error: "Unauthorized" }
  }

  await clearTrackedRepos(identity.externalUserId)
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/integrations")

  return { ok: true as const }
}
