"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { DashboardShell, type Crumb } from "@/components/dashboard-shell"
import { getDashboardRouteConfig } from "@/lib/dashboard-route-config"

type DashboardBreadcrumbContextValue = {
  setBreadcrumb: (breadcrumb: Crumb[] | null) => void
}

const DashboardBreadcrumbContext =
  React.createContext<DashboardBreadcrumbContextValue | null>(null)

export function useDashboardBreadcrumb() {
  const context = React.useContext(DashboardBreadcrumbContext)
  if (!context) {
    throw new Error("useDashboardBreadcrumb must be used within DashboardShellLayout")
  }
  return context
}

export function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const routeConfig = React.useMemo(
    () => getDashboardRouteConfig(pathname),
    [pathname]
  )
  const [breadcrumbOverride, setBreadcrumbOverride] = React.useState<
    Crumb[] | null
  >(null)

  React.useEffect(() => {
    setBreadcrumbOverride(null)
  }, [pathname])

  const breadcrumb = breadcrumbOverride ?? routeConfig.breadcrumb
  const showNotifications = routeConfig.showNotifications
  const contentClassName = routeConfig.fullHeight
    ? "overflow-hidden"
    : "overflow-y-auto overflow-x-hidden"

  return (
    <DashboardBreadcrumbContext.Provider
      value={{ setBreadcrumb: setBreadcrumbOverride }}
    >
      <DashboardShell
        breadcrumb={breadcrumb}
        showNotifications={showNotifications}
        contentClassName={contentClassName}
      >
        {children}
      </DashboardShell>
    </DashboardBreadcrumbContext.Provider>
  )
}
