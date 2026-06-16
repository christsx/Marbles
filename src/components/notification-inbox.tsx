"use client"

import { Inbox } from "@novu/nextjs"
import { useUser } from "@clerk/nextjs"

export function NotificationInbox() {
  const { user } = useUser()
  const applicationIdentifier =
    process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER

  if (!applicationIdentifier) {
    return null
  }

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={user?.id ?? "6a30d100955e249b9fb47f49"}
      appearance={{
        variables: {
          colorBackground: "var(--background)",
          colorForeground: "var(--foreground)",
          colorPrimary: "var(--primary)",
          colorPrimaryForeground: "var(--primary-foreground)",
          colorSecondary: "var(--secondary)",
          colorSecondaryForeground: "var(--secondary-foreground)",
          colorNeutral: "var(--border)",
          colorRing: "var(--ring)",
        },
      }}
    />
  )
}
