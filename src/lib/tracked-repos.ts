import { cookies } from "next/headers"

const REPOS_COOKIE = "forge_tracked_repos"
const ACTIVE_COOKIE = "forge_active_repo"

type TrackedRepoStore = Record<string, string[]>
type ActiveRepoStore = Record<string, string>

function readJsonStore<T extends Record<string, unknown>>(
  raw: string | undefined
): T {
  if (!raw) {
    return {} as T
  }

  try {
    const parsed = JSON.parse(raw) as T
    return parsed && typeof parsed === "object" ? parsed : ({} as T)
  } catch {
    return {} as T
  }
}

export async function getTrackedRepos(externalUserId: string): Promise<string[]> {
  const jar = await cookies()
  const store = readJsonStore<TrackedRepoStore>(jar.get(REPOS_COOKIE)?.value)
  return store[externalUserId] ?? []
}

export async function setTrackedRepos(
  externalUserId: string,
  repos: string[]
): Promise<void> {
  const jar = await cookies()
  const store = readJsonStore<TrackedRepoStore>(jar.get(REPOS_COOKIE)?.value)
  store[externalUserId] = repos

  jar.set(REPOS_COOKIE, JSON.stringify(store), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
}

export async function getActiveRepo(
  externalUserId: string,
  trackedRepos?: string[]
): Promise<string | null> {
  const repos = trackedRepos ?? (await getTrackedRepos(externalUserId))

  if (repos.length === 0) {
    return null
  }

  const jar = await cookies()
  const store = readJsonStore<ActiveRepoStore>(jar.get(ACTIVE_COOKIE)?.value)
  const active = store[externalUserId]

  if (active && repos.includes(active)) {
    return active
  }

  return repos[0] ?? null
}

export async function setActiveRepo(
  externalUserId: string,
  fullName: string
): Promise<void> {
  const jar = await cookies()
  const store = readJsonStore<ActiveRepoStore>(jar.get(ACTIVE_COOKIE)?.value)
  store[externalUserId] = fullName

  jar.set(ACTIVE_COOKIE, JSON.stringify(store), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
}

export async function clearActiveRepo(externalUserId: string): Promise<void> {
  const jar = await cookies()
  const store = readJsonStore<ActiveRepoStore>(jar.get(ACTIVE_COOKIE)?.value)
  delete store[externalUserId]

  jar.set(ACTIVE_COOKIE, JSON.stringify(store), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  })
}

export async function clearTrackedRepos(externalUserId: string): Promise<void> {
  await setTrackedRepos(externalUserId, [])
  await clearActiveRepo(externalUserId)
}
