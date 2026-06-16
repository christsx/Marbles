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
import { LayoutDashboardIcon, TargetIcon, GaugeIcon, MegaphoneIcon, LifeBuoyIcon, SendIcon, TrendingUpIcon } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Executive",
      url: "#",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Revenue Intelligence", url: "/dashboard/revenue-intelligence" },
        { title: "Forecasting", url: "/dashboard/forecasting" },
        { title: "Daily Briefings", url: "/dashboard/daily-briefings" },
        { title: "AI Audits", url: "/dashboard/ai-audits" },
      ],
    },
    {
      title: "Pipeline & Sales",
      url: "#",
      icon: <TargetIcon />,
      items: [
        { title: "Hot Lists", url: "/dashboard/hot-lists" },
        { title: "Leads & CRM", url: "/dashboard/leads-crm" },
        { title: "Billing & Payments", url: "/dashboard/billing" },
        { title: "Sales Team", url: "/dashboard/sales-team" },
      ],
    },
    {
      title: "Performance",
      url: "#",
      icon: <GaugeIcon />,
      items: [
        { title: "Main Dashboard", url: "/dashboard/performance" },
        { title: "Historical Views", url: "/dashboard/historical-views" },
        { title: "Goal Tracking", url: "/dashboard/goal-tracking" },
        { title: "Offer Financial Models", url: "/dashboard/offers" },
      ],
    },
    {
      title: "Marketing & Team",
      url: "#",
      icon: <MegaphoneIcon />,
      items: [
        { title: "OKRs", url: "/dashboard/okrs" },
        { title: "Asset Factory", url: "/dashboard/asset-factory" },
        { title: "SOP Library", url: "/dashboard/sop-library" },
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
                          <TrendingUpIcon className="size-4" />
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
