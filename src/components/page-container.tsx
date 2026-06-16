import * as React from "react"

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pt-2 pb-12 md:px-6">
      {children}
    </div>
  )
}
