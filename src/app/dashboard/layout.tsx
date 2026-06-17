import { AuthDataSync } from "@/components/auth-data-sync"
import { DashboardShellLayout } from "@/components/dashboard-shell-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthDataSync />
      <DashboardShellLayout>{children}</DashboardShellLayout>
    </>
  )
}
