type ProxyBody = {
  text?: () => Promise<string>
  bytes?: () => Promise<Uint8Array>
  json?: () => Promise<unknown>
}

export async function readProxyJson<T>(response: unknown): Promise<T> {
  if (Array.isArray(response)) {
    return response as T
  }

  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>

    if (Array.isArray(record.data)) {
      return record.data as T
    }

    const body = response as ProxyBody

    if (typeof body.json === "function") {
      return (await body.json()) as T
    }

    if (typeof body.text === "function") {
      return JSON.parse(await body.text()) as T
    }

    if (typeof body.bytes === "function") {
      const text = new TextDecoder().decode(await body.bytes())
      return JSON.parse(text) as T
    }
  }

  return response as T
}
