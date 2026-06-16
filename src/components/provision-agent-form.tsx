"use client"

import * as React from "react"
import { useActionState } from "react"
import { CheckCircle2Icon, TriangleAlertIcon } from "lucide-react"

import {
  provisionAgent,
  type ProvisionAgentState,
} from "@/app/dashboard/agents/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const initialState: ProvisionAgentState = { status: "idle", message: "" }

const specialties = ["Full-Stack", "Frontend", "Backend", "QA", "Infra", "Docs"]
const models = ["claude-opus-4.8", "gpt-5.5", "claude-sonnet-4.6"]

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

export function ProvisionAgentForm() {
  const [state, formAction, isPending] = useActionState(
    provisionAgent,
    initialState
  )

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5">
          {state.status !== "idle" && (
            <div
              className={cn(
                "flex items-start gap-2 rounded-md border p-3 text-sm",
                state.status === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              )}
            >
              {state.status === "success" ? (
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
              ) : (
                <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
              )}
              <span>{state.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Codename" htmlFor="name">
              <Input id="name" name="name" placeholder="Atlas" required />
            </Field>
            <Field label="Specialty" htmlFor="specialty">
              <select
                id="specialty"
                name="specialty"
                defaultValue="Full-Stack"
                className={selectClass}
              >
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Base model" htmlFor="model">
              <select
                id="model"
                name="model"
                defaultValue="claude-opus-4.8"
                className={selectClass}
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Autonomy"
              htmlFor="autonomy"
              hint="Supervised requires review before merge"
            >
              <select
                id="autonomy"
                name="autonomy"
                defaultValue="Supervised"
                className={selectClass}
              >
                <option value="Supervised">Supervised</option>
                <option value="Autonomous">Autonomous</option>
              </select>
            </Field>
            <Field
              label="Scoped repos"
              htmlFor="repos"
              hint="Comma-separated (optional)"
            >
              <Input id="repos" name="repos" placeholder="core-api, web-app" />
            </Field>
            <Field
              label="Weekly target"
              htmlFor="weeklyTarget"
              hint="Work orders per week"
            >
              <Input
                id="weeklyTarget"
                name="weeklyTarget"
                type="number"
                min={1}
                max={500}
                defaultValue={120}
              />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Provisioning..." : "Provision agent"}
            </Button>
            <span className="text-xs text-muted-foreground">
              The agent joins the fleet and starts pulling work orders.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
