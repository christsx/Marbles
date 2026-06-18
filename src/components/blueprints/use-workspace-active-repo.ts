"use client"

import * as React from "react"

type RepoSummaryPayload = {
  activeRepo?: string | null
}

/** Loads workspace default repo for the Projects picker — does not attach LLM context. */
export function useWorkspaceDefaultRepo(
  onDefaultRepo: (fullName: string) => void,
  enabled = true
) {
  React.useEffect(() => {
    if (!enabled) return

    let cancelled = false

    void fetch("/api/blueprints/repo-summary")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: RepoSummaryPayload | null) => {
        if (cancelled || !payload?.activeRepo) return
        onDefaultRepo(payload.activeRepo)
      })

    return () => {
      cancelled = true
    }
  }, [enabled, onDefaultRepo])
}
