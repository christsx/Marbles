"use client"

import { useOrganization } from "@clerk/nextjs"

export function WorkspaceLabel({ fallback = "Workspace" }: { fallback?: string }) {
  const { organization, isLoaded } = useOrganization()

  if (!isLoaded) {
    return <span className="text-muted-foreground">{fallback}</span>
  }

  return <>{organization?.name ?? "Personal workspace"}</>
}
