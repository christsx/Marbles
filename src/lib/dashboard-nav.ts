import type { LucideIcon } from "lucide-react"
import { BoxesIcon, FactoryIcon } from "lucide-react"

export type DashboardNavLink = {
  title: string
  url: string
}

export type DashboardNavSection = {
  title: string
  url: string
  icon: LucideIcon
  items: DashboardNavLink[]
}

/** MVP sidebar — same Factory UI, only shipped routes. */
export const DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
  {
    title: "Factory",
    url: "#",
    icon: FactoryIcon,
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "Blueprints", url: "/dashboard/blueprints" },
    ],
  },
  {
    title: "Build & Ship",
    url: "#",
    icon: BoxesIcon,
    items: [{ title: "Integrations", url: "/dashboard/integrations" }],
  },
]
