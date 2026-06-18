"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type MikeIconProps = {
  done?: boolean
  error?: boolean
  mike?: boolean
  size?: number
  style?: React.CSSProperties
  className?: string
}

export function MikeIcon({
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
      className={cn("inline-block shrink-0 text-foreground", className)}
      style={style}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="block"
      >
        <g fill="currentColor">
          <path d="m0 4h10v10h-10z" />
          <path d="m20 4h10v10h-10z" opacity=".6" />
          <path d="m10 14h10v10h-10z" opacity=".6" />
          <path d="m20 14h10v10h-10z" opacity=".45" />
          <path d="m30 14h10v10h-10z" opacity=".3" />
          <path d="m0 24h10v10h-10z" opacity=".6" />
          <path d="m10 24h10v10h-10z" opacity=".45" />
          <path d="m20 24h10v10h-10z" opacity=".3" />
          <path d="m30 24h10v10h-10z" opacity=".15" />
          <path d="m10 34h10v10h-10z" opacity=".3" />
          <path d="m20 34h10v10h-10z" opacity=".15" />
        </g>
      </svg>
    </span>
  )
}
