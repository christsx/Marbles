"use client"

import * as React from "react"

import type { AssistantProject } from "@/lib/assistant/types"
import { blueprints } from "@/lib/blueprints"

export function useDirectoryData(open: boolean) {
  const [loading, setLoading] = React.useState(false)

  const projects = React.useMemo<AssistantProject[]>(
    () =>
      blueprints.map((blueprint) => ({
        id: blueprint.id,
        name: blueprint.title,
        cmNumber: blueprint.id,
      })),
    []
  )

  React.useEffect(() => {
    if (!open) return
    setLoading(true)
    const id = window.setTimeout(() => setLoading(false), 120)
    return () => window.clearTimeout(id)
  }, [open])

  return { loading, projects }
}
