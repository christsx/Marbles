"use client"

import * as React from "react"

import {
  emptyProjectContext,
  type BlueprintProjectContext,
} from "@/lib/blueprints/project-context.types"
import { fetchRepoContextSnapshot } from "@/lib/blueprints/fetch-repo-context"

export function useBlueprintProjectContext() {
  const [projectContext, setProjectContext] =
    React.useState<BlueprintProjectContext>(emptyProjectContext)

  const enableRepoContext = React.useCallback(async () => {
    const snapshot = await fetchRepoContextSnapshot()
    setProjectContext((current) => ({ ...current, ...snapshot }))
  }, [])

  const toggleRepo = React.useCallback(async () => {
    if (projectContext.repoEnabled) {
      setProjectContext((current) => ({
        ...current,
        repoEnabled: false,
        activeRepo: null,
      }))
      return
    }

    await enableRepoContext()
  }, [enableRepoContext, projectContext.repoEnabled])

  const attachFiles = React.useCallback(
    (attachments: BlueprintProjectContext["attachments"]) => {
      setProjectContext((current) => ({
        ...current,
        attachments: [...current.attachments, ...attachments],
      }))
    },
    []
  )

  const removeRepo = React.useCallback(() => {
    setProjectContext((current) => ({
      ...current,
      repoEnabled: false,
      activeRepo: null,
    }))
  }, [])

  const removeAttachment = React.useCallback((id: string) => {
    setProjectContext((current) => ({
      ...current,
      attachments: current.attachments.filter((item) => item.id !== id),
    }))
  }, [])

  const clearAttachments = React.useCallback(() => {
    setProjectContext((current) => ({ ...current, attachments: [] }))
  }, [])

  return {
    projectContext,
    toggleRepo,
    attachFiles,
    removeRepo,
    removeAttachment,
    clearAttachments,
  }
}
