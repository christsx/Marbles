"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type MikeIconProps = {
  spin?: boolean
  done?: boolean
  error?: boolean
  mike?: boolean
  size?: number
  style?: React.CSSProperties
  className?: string
}

export function MikeIcon({
  spin = false,
  done = false,
  error = false,
  mike = false,
  size = 24,
  style,
  className,
}: MikeIconProps) {
  void done
  void error
  void mike

  const height = size
  const width = (size * 40) / 48

  return (
    <span
      className={cn(
        "inline-block shrink-0 text-foreground",
        spin && "animate-[spin_3s_linear_infinite]",
        className
      )}
      style={{
        animationPlayState: spin ? "running" : "paused",
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        style={{ display: "block" }}
      >
        <rect y="37" width="7" height="7" fill="currentColor" />
        <rect opacity="0.6" x="7" y="37" width="7" height="7" fill="currentColor" />
        <rect opacity="0.32" x="14" y="37" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" x="21" y="37" width="7" height="7" fill="currentColor" />
        <rect opacity="0.6" y="30" width="7" height="7" fill="currentColor" />
        <rect opacity="0.32" x="7" y="30" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" x="7" y="23" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" x="14" y="30" width="7" height="7" fill="currentColor" />
        <rect opacity="0.32" y="23" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" y="16" width="7" height="7" fill="currentColor" />
        <rect x="33" y="4" width="7" height="7" fill="currentColor" />
        <rect opacity="0.6" x="33" y="11" width="7" height="7" fill="currentColor" />
        <rect opacity="0.32" x="26" y="11" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" x="19" y="11" width="7" height="7" fill="currentColor" />
        <rect opacity="0.32" x="33" y="18" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" x="26" y="18" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" x="33" y="25" width="7" height="7" fill="currentColor" />
        <rect opacity="0.6" x="26" y="4" width="7" height="7" fill="currentColor" />
        <rect opacity="0.32" x="19" y="4" width="7" height="7" fill="currentColor" />
        <rect opacity="0.07" x="12" y="4" width="7" height="7" fill="currentColor" />
      </svg>
    </span>
  )
}
