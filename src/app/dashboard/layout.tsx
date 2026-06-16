import { AuthDataSync } from "@/components/auth-data-sync"

export const dynamic = "force-dynamic"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthDataSync />
      {children}
    </>
  )
}
