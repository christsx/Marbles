"use client"

import * as React from "react"

import { useOrganization } from "@clerk/nextjs"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
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
import { FactoryIcon, BoxesIcon, ShieldCheckIcon, CompassIcon, LifeBuoyIcon, SendIcon } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Factory",
      url: "#",
      icon: <FactoryIcon />,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Requirements", url: "/dashboard/requirements" },
        { title: "Blueprints", url: "/dashboard/blueprints" },
        { title: "Work Orders", url: "/dashboard/work-orders" },
      ],
    },
    {
      title: "Build & Ship",
      url: "#",
      icon: <BoxesIcon />,
      items: [
        { title: "Agents", url: "/dashboard/agents" },
        { title: "Artifacts", url: "/dashboard/artifacts" },
        { title: "Tests", url: "/dashboard/tests" },
        { title: "Deployments", url: "/dashboard/deployments" },
      ],
    },
    {
      title: "Quality",
      url: "#",
      icon: <ShieldCheckIcon />,
      items: [
        { title: "Code Review", url: "/dashboard/code-review" },
        { title: "Feedback", url: "/dashboard/feedback" },
        { title: "Incidents", url: "/dashboard/incidents" },
        { title: "Metrics", url: "/dashboard/metrics" },
      ],
    },
    {
      title: "Operate",
      url: "#",
      icon: <CompassIcon />,
      items: [
        { title: "Briefings", url: "/dashboard/briefings" },
        { title: "Cost & Models", url: "/dashboard/cost" },
        { title: "Roadmap", url: "/dashboard/roadmap" },
        { title: "Playbooks", url: "/dashboard/playbooks" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
}

export function AppSidebar({
  initialOrg,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  initialOrg?: { name: string; imageUrl: string } | null
}) {
  const { organization, isLoaded } = useOrganization()

  const orgName = organization?.name ?? initialOrg?.name
  const orgImageUrl = organization?.imageUrl ?? initialOrg?.imageUrl
  const ready = isLoaded || initialOrg != null

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
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
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
