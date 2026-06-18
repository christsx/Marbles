"use client"

import * as React from "react"

import {
  DEFAULT_MODEL_ID,
  resolveModelId,
} from "@/lib/ai/model-catalog"
import type { ApiKeyState } from "@/lib/ai/model-availability"

const STORAGE_KEY = "blueprint-selected-model"

export function useBlueprintSelectedModel() {
  const [modelId, setModelId] = React.useState(DEFAULT_MODEL_ID)

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    setModelId(resolveModelId(stored))
  }, [])

  const setSelectedModel = React.useCallback((nextModelId: string) => {
    const resolved = resolveModelId(nextModelId)
    setModelId(resolved)
    window.localStorage.setItem(STORAGE_KEY, resolved)
  }, [])

  return [modelId, setSelectedModel] as const
}

export function useBlueprintModelKeys() {
  const [apiKeys, setApiKeys] = React.useState<ApiKeyState | undefined>()

  React.useEffect(() => {
    let cancelled = false

    void fetch("/api/blueprints/models")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { apiKeys?: ApiKeyState } | null) => {
        if (!cancelled && payload?.apiKeys) {
          setApiKeys(payload.apiKeys)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApiKeys(undefined)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return apiKeys
}
