"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { CheckIcon, StarIcon } from "lucide-react"
import type { PipedreamClient } from "@pipedream/sdk/browser"

import {
  clearTrackedReposAction,
  saveTrackedReposAction,
  setActiveRepoAction,
} from "@/app/dashboard/integrations/actions"
import { SectionHeading } from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createPipedreamFrontendClient } from "@/lib/pipedream/frontend-client"
import type {
  GitHubRepoSummary,
  PipedreamAccountSummary,
} from "@/lib/pipedream/types"
import { cn } from "@/lib/utils"

type GitHubIntegrationPanelProps = {
  externalUserId: string
  initialAccounts: PipedreamAccountSummary[]
  initialTrackedRepos: string[]
  initialActiveRepo: string | null
  pipedreamConfigured?: boolean
}

export function GitHubIntegrationPanel({
  externalUserId,
  initialAccounts,
  initialTrackedRepos,
  initialActiveRepo,
  pipedreamConfigured = true,
}: GitHubIntegrationPanelProps) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [trackedRepos, setTrackedRepos] = useState(initialTrackedRepos)
  const [activeRepo, setActiveRepo] = useState(initialActiveRepo)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialTrackedRepos)
  )
  const [repos, setRepos] = useState<GitHubRepoSummary[]>([])
  const [filter, setFilter] = useState("")
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const client = useMemo(() => {
    if (!pipedreamConfigured) {
      return null
    }

    return createPipedreamFrontendClient(externalUserId)
  }, [externalUserId, pipedreamConfigured])

  const primaryAccount = accounts[0]
  const connected = Boolean(primaryAccount)

  const refreshAccounts = useCallback(async () => {
    const response = await fetch("/api/pipedream/accounts?app=github")

    if (!response.ok) {
      throw new Error("Failed to refresh GitHub accounts")
    }

    const payload = (await response.json()) as {
      accounts: PipedreamAccountSummary[]
    }

    setAccounts(payload.accounts)
    return payload.accounts
  }, [])

  const loadRepos = useCallback(async () => {
    setLoadingRepos(true)
    setError(null)

    try {
      const response = await fetch("/api/pipedream/github/repos")

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(body?.error ?? "Failed to load repositories")
      }

      const payload = (await response.json()) as { repos: GitHubRepoSummary[] }
      setRepos(payload.repos ?? [])
    } catch (loadError) {
      console.error(loadError)
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load repositories."
      )
    } finally {
      setLoadingRepos(false)
    }
  }, [])

  useEffect(() => {
    if (connected) {
      loadRepos()
    } else {
      setRepos([])
    }
  }, [connected, loadRepos])

  const connectGithub = async (pipedreamClient: PipedreamClient) => {
    setConnecting(true)
    setError(null)

    await pipedreamClient.connectAccount({
      app: "github",
      onSuccess: async () => {
        try {
          await refreshAccounts()
          await loadRepos()
        } catch (refreshError) {
          console.error(refreshError)
          setError("Connected, but failed to refresh.")
        } finally {
          setConnecting(false)
        }
      },
      onError: (err) => {
        setError(err.message)
        setConnecting(false)
      },
      onClose: (status) => {
        if (status.successful === false) {
          setConnecting(false)
        }
      },
    })
  }

  const disconnectGithub = async () => {
    if (!primaryAccount) {
      return
    }

    setDisconnecting(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/pipedream/accounts/${primaryAccount.id}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        throw new Error("Failed to disconnect")
      }

      await clearTrackedReposAction()
      setAccounts([])
      setRepos([])
      setSelected(new Set())
      setTrackedRepos([])
      setActiveRepo(null)
    } catch (disconnectError) {
      console.error(disconnectError)
      setError("Failed to disconnect.")
    } finally {
      setDisconnecting(false)
    }
  }

  const persistSelection = async (next: Set<string>) => {
    setSaving(true)
    setError(null)

    try {
      const result = await saveTrackedReposAction(Array.from(next))

      if (!result.ok) {
        throw new Error(result.error)
      }

      setTrackedRepos(result.repos)
      setSelected(new Set(result.repos))

      if (!activeRepo || !result.repos.includes(activeRepo)) {
        setActiveRepo(result.repos[0] ?? null)
      }
    } catch (saveError) {
      console.error(saveError)
      setError("Failed to save selection.")
    } finally {
      setSaving(false)
    }
  }

  const toggleRepo = (fullName: string) => {
    const next = new Set(selected)
    if (next.has(fullName)) {
      next.delete(fullName)
    } else {
      next.add(fullName)
    }
    setSelected(next)
    void persistSelection(next)
  }

  const makeActiveRepo = async (fullName: string) => {
    if (!selected.has(fullName)) {
      return
    }

    setError(null)

    const result = await setActiveRepoAction(fullName)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setActiveRepo(result.activeRepo)
  }

  const filteredRepos = repos.filter((repo) =>
    repo.fullName.toLowerCase().includes(filter.trim().toLowerCase())
  )

  const headingAction = connected ? (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground"
      onClick={disconnectGithub}
      disabled={disconnecting || saving}
    >
      {disconnecting ? "Disconnecting…" : "Disconnect"}
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={() => client && connectGithub(client)}
      disabled={connecting || !client || !pipedreamConfigured}
    >
      {connecting ? "Connecting…" : "Connect GitHub"}
    </Button>
  )

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading
        title="GitHub"
        description={
          connected
            ? `${primaryAccount?.name ?? "Connected"} · ${repos.length} repositories${saving ? " · saving…" : trackedRepos.length ? ` · ${trackedRepos.length} tracked` : ""}${activeRepo ? ` · overview: ${activeRepo.split("/")[1] ?? activeRepo}` : ""}`
            : "Connect to select repositories to track."
        }
        action={headingAction}
      />

      {connected ? (
        <Input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Filter repositories"
          className="max-w-sm"
        />
      ) : null}

      <Card className="overflow-hidden py-0 shadow-xs">
        {!connected ? (
          <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
            <p className="text-sm font-medium">No account connected</p>
            <p className="text-sm text-muted-foreground">
              Connect GitHub to browse and select repositories.
            </p>
          </div>
        ) : loadingRepos ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading repositories…
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {repos.length === 0
              ? "No repositories returned from GitHub."
              : "No repositories match your filter."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 pl-4" />
                <TableHead className="px-4">Repository</TableHead>
                <TableHead className="px-4 text-right">Updated</TableHead>
                <TableHead className="w-12 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepos.map((repo) => {
                const checked = selected.has(repo.fullName)
                const isActive = activeRepo === repo.fullName

                return (
                  <TableRow
                    key={String(repo.id)}
                    className="cursor-pointer"
                    onClick={() => toggleRepo(repo.fullName)}
                  >
                    <TableCell className="pl-4">
                      <span
                        className={cn(
                          "flex size-4 items-center justify-center rounded border border-input",
                          checked &&
                            "border-foreground bg-foreground text-background"
                        )}
                        aria-hidden
                      >
                        {checked ? <CheckIcon className="size-3" /> : null}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="font-medium">{repo.fullName}</span>
                      {repo.private ? (
                        <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                          private
                        </span>
                      ) : null}
                      {isActive ? (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          · overview
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                      {new Date(repo.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="pr-4">
                      {checked ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className={cn(
                            "text-muted-foreground",
                            isActive && "text-foreground"
                          )}
                          aria-label={`Show ${repo.fullName} on overview`}
                          onClick={(event) => {
                            event.stopPropagation()
                            void makeActiveRepo(repo.fullName)
                          }}
                        >
                          <StarIcon
                            className={cn("size-4", isActive && "fill-current")}
                          />
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </section>
  )
}
