export type PackageStackSummary = {
  name?: string
  framework?: string
  language?: string
  dependencies: string[]
  devDependencies: string[]
}

export function summarizePackageJson(raw: string): PackageStackSummary | null {
  try {
    const pkg = JSON.parse(raw) as {
      name?: string
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }

    const deps = Object.keys(pkg.dependencies ?? {})
    const devDeps = Object.keys(pkg.devDependencies ?? {})

    let framework: string | undefined

    if (deps.includes("next")) {
      framework = `Next.js ${pkg.dependencies?.next ?? ""}`.trim()
    } else if (deps.includes("react")) {
      framework = "React"
    } else if (deps.includes("express")) {
      framework = "Express"
    } else if (deps.includes("fastify")) {
      framework = "Fastify"
    }

    const highlights = [
      ...deps.filter((dep) =>
        [
          "next",
          "react",
          "drizzle-orm",
          "postgres",
          "@clerk/nextjs",
          "@supabase/supabase-js",
          "@aws-sdk/client-s3",
          "aws-sdk",
          "@pipedream/sdk",
          "@novu/nextjs",
          "tailwindcss",
          "typescript",
          "mermaid",
          "recharts",
        ].includes(dep)
      ),
      ...devDeps.filter((dep) => ["typescript", "drizzle-kit"].includes(dep)),
    ]

    return {
      name: pkg.name,
      framework,
      language: devDeps.includes("typescript") || deps.includes("typescript")
        ? "TypeScript"
        : undefined,
      dependencies: highlights.slice(0, 10),
      devDependencies: devDeps.slice(0, 5),
    }
  } catch {
    return null
  }
}

export function formatStackSummary(stack: PackageStackSummary): string {
  const parts = [
    stack.name ? `package=${stack.name}` : null,
    stack.framework ? `framework=${stack.framework}` : null,
    stack.language ? `lang=${stack.language}` : null,
    stack.dependencies.length
      ? `deps=${stack.dependencies.join(", ")}`
      : null,
  ].filter(Boolean)

  return parts.join(" | ")
}
