"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { sops } from "@/lib/sops"

const categories = ["All", "Sales", "Coaching", "RevOps", "Operations"]

export function SopLibrary() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState("All")

  const filtered = sops.filter((sop) => {
    const matchesCategory = category === "All" || sop.category === category
    const matchesQuery =
      query === "" ||
      sop.title.toLowerCase().includes(query.toLowerCase()) ||
      sop.owner.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search SOPs..."
            className="h-9 w-full rounded-md border border-input bg-transparent pr-3 pl-9 text-sm shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
          {categories.map((cat) => {
            const active = cat === category
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      <Card className="py-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
            <p className="text-sm font-medium">No matches</p>
            <p className="text-sm text-muted-foreground">
              Try a different search or category.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4">Document</TableHead>
                <TableHead className="px-4">Category</TableHead>
                <TableHead className="px-4">Owner</TableHead>
                <TableHead className="px-4 text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sop) => (
                <TableRow
                  key={sop.slug}
                  onClick={() => router.push(`/dashboard/sop-library/${sop.slug}`)}
                  className="cursor-pointer transition-colors"
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {sop.title}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant="secondary">{sop.category}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {sop.owner}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right text-muted-foreground">
                    {sop.updated}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
