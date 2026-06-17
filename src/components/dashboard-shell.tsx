"use client"

import * as React from "react"
import Link from "next/link"

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
import { cn } from "@/lib/utils"

export type Crumb = { label: string; href?: string }

type DashboardShellProps = {
  breadcrumb?: Crumb[]
  minimal?: boolean
  showNotifications?: boolean
  sidebarDefaultOpen?: boolean
  sidebarCollapsible?: "offcanvas" | "icon" | "none"
  contentClassName?: string
  children: React.ReactNode
}

export function DashboardShell({
  breadcrumb = [],
  minimal = false,
  showNotifications = true,
  sidebarDefaultOpen = true,
  sidebarCollapsible = "offcanvas",
  contentClassName,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen={sidebarDefaultOpen}>
      <AppSidebar collapsible={sidebarCollapsible} />
      <SidebarInset className="flex min-h-svh min-w-0 flex-1 flex-col">
        {minimal ? null : (
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
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" prefetch>
                        <WorkspaceLabel />
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumb.map((crumb, index) => {
                    const isLast = index === breadcrumb.length - 1
                    return (
                      <React.Fragment key={`${crumb.label}-${index}`}>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          {crumb.href && !isLast ? (
                            <BreadcrumbLink asChild>
                              <Link href={crumb.href} prefetch>
                                {crumb.label}
                              </Link>
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
            {showNotifications ? (
              <div className="ml-auto px-4">
                <NotificationInbox />
              </div>
            ) : null}
          </header>
        )}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            contentClassName ?? "overflow-y-auto overflow-x-hidden"
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
