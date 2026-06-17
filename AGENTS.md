<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# UI & performance standards

- React/Tailwind components: **≤ 100 lines** per file; pages **≤ 40 lines**. Split into subcomponents, hooks, types, and colocated CSS — see `.cursor/rules/component-size-limits.mdc`.
- Next.js routing & bundles: persistent layouts, `Link` + prefetch, Server Components by default — see `.cursor/rules/nextjs-performance.mdc`.
<!-- END:nextjs-agent-rules -->
