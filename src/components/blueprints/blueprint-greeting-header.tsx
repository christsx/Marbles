"use client"

import * as React from "react"

import { AppLogomark } from "@/components/app-logomark"
import { cn } from "@/lib/utils"

type BlueprintGreetingHeaderProps = {
  username: string
  ready: boolean
}

export function BlueprintGreetingHeader({
  username,
  ready,
}: BlueprintGreetingHeaderProps) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(() => setVisible(true), 100)
    return () => window.clearTimeout(timer)
  }, [ready])

  return (
    <div className="blueprint-initial-greeting-stage flex min-h-14 w-full items-center justify-center">
      <div
        className={cn(
          "blueprint-initial-greeting-row flex items-center gap-3",
          visible && "is-visible"
        )}
      >
        <AppLogomark size={30} className="blueprint-initial-greeting-icon shrink-0" />
        <h1 className="blueprint-initial-greeting-text m-0 whitespace-nowrap">
          Hi, {username}
        </h1>
      </div>
    </div>
  )
}
