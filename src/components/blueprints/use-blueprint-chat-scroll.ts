"use client"

import * as React from "react"

const STICKY_THRESHOLD_PX = 96

export function useBlueprintChatScroll(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  deps: unknown[],
  enabled: boolean
) {
  const stickToBottomRef = React.useRef(true)

  React.useEffect(() => {
    const element = scrollRef.current
    if (!element || !enabled) {
      return
    }

    const onScroll = () => {
      const distance =
        element.scrollHeight - element.scrollTop - element.clientHeight
      stickToBottomRef.current = distance <= STICKY_THRESHOLD_PX
    }

    element.addEventListener("scroll", onScroll, { passive: true })
    return () => element.removeEventListener("scroll", onScroll)
  }, [enabled, scrollRef])

  React.useLayoutEffect(() => {
    const element = scrollRef.current
    if (!element || !enabled || !stickToBottomRef.current) {
      return
    }

    element.scrollTop = element.scrollHeight
  }, [enabled, scrollRef, ...deps])
}
