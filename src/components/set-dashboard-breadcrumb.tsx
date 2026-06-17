"use client"

import * as React from "react"

import type { Crumb } from "@/components/dashboard-shell"
import { useDashboardBreadcrumb } from "@/components/dashboard-shell-layout"

export function SetDashboardBreadcrumb({ breadcrumb }: { breadcrumb: Crumb[] }) {
  const { setBreadcrumb } = useDashboardBreadcrumb()

  React.useEffect(() => {
    setBreadcrumb(breadcrumb)
    return () => setBreadcrumb(null)
  }, [breadcrumb, setBreadcrumb])

  return null
}
