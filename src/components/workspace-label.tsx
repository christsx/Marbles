"use client"

import { useOrganization } from "@clerk/nextjs"

import { Skeleton } from "@/components/ui/skeleton"

export function WorkspaceLabel({ fallback = "Workspace" }: { fallback?: string }) {
  const { organization, isLoaded } = useOrganization()

  if (!isLoaded) {
    return <Skeleton className="h-4 w-24" />
  }

  return <>{organization?.name ?? fallback}</>
}
