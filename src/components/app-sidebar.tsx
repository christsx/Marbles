"use client"

import Link from "next/link"

import { useOrganization } from "@clerk/nextjs"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DASHBOARD_NAV_SECTIONS } from "@/lib/dashboard-nav"
import { FactoryIcon } from "lucide-react"

const navMain = DASHBOARD_NAV_SECTIONS.map(({ icon: Icon, ...section }) => ({
  ...section,
  icon: <Icon />,
}))

export function AppSidebar({
  collapsible = "offcanvas",
  variant = "inset",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  collapsible?: "offcanvas" | "icon" | "none"
  variant?: "sidebar" | "floating" | "inset"
}) {
  const { organization, isLoaded } = useOrganization()

  const orgName = organization?.name
  const orgImageUrl = organization?.imageUrl
  const ready = isLoaded

  return (
    <Sidebar variant={variant} collapsible={collapsible} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/blueprints" prefetch>
                {ready ? (
                  <>
                    <Avatar className="size-8 rounded-lg after:rounded-lg">
                      <AvatarImage
                        className="rounded-lg"
                        src={orgImageUrl}
                        alt={orgName ?? "Workspace"}
                      />
                      <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        {orgName?.charAt(0).toUpperCase() ?? (
                          <FactoryIcon className="size-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {orgName ?? "Personal workspace"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="grid flex-1">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
