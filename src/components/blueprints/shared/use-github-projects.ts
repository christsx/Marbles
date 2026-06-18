"use client"

import * as React from "react"

type GitHubProjectsPayload = {
  connected?: boolean
  activeRepo?: string | null
  trackedRepos?: string[]
}

export function useGitHubProjects(open: boolean) {
  const [loading, setLoading] = React.useState(false)
  const [connected, setConnected] = React.useState(false)
  const [activeRepo, setActiveRepo] = React.useState<string | null>(null)
  const [repos, setRepos] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!open) return

    let cancelled = false
    setLoading(true)

    void fetch("/api/blueprints/repo-summary")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: GitHubProjectsPayload | null) => {
        if (cancelled || !payload) return
        setConnected(Boolean(payload.connected))
        setActiveRepo(payload.activeRepo ?? null)
        setRepos(payload.trackedRepos ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open])

  return { loading, connected, activeRepo, repos }
}
