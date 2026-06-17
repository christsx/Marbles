import { OverviewMetricsGrid } from "@/components/overview/overview-metrics-grid"
import { getOverviewPageData } from "@/lib/pipedream/overview-data"

export async function ModuleMetricCards() {
  const { metrics } = await getOverviewPageData()

  if (!metrics) {
    return null
  }

  return <OverviewMetricsGrid metrics={metrics} />
}
