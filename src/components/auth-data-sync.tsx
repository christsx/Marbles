"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

/**
 * Re-fetch server components when Clerk auth changes (sign-in / sign-out).
 * Without this, the client sidebar updates but RSC page content can stay stale.
 */
export function AuthDataSync() {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()
  const previousUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (!isLoaded) return

    if (
      previousUserId.current !== undefined &&
      previousUserId.current !== userId
    ) {
      router.refresh()
    }

    previousUserId.current = userId ?? null
  }, [userId, isLoaded, router])

  return null
}
