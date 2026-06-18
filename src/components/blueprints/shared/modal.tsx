"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ModalPrimaryAction = {
  label: string
  onClick: () => void
  disabled?: boolean
}

type ModalProps = {
  open: boolean
  onClose: () => void
  breadcrumbs: string[]
  title?: string
  primaryAction?: ModalPrimaryAction
  children: React.ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  breadcrumbs,
  title,
  primaryAction,
  children,
  className,
}: ModalProps) {
  const heading = title ?? breadcrumbs[breadcrumbs.length - 1] ?? "Dialog"

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className={cn("p-0", className)} aria-describedby={undefined}>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b px-5 py-4 pr-12">
            <nav className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb}-${index}`} className="inline-flex items-center gap-1">
                  {index > 0 ? <ChevronRightIcon className="size-3 opacity-60" /> : null}
                  <span>{crumb}</span>
                </span>
              ))}
            </nav>
            <DialogTitle>{heading}</DialogTitle>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

          {primaryAction ? (
            <div className="flex justify-end border-t px-5 py-4">
              <Button
                type="button"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label}
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
