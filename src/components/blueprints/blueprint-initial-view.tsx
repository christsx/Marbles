"use client"

import { BlueprintComposer, type BlueprintComposerProps } from "@/components/blueprints/blueprint-composer"
import { BlueprintGreetingHeader } from "@/components/blueprints/blueprint-greeting-header"

type BlueprintInitialViewProps = {
  username: string
  ready: boolean
  composerProps: BlueprintComposerProps
}

export function BlueprintInitialView({
  username,
  ready,
  composerProps,
}: BlueprintInitialViewProps) {
  return (
    <div className="blueprint-studio-landing flex h-full w-full flex-col px-4 md:px-6">
      <div className="blueprint-studio-landing-body flex flex-1 flex-col items-center justify-center">
        <div className="blueprint-studio-landing-inner relative flex w-full max-w-4xl flex-col items-center px-0 xl:px-8">
          <BlueprintGreetingHeader username={username} ready={ready} />
          <BlueprintComposer {...composerProps} large />
          <p className="blueprint-chat-disclaimer blueprint-landing-disclaimer text-center">
            Torse is AI and may get things wrong. Please verify important details.
          </p>
        </div>
      </div>
    </div>
  )
}
