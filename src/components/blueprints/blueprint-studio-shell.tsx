"use client"

import * as React from "react"

import "./blueprint-studio.css"

type BlueprintStudioShellProps = {
  children: React.ReactNode
}

export function BlueprintStudioShell({ children }: BlueprintStudioShellProps) {
  return (
    <div className="blueprint-studio-root flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      {children}
    </div>
  )
}
