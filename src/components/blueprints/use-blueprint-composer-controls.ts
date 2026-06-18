"use client"

import * as React from "react"

const INPUT_MAX_HEIGHT = 192

export function useBlueprintComposerTextarea(
  value: string,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) {
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, INPUT_MAX_HEIGHT)}px`
  }, [value, textareaRef])
}

export function useCompactComposerControls(
  controlsRef: React.RefObject<HTMLDivElement | null>
) {
  const [compact, setCompact] = React.useState(false)

  React.useEffect(() => {
    const element = controlsRef.current
    if (!element) return

    const update = () => setCompact(element.offsetWidth < 430)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [controlsRef])

  return compact
}
