import type { Crumb } from "@/components/dashboard-shell"

export type DashboardRouteConfig = {
  breadcrumb: Crumb[]
  showNotifications?: boolean
  fullHeight?: boolean
}

const ROUTES: Record<string, DashboardRouteConfig> = {
  "/dashboard": {
    breadcrumb: [{ label: "Overview" }],
  },
  "/dashboard/requirements": {
    breadcrumb: [{ label: "Factory" }, { label: "Requirements" }],
  },
  "/dashboard/blueprints": {
    breadcrumb: [{ label: "Factory" }, { label: "Blueprints" }],
    showNotifications: false,
    fullHeight: true,
  },
  "/dashboard/work-orders": {
    breadcrumb: [{ label: "Factory" }, { label: "Work Orders" }],
  },
  "/dashboard/agents": {
    breadcrumb: [{ label: "Build & Ship" }, { label: "Agents" }],
  },
  "/dashboard/agents/new": {
    breadcrumb: [
      { label: "Build & Ship" },
      { label: "Agents", href: "/dashboard/agents" },
      { label: "Provision Agent" },
    ],
  },
  "/dashboard/artifacts": {
    breadcrumb: [{ label: "Build & Ship" }, { label: "Artifacts" }],
  },
  "/dashboard/tests": {
    breadcrumb: [{ label: "Build & Ship" }, { label: "Tests" }],
  },
  "/dashboard/deployments": {
    breadcrumb: [{ label: "Build & Ship" }, { label: "Deployments" }],
  },
  "/dashboard/integrations": {
    breadcrumb: [{ label: "Integrations" }],
  },
  "/dashboard/code-review": {
    breadcrumb: [{ label: "Quality" }, { label: "Code Review" }],
  },
  "/dashboard/feedback": {
    breadcrumb: [{ label: "Quality" }, { label: "Feedback" }],
  },
  "/dashboard/incidents": {
    breadcrumb: [{ label: "Quality" }, { label: "Incidents" }],
  },
  "/dashboard/metrics": {
    breadcrumb: [{ label: "Quality" }, { label: "Metrics" }],
  },
  "/dashboard/briefings": {
    breadcrumb: [{ label: "Operate" }, { label: "Briefings" }],
  },
  "/dashboard/cost": {
    breadcrumb: [{ label: "Operate" }, { label: "Cost & Models" }],
  },
  "/dashboard/roadmap": {
    breadcrumb: [{ label: "Operate" }, { label: "Roadmap" }],
  },
  "/dashboard/playbooks": {
    breadcrumb: [{ label: "Operate" }, { label: "Playbooks" }],
  },
}

const FALLBACK: DashboardRouteConfig = {
  breadcrumb: [{ label: "Dashboard" }],
}

export function getDashboardRouteConfig(pathname: string): DashboardRouteConfig {
  if (ROUTES[pathname]) {
    return ROUTES[pathname]
  }

  if (pathname.startsWith("/dashboard/agents/")) {
    return {
      breadcrumb: [
        { label: "Build & Ship" },
        { label: "Agents", href: "/dashboard/agents" },
        { label: "Agent" },
      ],
    }
  }

  if (pathname.startsWith("/dashboard/blueprints/")) {
    return {
      breadcrumb: [
        { label: "Factory" },
        { label: "Blueprints", href: "/dashboard/blueprints" },
        { label: "Blueprint" },
      ],
      showNotifications: false,
      fullHeight: true,
    }
  }

  if (pathname.startsWith("/dashboard/artifacts/")) {
    return {
      breadcrumb: [
        { label: "Build & Ship" },
        { label: "Artifacts", href: "/dashboard/artifacts" },
        { label: "Category" },
      ],
    }
  }

  if (pathname.startsWith("/dashboard/playbooks/")) {
    return {
      breadcrumb: [
        { label: "Operate" },
        { label: "Playbooks", href: "/dashboard/playbooks" },
        { label: "Playbook" },
      ],
    }
  }

  return FALLBACK
}

export function isDashboardNavPath(pathname: string, href: string) {
  if (pathname === href) {
    return true
  }

  if (href === "/dashboard") {
    return false
  }

  return pathname.startsWith(`${href}/`)
}
