import { cn } from "@/lib/utils"

type AppLogomarkProps = {
  size?: number
  spin?: boolean
  className?: string
}

/** Core hex logomark — height-driven; width follows 42:48 aspect. */
export function AppLogomark({
  size = 24,
  spin = false,
  className,
}: AppLogomarkProps) {
  const width = (size * 42) / 48

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
        viewBox="0 0 42 48"
        width={width}
        height={size}
        fill="currentColor"
        aria-hidden
        className="block"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="m15.2286 4.99951c-3.2154 0-6.18655 1.71539-7.79425 4.5l-5.7735 9.99999c-1.6076941 2.7846-1.607697 6.2154 0 9l5.7735 10c1.6077 2.7846 4.57885 4.5 7.79425 4.5h11.547c3.2154 0 6.1865-1.7154 7.7942-4.5l5.7735-10c1.6077-2.7846 1.6077-6.2154 0-9l-5.7735-9.99999c-1.6077-2.78461-4.5788-4.5-7.7942-4.5zm11.547 5.99999h-7.2169c-1.1547 0-1.8762 1.2499-1.298 2.2494 1.784 3.0838 3.5722 6.1653 5.3536 9.2506.5359.9282.5359 2.0718 0 3-1.7814 3.0854-3.5696 6.1668-5.3536 9.2506-.5782.9995.1433 2.2494 1.298 2.2494h7.2169c1.0718 0 2.0622-.5718 2.5981-1.5l5.7735-10c.5359-.9282.5359-2.0718 0-3l-5.7735-10c-.5359-.9282-1.5263-1.5-2.5981-1.5z"
        />
      </svg>
    </span>
  )
}
