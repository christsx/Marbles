"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Modal } from "@/components/blueprints/shared/modal"
import { ProjectPicker } from "@/components/blueprints/shared/project-picker"
import { useDirectoryData } from "@/components/blueprints/shared/use-directory-data"

type SelectAssistantProjectModalProps = {
  open: boolean
  onClose: () => void
}

export function SelectAssistantProjectModal({
  open,
  onClose,
}: SelectAssistantProjectModalProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [creating, setCreating] = React.useState(false)
  const router = useRouter()
  const { loading, projects } = useDirectoryData(open)

  React.useEffect(() => {
    if (!open) return
    setSelectedId(null)
  }, [open])

  async function handleContinue() {
    if (!selectedId) return
    setCreating(true)
    try {
      onClose()
      router.push(`/dashboard/blueprints/${selectedId}/edit`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      breadcrumbs={["Assistant", "Start Chat in a Project"]}
      primaryAction={{
        label: creating ? "Opening…" : "Continue",
        onClick: () => void handleContinue(),
        disabled: !selectedId || creating,
      }}
    >
      <ProjectPicker
        projects={projects}
        loading={loading}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </Modal>
  )
}
