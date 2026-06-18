"use client"

import * as React from "react"

import {
  emptyProjectContext,
  type BlueprintProjectContext,
} from "@/lib/blueprints/project-context.types"

export function useBlueprintProjectContext() {
  const [projectContext, setProjectContext] =
    React.useState<BlueprintProjectContext>(emptyProjectContext)

  const selectGitHubProject = React.useCallback((fullName: string) => {
    setProjectContext((current) => ({
      ...current,
      repoEnabled: true,
      activeRepo: fullName,
    }))
  }, [])

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
    selectGitHubProject,
    attachFiles,
    removeRepo,
    removeAttachment,
    clearAttachments,
  }
}
