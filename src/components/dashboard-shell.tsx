import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { NotificationInbox } from "@/components/notification-inbox"
import { WorkspaceLabel } from "@/components/workspace-label"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export type Crumb = { label: string; href?: string }

export function DashboardShell({
  breadcrumb = [],
  children,
}: {
  breadcrumb?: Crumb[]
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-0 min-w-0 flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    <WorkspaceLabel />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumb.map((crumb, index) => {
                  const isLast = index === breadcrumb.length - 1
                  return (
                    <React.Fragment key={`${crumb.label}-${index}`}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {crumb.href && !isLast ? (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <NotificationInbox />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
