"use client"

import { useState } from "react"

import {
  saveTrackedReposAction,
  setActiveRepoAction,
} from "@/app/dashboard/integrations/actions"
import { GitHubRepoTrackerList } from "@/components/github/github-repo-tracker-list"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type GitHubRepoTrackerProps = {
  initialTrackedRepos: string[]
  initialActiveRepo: string | null
}

function normalizeRepo(value: string) {
  return value.trim().replace(/^https:\/\/github\.com\//i, "").replace(/\/$/, "")
}

export function GitHubRepoTracker({
  initialTrackedRepos,
  initialActiveRepo,
}: GitHubRepoTrackerProps) {
  const [trackedRepos, setTrackedRepos] = useState(initialTrackedRepos)
  const [activeRepo, setActiveRepo] = useState(initialActiveRepo)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function persist(repos: string[], nextActive = activeRepo) {
    setSaving(true)
    setError(null)
    const result = await saveTrackedReposAction(repos)
    if (!result.ok) {
      setError(result.error)
      setSaving(false)
      return
    }
    setTrackedRepos(result.repos)
    setActiveRepo(
      nextActive && result.repos.includes(nextActive)
        ? nextActive
        : (result.repos[0] ?? null)
    )
    setSaving(false)
  }

  async function addRepo() {
    const repo = normalizeRepo(draft)
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
      setError("Use owner/repo format, e.g. acme/platform")
      return
    }
    if (trackedRepos.includes(repo)) {
      setDraft("")
      return
    }
    await persist([...trackedRepos, repo], repo)
    setDraft("")
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading
        title="GitHub"
        description="Track repositories by slug. OAuth connect is off for now."
      />
      <div className="flex max-w-md gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="owner/repo"
          disabled={saving}
        />
        <Button type="button" onClick={() => void addRepo()} disabled={saving || !draft.trim()}>
          Track
        </Button>
      </div>
      <Card className="overflow-hidden py-0 shadow-xs">
        <GitHubRepoTrackerList
          trackedRepos={trackedRepos}
          activeRepo={activeRepo}
          saving={saving}
          onMakeActive={(repo) => {
            void setActiveRepoAction(repo).then((result) => {
              if (!result.ok) setError(result.error)
              else setActiveRepo(result.activeRepo)
            })
          }}
          onRemove={(repo) => void persist(trackedRepos.filter((item) => item !== repo))}
        />
      </Card>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </section>
  )
}
