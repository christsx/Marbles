"use client"

import * as React from "react"
import { useActionState } from "react"
import { SparklesIcon, TriangleAlertIcon } from "lucide-react"
import type { OutputData } from "@editorjs/editorjs"

import {
  saveBlueprint,
  type SaveBlueprintState,
} from "@/app/dashboard/blueprints/actions"
import {
  BlueprintEditor,
  type BlueprintEditorHandle,
} from "@/components/blueprints/blueprint-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generateAgenticBlueprint, emptyBlueprint } from "@/lib/blueprint-editor"
import { blueprintSystems } from "@/lib/blueprints"
import { cn } from "@/lib/utils"

const initialState: SaveBlueprintState = { status: "idle", message: "" }

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}

type BlueprintFormProps = {
  blueprintId?: string
  defaultTitle?: string
  defaultSystem?: string
  initialContent?: OutputData
}

export function BlueprintForm({
  blueprintId,
  defaultTitle = "",
  defaultSystem = blueprintSystems[0],
  initialContent = emptyBlueprint,
}: BlueprintFormProps) {
  const editorRef = React.useRef<BlueprintEditorHandle>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [title, setTitle] = React.useState(defaultTitle)
  const [system, setSystem] = React.useState(defaultSystem)
  const [generating, setGenerating] = React.useState(false)
  const [editorError, setEditorError] = React.useState<string | null>(null)
  const [state, formAction, isPending] = useActionState(
    saveBlueprint,
    initialState
  )

  const handleGenerate = async () => {
    if (!title.trim()) {
      setEditorError("Add a title first so the agent knows what to draft.")
      return
    }
    setEditorError(null)
    setGenerating(true)
    try {
      const data = generateAgenticBlueprint({ title: title.trim(), system })
      await editorRef.current?.render(data)
    } catch {
      setEditorError("Could not generate draft. Try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEditorError(null)

    try {
      const content = await editorRef.current?.save()
      if (!content) {
        setEditorError("Editor is still loading.")
        return
      }

      const formData = new FormData(e.currentTarget)
      formData.set("content", JSON.stringify(content))
      formAction(formData)
    } catch {
      setEditorError("Failed to read document content.")
    }
  }

  const errorMessage =
    editorError ?? (state.status === "error" ? state.message : null)

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title" htmlFor="title" hint="What is this blueprint designing?">
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Multi-tenant data isolation"
                required
              />
            </Field>
            <Field label="System" htmlFor="system">
              <select
                id="system"
                name="system"
                value={system}
                onChange={(e) => setSystem(e.target.value)}
                className={selectClass}
              >
                {blueprintSystems.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {blueprintId && (
            <input type="hidden" name="blueprintId" value={blueprintId} />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Agentic draft</span>
              <span className="text-xs text-muted-foreground">
                Atlas generates a structured doc from your title and system — edit freely.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating || isPending}
            >
              <SparklesIcon className={cn(generating && "animate-pulse")} />
              {generating ? "Generating…" : "Generate draft"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-base font-medium">Document</h2>
          <span className="text-xs text-muted-foreground">
            Block editor · headers, lists, code, checklists
          </span>
        </div>
        <BlueprintEditor ref={editorRef} initialData={initialContent} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending || generating}>
          {isPending
            ? "Saving…"
            : blueprintId
              ? "Save changes"
              : "Create blueprint"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => history.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
