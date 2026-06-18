import { cn } from "@/lib/utils"

type AppLogomarkProps = {
  size?: number
  spin?: boolean
  className?: string
}

/** Pixel logomark — height-driven; width follows 40:48 aspect. */
export function AppLogomark({
  size = 24,
  spin = false,
  className,
}: AppLogomarkProps) {
  const width = (size * 40) / 48

  return (
    <span
      className={cn(
        "inline-block shrink-0 text-foreground",
        spin && "animate-[spin_3s_linear_infinite]",
        className
      )}
      style={{ animationPlayState: spin ? "running" : "paused" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 48"
        width={width}
        height={size}
        fill="none"
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
